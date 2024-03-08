import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../database/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from  "@nestjs/config"
import {Tokens} from "../shared/types";
import * as bcrypt from "bcrypt";
import { stringify } from "querystring";
@Injectable()
export class AdminAuthService{
    constructor(private prismaService:PrismaService, private jwtService: JwtService, private configService : ConfigService) {
    }
    
    async login(adminname: string, password:string){
        const admin = await this.prismaService.admin.findUnique({where:{name:adminname}});
        if(!admin) throw new BadRequestException("Wrong admin name");
        if(!(await bcrypt.compare(password, admin.password))) throw new BadRequestException("Wrong password");
        const tokens = await this.getTokens(admin.id, admin.name);
        return tokens;
    }

    async getTokens(adminId: string, name: string): Promise<Tokens> {
        const jwtPayload= {
            id: adminId,
            name,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('AT_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('RT_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async signOut(refreshToken: string , accessToken:string){
        // TODO: check if provided tokens not expired
        // TODO: use argon or any another library to hash those tokkens
        // TODO: remove them from whitelist tokens database in REDIS
    }

    async validateAccessToken(accessToken: string){
        return this.jwtService.verifyAsync(accessToken)
    }
}
