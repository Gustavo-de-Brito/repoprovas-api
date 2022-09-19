import { Test } from "@prisma/client";

export type TestDataIds = Omit<Test, 'id'>;

export interface ITestData {
  name: string;
  pdfUrl: string;
  category: string;
  discipline: string;
  teacher: string;
};

export interface ITestByDiscipline {
  number: number,
  Discipline: {
    name: string,
    TeachersDisciplines?: any,
    categories?: any
  }[]
};

export interface ITestByTeacher {
  name: string;
  TeachersDisciplines?: any;
  categories?: any;
};