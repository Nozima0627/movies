import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { RegisterAdminDto } from './dto/register.admin.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async getAllAdmins(){
        const admins = await this.prisma.user.findMany({
            where: {
                status: Status.active,
                OR:[
                    {role: Role.ADMIN},
                    {role: Role.SUPERADMIN}
                ]
            },
            select:{
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                status: true
            }
        })
        return {
            success: true,
            data: admins
        }
    }

    async getAllUsers(){
        const users = await this.prisma.user.findMany({
            where: {
                status: Status.active,
                role: Role.USER
            },
            select:{
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                status: true
            }
        })
        return {
            success: true,
            data: users
        }
    }

    async getOneUser(id: number, currentUser: {id: number, role: Role}){
        const existUser = await this.prisma.user.findFirst({
            where: {
                id,
                status: Status.active
            }, select:{
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                status: true
            }
        })

        if(!existUser){
            throw new NotFoundException("User is not found by this ID")
        }
        if(id != currentUser.id && currentUser.role == Role.USER){
            throw new ForbiddenException("You cannot see other users' data")
        }

        return {
            success: true,
            data: existUser
        }
    }

    async getMyFavorites(id : number){
        const existUser = await this.prisma.user.findFirst({
            where:{id}
        })
        if(!existUser) {
            throw new NotFoundException("User is not found by this id")
        }

        const favorites = await this.prisma.favorites.findMany({
            where:{user_id: id}
        })

        if(!favorites.length){
            throw new NotFoundException("Your favorites list is free")
        }

        return {
            success: true,
            data: favorites
        }
    }

    async registerAdmin(payload: RegisterAdminDto, filename?: string){
        const existAdmin = await this.prisma.user.findFirst({
            where: {
                username: payload.username,
                email: payload.email
            }
        })

        if(existAdmin){
            throw new ConflictException("Admin is already registered")
        }

        const hashPass = await bcrypt.hash(payload.password, 10)
        await this.prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: hashPass,
                role: payload.role,
                status: Status.active,
                avatar: filename
            }
        })

        return {
            success: true,
            message: "Admin registered successfully"
        }
    }

    async registerUser(payload : RegisterUserDto, filename?: string){
        const existUser = await this.prisma.user.findFirst({
            where: {
                username: payload.username,
                email: payload.email
            }
        })

        if(existUser){
            throw new ConflictException("User is already registered")
        }

        const hashPass = await bcrypt.hash(payload.password, 10)
        await this.prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: hashPass,
                role: Role.USER,
                status: Status.active,
                avatar: filename
            }
        })

        return {
            success: true,
            message: "User registered succesfully"
        }
    }

    async updateUser(id : number, payload : UpdateUserDto, avatar?: string){
        const existUser = await this.prisma.user.findFirst({
            where:{
                id,
                status: Status.active
            }
        })
        if(!existUser){
            throw new NotFoundException('User is not found by this ID')
        }

        let hashPass = existUser.password
        if(payload.password){
            hashPass = await bcrypt.hash(payload.password, 10)
        }

        await this.prisma.user.update({
            where: {id},
            data:{
                username: payload.username ?? existUser.username,
                email: payload.email ?? existUser.email,
                password: hashPass,
                avatar: avatar ?? existUser.avatar
            }
        })
        return {
            success: true,
            message:"User info is updated"
        }
    }

    async deleteUser(id: number){
        const existUser = await this.prisma.user.findFirst({
            where:{
                id,
                status: Status.active
            }
        })
        if(!existUser){
            throw new NotFoundException("User not found with this ID")
        }

        await this.prisma.user.update({
            where:{id},
            data:{
                status: Status.inactive
            }
        })
        return {
            success: true,
            message: "User is deleted"
        }
    }
}
