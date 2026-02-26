import { Body, Controller, Post } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistoryDto } from './dto/create.watch.history.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('watch-history')
export class WatchHistoryController {
    constructor(private readonly watchHistoryService : WatchHistoryService){}

    @Post('create')
    createWatchHistory(
        @Body() payload : WatchHistoryDto
    ){
        return this.watchHistoryService.createWatchHistory(payload)
    }
}
