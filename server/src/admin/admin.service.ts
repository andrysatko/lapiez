import {HttpException, Injectable} from '@nestjs/common';
import {ProductService} from "../product/product.service";
import {CreateProductDto} from "./dto/CreateProduct.dto";
import * as uuid from 'uuid';
import * as path from "path";
import { createWriteStream } from 'fs';
import {calculateCalories} from "./utils/CountCalories";

import * as fs from "fs";
@Injectable()
export class AdminService {
    constructor(private productService: ProductService) {
    }

    async CreateProduct(files: Express.Multer.File[], body: CreateProductDto){
        const {CalorieContent,Proteins,Fats,Carbohydrates} = body.CaloryInfo;
        if(!CalorieContent){
            body.CaloryInfo.CalorieContent = calculateCalories(Proteins,Carbohydrates,Fats);
        }
        const product = await this.productService.createProduct(body);
        if(!product){
            throw new HttpException('Problem while saving product in database', 500);
        }
        const filesName = [];
        files.map(file => {
            try {
                const NewFileName = uuid.v4()  + `.${file.mimetype.split('/')[1]}`;
                fs.writeFileSync(path.join(process.cwd(),'static','products',NewFileName), file.buffer);
                filesName.push(NewFileName);
            }catch (e) {
                console.log(e)
                throw new HttpException('File not uploaded', 500);
            }
        })
        return this.productService.updateProduct(product.id, {images: filesName});
    }
    createCategory = this.productService.createCategory;
    createType = this.productService.createType;
}
