import { Controller, Get } from '@nestjs/common';
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
}
