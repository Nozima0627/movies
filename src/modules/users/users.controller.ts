import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateUserDto } from './dto/update.user.dto';

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
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`,
        description: "Superadmin and admin can do this operation"
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all/users')
    getAllUsers(){
        return this.userService.getAllUsers()
    }

    @UseGuards(AuthGuard)
    @Get('single/:id')
    getOneUser(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.userService.getOneUser(id, req['user'])
    }

    @UseGuards(AuthGuard)
    @Get('my/favorites/:id')
    getMyFavorites(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.userService.getMyFavorites(id)
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
        @UploadedFile() avatar? : Express.Multer.File
    ){
        return this.userService.registerAdmin(payload, avatar?.filename)
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
    @UseGuards(AuthGuard)
    @Post('register/user')
    registerUser(
        @Body() payload : RegisterUserDto,
        @UploadedFile() avatar? : Express.Multer.File
    ){
        return this.userService.registerUser(payload, avatar?.filename)
    }


    @UseGuards(AuthGuard)
    @Put('update/user:id')
    updateUser(
        @Param('id', ParseIntPipe) id : number,
        @Body() payload: UpdateUserDto,
        @UploadedFile() avatar? : Express.Multer.File
    ){
        return this.userService.updateUser(id, payload, avatar?.filename)
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    deleteUser(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.userService.deleteUser(id)
    }
}

