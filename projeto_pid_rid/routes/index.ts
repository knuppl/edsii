import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.render('index', { title: 'Express' });
});

export default router;
