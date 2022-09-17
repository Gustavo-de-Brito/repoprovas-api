import { Router } from 'express';
import authRouter from './authRouter';
import testRouter from './testRouter';

const indexRouter: Router = Router();

indexRouter.use(authRouter);
indexRouter.use(testRouter);

export default indexRouter;