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
import {UpdateTypeDto} from "./dto/UpdateType.dto";
import * as process from "process";

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
            console.log(categoryId, typeId)
            return await this.prismaService.product.create({
                data:{...data, images:filesNames, category:categoryId ? {connect:{id:categoryId}} : undefined, type:typeId? {connect:{id:typeId}}: undefined}
            })
        }catch (e) {
            console.log(e)
            removeFiles();
            throw new HttpException('Problem while saving product in database', 500);
        }
    }
    async UpdateProduct(product_Id: string,body: UpdateProductDto,files?: Express.Multer.File[] | undefined){
        const MaxAvailableFiles = 3;
        const filePath = path.join(process.cwd(),'static','products')
        const {CaloryInfo , FileData, ...rest} = body;
        const product = await this.prismaService.product.findUnique({where:{id:product_Id}});
        if(!product) throw new HttpException('Product not found', 404);
        const FilesNames = product.images;
        if(body.categoryId){
            const isCategory = await this.prismaService.category.findUnique({where:{id:body.categoryId}});
            if(!isCategory) throw new BadRequestException('Category not found');
        }
        if(body.typeId){
            const isType = await this.prismaService.category.findUnique({where:{id:body.typeId}});
            if(!isType) throw new BadRequestException('Type not found');
        }
        if(files.length > 0){
            try {
            if(!FileData){
                throw new BadRequestException('FileData should be provided for uploaded files');
            }
            if(FileData.replace){
                FileData.replace.map(replaceItem =>{
                    if(replaceItem.index < 0 || replaceItem.index > FilesNames.length) throw new BadRequestException(`Index ${replaceItem.index} out of range`);
                    const FILE = files.filter(file => file.originalname === replaceItem.fileName)[0];
                    const NewFileName = uuid.v4()  + FILE.originalname.split('.').pop()
                    fs.writeFileSync(path.join(filePath, NewFileName),  FILE.buffer);
                    const unlinkPath = path.join(filePath, FilesNames[replaceItem.index])
                    if(fs.existsSync(unlinkPath)){
                        fs.unlinkSync(unlinkPath)
                    }
                    FilesNames[replaceItem.index] = NewFileName;
                })
            }
            if(FileData.push){
                if(FilesNames.length + FileData.push.length > MaxAvailableFiles) throw new BadRequestException(`Max available files is ${MaxAvailableFiles}`);
                FileData.push.map((file,index) =>{
                    const NewFileName = uuid.v4()  + `.${files[index].mimetype.split('/')[1]}`;
                    fs.writeFileSync(path.join(filePath, NewFileName),  files[index].buffer);
                    FilesNames.push(NewFileName);
                })
            }
            }catch (e) {
                throw new HttpException('Problem while saving file', 500);
            }
        }
        if(FileData.remove){
            FileData.remove.map(index => {
                if(index < 0 || index > FilesNames.length) throw new BadRequestException(`Index ${index} out of range`);
                const unlinkPath = path.join(filePath, FilesNames[index])
                if(FilesNames[index]!== '' &&  fs.existsSync(unlinkPath)){
                    fs.unlinkSync(unlinkPath)
                }
            })
            for(let index of FileData.remove){
                if(index >= 0 && index < FilesNames.length){
                    FilesNames[index] ='';
                }
            }
        }
        return  this.prismaService.product.update({where:{id:product_Id},data:{ CaloryInfo: CaloryInfo ? {...product.CaloryInfo, ...CaloryInfo} : undefined,
                ...rest,
                images:FilesNames
            }})
    }
    async DeleteProduct(productId: string){
        const product = await this.prismaService.product.findUnique({where:{id:productId}});
        if(!product) throw new HttpException('Product not found', 404);
        const filePath = path.join(process.cwd(),'static','products');
        product.images.map(file => fs.unlink(path.join(filePath, file),()=>{}))
        await this.prismaService.product.delete({where:{id:productId}})
    }

    async UpdateOneImageProduct(productId: string, oldFileName: string ,  file: Express.Multer.File) {
        const product = await this.prismaService.product.findUnique({where:{id:productId}});
        if(!product) throw new HttpException('Product not found', 404);
        if(!product.images.includes(oldFileName)) throw new BadRequestException(`Porovided image name ${oldFileName} not found in product images`);
        const filePath = path.join(process.cwd(),'static','products');
        const NewFileName = uuid.v4()  + `.${file.mimetype.split('/')[1]}`;
        fs.writeFileSync(path.join(filePath, NewFileName), file.buffer);
        fs.unlinkSync(path.join(filePath, oldFileName));
        return this.prismaService.product.update({where:{id:productId}, data: {images: {set: product.images.map(fileName=> fileName === oldFileName ? NewFileName : fileName)}}})
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
        fs.unlink(filePath,()=>{});
    }
    async createType(data: Prisma.TypeUncheckedCreateInput){
        const {categoryId,...type} = data;
        return this.prismaService.type.create({
            data:{...type, category:{connect:{id:data.categoryId}}},
        })
    }

    async UpdateType(typeId: string, body: UpdateTypeDto){
        const type = await this.prismaService.type.findUnique({where:{id:typeId}});
        if(!type) throw new HttpException('Type not found', 404);
        return this.prismaService.type.update({where:{id:typeId},data:body})
    }

    async DeleteType(typeId: string){
        const type = await this.prismaService.type.findUnique({where:{id:typeId}});
        if(!type) throw new HttpException('Type not found', 404);
        await this.prismaService.type.delete({where:{id:typeId}})
    }
}
