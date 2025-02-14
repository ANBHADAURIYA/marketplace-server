import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import sequelize from './database';
import itemsRouter from './routes/items';
import transactionsRouter from './routes/transaction';

const app: Application = express();

app.use(express.json());
app.use(cors());

sequelize.sync().then(() => {
    console.log('Database & tables created!');
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRouter);
app.use('/api/transactions', transactionsRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hashers Marketplace!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
