import { Role } from 'generated/prisma';
import { Email } from './value-objects/user-email.vo';

export interface UserProps {
  id?: string;
  name: string;
  email: Email;
  role: Role;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }
  get role(): string {
    return this.props.role;
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      role: this.role,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
