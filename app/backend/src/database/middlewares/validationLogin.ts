import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';

export const validationEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return res.status(statusCodes.badRequest).json({ message: 'All fields must be filled' });
  }
  next();
};

export const validationPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (!password) {
    return res.status(statusCodes.badRequest).json({ message: 'All fields must be filled' });
  }
  next();
};
