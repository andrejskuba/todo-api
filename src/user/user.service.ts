import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './../user/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserDb')
    private readonly userDb: typeof User,
  ) {}

  static includeModels(): any[] {
    return [];
  }

  async getCurrentUser(req): Promise<User> {
    const user = await this.findByUsername(req?.user?.username);
    if (!user) {
      throw new HttpException(
        'Non-existing user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userDb.findAll<User>({
      where: {
        deletedAt: null,
      },
      include: UserService.includeModels(),
      order: [['created_at', 'DESC']],
    });
    return users;
  }

  async findById(
    id: string,
    includeDeleted = false,
  ): Promise<User | undefined> {
    const user = await this.userDb.findOne<User>({
      where: {
        id,
      },
      include: UserService.includeModels(),
      paranoid: !includeDeleted,
    });
    return user;
  }

  async findByUsername(
    username: string,
    includeDeleted = false,
  ): Promise<User | undefined> {
    const user = await this.userDb.findOne<User>({
      where: {
        username,
      },
      include: UserService.includeModels(),
      paranoid: !includeDeleted,
    });
    return user;
  }
}
