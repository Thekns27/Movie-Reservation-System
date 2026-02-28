


// import { User } from "@user/domain/user.entity";
// import { UserRepository } from "@user/domain/user.repository";
// import { Email } from "@user/domain/value-objects/user-email.vo";
// import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserRepository } from "../domain/user.repository";
import { PrismaService } from "src/core/infrastructure/prisma/prisma.service";
import { User } from "../domain/user.entity";
import { PaginationMeta } from "src/common/dto/response/response.dto";
import { Email } from "../domain/value-objects/user-email.vo";
// import { PaginationMeta } from "@dto/response/response.dto";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<{ data: User[]; paginateMeta?: PaginationMeta }> {
    const record = await this.prisma.user.paginate({
      limit: 10,
      page: 1,
    });
    return {
      data: record ? this.toDomainList(record.data) : [],
      paginateMeta: record?.meta,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(user: User, tx?: Prisma.TransactionClient): Promise<User> {
    const data = user.toPrimitives();
    const record = await (tx || this.prisma.baseClient).user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });
    return this.toDomain(record);
  }

  private toDomain(record: any): User {
    return User.create({
      id: record.id,
      name: record.name,
      email: Email.create(record.email),
      password: record.password,
      role: record.role,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toDomainList(records: any[]): User[] {
    return records.map(record => this.toDomain(record));
  }
}
