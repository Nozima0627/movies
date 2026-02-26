import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber, IsString } from "class-validator"

export class CreateSubscriptionDto {
    @ApiProperty()
    @IsString()
    name : string

    @ApiProperty({example: 29.99})
    @IsNumber()
    price : number

    @ApiProperty()
    @IsNumber()
    duration_days : number

    @ApiProperty({ 
        example: ['Unlimited movies', 'HD quality', '4K streaming', 'Download offline'],
        type: [String]
    })
    @IsArray()
    @IsString({each: true})
    features  : string[]
}