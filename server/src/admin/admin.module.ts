import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {DatabaseModule} from "../database/database.module";
import {JwtModule} from "@nestjs/jwt";
import { AdminAuthService } from './admin_auth.service';
import { JwtAdminStrategy } from './strategy/jwtAuthStrategyAdmin';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [AdminController],
  providers: [JwtAdminStrategy,AdminAuthService, AdminService]
})
export class AdminModule {}
