import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaClient,
  ) {
    this.jwtSecret = this.configService.get<string>('TOKEN_PASSWORD');
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { payload } = (await this.jwtService.verify(`${token}`, {
        complete: true,
      })) as { payload: { id: string } };

      const user = await this.prisma.users.findUnique({
        where: { id: payload.id },
      });
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
