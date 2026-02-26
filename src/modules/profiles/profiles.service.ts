import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateProfileDto } from './dto/create.profile.dto';
import { Role } from '@prisma/client';
import { UpdateProfileDto } from './dto/update.profile.dto';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService){}

    async getAllProfiles(){
        const profiles = await this.prisma.profile.findMany()

        return {
            success: true,
            data: profiles
        }
    }

    async getOneProfile(id: number){
        const existProfile = await this.prisma.profile.findFirst({
            where:{user_id: id}
        })
        if(!existProfile){
            throw new NotFoundException("User is not found by this id")
        }

        return {
            success: true,
            data: existProfile
        }
    }

    async createProfile(payload : CreateProfileDto, currentUser : {id: number, role: Role}){
        const existProfile = await this.prisma.profile.findFirst({
            where:{ user_id: payload.user_id}
        })

        if(existProfile){
            throw new NotFoundException("User already has a profile")
        }
        
        if(currentUser.id != payload.user_id && currentUser.role == Role.USER){
            throw new ForbiddenException("You can't create profile for others")
        }

        await this.prisma.profile.create({
            data: {
                ...payload,
                user_id: payload.user_id
            }
        })
        return {
            success: true,
            message: "Profile created"
        }
    }

    async updateProfile(id : number, payload : UpdateProfileDto){
        const existProfile = await this.prisma.profile.findFirst({
            where:{user_id: id}
        })
        if(!existProfile){
            throw new NotFoundException("Profile is not found by this id")
        }

        await this.prisma.profile.update({
            where: {user_id: id},
            data:{
                full_name: payload.full_name ?? existProfile.full_name,
                phone: payload.phone ?? existProfile.phone,
                country: payload.country ?? existProfile.country
            }
        })

        return {
            success : true,
            message: "Profile is updated"
        }

    }
}
