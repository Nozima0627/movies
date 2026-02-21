import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post()
    userLogin(
        @Body() payload: LoginDto
    ){
        return this.authService.userLogin(payload)
    }
}
