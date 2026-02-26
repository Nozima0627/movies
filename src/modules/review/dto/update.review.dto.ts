import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateReviewDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    user_id : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    movie_id : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    rating : number //you must check it in code 1<=rating <=5

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    comment? : string
}