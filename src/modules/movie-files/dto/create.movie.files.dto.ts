import { ApiProperty } from "@nestjs/swagger"
import { Quality } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateMovieFilesDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    movie_id : number

    // @ApiProperty()
    // @IsString()
    // file_url : string

    @ApiProperty()
    @IsEnum(Quality)
    quality  : Quality
}