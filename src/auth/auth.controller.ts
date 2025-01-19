import { Controller, Post, Body, Req, UseGuards, Patch, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ChangePasswordDto } from './change-password.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: RegisterDto) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body()  body: ChangePasswordDto) {
    const userId = req.user.userId;
    // const { currentPassword, newPassword } = body;
    return this.authService.changePassword(userId, body.currentPassword, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }
}
