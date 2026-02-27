import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateMovieFilesDto } from './dto/create.movie.files.dto';
import { UpdateMovieFilesDto } from './dto/update.movie.file.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class MovieFilesService {
    constructor(private prisma : PrismaService){}

    async getAllMovieFiles(currentUser: { id : number }){
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
            const moviesFiles = await this.prisma.movieFiles.findMany()

            return {
                success: true,
                data: moviesFiles
            }
        }
        const moviesFiles = await this.prisma.movieFiles.findMany()

        return {
            success: true,
            data: moviesFiles
        }
    }

    async getOneMovie(id: number){

    }

    async uploadMovieFile(payload : CreateMovieFilesDto, filename : string){
        const existMovieFile = await this.prisma.movieFiles.findFirst({
            where:{movie_id: payload.movie_id}
        })

        if(existMovieFile){
            throw new BadRequestException("This movie file is already uploaded")
        }
        await this.prisma.movieFiles.create({
            data: {
                ...payload,
                file_url: filename
            }
        })
        return {
            success: true,
            message: 'Movie file is uploaded'
        }
    }

    async updateMovieFile(id: number, payload: UpdateMovieFilesDto){
        const existMovieFile = await this.prisma.movieFiles.findFirst({
            where:{id}
        })
        if(!existMovieFile){
            throw new NotFoundException("Movie file is not found by this ID")
        }

        await this.prisma.movieFiles.update({
            where:{id},
            data:{
                movie_id: payload.movie_id ?? existMovieFile.movie_id,
                file_url: payload.file_url ?? existMovieFile.file_url,
                quality: payload.quality ?? existMovieFile.quality
            }
        })
        return {
            success: true,
            message: "Movie file is updated"
        }
    }

    async deleteMovieFile(id: number){
        const existMovieFile = await this.prisma.movieFiles.findFirst({
            where:{id}
        })
        if(!existMovieFile){
            throw new NotFoundException("Movie file is not found by this ID")
        }

        await this.prisma.movieFiles.delete({
            where:{
                id
            }
        })

        return{
            success: true,
            message: "Movie file is deleted"
        }
    }
}
