import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserSubscriptionDto } from './dto/create.user.subscription.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';


@ApiBearerAuth()
@Controller('user-subscription')
export class UserSubscriptionController {
    constructor(private readonly userSubscriptionService : UserSubscriptionService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllUserSubscriptions(){
        return this.userSubscriptionService.getAllUserSubscriptions()
    }

    @UseGuards(AuthGuard)
    @Get('inactive')
    getInactiveUserSubscriptions(){
        return this.userSubscriptionService.getInactiveUserSubscriptions()
    }


    @UseGuards(AuthGuard)
    @Post()
    createUserSubscription(
        @Body() payload : UserSubscriptionDto,
        @Req() req : Request
    ){
        return this.userSubscriptionService.createUserSubscription(payload, req['user'])
    }

    // @UseGuards(AuthGuard)
    // @Put('update/:id')
    // updateUserSubscription(
    //     @Param('id', ParseIntPipe) id : number,
    //     @Req() req: Request
    // ){
    //     // return this.userSubscriptionService.updateUserSubscription(id, req['user'])
    // }

    @UseGuards(AuthGuard)
    @Delete('delete/:subscriptionId')
    deleteUserSubscription(
        @Param('subscriptionId', ParseIntPipe) subscriptionId : number,
        @Req() req: Request
    ){
        return this.userSubscriptionService.deleteUserSubscription(subscriptionId, req['user'])
    }
}
