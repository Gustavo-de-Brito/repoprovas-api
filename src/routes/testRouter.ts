import { Router } from 'express';
import schemaValidation from '../middlewares/schemaValidation';
import testSchema from '../schemas/testSchema';
import { registerTest } from '../controllers/testControllers';

const testRouter:Router = Router();

testRouter.post('/tests', schemaValidation(testSchema), registerTest);

export default testRouter;