import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/index')
  disciplines(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('search') search?: string,
  ) {
    return this.userService.users({
      page: page,
      perPage: perPage,
      orderBy: {
        name: 'asc',
      },
      where: {
        name: {
          contains: search,
        },
      },
    });
  }
}
