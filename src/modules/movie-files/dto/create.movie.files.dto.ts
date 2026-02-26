import { ApiProperty } from "@nestjs/swagger"
import { Quality } from "@prisma/client"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateMovieFilesDto {
    @ApiProperty()
    @IsNumber()
    movie_id : number

    @ApiProperty()
    @IsString()
    file_url : string

    @ApiProperty()
    @IsEnum(Quality)
    quality  : Quality
}