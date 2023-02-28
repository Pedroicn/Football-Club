import * as jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'jwt_secret';

interface Payload {
  id?: number;
  username?: string;
  role?: string;
  email?: string
}

const generateToken = (payload: Payload) =>
  jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
  });

export default generateToken;
