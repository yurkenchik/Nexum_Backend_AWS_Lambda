import { Controller } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
}