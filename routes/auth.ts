import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import asyncHandler from '../utils/asyncHandler';

const router: Router = Router();

router.post('/register', asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    let user = await User.findOne({ where: { username } });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({ username, password: hashedPassword });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 });

    return res.status(201).json({ token, userId: user.id });
}));

router.post('/login', asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 });

    return res.status(200).json({ token, userId: user.id });
}));

export default router;
