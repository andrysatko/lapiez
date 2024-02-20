import {IsMongoId, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTypeDto {
    @ApiProperty()
    @IsMongoId()
    categoryId: string;
    @ApiProperty()
    @Length(1,20)
    title: string;
}