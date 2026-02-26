import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CategoryDto } from './dto/create.category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { Status } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma : PrismaService){}

    async getAllCategories(){
        const categories = await this.prisma.category.findMany()

        return {
            success: true,
            data: categories
        }
    }

    async createCategory(payload: CategoryDto){
        const existCategory = await this.prisma.category.findFirst({
            where:{
                name: payload.name,
                slug: payload.slug
            }
        })

        if(existCategory){
            throw new BadRequestException("Category is already exist")
        }

        await this.prisma.category.create({
            data: payload
        })

        return {
            success: true,
            message: "Category created"
        }
    }

    async updateCategory(id: number, payload: UpdateCategoryDto){
        const existCategory = await this.prisma.category.findFirst({
            where:{
                id
            }
        })

        if(!existCategory){
            throw new BadRequestException("Category is not found by this ID")
        }

        await this.prisma.category.update({
            where:{id},
            data: {
                name: payload.name ?? existCategory.name,
                slug: payload.slug ?? existCategory.slug,
                description: payload.description ?? existCategory.description
            }
        })

        return {
            success: true,
            message: "Category is updated"
        }
    }

    async deleteCategory(id: number){
        const existCategory = await this.prisma.category.findFirst({
            where:{
                id
            }
        })

        if(!existCategory){
            throw new BadRequestException("Category is not found by this ID")
        }

        await this.prisma.category.update({
            where:{id},
            data: {
                status: Status.inactive
            }
        })

        return {
            success: true,
            message: "Category is deleted"
        }
    }
}
