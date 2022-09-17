import { Category, Discipline, Teacher, TeachersDisciplines, Test } from "@prisma/client";
import prisma from "../databases/postgres";
import { TestDataIds } from "../types/testTypes";

export async function getCategoryByName(
  categoryName: string
) : Promise<Category | null> {
  const category: Category | null = await prisma.category.findFirst(
    {
      where: { name: categoryName }
    }
  );

  return category;
}

export async function getDisciplineByName(
  disciplineName: string
): Promise<Discipline | null> {
  const discipline: Discipline | null = await prisma.discipline.findFirst(
    {
      where: { name: disciplineName }
    }
  );

  return discipline;
}

export async function getTeacherByName(
  teacherName: string
): Promise<Teacher | null> {
  const teacher: Teacher | null = await prisma.teacher.findFirst(
    {
      where: { name: teacherName }
    }
  );

  return teacher;
}

export async function getTeacherDisciplineByIds(
  teacherId: number,
  disciplineId: number,
): Promise<TeachersDisciplines | null> {
  const teacherDiscipline: TeachersDisciplines | null = (
    await prisma.teachersDisciplines.findFirst(
      {
        where: { teacherId, disciplineId }
      }
    )
  );

  return teacherDiscipline;
}

export async function insert(test: TestDataIds): Promise<Test> {
  const newTest: Test = await prisma.test.create({
    data: test
  });

  return newTest;
}