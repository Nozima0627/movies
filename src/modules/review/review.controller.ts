import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create.review.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles';
import { UpdateReviewDto } from './dto/update.review.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService : ReviewService){}

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get('all')
    getAllReviews(){
        return this.reviewService.getAllReviews()
    }

    @UseGuards(AuthGuard)
    @Post('create')
    createReview(
        @Body() payload : CreateReviewDto
    ){
        return this.reviewService.createReview(payload)
    }

    @UseGuards(AuthGuard)
    @Put('update/:id')
    updateReview(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateReviewDto
    ){
        return this.reviewService.updateReview(id, payload)
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    deleteReview(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.reviewService.deleteReview(id)
    }
}
