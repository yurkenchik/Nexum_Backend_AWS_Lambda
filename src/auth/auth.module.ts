import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "src/auth/auth.service";
import { TokenService } from "src/auth/token.service";
import { AuthController } from "src/auth/auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    providers: [AuthService, TokenService],
    controllers: [AuthController],
    imports: [JwtModule, ConfigModule, UserModule],
    exports: [AuthService],
})
export class AuthModule {}