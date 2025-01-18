import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('profile')
export class ProfileController {
    constructor(private authService: AuthService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        const userId = req.user.userId;
        const user = await this.authService.getUserById(userId);
        return user;
    }
}
