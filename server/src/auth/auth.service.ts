import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,private jwtService: JwtService) { }

  // async validateUser(id: string, pass: string): Promise<any> {
  //   const user = await this.prismaService.admin
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async validateAdmin(name: string, password: string): Promise<any> {
    const admin = await this.prismaService.admin.findFirst({
      where: { name: name },
    });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password,createdAt, ...result } = admin;
      return result;
    }
    return null;
  }
  async loginAdmin(admin: any) {
    const payload = {  id: admin.id , name: admin.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
