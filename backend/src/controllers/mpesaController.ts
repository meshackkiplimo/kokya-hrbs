import { stkPush } from '@/services/mpesaService';
import { Request, Response } from 'express';


export const initiateSTKPush = async (req: Request, res: Response) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount are required.' });
    }

    const result = await stkPush(phone, amount);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
