import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {LocalAdminAuthGuard} from "../guards/LocalAdminAuth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAdminAuthGuard)
  @Post('login_admin')
  LoginAdmin(@Request() req: Request & { user: any }) {
    return this.authService.loginAdmin(req.user);
  }
}
