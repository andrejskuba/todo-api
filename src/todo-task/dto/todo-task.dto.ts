import { ApiProperty } from '@nestjs/swagger';
import { TodoTask, TodoTaskStatus } from '../todo-task.model';
import { UserDto } from 'src/user/dto/user.dto';

export class TodoTaskDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ enum: TodoTaskStatus })
  readonly status: TodoTaskStatus;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly deadline: Date;

  @ApiProperty()
  readonly author: UserDto;

  @ApiProperty()
  readonly order: number;

  constructor(todoTask: TodoTask) {
    this.id = todoTask.id;
    this.status = todoTask.status;
    this.title = todoTask.title;
    this.description = todoTask.description;
    this.deadline = todoTask.deadline;
    this.author = new UserDto(todoTask.author);
    this.order = todoTask.order;
  }
}
