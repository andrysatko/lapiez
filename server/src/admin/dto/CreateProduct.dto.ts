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
class CalorySubClass {
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    Proteins:number;
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    Carbohydrates:number;
    @IsNumber()
    @Min(0.01)
    @Max(1000)
    Fats:number;
    @IsOptional()
    @IsNumber()
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
    CaloryInfo: CalorySubClass;
    @Transform(({value}) => parseInt(value),{toClassOnly:true})
    @IsInt()
    @Max(3000)
    @Min(1)
    ProductWeight: number;
    @Length(1,300)
    description: string;
    @IsOptional()
    @Transform(({value})=> Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(99.9)
    @Min(0.01)
    discount?: number | null;
    @Transform(({value}) => Number(parseFloat(value).toFixed(2)),{toClassOnly:true})
    @IsNumber()
    @Max(9999.9)
    @Min(0.01)
    price: number;
    @Length(1,30)
    title: string;
    @IsMongoId()
    typeId: string;
    @IsMongoId()
    categoryId: string;
}