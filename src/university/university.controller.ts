import { Controller, Get, Param } from '@nestjs/common';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  getHello(): { message: string } {
    return this.universityService.getHello();
  }

  @Get('/discipline/failures')
  disciplineFailures() {
    return this.universityService.disciplineFailures();
  }

  @Get('/student/failures')
  studentFailures() {
    return this.universityService.studentFailures();
  }

  @Get('/student/:id')
  student(@Param('id') id: number) {
    return this.universityService.findStudentById(id);
  }

  @Get('/student/progress/:id')
  studentDiscipline(@Param('id') id: number) {
    return this.universityService.studentProgress(id);
  }
}
