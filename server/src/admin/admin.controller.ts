import {Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFiles} from '@nestjs/common';
import { AdminService } from './admin.service';
import {Post, UseInterceptors, UploadedFile} from "@nestjs/common";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {CreateProductDto, SchemaSwaggerCreateProductDto} from "./dto/CreateProduct.dto";
import {CreateCategoryDto} from "./dto/CreateCategory.dto";
import {CreateTypeDto} from "./dto/CreateType.dto";
import {ProductService} from "../product/product.service";
import {ApiBody, ApiConsumes, ApiResponse, ApiTags, getSchemaPath} from "@nestjs/swagger";
import {ReferenceObject, SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly productService: ProductService) {}

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
  createProduct( @UploadedFiles(new ParseFilePipe({
    validators:[
      new MaxFileSizeValidator({ maxSize: 100000 }),
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    ]
  })) files: Array<Express.Multer.File>,@Body() body: CreateProductDto) {
    return this.adminService.CreateProduct(files,body);
  }

  @Post('create_category')
  createCategory(@Body() body: CreateCategoryDto){
    return this.productService.createCategory(body);
  }

  @Post('create-type')
  createType(@Body() body: CreateTypeDto){
    return this.productService.createType(body);
  }
}
