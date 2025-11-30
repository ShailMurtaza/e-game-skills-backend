import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';
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
import { Role } from 'src/generated/prisma/enums';

export interface UpdateProfileResult {
    message: string;
    filename?: string;
    uuid?: string;
    url?: string;
}

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
    ) {}

    // Create new user
    async createLocalUser(createUserDto: CreateUserDto, signup = true) {
        if (!createUserDto.password) {
            throw new BadRequestException('Password Not Found');
        }
        // User can't just create an admin account by passing role as admin
        if (signup && createUserDto.role === Role.admin)
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
        return newUser;
    }

    // Create new user using OAuth
    async createOAuthUser(createUserDto: CreateUserDto) {
        // User can't just create an admin account by passing role as admin
        const userDto = await this.findOne({ email: createUserDto.email });
        if (userDto !== null)
            throw new BadRequestException('Email already in use');
        const newUser = await this.databaseService.user.create({
            data: {
                ...createUserDto,
                verified: true,
            },
        });
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
                provider: filters?.provider ? filters.provider : undefined,
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
        // 1. User not found
        if (!user) throw new BadRequestException('Email not found');

        // 2. OAuth user (no password) — block local login
        if (!user.password) {
            throw new BadRequestException(
                `This account uses OAuth. Please log in with your provider: ${user.provider}`,
            );
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) throw new BadRequestException('Invalid password');

        return user;
    }

    // Generate OTP and send it to Email
    async generateOtp(email: string) {
        let user = await this.findOne({ email: email });
        if (!user) throw new BadRequestException('Email not found');
        if (user.provider !== null)
            throw new BadRequestException(
                `This account uses OAuth. Please log in with your provider: ${user.provider}`,
            );
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

    async getPublicProfileData(userId: number) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                username: true,
                region: true,
                country: true,
                role: true,
                avatar: true,
                description: true,
                email: true,
            },
        });
        if (user === null) {
            throw new BadRequestException('User Not Found');
        }
        return {
            username: user.username,
            email: user.email,
            region: user.region,
            country: user.country,
            avatar: user.avatar
                ? Buffer.from(user.avatar).toString('hex')
                : null,
            description: user.description,
        };
    }

    async updateProfile(
        userId: number,
        dto: UpdateUserDto,
        file?: Express.Multer.File,
    ): Promise<UpdateProfileResult> {
        const data: any = { ...dto };

        let filename: string | undefined;
        let uuidHex: string | undefined;

        // --- Get current user to check for old avatar ---
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        const oldAvatarUuidBuffer: Buffer | null = user?.avatar
            ? Buffer.from(user.avatar) // Convert Uint8Array to Buffer. Because Database returns Uint8Array. uint8Array and Buffer is same but typescript treat them separately
            : null;

        if (file) {
            // ---- Generate 16‑byte binary UUID ----
            const uuidBuffer = Buffer.alloc(16);
            uuidv4(undefined, uuidBuffer);
            uuidHex = uuidBuffer.toString('hex');

            // ---- Convert to WebP (80% quality) ----
            const webpBuffer = await sharp(file.buffer)
                .webp({ quality: 80 })
                .toBuffer();

            // ---- Persist file on disk ----
            filename = `${uuidHex}.webp`;
            const filepath = path.join(
                process.cwd(),
                'uploads/avatars',
                filename,
            );
            await fs.mkdir(path.dirname(filepath), { recursive: true });
            await fs.writeFile(filepath, webpBuffer);

            // ---- Store binary UUID in DB (unique) ----
            data.avatar = uuidBuffer;

            // --- Delete old avatar image ---
            if (oldAvatarUuidBuffer) {
                const oldFilename = `${oldAvatarUuidBuffer.toString('hex')}.webp`;
                const oldFilepath = path.join(
                    process.cwd(),
                    'uploads/avatars',
                    oldFilename,
                );

                try {
                    await fs.unlink(oldFilepath);
                } catch (err: any) {
                    if (err.code !== 'ENOENT') {
                        console.warn(
                            `Failed to delete old avatar: ${oldFilename}`,
                            err,
                        );
                    }
                }
            }
        }

        // ---- Update user record (text fields + avatar) ----
        await this.databaseService.user.update({
            where: { id: userId },
            data,
        });

        return {
            message: 'Profile updated successfully',
            ...(filename && {
                filename,
                uuid: uuidHex,
                url: `/uploads/${filename}`,
            }),
        };
    }
}
