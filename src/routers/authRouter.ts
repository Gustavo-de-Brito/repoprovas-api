import { Router } from 'express';
import registerSchema from '../schemas/registerSchema';
import loginSchema from '../schemas/loginSchema';
import schemaValidation from '../middlewares/schemaValidation';
import { registerUser, loginUser } from '../controllers/authControllers';

const authRouter: Router = Router();

authRouter.post('/sign-up', schemaValidation(registerSchema), registerUser);
authRouter.post('/sign-in', schemaValidation(loginSchema), loginUser)

export default authRouter;