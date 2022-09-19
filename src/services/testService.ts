import { Category, Discipline, Teacher, TeachersDisciplines, Test } from "@prisma/client";
import { ITestData, TestDataIds } from "../types/testTypes";
import * as testRepository from '../repositories/testRepository';
import { notFoundError } from "../utils/errorUtils";

async function isCategoryValid(categoryName: string): Promise<Category> {
  const category: Category | null = await testRepository.getCategoryByName(
    categoryName
  );

  if(!category) throw notFoundError('a categoria informada não existe');

  return category;
}

async function isDisciplineValid(disciplineName: string): Promise<Discipline> {
  const discipline: Discipline | null = await testRepository.getDisciplineByName(
    disciplineName
  );

  if(!discipline) throw notFoundError('a disciplina informada não existe');

  return discipline;
}

async function isTeacherValid(teacherName: string): Promise<Teacher> {
  const teacher: Teacher | null = await testRepository.getTeacherByName(
    teacherName
  );

  if(!teacher) throw notFoundError('o professor informado não existe');

  return teacher;
}

async function isTeacherDisciplineValid(
  teacherId: number,
  disciplineId: number
): Promise<TeachersDisciplines> {
  const teacherDiscipline: TeachersDisciplines | null = (
    await testRepository.getTeacherDisciplineByIds(teacherId, disciplineId)
  );

  if(!teacherDiscipline) {
    throw notFoundError(
      'o professor informado não leciona a disciplina informada'
    );
  }

  return teacherDiscipline;
}

export async function addTest(test: ITestData): Promise<Test> {
  const categoryData: Category = await isCategoryValid(test.category)
  const disciplineData: Discipline = await isDisciplineValid(test.discipline);
  const teacherData: Teacher = await isTeacherValid(test.teacher);
  const teacherDisciplineData: TeachersDisciplines = (
    await isTeacherDisciplineValid(teacherData.id, disciplineData.id)
  );

  const testToDatabase: TestDataIds = {
    name: test.name,
    pdfUrl: test.pdfUrl,
    categoryId: categoryData.id,
    teacherDisciplineId: teacherDisciplineData.id
  };

  const newTest: Test = await testRepository.insert(testToDatabase);

  return newTest;
}