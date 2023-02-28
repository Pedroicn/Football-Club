import * as bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel';
// import Team from '../interfaces/TeamInterface';
interface UserLoginShape {
  email: string;
  password: string;
}

class UserService {
  public userModel = UserModel;

  public async user(user: UserLoginShape): Promise<UserModel | null> {
    const result = await this.userModel.findOne({
      where: { email: user.email },
    });

    const validateUser = bcrypt.compareSync(user.password, result?.password || '-');

    return validateUser ? result : null;
  }
}
export default UserService;
