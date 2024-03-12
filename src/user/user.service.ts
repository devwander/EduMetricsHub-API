import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { existingUserError } from './errors/existingUser.error';
import { paginator } from './paginator';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

const paginate: PaginateFunction = paginator({ perPage: 10 });
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

  async users({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<User>> {
    return paginate(
      this.prisma.user,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage,
      },
    );
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
