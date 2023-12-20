-- CreateTable
CREATE TABLE "aluno" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "arg_class" DOUBLE PRECISION NOT NULL,
    "ano_entrada" INTEGER NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplina" (
    "id" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carga_horaria" INTEGER NOT NULL,
    "credito" INTEGER NOT NULL,
    "tipo" INTEGER NOT NULL,

    CONSTRAINT "disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico" (
    "id_aluno" INTEGER NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "semestre" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "historico_pkey" PRIMARY KEY ("id_aluno","id_disciplina","ano","semestre")
);

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico" ADD CONSTRAINT "historico_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
