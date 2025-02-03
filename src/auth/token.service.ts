import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "src/user/user.model";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async generateToken(userData: Partial<UserDocument>): Promise<string> {
        const userPayload = {
            id: userData._id,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            hashedPassword: userData.password,
        };

        return this.jwtService.sign(userPayload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: this.configService.get<number>("JWT_EXPIRATION_TIME"),
        });
    }
}