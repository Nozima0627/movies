import { Body, Controller, Get, Post, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterAdminDto } from './dto/register.admin.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { RegisterUserDto } from './dto/register.user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @ApiOperation({
        summary: `${Role.SUPERADMIN}`,
        description: "Only superadmin can do this operation"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @Get('all/admins')
    getAllAdmins(){
        return this.userService.getAllAdmins()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}`,
        description: "Only superadmin can do this operation"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type: 'object',
            properties: {
                username: {type: "string"},
                email: {type: "string"},
                password: {type: "string"},
                role: {type: "string", enum: ['USER', "SUPERADMIN", "ADMIN"]},
                avatar: {type: 'string', format: "binary"}
            }
        }
    })
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './src/uploads',
            filename: (req, file, callback) => {
                const filename = Date.now() + '.' + file.mimetype.split('/')[1]
                callback(null, filename)
            },
        }),
        fileFilter:(req, file, cb) => {
            const existFile = ['png', 'jpeg', 'jpg']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post('register/admin')
    registerAdmin(
        @Body() payload : RegisterAdminDto,
        @UploadedFile() file? : Express.Multer.File
    ){
        return this.userService.registerAdmin(payload, file?.filename)
    }


    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type: 'object',
            properties: {
                username: {type: "string"},
                email: {type: "string"},
                password: {type: "string"},
                avatar: {type: 'string', format: "binary"}
            }
        }
    })
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './src/uploads',
            filename: (req, file, callback) => {
                const filename = Date.now() + '.' + file.mimetype.split('/')[1]
                callback(null, filename)
            },
        }),
        fileFilter:(req, file, cb) => {
            const existFile = ['png', 'jpeg', 'jpg']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post('register/user')
    registerUser(
        @Body() payload : RegisterUserDto,
        @UploadedFile() file? : Express.Multer.File
    ){
        return this.userService.registerUser(payload, file?.filename)
    }
}
