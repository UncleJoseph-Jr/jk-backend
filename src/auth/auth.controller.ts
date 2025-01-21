import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  BadRequestException,
  UseGuards,
  Patch,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ChangePasswordDto } from './change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    const userId = req.user.userId;
    // const { currentPassword, newPassword } = body;
    return this.authService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // @Post('reset-password')
  // async resetPassword(@Body() body: { token: string, newPassword: string }) {
  //   return this.authService.resetPassword(body.token, body.newPassword);
  // }
  @Get('reset-password')
  async resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
    try {
      const isValid = this.authService.verifyResetToken(token);
      if (!isValid) {
        return res.status(400).send('Invalid or expired token');
      }

      return res.send(`
        <html>
        <body>
          <h1>Reset Password</h1>
          <form id="resetForm" action="/auth/reset-password" method="POST" onsubmit="return validatePasswords();">
            <input type="hidden" name="token" value="${token}" />
            <input type="password" name="newPassword" id="newPassword" placeholder="New Password" required />
            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required />
            <button type="submit">Submit</button>
          </form>
          <script>
            function validatePasswords() {
              const newPassword = document.getElementById('newPassword').value;
              const confirmPassword = document.getElementById('confirmPassword').value;
              if (newPassword !== confirmPassword) {
                alert('Passwords do not match!');
                return false;
              }
              return true;
            }
          </script>
        </body>
      </html>
      `);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: number;
      };
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.authService.updateUserPassword(payload.userId, hashedPassword);

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
