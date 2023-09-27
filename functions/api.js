import express, { Router } from 'express';
import serverless from 'serverless-http';

const api = express();

const router = Router();
router.get('/', (req, res) => res.send('Test'));

api.use('/api/', router);

export const handler = serverless(api);