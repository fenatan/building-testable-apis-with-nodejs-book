import { Router } from 'express';
import productsRotuer from './products';

const router = Router();

router.get('/', (req, res) => res.send('Hello Nodeee!'));
router.use('/products', productsRotuer);

export default router;