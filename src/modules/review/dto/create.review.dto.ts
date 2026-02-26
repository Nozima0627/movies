import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateReviewDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    movie_id : number

    @ApiProperty()
    @IsNumber()
    rating : number //you must check it in code 1<=rating <=5

    @ApiProperty()
    @IsOptional()
    @IsString()
    comment? : string
}