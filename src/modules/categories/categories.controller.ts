import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CategoryDto } from './dto/create.category.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService){}

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Get()
    getAllCategories(){
        return this.categoryService.getAllCategories()
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post()
    createCategory(
        @Body() payload: CategoryDto
    ){
        return this.categoryService.createCategory(payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Put('update/:id')
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateCategoryDto
    ){
        return this.categoryService.updateCategory(id, payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('delete/:id')
    deleteCategory(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.categoryService.deleteCategory(id)
    }

}
