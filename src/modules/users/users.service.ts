import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { RegisterAdminDto } from './dto/register.admin.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';

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
}
