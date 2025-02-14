import { Router, Request, Response } from 'express';
import Transaction from '../models/transaction';
import Item from '../models/items';

const router = Router();


router.post('/', async (req: Request, res: Response) => {
    try {
        const { type, itemId, userId, quantity } = req.body;
        const newTransaction = await Transaction.create({ type, itemId, userId, quantity });
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});


router.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.findAll({ where: { userId } });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});


router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const transaction = await Transaction.findByPk(id);
        if (transaction) {
            transaction.status = status;
            await transaction.save();
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});


router.get('/pending/user/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const items = await Item.findAll({ where: { userId } });
        const itemIds = items.map(item => item.id);

        const transactions = await Transaction.findAll({
            where: {
                itemId: itemIds,
                status: 'pending'
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching pending transactions:', error);
        res.status(500).json({ error: 'Failed to fetch pending transactions' });
    }
});

export default router;
