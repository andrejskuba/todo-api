import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoList } from './todo-list.model';
import { User } from './../user/user.model';
import { TodoTask } from 'src/todo-task/todo-task.model';
import { TodoListOwner } from 'src/todo-list-owner/todo-list-owner.model';
import { TodoListCreateDto } from './dto/todo-list-create.dto';
import { TodoListOwnerService } from 'src/todo-list-owner/todo-list-owner.service';
import { TodoTaskService } from 'src/todo-task/todo-task.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TodoListService {
  constructor(
    @Inject('TodoListDb')
    private readonly todoListDb: typeof TodoList,
    private readonly todoListOwnerService: TodoListOwnerService,
    private readonly todoTaskService: TodoTaskService,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  static includeModels(): any[] {
    return [
      User,
      {
        model: TodoTask,
        separate: true,
        include: [User],
        order: [['order', 'ASC']],
      },
      {
        model: TodoListOwner,
        include: [
          {
            model: User,
            as: 'user',
          },
        ],
      },
    ];
  }

  async findAll(): Promise<TodoList[]> {
    const lists = await this.todoListDb.findAll<TodoList>({
      include: TodoListService.includeModels(),
      order: [['created_at', 'DESC']],
    });
    return lists;
  }

  async findOne(id: string): Promise<TodoList> {
    const todoList = await this.todoListDb.findOne<TodoList>({
      where: {
        id,
      },
      include: TodoListService.includeModels(),
    });
    if (!todoList) {
      throw new HttpException('No todo list found', HttpStatus.NOT_FOUND);
    }
    return todoList;
  }

  async create(data: TodoListCreateDto, user: User): Promise<TodoList> {
    let todoList;
    await this.sequelize.transaction(async (transaction) => {
      const { tasks, ...todoListData } = data;
      todoList = new TodoList(todoListData);
      const res = await todoList.save({ transaction });
      if (res?.id == null) {
        throw new HttpException(
          'There was an error during creation process',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      await this.todoTaskService.createBulk(todoList, tasks, user, transaction);
      await this.todoListOwnerService.create(
        todoList,
        user.id,
        user,
        transaction,
      );
    });
    // load with all linked data
    return this.findOne(todoList.id);
  }

  async share(
    todoListId: string,
    userId: string,
    author: User,
  ): Promise<boolean> {
    const todoList = await this.findOne(todoListId);
    const newOwner = await this.todoListOwnerService.create(
      todoList,
      userId,
      author,
    );
    return !!newOwner;
  }

  async delete(id: string): Promise<boolean> {
    const todoList = await this.findOne(id);
    await todoList.destroy();
    return true;
  }

  async deleteOwner(todoList: TodoList, userId: string): Promise<boolean> {
    const owner = await this.todoListOwnerService.find(todoList.id, userId);
    if (owner) {
      await owner.destroy();
    }
    return true;
  }
}
