import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersService.verifyCredentials(
            loginDto.email,
            loginDto.password,
        );
        if (user) {
            if (user.verified === false) {
                throw new BadRequestException('Verify Email Address');
            }
            const payload = { id: user.id, username: user.username };
            const accessToken = this.jwtService.sign(payload);
            return {
                accessToken,
                userId: user.id,
            };
        }
    }

    // Verify otp
    async verifyOtp(email: string, otp: number) {
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
}
