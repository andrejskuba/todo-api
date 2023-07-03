import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TodoListShareDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  userId: string;
}
