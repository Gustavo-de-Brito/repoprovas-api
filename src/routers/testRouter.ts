import { Router } from 'express';
import tokenValidation from '../middlewares/tokenValidationMiddleware';
import schemaValidation from '../middlewares/schemaValidation';
import testSchema from '../schemas/testSchema';
import { registerTest } from '../controllers/testControllers';

const testRouter:Router = Router();

testRouter.post(
  '/tests',
  tokenValidation,
  schemaValidation(testSchema),
  registerTest
);

export default testRouter;