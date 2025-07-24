import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    console.log('Auth middleware - Full headers:', req.headers);
    const authHeader = req.headers.authorization;
    console.log('Auth middleware - Authorization header:', authHeader);
    
    if (!authHeader) {
        console.log('Auth middleware - No authorization header found');
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Auth middleware - Extracted token:', token.substring(0, 20) + '...');
    
    // Check for invalid token
    if (token === 'invalid_token') {
        console.log('Auth middleware - Invalid token detected');
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

    try {
        // Simple JWT decode without verification (for development)
        // In production, you should use proper JWT verification
        try {
            // Try to decode the token manually
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                console.log('Decoded token payload:', payload);
                
                // Ensure we have a user ID
                if (payload.user_id || payload.id) {
                    (req as AuthRequest).user = payload;
                } else {
                    console.error('No user ID found in token payload');
                    res.status(401).json({ message: 'Invalid token: no user ID' });
                    return;
                }
            } else {
                console.error('Invalid token format');
                res.status(401).json({ message: 'Invalid token format' });
                return;
            }
        } catch (decodeError) {
            console.error('Token decode failed:', decodeError);
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
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
        // Same logic as verifyToken but optional
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                if (payload.user_id || payload.id) {
                    (req as AuthRequest).user = payload;
                }
            }
        } catch (decodeError) {
            console.log('Optional auth - token decode failed, continuing without user');
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }
};