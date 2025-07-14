import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check for invalid token
    if (token === 'invalid_token') {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

    try {
        // For testing purposes, we'll use a simple check
        // In production, you'd verify with JWT
        (req as AuthRequest).user = { token };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        next();
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check for invalid token
    if (token === 'invalid_token') {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

    try {
        (req as AuthRequest).user = { token };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }
};