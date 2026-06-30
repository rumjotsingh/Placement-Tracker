import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import env from './config/env.js';

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
