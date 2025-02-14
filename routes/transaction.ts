import { Router } from 'express';
import Transaction from '../models/transaction';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { type, itemId, userId, quantity } = req.body;
        const newTransaction = await Transaction.create({ type, itemId, userId, quantity });
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.findAll({ where: { userId } });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

router.put('/:id', async (req, res) => {
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

export default router;
