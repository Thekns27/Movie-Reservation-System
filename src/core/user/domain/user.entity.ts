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

  get role(): Role {
    return this.props.role;
  }


  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      role: this.props.role,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  update(props: Partial<Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (props.name) this.props.name = props.name;
    if (props.email) this.props.email = props.email;
    if (props.role) this.props.role = props.role;
    if (props.password) this.props.password = props.password;
    this.props.updatedAt = new Date();
  }
}
