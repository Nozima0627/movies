import { Module } from '@nestjs/common';
import { MovieFilesController } from './movie-files.controller';
import { MovieFilesService } from './movie-files.service';

@Module({
  controllers: [MovieFilesController],
  providers: [MovieFilesService]
})
export class MovieFilesModule {}
