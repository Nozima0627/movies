import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class AddFavoriteDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    movie_id : number
}