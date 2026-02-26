import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { WatchHistoryDto } from './dto/create.watch.history.dto';

@Injectable()
export class WatchHistoryService {
    constructor(private prisma : PrismaService){}

    async createWatchHistory(payload : WatchHistoryDto) {
        const existWatchHistory = await this.prisma.watchHistory.findFirst({
            where:{
                user_id: payload.user_id,
                movie_id: payload.movie_id
            }
        })

        if(existWatchHistory){
            throw new BadRequestException("You already started to watch this movie")
        }
        await this.prisma.watchHistory.create({
            data:payload
        })

        return {
            success: true,
            message: "Watch history is recorded"
        }
    }
}
