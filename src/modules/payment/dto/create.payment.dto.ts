import { ApiProperty } from "@nestjs/swagger"
import { Paymentmethod } from "@prisma/client"
import { IsArray, IsEnum, IsNumber, IsString } from "class-validator"

export class PaymentDto {
    @ApiProperty()
    @IsNumber()
    user_subscription_id : number

    @ApiProperty({example: 99999.99})
    @IsNumber()
    amount : number

    @ApiProperty()
    @IsEnum(Paymentmethod)
    payment_method : Paymentmethod

    @ApiProperty({
        type: [String]
    })
    @IsArray()
    @IsString({each: true})
    payment_details : string[]
}

//hlai tugamadi, buni dtosini togrilash kerak