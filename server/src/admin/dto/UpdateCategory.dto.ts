import {IsMongoId, Length, IsNotEmpty, IsOptional} from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @Length(1,20)
    @IsNotEmpty()
    title?: string;
}
