import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import statusCodes from '../../utils/statusCodes';

const secretKey = process.env.JWT_SECRET || 'jwt_secret';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(statusCodes.unauthorized).send({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(authorization, secretKey);
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(statusCodes.unauthorized).json({ message: 'Token must be a valid token' });
  }
};

export default validateToken;
