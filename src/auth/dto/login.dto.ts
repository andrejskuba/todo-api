import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({
    minimum: 4,
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    nullable: false,
  })
  password: string;
}
