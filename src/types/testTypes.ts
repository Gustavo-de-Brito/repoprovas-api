import { Test } from "@prisma/client";

export type TestDataIds = Omit<Test, 'id'>;

export interface ITestData {
  name: string;
  pdfUrl: string;
  category: string;
  discipline: string;
  teacher: string;
}