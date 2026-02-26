import { ApiPropertyOptional } from "@nestjs/swagger"
import { Quality } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateMovieFilesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    movie_id : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    file_url : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(Quality)
    quality  : Quality
}