import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "src/auth/token.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthorizationResponseDto } from "src/auth/dto/authorization-response.dto";
import { UserService } from "src/user/user.service";
import { UserAlreadyExistsException } from "src/domain/exceptions/client/user-already-exists.exception";
import { Password } from "src/domain/value-objects/password.vo";
import { Email } from "src/domain/value-objects/emai.vo";
import { PhoneNumber } from "src/domain/value-objects/phone-number.vo";
import { LoginDto } from "src/auth/dto/login.dto";
import { UserDocument } from "src/user/user.model";
import { UserNotFoundException } from "src/domain/exceptions/client/user-not-found.exception";
import { PasswordDontMatchException } from "src/domain/exceptions/client/passwords-dont-match.exception";
import { ValidateUserDto } from "src/auth/dto/validate-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    async registration(registrationDto: CreateUserDto): Promise<AuthorizationResponseDto> {
        const { email, phoneNumber, password } = registrationDto;

        const userExistsByEmail = await this.userService.getUseByEmail(email);
        if (userExistsByEmail) {
            throw new UserAlreadyExistsException();
        }

        const passwordValueObject = new Password(password);
        const hashedPassword = await passwordValueObject.hash();

        const user = await this.userService.createUser({
            email: new Email(email).getValue(),
            phoneNumber: new PhoneNumber(phoneNumber).getValue(),
            password: hashedPassword,
        });

        const { id } = user;
        const token = await this.tokenService.generateToken({ id, hashedPassword, ...user });
        return { token };
    }

    async login(loginDto: LoginDto): Promise<AuthorizationResponseDto> {
        const { email, password } = loginDto;
        const user = await this.validateUser({ email, password });

        const { id } = user;
        const token = await this.tokenService.generateToken({ id, hashedPassword: password, ...user });
        return { token };
    }

    async validateUser(validateUserDto: ValidateUserDto): Promise<UserDocument> {
        const { email, password } = validateUserDto;
        const user = await this.userService.getUseByEmail(email);
        if (!user) {
            throw new UserNotFoundException();
        }

        const passwordValueObject = new Password(user.password);
        const passwordMatch = await passwordValueObject.hash();

        if (!passwordMatch) {
            throw new PasswordDontMatchException();
        }
        return user;
    }
}