import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class UpdateUserDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsStrongPassword()
    password?: string
}