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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ChangePasswordDto } from './change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration details',
    schema: {
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    schema: {
      example: {
        message: 'Registration successful',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2025-01-23T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @Post('register')
  async register(@Body(new ValidationPipe()) body: RegisterDto) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

  /////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User loged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    description: 'User login payload',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logined successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  /////////////////////////////////////////////////////////////////
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password.' })
  @ApiBody({
    description: 'payload for changing password',
    schema: {
      properties: {
        currentPassword: { type: 'string', example: 'olePassword123' },
        newPassword: { type: 'string', example: 'newPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    schema: {
      example: { message: 'Password changed successfully' },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    const userId = req.user.userId;
    return this.authService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }
  /////////////////////////////////////////////////////////////////
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user.' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful.',
    schema: {
      example: { message: 'Lohout successful' },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  /////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'Forgot password.' })
  @ApiBody({
    description: 'Payload for sending password reset link',
    schema: {
      properties: {
        email: { type: 'string', example: 'john.doe@example' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'password reset link sent to email.',
    schema: {
      example: { message: 'Password reset link sent to email' },
    },
  })
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  /////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'reset password page.' })
  @ApiBody({
    description: 'Reset password details',
    schema: {
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        newPassword: { type: 'string', example: 'newStrongPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful.',
    schema: {
      example: { message: 'Password reset successful' },
    },
  })
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

  /////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'Reset password.' })
  @ApiBody({
    description: 'Reset password details',
    schema: {
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        newPassword: { type: 'string', example: 'newStrongPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful.',
    schema: {
      example: { message: 'Password reset successful' },
    },
  })
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
  /////////////////////////////////////////////////////////////////
}
