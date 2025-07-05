import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createAuthService, getAllUsersService, loginAuthService, updateVerificationStatus } from '../services/authService';

import jwt from 'jsonwebtoken';

import { TIUser } from '@/Drizzle/schema';
import { emailService } from '@/services/emailService';

// Store verification codes with expiry (in memory - consider using Redis in production)
const verificationCodes = new Map<string, { code: string; expires: Date }>();

// Generate a random 6-digit verification code
const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const creatUserController = async (req: Request, res: Response) => {
    try {
        const userData: TIUser = req.body;
        const password = userData.password;
        userData.password = await bcrypt.hashSync(password, 10);
        userData.role = userData.role || 'customer'; // Default role is customer
        
        try {
            const createUser = await createAuthService(userData);
            if (!createUser) {
                res.status(400).json({ message: "User creation failed" });
                return;
            }

        // Generate and store verification code
        const verificationCode = generateVerificationCode();
        verificationCodes.set(createUser.email, {
            code: verificationCode,
            expires: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours expiry
        });

        // Try to send verification code email
        try {
            await emailService.sendVerificationCode(createUser.email, verificationCode);
            
            // Registration successful with email sent
            res.status(201).json({ 
                message: "Registration successful! We have sent a verification code to your email. Please verify your email to enable login.", 
                user: {
                    id: createUser.user_id,
                    first_name: createUser.first_name,
                    last_name: createUser.last_name,
                    email: createUser.email
                }
            });
        } catch (emailError) {
            // Registration successful but email failed
            console.error("Failed to send verification email:", emailError);
            res.status(201).json({ 
                message: "Registration successful! However, we couldn't send the verification email. Please try to login to receive a new verification code.", 
                user: {
                    id: createUser.user_id,
                    first_name: createUser.first_name,
                    last_name: createUser.last_name,
                    email: createUser.email
                },
                emailError: true
            });
        }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Missing required user fields') {
                    res.status(400).json({ message: 'Missing required user fields: first name, last name, email, and password' });
                    return;
                }
                if (error.message === 'Missing required customer fields') {
                    res.status(400).json({ message: 'Missing required customer fields: phone number and address' });
                    return;
                }
                if (error.message.includes('Password must contain')) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error.message === 'Database error') {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
            }
            throw error;
        }
    } catch (error) {
        console.error("Error in createUserController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const existingUser = await loginAuthService(user);
        
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userMatch = await bcrypt.compareSync(user.password, existingUser.password);
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if user is verified after password check
        if (!existingUser.is_verified) {
            // Generate new verification code if user is not verified
            const verificationCode = generateVerificationCode();
            verificationCodes.set(existingUser.email, {
                code: verificationCode,
                expires: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours expiry
            });
            
            // Try to send new verification code
            try {
                await emailService.sendVerificationCode(existingUser.email, verificationCode);
                return res.status(403).json({ 
                    message: "Account not verified. A new verification code has been sent to your email. Please verify your account to login.",
                    isVerified: false
                });
            } catch (emailError) {
                return res.status(403).json({ 
                    message: "Account not verified and we couldn't send a new verification code. Please try again later.",
                    isVerified: false,
                    emailError: true
                });
            }
        }

        const payload = {
            sub: existingUser.user_id,
            user_id: existingUser.user_id,
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            role: existingUser.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
        };
        
        const secret = process.env.JWT as string;
        if (!secret) {
            throw new Error("JWT secret is not defined");
        }
        const token = jwt.sign(payload, secret);
        
        return res.status(200).json({ 
            message: "Login successful", 
            user: {
                id: existingUser.user_id,
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                email: existingUser.email,
                isVerified: existingUser.is_verified,
                role: existingUser.role
            }, 
            token 
        });
    } catch (error) {
        console.error("Error in loginUserController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        // Check if verification code exists and is valid
        const storedVerification = verificationCodes.get(email);
        console.log("Stored Verification:", storedVerification);
        if (!storedVerification) {
            return res.status(400).json({ 
                message: "Verification code not found or expired. Please try to login to receive a new verification code."
            });
        }

        // Check if code matches and hasn't expired
        if (storedVerification.code !== code || storedVerification.expires < new Date()) {
            return res.status(400).json({ 
                message: "Invalid or expired verification code. Please try to login to receive a new verification code."
            });
        }

        // Remove the used verification code
        verificationCodes.delete(email);

        // Update user's verification status
        await updateVerificationStatus(email, true);

        res.status(200).json({ 
            message: "Email verified successfully. You can now log in.",
            isVerified: true
        });

    } catch (error) {
        console.error("Error in verifyEmailController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

