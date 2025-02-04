import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { AppService } from "src/app.service";
import { AppController } from "src/app.controller";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): MongooseModuleFactoryOptions => ({
                uri: configService.get<string>("MONGO_DB_URI")
            })
        }),
        UserModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
