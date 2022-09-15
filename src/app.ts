import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';

const app = express();

app.use(cors());
app.use(json());

app.use(authRouter);

export default app;