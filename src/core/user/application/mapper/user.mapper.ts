import { User } from '../../domain/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.getValue(),
      role: user.toPrimitives().role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
