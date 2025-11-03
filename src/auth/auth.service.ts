import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Provider, Role } from 'generated/prisma/enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private FRONTEND_URL: string;
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
        private readonly configService: ConfigService,
    ) {
        this.FRONTEND_URL =
            this.configService.getOrThrow<string>('FRONTEND_URL');
    }

    createJwtToken(user) {
        const payload = {
            id: user.id,
        };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }

    async localLogin(loginDto: LoginDto) {
        const user = await this.usersService.verifyCredentials(
            loginDto.email,
            loginDto.password,
        );
        if (user) {
            if (user.verified === false) {
                throw new UnauthorizedException('Verify Email Address');
            }
            return this.createJwtToken(user);
        }
    }

    // Need redirect with accessToken because unlike localLogin, OAuth uses full page redirect
    async OAuthLogin(user_id: number) {
        const user = await this.usersService.findOne({
            id: user_id,
        });
        if (user) {
            var page = '';
            if (user.role == Role.pending) {
                var page = 'select_role';
            } else if (user.role === Role.player) {
                var page = 'player_dashboard';
            } else if (user.role === Role.team) {
                var page = 'team_dashboard';
            } else if (user.role === Role.admin) {
                var page = 'admin_panel';
            }
            return {
                accessToken: this.createJwtToken(user),
                redirect: `${this.FRONTEND_URL}/${page}`,
            };
        }
    }

    // Verify user using otp and email
    async verifyUser(email: string, otp: number) {
        const user = await this.usersService.findOne({ email: email });
        if (user === null) {
            throw new BadRequestException('Invalid Email');
        }
        if (this.otpService.verify(email, otp)) {
            this.usersService.update(user.id, { verified: true });
            return { message: 'Verified!' };
        }

        throw new BadRequestException('Not Matched');
    }

    async validateOAuthUser(createUserDto: CreateUserDto) {
        const user = await this.usersService.findOne({
            email: createUserDto.email,
            provider: createUserDto.provider,
        });

        if (user) return user;
        return await this.usersService.createOAuthUser(createUserDto);
    }

    async getProfile(userId: number) {
        const user = await this.usersService.findOne({ id: userId });
        if (user === null) {
            throw new BadRequestException('User Not Found');
        }
        return {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            region_id: user.region_id,
            avatar: user.avatar
                ? Buffer.from(user.avatar).toString('hex')
                : null,
            description: user.description,
        };
    }
}
