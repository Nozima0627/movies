import { Module } from '@nestjs/common';
import { MovieCategoryController } from './movie-category.controller';
import { MovieCategoryService } from './movie-category.service';

@Module({
  controllers: [MovieCategoryController],
  providers: [MovieCategoryService]
})
export class MovieCategoryModule {}
