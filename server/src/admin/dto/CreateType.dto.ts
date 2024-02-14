import {IsMongoId, Length} from "class-validator";

export class CreateTypeDto {
    @IsMongoId()
    categoryId: string;
    @Length(1,20)
    title: string;
}