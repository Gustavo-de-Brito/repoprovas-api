import { Request, Response } from "express";
import { ITestData } from "../types/testTypes";
import * as testService from '../services/testService';
import { Test, User } from "@prisma/client";

export async function registerTest(req: Request, res: Response) {
  const test: ITestData = req.body;

  const registeredTest: Test = await testService.addTest(test);

  res.status(201).send(registeredTest);
}

export async function getTestGroupByDiscipline(req: Request, res: Response) {
  const tests = await testService.getTestsDiscipline();

  res.status(200).send(tests);
}

export async function getTestsGroupByTeacher(req: Request, res: Response) {
  const tests = await testService.getTestsTeacher();

  res.status(200).send(tests);
}