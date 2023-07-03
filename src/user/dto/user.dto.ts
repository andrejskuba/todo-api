import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.model';

export class UserDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly username: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }
}
