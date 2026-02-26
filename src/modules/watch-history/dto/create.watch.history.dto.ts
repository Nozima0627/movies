import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class WatchHistoryDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsNumber()
    movie_id : number

    @ApiProperty()
    @IsNumber()
    watched_duration : number

    @ApiProperty()
    @IsNumber()
    watched_percentage : number
}