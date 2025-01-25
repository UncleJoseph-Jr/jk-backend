import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is invalid');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      if (roles && roles.length > 0) {
        const hasRole = roles.includes(payload.role);
        if (!hasRole) {
          throw new ForbiddenException(
            'You do not have permission to access this resource',
          );
        }
      }

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
