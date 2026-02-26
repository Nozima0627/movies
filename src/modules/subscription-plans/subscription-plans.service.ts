import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateSubscriptionDto } from './dto/create.subscription.plan.dto';
import { retry } from 'rxjs';
import { UpdateSubscriptionDto } from './dto/update.subscription.plan.dto';

@Injectable()
export class SubscriptionPlansService {
    constructor(private prisma : PrismaService){}

    async getAllSubscriptionPlans(){
        const plans = await this.prisma.subscriptionPlan.findMany({
            where:{
                is_active: true
            }
        })

        return {
            success: true,
            data: plans
        }
    }

    async getOneSubscriptionPlan(id: number){
        const existPlan = await this.prisma.subscriptionPlan.findFirst({
            where:{
                id,
                is_active: true
            }
        })

        if(!existPlan){
            throw new NotFoundException("Plan is not found by this id")
        }

        return {
            success: true,
            data: existPlan
        }
    }

    async createSubscriptionPlan(payload : CreateSubscriptionDto){
        const existPlan = await this.prisma.subscriptionPlan.findFirst({
            where:{name: payload.name}
        })

        if(existPlan){
            throw new ConflictException("Plan with this name is already exist")
        }

        await this.prisma.subscriptionPlan.create({
            data:{
                name: payload.name,
                price: payload.price,
                duration_days: payload.duration_days,
                features: payload.features
            }
        })

        return {
            success: true,
            message: "Subscription plan is created"
        }
    }

    async updateSubscriptionPlan(id: number, payload : UpdateSubscriptionDto){
        const existPlan = await this.prisma.subscriptionPlan.findFirst({
            where:{id}
        })

        if(!existPlan){
            throw new NotFoundException("Subscription plan is not found by this id")
        }

        await this.prisma.subscriptionPlan.update({
            where:{id},
            data:{
                name: payload.name ?? existPlan.name,
                price: payload.price ?? existPlan.price,
                duration_days: payload.duration_days ?? existPlan.duration_days,
                features: payload.features ?? existPlan.features
            }
        })
        return {
            success :true,
            message: "Subscription plan is updated"
        }
    }

    async deleteSubscriptionPlan(id: number){
        const existPlan = await this.prisma.subscriptionPlan.findFirst({
            where:{id}
        })

        if(!existPlan){
            throw new NotFoundException("Subscription plan is not found by this id")
        }

        await this.prisma.subscriptionPlan.update({
            where:{id},
            data:{
                is_active: false
            }
        })
        return {
            success :true,
            message: "Subscription plan is deleted"
        }
    }
}
