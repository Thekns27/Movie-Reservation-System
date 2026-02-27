import { Email } from 'src/core/user/domain/value-objects/user-email.vo';

export interface UserProps {
  id?: string;
  name: string;
  email: Email;
  passcode: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public isDeleted: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: Partial<User>): User {
    return new User(
      props.id!,
      props.name!,
      props.email!,
      props.password!,
      props.isDeleted ?? false,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
