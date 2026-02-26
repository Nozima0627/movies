import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { movieCategoryDto } from './dto/create.movie.category.dto';

@Injectable()
export class MovieCategoryService {
    constructor(private prisma : PrismaService){}

    async getAllMovieCategories(){
        const existMovieCategories = await this.prisma.movieCategory.findMany()

        return {
            success: true,
            data: existMovieCategories
        }
    }

    async addMovieToCategory(payload : movieCategoryDto){
        const existMovieCategory = await this.prisma.movieCategory.findFirst({
            where:{
                movie_id: payload.movie_id,
                category_id: payload.category_id
            }
        })

        if(existMovieCategory){
            throw new BadRequestException("Movie is already added to this category")
        }
        await this.prisma.movieCategory.create({
            data:payload
        })

        return {
            success: true,
            message: "Movie is added to category"
        }
    }

    async deleteMovieCategory(payload : movieCategoryDto){
        const existMovieCategory = await this.prisma.movieCategory.findFirst({
            where:{
                movie_id: payload.movie_id,
                category_id: payload.category_id
            }
        })

        if(!existMovieCategory){
            throw new NotFoundException("Movie is not found in this category")
        }

        await this.prisma.movieCategory.delete({
            where:{
                movie_id_category_id:{
                    movie_id: payload.movie_id,
                    category_id:payload.category_id
                }
            }
        })

        return {
            success: true,
            message: "Movies is deleted from this category"
        }
    }
}
