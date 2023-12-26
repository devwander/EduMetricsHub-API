-- AlterTable
CREATE SEQUENCE aluno_id_seq;
ALTER TABLE "aluno" ALTER COLUMN "id" SET DEFAULT nextval('aluno_id_seq');
ALTER SEQUENCE aluno_id_seq OWNED BY "aluno"."id";

-- AlterTable
CREATE SEQUENCE disciplina_id_seq;
ALTER TABLE "disciplina" ALTER COLUMN "id" SET DEFAULT nextval('disciplina_id_seq');
ALTER SEQUENCE disciplina_id_seq OWNED BY "disciplina"."id";
