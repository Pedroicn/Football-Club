import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';

export const validationEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return res.status(statusCodes.badRequest).json({ message: 'All fields must be filled' });
  }

  const validEmail = /\S+@\S+\.\S+/i.test(email);

  if (!validEmail) {
    return res.status(statusCodes.unauthorized).json({ message: 'Invalid email or password' });
  }
  next();
};

export const validationPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (!password) {
    return res.status(statusCodes.badRequest).json({ message: 'All fields must be filled' });
  }

  if (password.length < 6) {
    return res.status(statusCodes.unauthorized).json({ message: 'Invalid email or password' });
  }
  next();
};
