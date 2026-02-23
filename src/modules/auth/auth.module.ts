import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'ilovemovies',
            signOptions:{
                expiresIn: "2h"
            }
        })
    ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
