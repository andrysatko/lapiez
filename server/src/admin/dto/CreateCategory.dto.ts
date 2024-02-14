import {IsMongoId, Length, IsNotEmpty} from "class-validator";

export class CreateCategoryDto {
    @Length(1,20)
    @IsNotEmpty()
    title: string;
}
