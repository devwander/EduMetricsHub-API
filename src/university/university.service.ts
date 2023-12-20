import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): { message: string } {
    return { message: 'Teste de login!' };
  }

  async disciplineFailures() {
    return await this.prisma.$queryRaw`
    SELECT
      d.nome AS "name",
      CAST(COUNT(CASE WHEN h.status IN (2, 3, 4) THEN 1 END) AS INT) AS "num_failures"
    FROM
      historico h
    JOIN
      disciplina d ON h.id_disciplina = d.id
    GROUP BY d.nome;`;
  }

  async studentFailures() {
    return await this.prisma.$queryRaw`
    SELECT
      a.nome AS "name",
      CAST(COUNT(CASE WHEN h.status IN (2, 3, 4) THEN 1 END) AS INT) AS "num_failures"
    FROM
      historico h
    JOIN
      aluno a ON h.id_aluno = a.id
    GROUP BY a.nome;`;
  }

  findStudentById(id: number) {
    return this.prisma.aluno.findUnique({ where: { id } });
  }
}
