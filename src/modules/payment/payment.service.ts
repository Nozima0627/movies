import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { PaymentDto } from './dto/create.payment.dto';

@Injectable()
export class PaymentService {
    constructor(private prisma : PrismaService){}

    async getAllPayments(){
        const payments = await this.prisma.payment.findMany()

        return {
            success: true,
            data: payments
        }
    }

    async getOnePayment(id: number, currentUser : {id: number, role: Role}){
        const existUser = await this.prisma.userSubscription.findFirst({
            where:{
                user_id: id
            }, select:{
                id: true,
                payments:true
            }
        })
        if(!existUser){
            throw new NotFoundException("User is not found with by this id")
        }

        if(existUser.id != currentUser.id && currentUser.role == Role.USER){
            throw new ForbiddenException("❗You are trying to see for other's subscription")
        }

        return {
            success: true,
            data: existUser.payments
        }
    }

    async createPayment(payload : PaymentDto, currentUser : {id: number, role: Role}){
        const existSubscription = await this.prisma.userSubscription.findFirst({
            where:{id:payload.user_subscription_id},
            select:{
                plans:{
                    select:{
                        price:true
                    }
                }
            }
        })
        
        if(!existSubscription){
            throw new NotFoundException("You did not start subscription process yet")
        }

        const existUser = await this.prisma.userSubscription.findFirst({
            where:{
                user_id: currentUser.id,
                id: payload.user_subscription_id
            }
        })

        if(!existUser && currentUser.role == Role.USER){
            throw new ForbiddenException("You are trying to pay for other's subscription")
        }

        if(Number(existSubscription.plans.price) > Number(payload.amount)){
            throw new BadRequestException("Amount is not enough")
        }

        await this.prisma.payment.create({
            data: payload
        })

        await this.prisma.userSubscription.update({
            where:{id: payload.user_subscription_id},
            data:{
                status: 'active'                
            }
        })
        return {
            success: true,
            message: 'Payment is completed, your subscription is active now'
        }
    }
}
