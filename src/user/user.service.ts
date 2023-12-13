import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { existingUserError } from './errors/existingUser.error';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const data: Prisma.UserCreateInput = {
        ...createUserDto,
        password: await bcrypt.hash(password, 10),
      };

      const createdUser = await this.prisma.user.create({ data });

      return {
        ...createdUser,
        password: undefined,
      };
    }

    throw new existingUserError(
      'The email address provided is already in use.',
    );
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
