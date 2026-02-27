import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MovieFilesService } from './movie-files.service';
import { CreateMovieFilesDto } from './dto/create.movie.files.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles';
import { Role } from '@prisma/client';
import { UpdateMovieFilesDto } from './dto/update.movie.file.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('movie-files')
export class MovieFilesController {
    constructor(private readonly movieFilesService : MovieFilesService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllMovieFiles(
        @Req() req : Request
    ){
        return this.movieFilesService.getAllMovieFiles(req['user'])
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type: 'object',
            properties: {
                movie_id: {type: "number"},
                file: {type: 'string', format: "binary"},
                quality: {
                    type: "string", 
                    enum: ["SD", "HD", "FULLHD", "LOW", "MEDIUM"]
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads',
            filename: (req, file, callback) => {
                const filename = Date.now() + '.' + file.mimetype.split('/')[1]
                callback(null, filename)
            },
        }),
        fileFilter:(req, file, cb) => {
            const existFile = ['mp4', 'mkv', 'jpg']

            if(!existFile.includes(file.mimetype.split('/')[1])){
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post('create')
    uploadMovieFile(
        @Body() payload : CreateMovieFilesDto,
        @UploadedFile() file : Express.Multer.File
    ){
        return this.movieFilesService.uploadMovieFile(payload, file.filename)
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Put('update/:id')
    updateMovieFile(
        @Param('id', ParseIntPipe) id : number,
        @Body() payload : UpdateMovieFilesDto
    ){
        return this.movieFilesService.updateMovieFile(id, payload)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Delete('delete/:id')
    deleteMovieFile(
        @Param('id', ParseIntPipe) id : number
    ){
        return this.movieFilesService.deleteMovieFile(id)
    }
}
