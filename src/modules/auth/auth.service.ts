import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService,
        private jwtService: JwtService
    ){}

    async userLogin(payload: LoginDto){
        const existUser = await this.prisma.user.findUnique({
            where: {email: payload.email}
        })

        if(!existUser){
            throw new NotFoundException("Email or password is incorrect")
        }

        if(!await bcrypt.compare(payload.password, existUser.password)){
            throw new NotFoundException("Email or password is incorrect")
        }

        return {
            success: true,
            message: "You are logged in",
            toke: this.jwtService.sign({id: existUser.id, email:existUser.email, role: existUser.role})
        }
    }
}
