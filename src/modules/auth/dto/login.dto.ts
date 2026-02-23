import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class LoginDto {
    @ApiProperty({example: "nozimaabdugapparova9@gmail.com"})
    @IsEmail()
    email: string

    @ApiProperty({example: "Nozima06!"})
    @IsString()
    password: string
}