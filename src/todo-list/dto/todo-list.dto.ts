import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { TodoList } from '../todo-list.model';
import { UserDto } from 'src/user/dto/user.dto';
import { TodoTaskDto } from 'src/todo-task/dto/todo-task.dto';
import { TodoListOwner } from 'src/todo-list-owner/todo-list-owner.model';

@ApiExtraModels(TodoTaskDto)
export class TodoListDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly author: UserDto;

  @ApiProperty()
  readonly title: string;

  @ApiProperty({
    type: 'array',
    items: {
      allOf: [{ $ref: getSchemaPath(TodoTaskDto) }],
    },
  })
  readonly tasks: TodoTaskDto[];

  /*
  @ApiProperty({
    type: 'array',
    items: {
      allOf: [{ $ref: getSchemaPath(TodoListOwnerDto) }],
    },
  })
  */
  readonly owners: TodoListOwner[];

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  constructor(todoList: TodoList) {
    this.id = todoList.id;
    this.author = new UserDto(todoList.author);
    this.title = todoList.title;
    this.tasks = todoList.tasks.map((task) => new TodoTaskDto(task));
    this.createdAt = todoList.createdAt;
    this.updatedAt = todoList.updatedAt;
  }
}
