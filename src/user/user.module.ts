import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Module({
  providers: [UserService, { provide: 'UserDb', useValue: User }],
  exports: [UserService],
})
export class UserModule {}
