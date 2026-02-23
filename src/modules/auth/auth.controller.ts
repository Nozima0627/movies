import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';


@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    userLogin(
        @Body() payload: LoginDto

    ){
        return this.authService.userLogin(payload)
    }
}
