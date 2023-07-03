import { IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoTaskStatus } from '../todo-task.model';

export class TodoTaskCreateDto {
  @IsEnum(TodoTaskStatus)
  @ApiProperty({ enum: TodoTaskStatus })
  status: TodoTaskStatus = TodoTaskStatus.ACTIVE;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  deadline: Date;
}
