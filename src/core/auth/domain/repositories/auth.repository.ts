import { Prisma } from '@prisma/client';
import { User } from '../entities/auth.entity';

export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract save(user: User, tx?: Prisma.TransactionClient): Promise<User>;
}
