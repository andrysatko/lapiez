import {IsMongoId, IsOptional, Length} from "class-validator";

export class UpdateTypeDto {
    @IsOptional()
    @IsMongoId()
    categoryId: string;
    @IsOptional()
    @Length(1,20)
    title: string;
}