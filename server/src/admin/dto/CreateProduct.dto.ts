import {Prisma} from '@prisma/client';
import {
    ArrayNotEmpty,
    IsArray, IsDefined, IsInt, IsJSON,
    IsMongoId, IsNotEmptyObject,
    IsNumber, IsObject,
    IsOptional, IsString,
    Length,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import {Transform, Type} from "class-transformer";
import {CustomValidateNested} from "../../shared/CustomValidateNested.decorator";
import {BadRequestException} from "@nestjs/common";
import {ApiProperty} from "@nestjs/swagger";
import {ReferenceObject, SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
class CalorySubClass {
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Proteins:number;
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Carbohydrates:number;
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Fats:number;
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    CalorieContent?:number;
}
export class CreateProductDto implements Prisma.ProductUncheckedCreateInput {
    @Transform(({value})=>{
        try {
            return JSON.parse(value);
        } catch (error) {
            throw new BadRequestException('CaloryInfo invalid JSON format: ' + error.message);
        }
    })
    @CustomValidateNested(CalorySubClass)
    @Type(() => CalorySubClass)
    @ApiProperty()
    CaloryInfo: CalorySubClass;
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    @IsInt()
    @Max(3000)
    @Min(1)
    @ApiProperty()
    ProductWeight: number;
    @Length(1,300)
    @ApiProperty()
    description: string;
    @IsOptional()
    @Transform(({value})=> Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(99.9)
    @Min(0.01)
    @ApiProperty()
    discount?: number | null;
    @Transform(({value}) => Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(9999.9)
    @Min(0.01)
    @ApiProperty()
    price: number;
    @Length(1,30)
    @ApiProperty()
    title: string;
    @IsMongoId()
    @ApiProperty()
    typeId: string;
    @IsMongoId()
    @ApiProperty()
    categoryId: string;
}

export const  SchemaSwaggerCreateProductDto :  Record<keyof CreateProductDto, SchemaObject | ReferenceObject> = {
    CaloryInfo: {type:'object',example:{"Proteins": 0, "Carbohydrates": 0, "Fats": 0, "CalorieContent": 0}, items:{properties:{Proteins:{type:'number'},Carbohydrates:{type:'number'},Fats:{type:'number'},CalorieContent:{type:'number'}}}},
    ProductWeight: {type:'integer'},
    categoryId: {type:'string'},
    description: {type:'string'},
    discount: {type:'float'},
    price: {type:'float'},
    title: {type:'string'},
    typeId: {type:'string'}
}