import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/create.payment.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService : PaymentService){}

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all')
    getAllPayments(){
        return this.paymentService.getAllPayments()
    }

    @UseGuards(AuthGuard)
    @Get('own/:id')
    getMyPayment(
        @Param('id', ParseIntPipe) id: number,
        @Req() req : Request
    ){
        return this.paymentService.getOnePayment(id, req['user'])
    }


    @UseGuards(AuthGuard)
    @Post('pay')
    createPayment(
        @Body() payload : PaymentDto,
        @Req() req : Request
    ){
        return this.paymentService.createPayment(payload, req['user'])
    }
}
