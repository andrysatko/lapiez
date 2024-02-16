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
import {PartialType} from "@nestjs/mapped-types";
class CalorySubClass {
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Proteins?:number;
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Carbohydrates?:number;
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    @ApiProperty()
    Fats?:number;
    @IsOptional()
    @IsNumber()
    @ApiProperty()
    CalorieContent?:number;
}
type TImplements =  Omit<Partial<Prisma.ProductUncheckedCreateInput>,'CaloryInfo'> & {CaloryInfo?: CalorySubClass};
export class UpdateProductDto implements TImplements {
    @IsOptional()
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
    CaloryInfo?: CalorySubClass;
    @IsOptional()
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    @IsInt()
    @Max(3000)
    @Min(1)
    @ApiProperty()
    ProductWeight?: number;
    @IsOptional()
    @Length(1,300)
    @ApiProperty()
    description?: string;
    @IsOptional()
    @Transform(({value})=> Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(99.9)
    @Min(0.01)
    @ApiProperty()
    discount?: number | null;
    @IsOptional()
    @Transform(({value}) => Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(9999.9)
    @Min(0.01)
    @ApiProperty()
    price?: number;
    @IsOptional()
    @Length(1,30)
    @ApiProperty()
    title?: string;
    @IsOptional()
    @IsMongoId()
    @ApiProperty()
    typeId?: string;
    @IsOptional()
    @IsMongoId()
    @ApiProperty()
    categoryId?: string;
}

export const  SchemaSwaggerUpdateProductDto :  Record<keyof UpdateProductDto, SchemaObject | ReferenceObject> = {
    CaloryInfo: {type:'object', nullable:true, example:{"Proteins": 0, "Carbohydrates": 0, "Fats": 0, "CalorieContent": 0}, items:{properties:{Proteins:{type:'number', nullable:true},Carbohydrates:{type:'number', nullable:true},Fats:{type:'number', nullable:true},CalorieContent:{type:'number', nullable:true}}}},
    ProductWeight: {type:'integer', nullable:true},
    categoryId: {type:'string', nullable:true},
    description: {type:'string', nullable:true},
    discount: {type:'float', nullable:true},
    price: {type:'float', nullable:true},
    title: {type:'string', nullable:true},
    typeId: {type:'string', nullable:true}
}