import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {

  private tokenBlacklist: Set<string> = new Set();

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async logout(token: string): Promise<{ message: string }> {
    this.tokenBlacklist.add(token);
    return { message: 'Logout successful' };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password changed successfullu' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // throw new Error('User not found');
      throw new NotFoundException('User not found');
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1);

    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetTokenExpiresAt: resetTokenExpiresAt,
      },
    });

    await this.emailService.sendResetPasswordEmail(email, resetToken);

    return { message: 'password reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.resetPasswordToken !== token || user.resetTokenExpiresAt < new Date()) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return { message: 'Password successfully reset' };
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        status: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      status: string;
      createdAt: Date;
    };
  }> {
    const existringUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existringUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    };
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // throw new Error('User not found');
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // throw new Error('Invalid password');
      throw new UnauthorizedException('Invalid password')
    }

    const payload = { userId: user.id, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  verifyResetToken(token: string): boolean {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
      return !!payload.userId;
    } catch (error) {
      return false;
    }
  }
  async updateUserPassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
