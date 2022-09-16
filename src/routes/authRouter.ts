import { Router } from 'express';
import authSchema from '../schemas/authSchema';
import schemaValidation from '../middlewares/schemaValidation';
import { registerUser } from '../controllers/authControllers';

const authRouter: Router = Router();

authRouter.post('/sign-up', schemaValidation(authSchema), registerUser);

export default authRouter;