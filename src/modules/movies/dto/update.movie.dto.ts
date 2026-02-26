import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateMovieDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    release_year : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    duration_minutes : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    poster_url : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    rating : number

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsNumber()
    // created_by : number
}