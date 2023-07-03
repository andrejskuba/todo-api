import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TodoTask, TodoTaskStatus } from './todo-task.model';
import { TodoList } from 'src/todo-list/todo-list.model';
import { User } from 'src/user/user.model';
import { Transaction } from 'sequelize';
import { TodoTaskCreateDto } from './dto/todo-task-create.dto';
import { TodoTaskUpdateDto } from './dto/todo-task-update.dto';

@Injectable()
export class TodoTaskService {
  constructor(
    @Inject('TodoTaskDb')
    private readonly todoTaskDb: typeof TodoTask,
  ) {}

  async create(
    todoList: TodoList,
    data: TodoTaskCreateDto,
    user: User,
  ): Promise<TodoTask> {
    const todoTask = new TodoTask({
      status: TodoTaskStatus.ACTIVE,
      ...data,
      todoListId: todoList.id,
      authorId: user.id,
      order: todoList.tasks.length + 1,
    });
    const res = await todoTask.save();
    if (res?.id == null) {
      throw new HttpException(
        'There was an error during creation process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return todoTask;
  }

  async createBulk(
    todoList: TodoList,
    tasks: TodoTaskCreateDto[],
    user: User,
    transaction: Transaction,
  ): Promise<TodoTask[]> {
    if (!tasks?.length) {
      return [];
    }
    return this.todoTaskDb.bulkCreate(
      tasks.map((task, idx) => ({
        status: TodoTaskStatus.ACTIVE,
        todoListId: todoList.id,
        authorId: user.id,
        order: idx + 1,
        ...task,
      })),
      { transaction },
    );
  }

  async update(
    id: string,
    data: TodoTaskUpdateDto,
    user: User,
  ): Promise<TodoTask> {
    const task = await this.todoTaskDb.findByPk<TodoTask>(id);
    if (!task) {
      throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
    }
    task.status = data.status || task.status;
    task.title = data.title || task.title;
    task.description = data.description || task.description;
    task.deadline = data.deadline || task.deadline;
    task.authorId = user.id;

    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.todoTaskDb.findByPk<TodoTask>(id);
    if (!task) {
      throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
    } else {
      await task.destroy();
    }
    return true;
  }
}
