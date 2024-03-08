import {
  BadRequestException,
  Body,
  Controller, Delete,
  FileTypeValidator,
  MaxFileSizeValidator, Optional, Param,
  ParseFilePipe,
  Put, Req,
  Res,
  UploadedFiles,
  UseGuards
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {Post, UseInterceptors, UploadedFile} from "@nestjs/common";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {CreateProductDto, SchemaSwaggerCreateProductDto} from "./dto/CreateProduct.dto";
import {CreateCategoryDto} from "./dto/CreateCategory.dto";
import {CreateTypeDto} from "./dto/CreateType.dto";
import {ProductService} from "../product/product.service";
import {ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags, getSchemaPath} from "@nestjs/swagger";
import {ReferenceObject, SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {SchemaSwaggerUpdateProductDto, UpdateProductDto} from "./dto/UpdateProduct.dto";
import {IsOptional} from "class-validator";
import {UpdateTypeDto} from "./dto/UpdateType.dto";
import {AdminAuthService} from "./admin_auth.service";
import {SignDto} from "./dto/Sign.dto";
import { JwtAuthGuard } from './guards/AtAdminAuth.guard';
import { Public } from 'src/shared/public.decorator';
import {response, Response} from 'express';
@UseGuards(
  JwtAuthGuard
)
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({ status: 201, description: 'Admin has been successfully logged in.'})
  async Login(@Body() body: SignDto, @Res({ passthrough: true }) response: Response){
    return  await this.adminAuthService.login(body.name, body.password)
  }


  @Public()
  @Post('isValid_access_token')
  async isValidToken(@Body() body: {accessToken: string}, @Res() response: Response){
    const IsValid = await this.adminAuthService.validateAccessToken(body.accessToken);
    if(!IsValid){
      throw new BadRequestException("Invalid token");
    }
    response.statusCode = 200;
    return response.json({message: "Valid token"});
  }

  @Post('create-product')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'files': {
          type: 'array',
          items: {
            type: 'file',
            format: 'binary',
          },
        },
        ...SchemaSwaggerCreateProductDto
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @UseInterceptors(FilesInterceptor('files',2,))
  createProduct(@UploadedFiles(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 10000000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ]
  })) files: Array<Express.Multer.File>,@Body() body: CreateProductDto) {
    return this.adminService.CreateProduct(files,body);
  }

  @Put('update-product/:productId')
  @ApiParam({ name: 'productId', type: 'string', description: 'The mongodb id of the product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: 'object',
      properties:{
        'files':{
          type: 'array',
          nullable:true,
          items: {
            type: 'file',
            format: 'binary',
          }
        },
        ...SchemaSwaggerUpdateProductDto
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated.'})
  @UseInterceptors(FilesInterceptor('files',2,))
  updateProduct(@Optional() @UploadedFiles(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 1000000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ],
    fileIsRequired: false,
  })) files: Array<Express.Multer.File>,@Body() body: UpdateProductDto, @Param() params: any){
    return this.adminService.UpdateProduct(params.productId, body , files);
  }

  @Put('update-product-image/:productId/:OldImageName')
  @ApiParam({ name: 'productId', type: 'string', description: 'The mongodb id of the product' })
  @ApiParam({ name: 'OldImageName', type: 'string', description: 'Name of the image which should be replaced' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: 'object',
      properties:{
        'file':{
          type: 'file',
          format: 'binary',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The record has been successfully updated.'})
  @UseInterceptors(FileInterceptor('file'))
  updateProductImage(@UploadedFile() file: Express.Multer.File, @Param() params: any){
    return this.adminService.UpdateOneImageProduct(params.productId, params.OldImageName, file);
  }

  @Delete('delete-product/:productId')
  @ApiParam({name: 'productId', type: 'string', description: 'The mongodb id of the product'})
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
  deleteProduct(@Param() params: any){
    return this.adminService.DeleteProduct(params.productId)
  }

  @Post('create_category')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema:{
      type: 'object',
      properties:{
        icon:{
          type: 'file',
          format: 'binary',
        },
        title:{
          type: 'string',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @UseInterceptors(FileInterceptor('icon'))
  createCategory(@UploadedFile(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 100000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
    ]
  })) icon: Express.Multer.File ,@Body() body: CreateCategoryDto){
    return this.adminService.createCategory(icon,body);
  }

  @Put('update-category/:categoryId')
  @ApiConsumes('multipart/form-data')
  @ApiParam({name: 'categoryId', type: 'string', description: 'The mongodb id of the category'})
  @ApiBody({
    schema:{
      type: 'object',
      properties:{
        icon:{
          type: 'file',
          nullable:true,
          format: 'binary',
        },
        title:{
          type: 'string',
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The category has been successfully updated.'})
  @UseInterceptors(FileInterceptor('icon'))
  updateCategory(@Optional() @UploadedFile(new ParseFilePipe({
    validators:[new MaxFileSizeValidator({ maxSize: 100000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
    ],
    fileIsRequired: false,
  })) icon: Express.Multer.File ,@Body() body: CreateCategoryDto, @Param() params: any){
    return this.adminService.updateCategory(params.categoryId,body,icon);
  }

  @Delete('delete-category/:productId')
  @ApiParam({name: 'productId', type: 'string', description: 'The mongodb id of the category'})
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.'})
  deleteCategory(@Param() params: any){
    return this.adminService.DeleteCategory(params.productId)
  }
  @Post('create-type')
  createType(@Body() body: CreateTypeDto){
    return this.adminService.createType(body);
  }

  @Put('update-type/:typeId')
  updateType(@Body() body: UpdateTypeDto, @Param() params:any){
    return this.adminService.UpdateType(params.typeId, body);
  }

  @Delete('delete-type/:productId')
  @ApiParam({name: 'productId', type: 'string', description: 'The mongodb id of the type'})
  @ApiResponse({ status: 200, description: 'The type has been successfully deleted.'})
  deleteType(@Param() params: any){
    return this.adminService.DeleteType(params.productId)
  }
}
