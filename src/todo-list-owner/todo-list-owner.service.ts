import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoListOwner } from './todo-list-owner.model';
import { TodoList } from 'src/todo-list/todo-list.model';
import { User } from 'src/user/user.model';
import { Transaction } from 'sequelize';

@Injectable()
export class TodoListOwnerService {
  constructor(
    @Inject('TodoListOwnerDb')
    private readonly todoListOwnerDb: typeof TodoListOwner,
  ) {}

  async find(todoListId: string, userId: string): Promise<TodoListOwner> {
    const todoListOwner = await this.todoListOwnerDb.findOne<TodoListOwner>({
      where: {
        todoListId,
        userId,
      },
    });
    return todoListOwner;
  }

  async create(
    todoList: TodoList,
    userId: string,
    author: User,
    transaction?: Transaction,
  ): Promise<TodoListOwner> {
    let owner = await this.find(todoList.id, userId);
    if (!owner) {
      owner = new TodoListOwner({
        todoListId: todoList.id,
        userId,
        authorId: author.id,
      });
      const res = await owner.save({ transaction });
      if (!res.id) {
        throw new HttpException(
          'There was an error during creation process',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return owner;
  }
}
