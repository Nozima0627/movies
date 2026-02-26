import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create.profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update.profile.dto';

@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profileService : ProfilesService){}

    @UseGuards(AuthGuard)
    @Get('all')
    getAllProfiles(){
        return this.profileService.getAllProfiles()
    }


    @UseGuards(AuthGuard)
    @Get('/:id')
    getOneProfile(
        @Param('id', ParseIntPipe) id:number
    ){
        return this.profileService.getOneProfile(id)
    }

    @UseGuards(AuthGuard)
    @Post('create')
    createProfile(
        @Body() payload: CreateProfileDto,
        @Req() req: Request
    ){
        return this.profileService.createProfile(payload, req['user'])
    }

    @UseGuards(AuthGuard)
    @Put('update/:id')
    updateProfile(
        @Param("id", ParseIntPipe) id : number,
        @Body() payload : UpdateProfileDto
    ){
        return this.profileService.updateProfile(id, payload)
    }
}
