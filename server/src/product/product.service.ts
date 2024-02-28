import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {Prisma, Product} from '@prisma/client';
@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService){
    }

    getTypes(){
        return this.prisma.type.findMany();
    }
    getCategories(){
        return this.prisma.category.findMany();
    }

    getAll(){
        const data =this.prisma.product.findMany({include:{type:true,category:true}});
        return data;
    }
    getById(id: string){
        return this.prisma.product.findUnique({
            where: {id}
        });
    }
    getByCategory(categoryId:string){
        return this.prisma.product.findMany({
            where:{categoryId:categoryId}
        })
    }
    getByType(typeId:string){
        return this.prisma.product.findMany({
            where:{typeId:typeId}
        })
    }

    getAllCategoriesAndTypes(){
        return this.prisma.category.findMany({include:{types:true}});
    }

    getProductById(id: string){
        return this.prisma.product.findUnique({
            where: {id:id},
            include: {type:true, category:true}
        });
    }
}
