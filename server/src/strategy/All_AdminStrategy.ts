import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {ExtractJwt} from "passport-jwt";
import {PrismaService} from "../database/prisma.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'admin_local') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string){
        const admin = await this.authService.validateAdmin(username, password);
        if (!admin) {
            throw new UnauthorizedException();
        }
        return admin;
    }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin_jwt') {
    constructor(private authService: AuthService,private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'admin secret', // TODO: move to env
        });
    }

    async validate(payload: any) {
        const admin = await this.prismaService.admin.findFirst({where:{id:payload.id}});
        if (!admin) {
            throw new HttpException('This administrator no longer exists', 500);
        }
        return { id: payload.id, name: payload.name };
    }
}