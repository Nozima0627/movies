import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class RegisterAdminDto{
    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsStrongPassword()
    password: string

    @ApiProperty({ 
        enum: Role, 
        example: Role.USER,
        required: false 
    })
    @IsOptional()
    @IsEnum(Role)
    role? : Role
}