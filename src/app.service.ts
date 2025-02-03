import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
    constructor(
        private readonly configService: ConfigService
    ) {}

    checkServer(): string {
        return `Server is working on http://localhost:${this.configService.get<string>("PORT")}`;
    }
}
