import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { Admin_JWT_Payload } from 'src/shared/types';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy,'jwt-admin') {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AT_SECRET'),
    });
  }

  async validate(payload: Admin_JWT_Payload) {
    const admin = await this.prismaService.admin.findUnique({ where: { id: payload.id } });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}