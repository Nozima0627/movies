import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateReviewDto } from './dto/create.review.dto';
import { UpdateReviewDto } from './dto/update.review.dto';

@Injectable()
export class ReviewService {
    constructor(private prisma : PrismaService){}

    async getAllReviews(){
        const reviews = await this.prisma.review.findMany()

        return {
            success: true,
            data: reviews
        }
    }

    async createReview(payload : CreateReviewDto){
        const existReview = await this.prisma.review.findFirst({
            where:{
                user_id: payload.user_id,
                movie_id: payload.movie_id
            }
        })

        if(existReview){
            throw new BadRequestException("You already left review to this movie")
        }
        if(!(payload.rating <=5 && payload.rating>=1)){
            throw new BadRequestException("Rating should be 1 to 5")
        }

        await this.prisma.review.create({
            data: payload
        })

        return {
            success: true,
            message: "Review is recorded"
        }
    }

    async updateReview(id: number, payload : UpdateReviewDto){
        const existReview = await this.prisma.review.findFirst({
            where:{ id }
        })

        if(!existReview){
            throw new BadRequestException("Review is not found by this id")
        }
        if(payload.rating && !(payload?.rating <=5 && payload?.rating>=1)){
            throw new BadRequestException("Rating should be 1 to 5")
        }

        await this.prisma.review.update({
            where:{id},
            data:{
                user_id: payload.user_id ?? existReview.user_id,
                movie_id: payload.movie_id ?? existReview.movie_id,
                rating: payload.rating ?? existReview.rating,
                comment: payload.comment ?? existReview.comment
            }
        })
        return {
            success: true,
            message: "Review is updated"
        }

    }

    async deleteReview(id: number){
        const existReview = await this.prisma.review.findFirst({
            where:{ id }
        })

        if(!existReview){
            throw new BadRequestException("Review is not found by this id")
        }

        await this.prisma.review.delete({
            where:{id}
        })

        return {
            success: true,
            message: "Review is deleted"
        }
    }
}
