import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Unique ID of the user' })
  id!: string;

  @ApiProperty({ example: 'Kyaw', description: 'Full name of the user' })
  name!: string;

  @ApiProperty({
    example: 'kyaw@example.com',
    description: 'Email of the user',
  })
  email!: string;

  @ApiProperty({ example: 'user', description: 'Role of the user' })
  role!: string;

  @ApiProperty({ description: 'Date the user was created' })
  createdAt!: Date;

  @ApiProperty({ description: 'Date the user was last updated' })
  updatedAt!: Date;
}
