import { ApiProperty } from "@nestjs/swagger";
import {IsString, Length} from "class-validator"
export class SignDto {
    @ApiProperty()
    @IsString()
    @Length(1, 20)
    name: string;
    @ApiProperty()
    @IsString()
    @Length(1,50)
    password: string;
}