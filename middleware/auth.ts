import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface JwtPayload {
    user: {
        id: number;
    };
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        const user = await User.findByPk(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};