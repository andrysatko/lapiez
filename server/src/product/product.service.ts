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
            data:{...data, category:categoryId ? {connect:{id:categoryId}} : undefined, type:typeId? {connect:{id:typeId}}: undefined}
        })
    }
    // updateProduct(id: string, body: Prisma.ProductUpdateInput){
    //     const {categoryId,typeId,...data} = body;
    //     return this.prisma.product.update({
    //         where:{id},
    //         data:{...data, category:categoryId ? {connect:{id:categoryId}} : undefined, type:typeId? {connect:{id:typeId}}: undefined}
    //     })
    // }
    createCategory(data: Prisma.CategoryUncheckedCreateInput){
        return this.prisma.category.create({
            data:{title:data.title, icon:data.icon}
        })
    }

}
