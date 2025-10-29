import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OtpService } from 'src/otp/otp.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly otpService: OtpService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const userDto = await this.findOne({ email: createUserDto.email });
        if (userDto !== null)
            throw new BadRequestException({ message: 'Email already in use' });
        const hashedPassword = await argon2.hash(createUserDto.password);
        const newUser = await this.databaseService.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
                verified: false, // Always false while creating new user
            },
        });
        const otp = this.otpService.generate(newUser.email);
        return newUser;
    }

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

    async update(id: number, updateUserDto: UpdateUserDto) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }

    async remove(id: number) {
        return this.databaseService.user.delete({
            where: {
                id,
            },
        });
    }

    async verifyCredentials(email: string, password: string) {
        const user = await this.findOne({ email: email });
        if (!user)
            throw new BadRequestException({ message: 'Email not found' });

        const valid = await argon2.verify(user.password, password);
        if (!valid) throw new BadRequestException('Invalid password');

        return user;
    }

    async verifyOtp(email: string, otp: number) {
        const user = await this.findOne({ email: email });
        if (user === null) {
            throw new BadRequestException('Invalid Email');
        }
        if (this.otpService.verify(email, otp)) {
            this.update(user.id, { verified: true });
            return { message: 'Verified!' };
        }

        throw new BadRequestException('Not Matched');
    }

    async generateOtp(email: string) {
        let user = await this.findOne({ email: email });
        if (!user)
            throw new BadRequestException({ message: 'Email not found' });
        if (user.verified === true) return { messsage: 'Alread verified' };
        const otp = this.otpService.generate(email);
        return { message: 'Check your Email' };
    }
}
