import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id!: string;

  @ApiProperty({ example: 'Inception' })
  title!: string;

  @ApiProperty({ example: 'Sci-Fi' })
  genre!: string;

  @ApiProperty({ example: ['Actor A', 'Actor B'] })
  actors!: string[];

  @ApiProperty({ example: 148 })
  duration!: number;

  @ApiProperty({ example: 'Movie description here' })
  description?: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;
}