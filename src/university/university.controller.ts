import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  getHello(): { message: string } {
    return this.universityService.getHello();
  }

  @Get('/disciplines')
  disciplines(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.universityService.disciplines(take, skip);
  }

  @Get('/discipline/:id')
  discipline(@Param('id') id: number) {
    return this.universityService.findDisciplineById(id);
  }

  @Get('/discipline/data/failures')
  disciplineFailures(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.disciplineFailures(take, skip);
  }

  @Get('/discipline/data/progress')
  disciplineProgressAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.disciplineProgressAll(take, skip);
  }

  @Get('/discipline/data/progress/:id')
  disciplineProgress(@Param('id') id: number) {
    return this.universityService.disciplineProgressById(id);
  }

  @Get('/students')
  students(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.universityService.students(take, skip);
  }

  @Get('/student/:id')
  student(@Param('id') id: number) {
    return this.universityService.findStudentById(id);
  }

  @Get('/student/data/failures')
  studentFailures(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.universityService.studentFailures(take, skip);
  }

  @Get('/student/data/progress/:id')
  studentDiscipline(@Param('id') id: number) {
    return this.universityService.studentProgressById(id);
  }

  @Get('/student/data/progress')
  studentDisciplineAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.studentProgressAll(take, skip);
  }

  @Get('/student/data/elective/:id')
  studentAllElective(@Param('id') id: number) {
    return this.universityService.studentAllElective(id);
  }

  @Get('/student/data/blocked')
  studentBlocked() {
    return this.universityService.studentBlocked();
  }
}
