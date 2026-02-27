import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
// import { Role } from 'generated/prisma';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'Kyaw' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'kyaw@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Secret password for the user account',
    example: '123456',
  })
  @IsString()
  password!: string;

  @IsString()
  @ApiProperty({ example: 'user', description: 'Role of the user' })
  role!: Role;
}
