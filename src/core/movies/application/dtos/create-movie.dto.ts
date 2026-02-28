import { IsArray, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class CreateUserDto {
//   // id,title,genre,actors,duration,description,isActive
//   @ApiProperty({ description: 'Title name of the movie', example: 'Deadpool' })
//   @IsNotEmpty()
//   title!: string;

//   @ApiProperty({
//     description: 'Genre of the movie',
//     example: 'Deadpool',
//   })
//   @IsEmail()
//   genre!: string;

//   @ApiProperty({
//     description: 'Actors of name ',
//     example: 'Daung',
//   })
//   @IsString()
//   actors!: string;

//   @ApiProperty({
//     description: 'Duration of the movie in minutes',
//     example: '120',
//   })
//   @IsString()
//   duration!: number;

//   @ApiProperty({
//     description: 'Description of the movie',
//     example: 'This is a movie about a superhero named Deadpool.',
//   })
//   @IsString()
//   description!: string;

//   @ApiProperty({
//     description: 'Whether the movie is active or not',
//     example: true,
//   })
//   @IsBoolean()
//   isActive!: boolean;
// }


export class CreateMovieDto {
  @ApiProperty({ example: 'Inception', description: 'Title of the movie' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Sci-Fi', description: 'Genre of the movie' })
  @IsString()
  @IsNotEmpty()
  genre!: string;

  @ApiProperty({
    example: ['Leonardo DiCaprio', 'Cillian Murphy'],
    description: 'List of actors'
  })
  @IsArray()
  @IsString({ each: true })
  actors!: string[];

  @ApiProperty({ example: 148, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiPropertyOptional({
    example: 'A thief who steals corporate secrets...',
    description: 'Short summary'
  })
  @IsString()
  @IsOptional()
  description?: string;
}
