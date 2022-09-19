import { faker } from '@faker-js/faker';
import prisma from '../../src/databases/postgres';

function ramdomize() {
  return Math.random() - 0.5;
}

async function getRandomTeacherAndDiscipline(): 
  Promise<{ teacher: string | undefined, discipline: string | undefined}>
{
  const teachersDisciplinesIds = await prisma.teachersDisciplines.findMany(
    {
      select: {
        id: true
      }
    }
  );

  const teacherDisciplineId = [...teachersDisciplinesIds].sort(ramdomize)[0].id;

  const teacherDiscipline = await prisma.teachersDisciplines.findFirst({
    where: { id: teacherDisciplineId },
    select: {
      teachers: {
        select: {
          name: true
        }
      },
      disciplines: {
        select: {
          name: true
        }
      }
    }
  });

  return {
    teacher: teacherDiscipline?.teachers.name,
    discipline: teacherDiscipline?.disciplines.name
  };
}

async function getRamdomCategory(): Promise<{ category: string | undefined }> {
  const categoryIds = await prisma.category.findMany(
    {
      select: {
        name: true
      }
    }
  );

  const category = [...categoryIds].sort(ramdomize)[0].name;

  return { category }
}

export async function testFactory(): 
  Promise<
    {
      name:string,
      pdfUrl:string,
      category:string | undefined,
      discipline: string | undefined,
      teacher:string | undefined
    }
  >
{
  const { teacher, discipline } = await getRandomTeacherAndDiscipline();
  const { category } = await getRamdomCategory();

  return {
    name: faker.lorem.words(3),
    pdfUrl: faker.internet.url(),
    category,
    discipline,
    teacher
  };
}

export async function teacherDisciplineWrongFactory() {
  const teacherDiscipline = await prisma.teachersDisciplines.findFirst(
    {
      select: {
        teachers: {
          select: {
            name: true
          }
        },
        disciplines: {
          select: {
            name: true
          }
        }
      }
    }
  );

  const teacher = await prisma.teacher.findFirst(
    {
      where: {
        NOT:{
          name: teacherDiscipline?.teachers.name
        }
      }
    }
  );

  return {
    teacher: teacher?.name,
    discipline: teacherDiscipline?.disciplines.name
  };
}