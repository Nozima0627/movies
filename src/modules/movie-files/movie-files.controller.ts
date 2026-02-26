import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MovieFilesService } from './movie-files.service';
import { CreateMovieFilesDto } from './dto/create.movie.files.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { put } from 'axios';
import { UpdateMovieFilesDto } from './dto/update.movie.file.dto';

@ApiBearerAuth()
@Controller('movie-files')
export class MovieFilesController {
    constructor(private readonly movieFilesService : MovieFilesService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllMovieFiles(
        @Req() req : Request
    ){
        return this.movieFilesService.getAllMovieFiles(req['user'])
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post('create')
    uploadMovieFile(
        @Body() payload : CreateMovieFilesDto
    ){
        return this.movieFilesService.uploadMovieFile(payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Put('update/:id')
    updateMovieFile(
        @Param('id', ParseIntPipe) id : number,
        @Body() payload : UpdateMovieFilesDto
    ){
        return this.movieFilesService.updateMovieFile(id, payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('delete/:id')
    deleteMovieFile(
        @Param('id', ParseIntPipe) id : number
    ){
        return this.movieFilesService.deleteMovieFile(id)
    }


}
