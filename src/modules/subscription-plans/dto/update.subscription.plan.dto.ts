import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateSubscriptionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name : string

    @ApiPropertyOptional({example: 29.99})
    @IsOptional()
    @IsNumber()
    price : number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    duration_days : number

    @ApiPropertyOptional({ 
        example: ['Unlimited movies', 'HD quality', '4K streaming', 'Download offline'],
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    features  : string[]
}