import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionDto } from './dto/create.subscription.plan.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { UpdateSubscriptionDto } from './dto/update.subscription.plan.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('subscription-plans')
export class SubscriptionPlansController {
    constructor(private readonly subscriptionPlanService: SubscriptionPlansService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllSubscriptionPlans(){
        return this.subscriptionPlanService.getAllSubscriptionPlans()
    }

    @UseGuards(AuthGuard)
    @Get('single/:id')
    getOneSubscriptionPlan(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.subscriptionPlanService.getOneSubscriptionPlan(id)
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('create')
    createSubscriptionPlan(
        @Body() payload : CreateSubscriptionDto
    ){
        return this.subscriptionPlanService.createSubscriptionPlan(payload)
    }



    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Put('update/:id')
    updateSubscriptionPlan(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateSubscriptionDto
    ){
        return this.subscriptionPlanService.updateSubscriptionPlan(id, payload)
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('/:id')
    deleteSubscriptionPlan(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.subscriptionPlanService.deleteSubscriptionPlan(id)
    }
}
