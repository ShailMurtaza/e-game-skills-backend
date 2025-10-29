import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: CreateUserDto) {
        const userDto = await this.findOne({ email: createUserDto.email });
        if (userDto !== null)
            throw new BadRequestException({ message: 'Email already in use' });
        const hashedPassword = await argon2.hash(createUserDto.password);
        return this.databaseService.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
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
                username: filters?.username ? filters.username : undefined,
                password: filters?.password ? filters.password : undefined,
                email: filters?.email ? filters.email : undefined,
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
        const user = await this.findOne({ email });
        if (!user)
            throw new BadRequestException({ message: 'Email not found' });

        const valid = await argon2.verify(user.password, password);
        if (!valid) throw new BadRequestException('Invalid password');

        return { message: 'Correct Email and Password' };
    }
}
