import { Router, Request, Response } from 'express';
import Item from '../models/items';
import { verifyToken } from '../middleware/auth';
import { asyncMiddleware } from '../utils/asyncMiddleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Get all items
router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
    const items = await Item.findAll();
    res.json(items);
}));

// Get items owned by the authenticated user
router.get('/user', asyncHandler(verifyToken), asyncHandler(async (req: Request, res: Response) => {
    console.log('req.user:', req.user);
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ msg: 'User not authenticated' });
    }
    const items = await Item.findAll({ where: { userId } });
    res.json(items);
}));

// Get a single item by ID
router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    const item = await Item.findByPk(req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
}));

// Create a new item
router.post('/', asyncHandler(verifyToken), asyncHandler(async (req: Request, res: Response) => {
    console.log('req.user:', req.user);
    const { name, description, price, image } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ msg: 'User not authenticated' });
    }
    const newItem = await Item.create({ name, description, price, image, userId });
    res.status(201).json(newItem);
}));

// Update an item
router.put('/:id', asyncHandler(verifyToken), asyncHandler(async (req: Request, res: Response) => {
    console.log('req.user:', req.user);
    const { name, description, price, image } = req.body;
    const item = await Item.findByPk(req.params.id);
    if (item) {
        if (item.userId !== req.user?.id) {
            return res.status(403).json({ error: 'You are not authorized to update this item' });
        }
        item.name = name;
        item.description = description;
        item.price = price;
        item.image = image;
        await item.save();
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
}));

// Delete an item
router.delete('/:id', asyncHandler(verifyToken), asyncHandler(async (req: Request, res: Response) => {
    console.log('req.user:', req.user);
    const item = await Item.findByPk(req.params.id);
    if (item) {
        if (item.userId !== req.user?.id) {
            return res.status(403).json({ error: 'You are not authorized to delete this item' });
        }
        await item.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
}));

export default router;