import {Controller, Get, Param} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  getAll(){
        return this.productService.getAll();
    }
  @Get('CategoriesAndTypes')
  getCategoriesAndTypes(){
      return this.productService.getAllCategoriesAndTypes();
  }

  @Get('ProductById/:id')
  getProductById(@Param('id') id: string){
      return this.productService.getProductById(id);
  }
}
