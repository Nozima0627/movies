import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { AddFavoriteDto } from './dto/add.favorite.dto';

@Injectable()
export class FavoritesService {
    constructor(private prisma : PrismaService){}

    async getAllFavourites(){
        const favorites = await this.prisma.favorites.findMany()

        return{
            success: true,
            data: favorites 
        }
    }

    async addToFavorites(payload : AddFavoriteDto){
        const isFavorite = await this.prisma.favorites.findFirst({
            where:{
                user_id: payload.user_id,
                movie_id: payload.movie_id
            }
        })

        if(isFavorite){
            throw new BadRequestException("Movies is already in favorites list")
        }
        await this.prisma.favorites.create({
            data: payload
        })

        return {
            success: true,
            message: "Movie is added to favorites"
        }
    }

    async deleteFavorite(id: number){
        await this.prisma.favorites.delete({
            where:{id}
        })

        return {
            success: true,
            message: "Movie is deleted from favorites"
        }
    }
}
