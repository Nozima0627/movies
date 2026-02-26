import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { AddMovieDto } from './dto/add.move.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { PaymentStatus, Role, Status, SubscriptionType } from '@prisma/client';

@Injectable()
export class MoviesService {
    constructor(private prisma : PrismaService){}

    async getAllMovies(currentUser : {id: number}){
        
        const existuser = await this.prisma.user.findFirst({
            where:{id: currentUser.id},
            select:{
                userSubscriptions:{
                    where:{user_id: currentUser.id},
                    select:{
                        status: true
                    }
                }
            }
        })
        if(!(existuser?.userSubscriptions?.some(sub => sub.status == PaymentStatus.active))){
            const movies = await this.prisma.movie.findMany({
                where: {
                    subscription_type: SubscriptionType.free
                },
                select:{
                    id: true,
                    title: true,
                    description: true,
                    duration_minutes: true,
                    rating: true,
                    release_year: true,
                    poster_url: true,
                    movieFiles: true
                }
            })
            return {
                success: true,
                data: movies
            }
        }
        
        const movies = await this.prisma.movie.findMany({
            select:{
                id: true,
                    title: true,
                    description: true,
                    duration_minutes: true,
                    rating: true,
                    release_year: true,
                    poster_url: true,
                    movieFiles: true
                }
        })
            
        return {
            success: true,
            data: movies
        }
    }

    async getOneMovies(id : number, currentUser : {id: number}){
        
        const existuser = await this.prisma.user.findFirst({
            where:{id: currentUser.id},
            select:{
                userSubscriptions:{
                    where:{user_id: currentUser.id},
                    select:{
                        status: true
                    }
                }
            }
        })
        if(!(existuser?.userSubscriptions?.some(sub => sub.status == PaymentStatus.active))){
            const movie = await this.prisma.movie.findFirst({
                where: {
                    id,
                    subscription_type: SubscriptionType.free
                },
                select:{
                    id: true,
                    title: true,
                    description: true,
                    duration_minutes: true,
                    rating: true,
                    release_year: true,
                    poster_url: true,
                    movieFiles: true
                }
            })
            return {
                success: true,
                data: movie
            }
        }
        
        const movie = await this.prisma.movie.findFirst({
            where:{id},
            select:{
                id: true,
                title: true,
                description: true,
                duration_minutes: true,
                rating: true,
                release_year: true,
                poster_url: true,
                movieFiles: true
            }
        })
            
        return {
            success: true,
            data: movie
        }
    }

    async addMovie(payload : AddMovieDto, currentUser : { id: number}){
        const existMovie = await this.prisma.movie.findFirst({
            where:{
                title: payload.title,
                slug: payload.slug
            }
        })
        await this.prisma.movie.create({
            data: {
                ...payload,
                created_by: currentUser.id
            }
        })

        return {
            success: true,
            message: "Movie is added ✅"
        }
    }

    async updateMovie(id : number, payload : UpdateMovieDto, currentUser: {id : number}){
        const existMovie = await this.prisma.movie.findFirst({
            where:{id}
        })

        if(!existMovie){
            throw new NotFoundException("Movie is not found by this ID")
        }

        await this.prisma.movie.update({
            where:{id},
            data:{
                title: payload.title ?? existMovie.title,
                slug: payload.slug ?? existMovie.slug,
                description: payload.description ?? existMovie.description,
                release_year: payload.release_year ?? existMovie.release_year,
                duration_minutes: payload.duration_minutes ?? existMovie.duration_minutes,
                poster_url: payload.poster_url ?? existMovie.poster_url,
                rating: payload.rating ?? existMovie.rating,
                created_by: currentUser.id
            }
        })

        return {
            success: true,
            message: "Movie is updated"
        }
    }

    async upgradeMovie(id : number){
        const existMovie = await this.prisma.movie.findFirst({
            where:{id}
        })

        if(!existMovie){
            throw new NotFoundException("Movie is not found by this ID")
        }

        if(existMovie.subscription_type == SubscriptionType.premium){
            throw new BadRequestException("Movie is already in the premium list")
        }

        await this.prisma.movie.update({
            where:{id},
            data:{
                subscription_type: SubscriptionType.premium
            }
        })

        return {
            success: true,
            message: "Movie is in premium list now"
        }
    }

    async deleteMovie(id : number){
        const existMovie = await this.prisma.movie.findFirst({
            where:{id}
        })

        if(!existMovie){
            throw new NotFoundException("Movie is not found by this ID")
        }
        await this.prisma.movie.update({
            where:{id},
            data:{
                status: Status.delete
            }
        })
        return {
            success: true,
            message: "Movie is deleted"
        }
    }
}
