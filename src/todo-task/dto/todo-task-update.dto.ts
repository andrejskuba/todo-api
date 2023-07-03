import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoTaskStatus } from '../todo-task.model';

export class TodoTaskUpdateDto {
  @IsOptional()
  @IsEnum(TodoTaskStatus)
  @ApiProperty({ enum: TodoTaskStatus })
  status: TodoTaskStatus = TodoTaskStatus.ACTIVE;

  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  deadline: Date;
}
