import { Module } from '@nestjs/common';
import { TodoListModule } from './todo-list/todo-list.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TodoTaskModule } from './todo-task/todo-task.module';
import { AuthModule } from './auth/auth.module';
import { TodoListOwnerModule } from './todo-list-owner/todo-list-owner.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TodoListModule,
    UserModule,
    DatabaseModule,
    TodoTaskModule,
    AuthModule,
    TodoListOwnerModule,
    CaslModule,
  ],
})
export class AppModule {}
