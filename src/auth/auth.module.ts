import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "src/auth/auth.service";
import { TokenService } from "src/auth/token.service";
import { AuthController } from "src/auth/auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

@Module({
    providers: [AuthService, TokenService],
    controllers: [AuthController],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
                return {
                    secret: configService.get<string>("JWT_SECRET"),
                    signOptions: { expiresIn: configService.get<number>("JWT_EXPIRES_IN") }
                }
            }
        }),
        ConfigModule,
        UserModule
    ],
    exports: [AuthService],
})
export class AuthModule {}