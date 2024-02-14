import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {Prisma, Product} from '@prisma/client';
@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService){
    }

    getAll(){
        return this.prisma.product.findMany();
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

    createProduct(body: Prisma.ProductUncheckedCreateInput){
        const {categoryId,typeId,...data} = body;
        return this.prisma.product.create({
            data:{...data, category:{connect:{id:categoryId}}, type:{connect:{id:typeId}}}
        })
    }
    updateProduct(id: string, data: Prisma.ProductUncheckedUpdateInput){
        return this.prisma.product.update({
            where:{id},
            data
        })
    }
    createCategory(data: Prisma.CategoryUncheckedCreateInput){

       const test =  this.prisma.product.findMany()
        return this.prisma.category.create({
            data:{title:data.title}
        })
    }
    createType(data: Prisma.TypeUncheckedCreateInput){
        const {categoryId,...type} = data;
        return this.prisma.type.create({
            data:{...type, category:{connect:{id:data.categoryId}}},
        })
    }
}
