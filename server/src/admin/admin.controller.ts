import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator, Param,
  ParseFilePipe,
  Put,
  UploadedFiles
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {Post, UseInterceptors, UploadedFile} from "@nestjs/common";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {CreateProductDto, SchemaSwaggerCreateProductDto} from "./dto/CreateProduct.dto";
import {CreateCategoryDto} from "./dto/CreateCategory.dto";
import {CreateTypeDto} from "./dto/CreateType.dto";
import {ProductService} from "../product/product.service";
import {ApiBody, ApiConsumes, ApiResponse, ApiTags, getSchemaPath} from "@nestjs/swagger";
import {ReferenceObject, SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import {SchemaSwaggerUpdateProductDto, UpdateProductDto} from "./dto/UpdateProduct.dto";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
      new MaxFileSizeValidator({ maxSize: 1000000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ]
  })) files: Array<Express.Multer.File>,@Body() body: CreateProductDto) {
    return this.adminService.CreateProduct(files,body);
  }

  @Put('update-product/:productId')
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
  updateProduct(@UploadedFiles(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 1000000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ]
  })) files: Array<Express.Multer.File>, body: UpdateProductDto, @Param() params: any){
    return this.adminService.UpdateProduct(params.productId, body , files);
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

  @Post('create-type')
  createType(@Body() body: CreateTypeDto){
    return this.adminService.createType(body);
  }
}
