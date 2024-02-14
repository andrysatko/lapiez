import {Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFiles} from '@nestjs/common';
import { AdminService } from './admin.service';
import {Post, UseInterceptors, UploadedFile} from "@nestjs/common";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {CreateProductDto} from "./dto/CreateProduct.dto";
import {CreateCategoryDto} from "./dto/CreateCategory.dto";
import {CreateTypeDto} from "./dto/CreateType.dto";
import {ProductService} from "../product/product.service";
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly productService: ProductService) {}

  @Post('create-product')
  @UseInterceptors(FilesInterceptor('files',2))
  uploadFile( @UploadedFiles() files: Array<Express.Multer.File>,@Body() body: CreateProductDto) {
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
