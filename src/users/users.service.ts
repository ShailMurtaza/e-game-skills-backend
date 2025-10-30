import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OtpService } from 'src/otp/otp.service';
import {
    CreateUserDto,
    ResetPasswordDto,
    UpdateUserDto,
} from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { SendEmailDto } from 'src/email/dto/email.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
    ) {}

    // Create new user
    async create(createUserDto: CreateUserDto, signup = true) {
        // User can't just create an admin account by passing role as admin
        if (signup && createUserDto.role === 'admin')
            throw new BadRequestException('Invalid Role');
        const userDto = await this.findOne({ email: createUserDto.email });
        if (userDto !== null)
            throw new BadRequestException('Email already in use');
        const hashedPassword = await argon2.hash(createUserDto.password);
        const newUser = await this.databaseService.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
                verified: false, // Always false while creating new user
            },
        });
        this.generateOtp(newUser.email);
        return newUser;
    }

    // Find all users using filter
    async findAll(filters?: Record<string, any>) {
        return this.databaseService.user.findMany({
            where: {
                username: filters?.username
                    ? { contains: filters.username }
                    : undefined,
                email: filters?.email ? { contains: filters.email } : undefined,
                role: filters?.role,
                region_id: filters?.region_id
                    ? Number(filters.region_id)
                    : undefined,
            },
        });
    }

    // Find user using filter
    async findOne(filters?: Record<string, any>) {
        return this.databaseService.user.findUnique({
            where: {
                id: filters?.id ? Number(filters.id) : undefined,
                email: filters?.email ? filters.email : undefined,
                username: filters?.username ? filters.username : undefined,
                password: filters?.password ? filters.password : undefined,
            },
        });
    }

    // Update user based on given data
    async update(id: number, updateUserDto: UpdateUserDto) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }

    // Delete User using id
    async remove(id: number) {
        return this.databaseService.user.delete({
            where: {
                id,
            },
        });
    }

    // Check user's email and password
    async verifyCredentials(email: string, password: string) {
        const user = await this.findOne({ email: email });
        if (!user) throw new BadRequestException('Email not found');

        const valid = await argon2.verify(user.password, password);
        if (!valid) throw new BadRequestException('Invalid password');

        return user;
    }

    // Generate OTP and send it to Email
    async generateOtp(email: string) {
        let user = await this.findOne({ email: email });
        if (!user) throw new BadRequestException('Email not found');
        const otp = this.otpService.generate(email);
        const sendEmailDto: SendEmailDto = {
            recipients: [user.email],
            subject: 'E Game Skills - OTP',
            html: `Your OTP is: <strong>${otp}</strong>`,
        };
        this.emailService.sendEmail(sendEmailDto);
        return { message: 'Check your Email' };
    }

    // Check otp and update password
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        let user = await this.findOne({ email: resetPasswordDto.email });
        if (!user) throw new BadRequestException('Email not found');
        if (!this.otpService.verify(user.email, resetPasswordDto.otp)) {
            throw new BadRequestException();
        }
        const hashedPassword = await argon2.hash(resetPasswordDto.password);
        this.update(user.id, { password: hashedPassword, verified: true });
        return { message: 'Password Reset Successfull' };
    }
}
