import { Router } from 'express';
import productsRotuer from './products';
import usersRouter from './users';

const router = Router();

router.get('/', (req, res) => res.send('Hello Nodeee!'));

router.use('/users', usersRouter);

router.use('/products', productsRotuer);

export default router;
