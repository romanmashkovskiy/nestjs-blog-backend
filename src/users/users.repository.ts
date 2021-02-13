import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto, UserUpdateDto } from './dtos';
import { UserFindQueryInterface } from '../auth/interfaces';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(userCreateDto: UserCreateDto): Promise<void> {
    const {
      email,
      password,
      firstName,
      lastName,
      validateEmailToken,
      validateEmailTokenExpires,
    } = userCreateDto;

    const user = this.create();
    user.email = email;
    user.username = 'test';
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await this.hashPassword(password);
    user.validateEmailToken = validateEmailToken;
    user.validateEmailTokenExpires = validateEmailTokenExpires;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with such email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<void> {
    const { password } = userUpdateDto;

    let hashedPassword;
    if (password) {
      hashedPassword = await this.hashPassword(password);
    }

    await this.update(id, {
      ...userUpdateDto,
      ...(hashedPassword && { password: hashedPassword }),
    });
  }

  async findUser(userFindQuery: UserFindQueryInterface): Promise<User> {
    const { email, validateEmailToken, resetPasswordToken } = userFindQuery;

    const query = this.createQueryBuilder('user');

    if (email) {
      query.andWhere('user.email = :email', { email });
    }

    if (validateEmailToken) {
      query
        .andWhere('user.validateEmailToken = :validateEmailToken', {
          validateEmailToken,
        })
        .andWhere('user.validateEmailTokenExpires > :currentDate', {
          currentDate: new Date(),
        });
    }

    if (resetPasswordToken) {
      query
        .andWhere('user.resetPasswordToken = :resetPasswordToken', {
          resetPasswordToken,
        })
        .andWhere('user.resetPasswordTokenExpires > :currentDate', {
          currentDate: new Date(),
        });
    }

    return query.getOne();
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
