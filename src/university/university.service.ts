import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MIN_TAKE_RESULTS } from 'src/utils/constants';
import { PrismaService } from '../prisma/prisma.service';
import { Aluno } from './entities/aluno.entity';
import { Disciplina } from './entities/disciplina.entity';
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
export class UniversityService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): { message: string } {
    return { message: 'hello, you are logged!' };
  }

  async disciplines({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.disciplinaWhereInput;
    orderBy?: Prisma.disciplinaOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Disciplina>> {
    return paginate(
      this.prisma.disciplina,
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

  async disciplineOffer(id: number) {
    return await this.prisma.$queryRaw`
    SELECT DISTINCT ano, semestre
    FROM historico
    WHERE id_disciplina = ${id}
    ORDER BY ano, semestre
`;
  }

  async disciplineDemand() {
    return await this.prisma.$queryRaw`SELECT disciplina.id, disciplina.nome, (
      SELECT CAST(COUNT(*) AS INT)
      FROM aluno
      WHERE NOT EXISTS (
        SELECT *
        FROM historico
        WHERE historico.id_disciplina = disciplina.id AND
        historico.id_aluno = aluno.id
      )) as demanda
      FROM disciplina
      ORDER BY demanda DESC;`;
  }

  async disciplineDemandById(id: number) {
    return await this.prisma.$queryRaw`SELECT disciplina.id, disciplina.nome, (
      SELECT CAST(COUNT(*) AS INT)
      FROM aluno
      WHERE NOT EXISTS (
        SELECT *
        FROM historico
        WHERE historico.id_disciplina = disciplina.id AND
        historico.id_aluno = aluno.id
      )) as demanda
      FROM disciplina
      WHERE id = ${id}
      ORDER BY demanda DESC;`;
  }

  async students({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.alunoWhereInput;
    orderBy?: Prisma.alunoOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Aluno>> {
    return paginate(
      this.prisma.aluno,
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

  async reprovedMore(code: string, count: number) {
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
      d.codigo = '${code}'
      AND h.status IN (3, 4)
    GROUP BY
      a.id, a.nome
    HAVING
      COUNT(*) >= ${count};`;
  }

  async studentHistoric(id: number) {
    return await this.prisma.$queryRaw`
    SELECT
      disciplina.id as id_disciplina,
      disciplina.nome,
      historico.ano,
      historico.semestre,
      historico.status,
      historico.nota
    FROM 
      historico JOIN disciplina on historico.id_disciplina = disciplina.id
    WHERE
      historico.id_aluno = ${id};`;
  }

  async studentHoursPerSemester(id: number) {
    return await this.prisma.$queryRaw`
    SELECT 
      historico.ano,
      historico.semestre,
      CAST((SUM(disciplina.carga_horaria)) as INT) as horas_cursadas
    FROM historico JOIN disciplina on historico.id_disciplina = disciplina.id
    WHERE historico.id_aluno = ${id}
    GROUP BY historico.ano, historico.semestre`;
  }
}
