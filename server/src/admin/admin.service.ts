import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import {CreateProductDto} from "./dto/CreateProduct.dto";
import * as uuid from 'uuid';
import * as path from "path";
import * as fs from 'fs';
import {calculateCalories} from "./utils/CountCalories";
import {CreateCategoryDto} from "./dto/CreateCategory.dto";
import {UpdateProductDto} from "./dto/UpdateProduct.dto";
import {PrismaService} from "../database/prisma.service";
import {Prisma} from "@prisma/client";
import {UpdateCategoryDto} from "./dto/UpdateCategory.dto";

@Injectable()
export class AdminService {
    constructor(private prismaService: PrismaService) {
    }

    async CreateProduct(files: Express.Multer.File[], body: CreateProductDto){
        const {CalorieContent,Proteins,Fats,Carbohydrates} = body.CaloryInfo;
        if(!CalorieContent){
            body.CaloryInfo.CalorieContent = calculateCalories(Proteins,Carbohydrates,Fats);
        }
        const filePath = path.join(process.cwd(),'static','products')
        const filesNames = [];
        const removeFiles = ()=> filesNames.map(file => fs.unlinkSync(path.join(filePath, file)));
        files.map(file => {
            try {
                const NewFileName = uuid.v4()  + `.${file.mimetype.split('/')[1]}`;
                fs.writeFileSync(path.join(filePath, NewFileName),  file.buffer);
                filesNames.push(NewFileName);
            }catch (e) {
                removeFiles();
                throw new HttpException(`File ${file.originalname} not uploaded`, 500);
            }
        })
        try {
            const {categoryId,typeId,...data} = body;
            return await this.prismaService.product.create({
                data:{...data, images:filesNames, category:categoryId ? {connect:{id:categoryId}} : undefined, type:typeId? {connect:{id:typeId}}: undefined}
            })
        }catch (e) {
            removeFiles();
            throw new HttpException('Problem while saving product in database', 500);
        }
    }
    async UpdateProduct(product_Id: string,body: UpdateProductDto,files?: Express.Multer.File[] | undefined){
        const {CaloryInfo , ...rest} = body;
        const product = await this.prismaService.product.findUnique({where:{id:product_Id}});
        if(!product) throw new HttpException('Product not found', 404);
        const OldFilesNames = product.images;
        const filesNames = [];
        if(files){
            const filePath = path.join(process.cwd(),'static','products')
            try {
                files.map(file =>{
                    const NewFileName = uuid.v4()  + `.${file.mimetype.split('/')[1]}`;
                    fs.writeFileSync(path.join(filePath, NewFileName),  file.buffer);
                    filesNames.push(NewFileName);
                })
                const updatedProduct =await this.prismaService.product.update({where:{id:product_Id},data:{CaloryInfo:{...product.CaloryInfo, ...CaloryInfo},
                        ...rest,
                        images:filesNames
                    }})
                OldFilesNames.map(file => fs.unlinkSync(path.join(filePath, file)))
                return updatedProduct;
            }catch (e) {
                filesNames.map(file => fs.unlinkSync(path.join(filePath, file)));
                throw new HttpException('Problem while saving product in database', 500);
            }
        }
        return this.prismaService.product.update({where:{id:product_Id},data:{CaloryInfo:{...product.CaloryInfo, ...CaloryInfo},
                ...rest,
            }});
    }
    async DeleteProduct(productId: string){
        const product = await this.prismaService.product.findUnique({where:{id:productId}});
        if(!product) throw new HttpException('Product not found', 404);
        const filePath = path.join(process.cwd(),'static','products');
        try{product.images.map(file => fs.unlinkSync(path.join(filePath, file)))}
        finally {
            await this.prismaService.product.delete({where:{id:productId}})
        }
    }

    async UpdateOneImageProduct(productId: string, file: Express.Multer.File, oldFileName: string){
        const product = await this.prismaService.product.findUnique({where:{id:productId}});
        if(!product) throw new HttpException('Product not found', 404);
        if(!product.images.includes(oldFileName)) throw new BadRequestException(`Porovided image name ${oldFileName} not found in product images`);
        const filePath = path.join(process.cwd(),'static','products',oldFileName);
        fs.writeFileSync(filePath, file.buffer);
    }

    async createCategory(icon: Express.Multer.File,body : CreateCategoryDto ){
        const NewFileName = uuid.v4()  + `.${icon.mimetype.split('/')[1]}`;
        const filePath = path.join(process.cwd(),'static','categories',NewFileName);
        fs.writeFileSync(filePath, icon.buffer);
        try {
            return await this.prismaService.category.create({
                data:{...body, icon:NewFileName}
            })
        }catch (e) {
            fs.unlinkSync(filePath);
            throw new HttpException('Problem while saving category in database', 500);
        }
    }
    async updateCategory(categoryId:string , body : UpdateCategoryDto, icon?: Express.Multer.File | undefined ){
        const category = await this.prismaService.category.findUnique({where:{id:categoryId}});
        if(!category) throw new HttpException('Category not found', 404);
        if(icon){
            const oldFileName = category.icon;
            const NewFileName = uuid.v4()  + `.${icon.mimetype.split('/')[1]}`;
            const filePath = path.join(process.cwd(),'static','categories',NewFileName);
            fs.writeFileSync(filePath, icon.buffer);
            try{
                const updatedCategory = await this.prismaService.category.update({where:{id:categoryId},data:{...body, icon:NewFileName}})
                fs.unlinkSync(filePath);
                return updatedCategory;
            }
            catch (e) {
                fs.unlinkSync(filePath);
                throw new HttpException('Problem while saving category in database', 500);
            }
        }
        return this.prismaService.category.update({where:{id: categoryId},data:{...body}})
    }

    async DeleteCategory(categoryId:string ){
        const category = await this.prismaService.category.findUnique({where:{id:categoryId}});
        if(!category) throw new HttpException('Category not found', 404);
        const filePath = path.join(process.cwd(),'static','categories',category.icon);
        await this.prismaService.category.delete({where:{id:categoryId}});
        fs.unlinkSync(filePath);
    }
    async createType(data: Prisma.TypeUncheckedCreateInput){
        const {categoryId,...type} = data;
        return this.prismaService.type.create({
            data:{...type, category:{connect:{id:data.categoryId}}},
        })
    }

    async UpdateType(typeId: string, title:string){
        const type = await this.prismaService.type.findUnique({where:{id:typeId}});
        if(!type) throw new HttpException('Type not found', 404);
        return this.prismaService.type.update({where:{id:typeId},data:{title}})
    }

    async DeleteType(typeId: string){
        const type = await this.prismaService.type.findUnique({where:{id:typeId}});
        if(!type) throw new HttpException('Type not found', 404);
        await this.prismaService.type.delete({where:{id:typeId}})
    }
}
