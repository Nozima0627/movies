import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsPhoneNumber, IsString } from "class-validator"

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber('UZ')
    phone : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country : string
}