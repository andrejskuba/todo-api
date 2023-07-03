import { Module } from '@nestjs/common';
import { TodoListOwnerService } from './todo-list-owner.service';
import { TodoListOwner } from './todo-list-owner.model';

@Module({
  providers: [
    TodoListOwnerService,
    {
      provide: 'TodoListOwnerDb',
      useValue: TodoListOwner,
    },
  ],
})
export class TodoListOwnerModule {}
