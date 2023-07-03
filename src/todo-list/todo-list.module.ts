import { Module } from '@nestjs/common';
import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TodoList } from './todo-list.model';
import { UserModule } from 'src/user/user.module';
import { CaslModule } from 'src/casl/casl.module';
import { TodoListOwnerModule } from 'src/todo-list-owner/todo-list-owner.module';
import { TodoListOwnerService } from 'src/todo-list-owner/todo-list-owner.service';
import { TodoListOwner } from 'src/todo-list-owner/todo-list-owner.model';
import { DatabaseModule } from 'src/database/database.module';
import { TodoTaskService } from 'src/todo-task/todo-task.service';
import { TodoTask } from 'src/todo-task/todo-task.model';

@Module({
  imports: [UserModule, CaslModule, TodoListOwnerModule, DatabaseModule],
  controllers: [TodoListController],
  providers: [
    TodoListService,
    TodoListOwnerService,
    TodoTaskService,
    {
      provide: 'TodoListDb',
      useValue: TodoList,
    },
    {
      provide: 'TodoListOwnerDb',
      useValue: TodoListOwner,
    },
    {
      provide: 'TodoTaskDb',
      useValue: TodoTask,
    },
  ],
})
export class TodoListModule {}
