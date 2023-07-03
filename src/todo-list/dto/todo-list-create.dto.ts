import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { TodoTaskCreateDto } from 'src/todo-task/dto/todo-task-create.dto';

@ApiExtraModels(TodoTaskCreateDto)
export class TodoListCreateDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({
    minimum: 4,
  })
  title: string;

  @ApiProperty({
    name: 'tasks',
    type: 'array',
    items: {
      allOf: [{ $ref: getSchemaPath(TodoTaskCreateDto) }],
    },
  })
  tasks: TodoTaskCreateDto[];

  authorId: string;
}
