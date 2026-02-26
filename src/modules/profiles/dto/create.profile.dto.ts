import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPhoneNumber, IsString } from "class-validator"

export class CreateProfileDto {
    @ApiProperty()
    @IsNumber()
    user_id : number

    @ApiProperty()
    @IsString()
    full_name : string

    @ApiProperty()
    @IsPhoneNumber('UZ')
    phone : string

    @ApiProperty()
    @IsString()
    country : string
}