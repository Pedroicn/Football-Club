import { Request, Response } from 'express';
import statusCodes from '../../utils/statusCodes';
import UserService from '../services/userService';
import generateToken from '../../utils/JWT';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public user = async (req: Request, res: Response) => {
    const user = await this.userService.user(req.body);
    const newUser = {
      id: user?.id,
      username: user?.username,
      role: user?.role,
      email: user?.email,
    };
    const token = generateToken(newUser);
    res.status(statusCodes.ok).json({ token });
  };
}

export default UserController;
