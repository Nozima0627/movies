import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserSubscriptionDto } from './dto/create.user.subscription.dto';
import { PaymentStatus, Role } from '@prisma/client';
import e from 'express';

@Injectable()
export class UserSubscriptionService {
    constructor(private prisma : PrismaService){}

    async getAllUserSubscriptions(){
        const  userSubscriptions = await this.prisma.userSubscription.findMany({
            where:{
                status: {in :['active', 'pending_payment']}
            },
            select:{
                id: true,
                user_id: true,
                plan_id: true,
                start_date: true,
                end_date: true,
                status: true,
                auto_renew: true,
            }
        })

        return {
            success: true,
            data: userSubscriptions 
        }
    }

    async getInactiveUserSubscriptions(){
        const  userSubscriptions = await this.prisma.userSubscription.findMany({
            where:{
                status: {in :['expired', 'canceled']}
            },
            select:{
                id: true,
                user_id: true,
                plan_id: true,
                start_date: true,
                end_date: true,
                status: true,
                auto_renew: true,
            }
        })

        return {
            success: true,
            data: userSubscriptions 
        }
    }

    async createUserSubscription(payload : UserSubscriptionDto, currentUser: {id: number, role: Role}){

        const existPlan = await this.prisma.subscriptionPlan.findFirst({
            where:{id: payload.plan_id}
        })
        if(!existPlan){
            throw new NotFoundException("Plan is not found by this ID")
        }

        const existSubscription = await this.prisma.userSubscription.findFirst({
            where:{
                user_id: payload.user_id,
                status: {in: ['active', 'pending_payment']}
            }
        })

        if(existSubscription){
            throw new ConflictException("You already have a subscription")
        }

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + existPlan.duration_days)
        await this.prisma.userSubscription.create({
            data:{
                ...payload,
                user_id: payload.user_id,
                end_date: endDate,
                start_date: startDate
            }
        })

        return {
            success: true,
            message: 'Subscription payment is pending'
        }
    }

    // async updateUserSubscription(id : number, currentUser: {id: number, role: Role}){
    //     await this.prisma.userSubscription.update({
    //         where:{user_id: currentUser.id},
    //         data:{

    //         }
    //     })
    // }

    async deleteUserSubscription(subscriptionId : number, currentUser : {id: number, role: Role}){
        const existSubscription = await this.prisma.userSubscription.findFirst({
            where:{id: subscriptionId}
        })

        if(!existSubscription){
            throw new NotFoundException("Subscription is not found by this ID")
        }

        if(currentUser.id != existSubscription.user_id && currentUser.role == Role.USER){
            throw new ForbiddenException("You can't delte other's subscriptions")
        }

        await this.prisma.userSubscription.update({
            where:{id: subscriptionId},
            data:{
                status: PaymentStatus.canceled
            }
        })

        return {
            success: true,
            message: "Subscription is deleted successfully"
        }
    }
}
