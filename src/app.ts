import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import indexRouter from './routers/index';
import handlerErrorsMiddleware from './middlewares/handleErrorsMiddleware';

const app = express();

app.use(cors());
app.use(json());

app.use(indexRouter);

app.use(handlerErrorsMiddleware);

export default app;