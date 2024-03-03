import { Controller, Get, Param, Query } from '@nestjs/common';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  getHello(): { message: string } {
    return this.universityService.getHello();
  }

  // Wanderson
  // Retorna todas as disciplinas
  @Get('/disciplines')
  disciplines(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    return this.universityService.disciplines({
      page: page,
      perPage: perPage,
      orderBy: {
        nome: 'asc',
      },
    });
  }

  // Wanderson
  // Retorna a disciplina por id
  @Get('/discipline/:id')
  discipline(@Param('id') id: number) {
    return this.universityService.findDisciplineById(id);
  }

  // Wanderson
  // Retorna o número de reprovações por disciplina
  @Get('/discipline/data/failures')
  disciplineFailures(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.disciplineFailures(take, skip);
  }

  // Wanderson
  // Retorna os a quantidade de estudantes que tem as materias como:
  // cursando, cursou, obrigatorio ou eletiva
  @Get('/discipline/data/progress')
  disciplineProgressAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.disciplineProgressAll(take, skip);
  }

  // Wanderson
  // Retorna os a quantidade de estudantes que tem a material como:
  // cursando, cursou, obrigatorio ou eletiva
  @Get('/discipline/data/progress/:id')
  disciplineProgress(@Param('id') id: number) {
    return this.universityService.disciplineProgressById(id);
  }

  // Cesar
  // Retorna a oferta da cadeira ao longo dos anos e semestres
  @Get('/discipline/data/offer/:id')
  disciplineOffer(@Param('id') id: number) {
    return this.universityService.disciplineOffer(id);
  }

  // Cesar
  // Retorna as materias e a demanda dele (número de alunos que ainda não realizaram)
  @Get('/discipline/data/demand')
  disciplineDemand() {
    return this.universityService.disciplineDemand();
  }

  // Wanderson
  // retona todos os estudantes
  @Get('/students')
  students(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.universityService.students(take, skip);
  }

  // Wanderson
  // retona estudante em especifico
  @Get('/student/:id')
  student(@Param('id') id: number) {
    return this.universityService.findStudentById(id);
  }

  // Wanderson
  // Retorna o número de reprovações dos estudantes
  @Get('/student/data/failures')
  studentFailures(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.universityService.studentFailures(take, skip);
  }

  // Wanderson
  // Retorna o dado do estudante em relação as materias:
  // cursando, cursou, obrigatorio ou eletiva
  @Get('/student/data/progress/:id')
  studentDiscipline(@Param('id') id: number) {
    return this.universityService.studentProgressById(id);
  }

  // Wanderson
  // Retorna o dado dos estudante em relação as materias:
  // cursando, cursou, obrigatorio ou eletiva
  @Get('/student/data/progress')
  studentDisciplineAll(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return this.universityService.studentProgressAll(take, skip);
  }

  // João Firmino
  @Get('/student/data/elective/:id')
  studentAllElective(@Param('id') id: number) {
    return this.universityService.studentAllElective(id);
  }

  // João Firmino
  @Get('/student/data/blocked')
  studentBlocked() {
    return this.universityService.studentBlocked();
  }

  // João Firmino
  @Get('/student/data/reprovedmore')
  reprovedMore(@Query('code') code?: string, @Query('count') count?: number) {
    return this.universityService.reprovedMore(code, count);
  }

  // Cesar
  // Retorna o historico do estudante em relação as disciplinsa:
  // nome, ano, semestre, status e nota
  @Get('/student/data/historic/:id')
  studentHistoric(@Param('id') id: number) {
    return this.universityService.studentHistoric(id);
  }

  // Cesar
  // Retona o ano, semestre e carga horaria total do estudante
  @Get('/student/data/hoursPerSemester/:id')
  studentHoursPerSemester(@Param('id') id: number) {
    return this.universityService.studentHoursPerSemester(id);
  }
}
