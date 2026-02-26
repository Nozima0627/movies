import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MovieCategoryService } from './movie-category.service';
import { movieCategoryDto } from './dto/create.movie.category.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@Controller('movie-category')
export class MovieCategoryController {
    constructor(private readonly movieCategoryService: MovieCategoryService){}

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all')
    getAllMovieCategories(){
        return this.movieCategoryService.getAllMovieCategories()
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('create')
    addMovieToCategory(
        @Body() payload : movieCategoryDto
    ){
        return this.movieCategoryService.addMovieToCategory(payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('delete')
    deleteMovieCategory(
        @Body() payload : movieCategoryDto
    ){
        return this.movieCategoryService.deleteMovieCategory(payload)
    }
}
