import { Category, Discipline, Teacher, TeachersDisciplines, Test } from "@prisma/client";
import { ITestByDiscipline, ITestByTeacher, ITestData, TestDataIds } from "../types/testTypes";
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

export async function getTestsDiscipline() {
  const tests = await testRepository.getTestGroupByDiscipline();
  const formatedDisciplines: ITestByDiscipline[] = [...tests]
  
  for(let i = 0; i < tests.length; i++) {
    const disciplines = tests[i].Discipline;
    
    for(let j = 0; j < disciplines.length; j++) {
      const teachersDisciplines = disciplines[j].TeachersDisciplines;
      const testsByCategory = [];

      for(let k = 0; k < teachersDisciplines.length; k++) {
        const emptyTest = teachersDisciplines[k].Test;

        for(let l = 0; l < emptyTest.length; l++) {
          testsByCategory.push({
            name: emptyTest[l].categories.name,
            tests: emptyTest[l].categories.Test.map(test => {
              const formatedTest = {
                name: test.name,
                pdfUrl: test.pdfUrl,
                teacher: test.teachersDisciplines.teachers.name
              };

              return formatedTest;
            })
          });
        }
      }

      delete formatedDisciplines[i].Discipline[j].TeachersDisciplines;
      formatedDisciplines[i].Discipline[j].categories = testsByCategory;
    }
  }

  return formatedDisciplines;
}

export async function getTestsTeacher() {
  const tests = await testRepository.getTestsGroupByTeacher();
  const formatedTestsTeacher: ITestByTeacher[] = { ...tests };

  for(let i = 0; i < tests.length; i++) {
    const teachersDisciplines = tests[i].TeachersDisciplines;
    
    for(let j = 0; j < teachersDisciplines.length; j++) {
      const emptyTest = teachersDisciplines[j].Test;
      const testsByCategory = [];

        for(let k = 0; k < emptyTest.length; k++) {
          testsByCategory.push({
            name: emptyTest[k].categories.name,
            tests: emptyTest[k].categories.Test.map(test => {
              const formatedTest = {
                name: test.name,
                pdfUrl: test.pdfUrl,
                discipline: test.teachersDisciplines.disciplines.name
              };

              return formatedTest;
            })
          });
      }

      delete formatedTestsTeacher[i].TeachersDisciplines
      formatedTestsTeacher[i].categories = testsByCategory;
    }
  }

  return tests;
}