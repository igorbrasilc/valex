import express, { Request, Response } from 'express';
import "express-async-errors";
import cors from 'cors';
import router from './app.js';
import errorHandling from './middlewares/errorHandling.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorHandling);

// const port: number = +process.env.PORT || 4000;
app.listen(process.env.PORT, () => {
    console.log(`Running on http://localhost:${process.env.PORT}`);
});