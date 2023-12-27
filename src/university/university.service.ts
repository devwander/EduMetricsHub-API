import { Injectable } from '@nestjs/common';
import { MIN_TAKE_RESULTS } from 'src/utils/constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): { message: string } {
    return { message: 'hello, you are logged!' };
  }

  async disciplines(take: number, skip: number) {
    return await this.prisma.disciplina.findMany({
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async disciplineFailures(take: number, skip: number) {
    const disciplines = await this.prisma.disciplina.findMany({
      select: {
        nome: true,
        historico: {
          select: {
            status: true,
          },
        },
      },
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });

    const results = disciplines.map((discipline) => {
      const { nome, historico } = discipline;

      const numFailures = historico.reduce((count, historic) => {
        return count + ([2, 3, 4].includes(historic.status) ? 1 : 0);
      }, 0);

      return {
        name: nome,
        num_failures: numFailures,
      };
    });

    return results;
  }

  async findDisciplineById(id: number) {
    return this.prisma.disciplina.findUnique({ where: { id } });
  }

  async disciplineProgressById(id: number) {
    const discipline = await this.prisma.disciplina.findUnique({
      where: { id: id },
      select: {
        nome: true,
        tipo: true,
        historico: {
          select: {
            status: true,
          },
        },
      },
    });

    const { nome, historico } = discipline;

    const results = {
      name: nome,
      num_studied: 0,
      num_studying: 0,
      num_missing_mandatory: 0,
      num_missing_elective: 0,
    };

    for (const h of historico) {
      switch (h.status) {
        case 1:
        case 2:
          results.num_studied++;
          break;
        case 5:
          results.num_studying++;
          break;
        case 0:
        case 3:
        case 4:
        case 6:
        case 7:
          results.num_missing_mandatory += discipline.tipo === 1 ? 1 : 0;
          results.num_missing_elective += discipline.tipo === 2 ? 1 : 0;
          break;
      }
    }

    return results;
  }

  async disciplineProgressAll(take: number, skip: number) {
    const disciplines = await this.prisma.disciplina.findMany({
      select: {
        nome: true,
        tipo: true,
        historico: {
          select: {
            status: true,
          },
        },
      },
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });

    const results = disciplines.map((discipline) => {
      const { nome, historico } = discipline;

      const aggregatedResults = {
        name: nome,
        num_studied: 0,
        num_studying: 0,
        num_missing_mandatory: 0,
        num_missing_elective: 0,
      };

      for (const h of historico) {
        switch (h.status) {
          case 1:
          case 2:
            aggregatedResults.num_studied++;
            break;
          case 5:
            aggregatedResults.num_studying++;
            break;
          case 0:
          case 3:
          case 4:
          case 6:
          case 7:
            aggregatedResults.num_missing_mandatory +=
              discipline.tipo === 1 ? 1 : 0;
            aggregatedResults.num_missing_elective +=
              discipline.tipo === 2 ? 1 : 0;
            break;
        }
      }

      return aggregatedResults;
    });

    return results;
  }

  async students(take: number, skip: number) {
    return await this.prisma.aluno.findMany({
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async studentFailures(take: number, skip: number) {
    const students = await this.prisma.aluno.findMany({
      select: {
        nome: true,
        historico: {
          select: {
            status: true,
          },
        },
      },
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });

    const results = students.map((student) => {
      const { nome, historico } = student;

      const numFailures = historico.reduce((count, historic) => {
        return count + ([2, 3, 4].includes(historic.status) ? 1 : 0);
      }, 0);

      return {
        name: nome,
        num_failures: numFailures,
      };
    });

    return results;
  }

  async findStudentById(id: number) {
    return await this.prisma.aluno.findUnique({ where: { id } });
  }

  async studentProgressById(id: number) {
    const student = await this.prisma.aluno.findUnique({
      where: { id: id },
      select: {
        nome: true,
        historico: {
          select: {
            status: true,
            disciplina: {
              select: {
                tipo: true,
              },
            },
          },
        },
      },
    });

    const { nome, historico } = student;

    const results = {
      name: nome,
      num_studied: 0,
      num_studying: 0,
      num_missing_mandatory: 0,
      num_missing_elective: 0,
    };

    for (const h of historico) {
      switch (h.status) {
        case 1:
        case 2:
          results.num_studied++;
          break;
        case 5:
          results.num_studying++;
          break;
        case 0:
        case 3:
        case 4:
        case 6:
        case 7:
          results.num_missing_mandatory += h.disciplina.tipo === 1 ? 1 : 0;
          results.num_missing_elective += h.disciplina.tipo === 2 ? 1 : 0;
          break;
      }
    }

    return results;
  }

  async studentProgressAll(take: number, skip: number) {
    const students = await this.prisma.aluno.findMany({
      select: {
        nome: true,
        historico: {
          select: {
            status: true,
            disciplina: {
              select: {
                tipo: true,
              },
            },
          },
        },
      },
      take: take || MIN_TAKE_RESULTS,
      skip: skip || 0,
      orderBy: {
        nome: 'asc',
      },
    });

    const results = students.map((student) => {
      const { nome, historico } = student;

      const aggregatedResults = {
        name: nome,
        num_studied: 0,
        num_studying: 0,
        num_missing_mandatory: 0,
        num_missing_elective: 0,
      };

      for (const h of historico) {
        switch (h.status) {
          case 1:
          case 2:
            aggregatedResults.num_studied++;
            break;
          case 5:
            aggregatedResults.num_studying++;
            break;
          case 0:
          case 3:
          case 4:
          case 6:
          case 7:
            aggregatedResults.num_missing_mandatory +=
              h.disciplina.tipo === 1 ? 1 : 0;
            aggregatedResults.num_missing_elective +=
              h.disciplina.tipo === 2 ? 1 : 0;
            break;
        }
      }

      return aggregatedResults;
    });

    return results;
  }

  async studentAllElective(id: number) {
    return await this.prisma.$queryRaw`
    SELECT
      a.id AS id_aluno,
      a.nome AS nome_aluno,
      COUNT(*) AS quantidade_disciplinas_eletivas_passadas
    FROM
      aluno a
      JOIN historico h ON a.id = h.id_aluno
      JOIN disciplina d ON h.id_disciplina = d.id
    WHERE
      d.tipo = 2
      AND h.status IN (1, 2)
      AND a.id = ${id}
    GROUP BY a.id;
;`;
  }

  async studentBlocked() {
    return await this.prisma.$queryRaw`
    SELECT
      a.id AS id_aluno,
      a.nome AS nome_aluno
    FROM
      aluno a
    WHERE
    NOT EXISTS (
        SELECT 1
        FROM historico h
        JOIN disciplina d ON h.id_disciplina = d.id
        WHERE h.id_aluno = a.id
          AND h.status IN (3, 4)
    );
;`;
  }

  async reprovedMore(take: string, skip: number) {
    return await this.prisma.$queryRaw`
    SELECT
      a.id AS id_aluno,
      a.nome AS nome_aluno,
      COUNT(*) AS vezes_reprovado
    FROM
      aluno a
      JOIN historico h ON a.id = h.id_aluno
      JOIN disciplina d ON h.id_disciplina = d.id
    WHERE
      d.codigo = '${take}'
      AND h.status IN (3, 4)
    GROUP BY
      a.id, a.nome
    HAVING
      COUNT(*) >= ${skip};`;
  }
}
