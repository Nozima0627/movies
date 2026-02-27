import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class AddMovieDto{
    @ApiProperty()
    @IsString()
    title : string

    @ApiProperty()
    @IsString()
    slug : string

    @ApiProperty()
    @IsString()
    description : string

    @ApiProperty()
    @IsNumber()
    release_year : number

    @ApiProperty()
    @IsNumber()
    duration_minutes : number

    // @ApiProperty()
    // @IsString()
    // poster_url : string

    @ApiProperty()
    @IsNumber()
    rating : number

    // @ApiProperty()
    // @IsNumber()
    // created_by : number
}