import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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
          return true;
        } catch {
          throw new UnauthorizedException('Invalid token');
        }
      }
}