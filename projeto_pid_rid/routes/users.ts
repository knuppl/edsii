import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('respond with a resource');
});

export default router;
