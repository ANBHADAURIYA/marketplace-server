import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import Item from '../models/items';
import { verifyToken } from '../middleware/auth';
import { asyncMiddleware } from '../utils/asyncMiddleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Get all items with search, filter, and sort functionality
router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
    const { search, minPrice, maxPrice, sortBy, order } = req.query;

    const where: any = {};

    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    if (minPrice) {
        where.price = { ...where.price, [Op.gte]: Number(minPrice) };
    }

    if (maxPrice) {
        where.price = { ...where.price, [Op.lte]: Number(maxPrice) };
    }

    const orderArray: any[] = [];
    if (sortBy) {
        orderArray.push([sortBy, order === 'desc' ? 'DESC' : 'ASC']);
    }

    const items = await Item.findAll({
        where,
        order: orderArray.length ? orderArray : [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'description', 'price', 'image', 'userId', 'createdAt'] // Include createdAt attribute
    });

    res.json(items);
}));

// Get items owned by the authenticated user
router.get('/user', asyncHandler(verifyToken), asyncHandler(async (req: Request, res: Response) => {
    console.log('req.user:', req.user);
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ msg: 'User not authenticated' });
    }
    const items = await Item.findAll({
        where: { userId },
        attributes: ['id', 'name', 'description', 'price', 'image', 'userId', 'createdAt'] // Include createdAt attribute
    });
    res.json(items);
}));

// Get a single item by ID
router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    const item = await Item.findByPk(req.params.id, {
        attributes: ['id', 'name', 'description', 'price', 'image', 'userId', 'createdAt'] // Include createdAt attribute
    });
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
