import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddFavoriteDto } from './dto/add.favorite.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoriteService : FavoritesService){}
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get('all')
    getAllFavorites(){
        return this.favoriteService.getAllFavourites()
    }

    @UseGuards(AuthGuard)
    @Post('add')
    addToFavorites(
        @Body() payload : AddFavoriteDto
    ){
        return this.favoriteService.addToFavorites(payload)
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    deleteFavorite(
        @Param('id', ParseIntPipe) id : number
    ){
        return this.favoriteService.deleteFavorite(id)
    }


}
