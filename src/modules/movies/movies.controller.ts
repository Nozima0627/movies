import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { AddMovieDto } from './dto/add.move.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService : MoviesService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllMovies(
        @Req() req: Request
    ){
        return this.movieService.getAllMovies(req['user'])
    }

    @UseGuards(AuthGuard)
    @Get('one/:id')
    getOneMovies(
        @Param('id', ParseIntPipe) id : number,
        @Req() req: Request
    ){
        return this.movieService.getOneMovies(id, req['user'])
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post('add')
    addMovie(
        @Body() payload : AddMovieDto,
        @Req() req: Request
    ){
        return this.movieService.addMovie(payload, req['user'])
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Put('update/:id')
    updateMovie(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateMovieDto,
        @Req() req: Request
    ){
        return this.movieService.updateMovie(id, payload, req['user'])
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Put('upgrade/:id')
    upgradeMovie(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.movieService.upgradeMovie(id)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('delete/:id')
    deleteMovie(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.movieService.deleteMovie(id)
    }

}
