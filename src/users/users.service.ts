import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserFindQueryInterface } from '../auth/interfaces/user-find-query.interface';
import { UserCreateDto, UserUpdateDto } from './dtos';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findUser(userFindQuery: UserFindQueryInterface): Promise<User> {
    return this.usersRepository.findUser(userFindQuery);
  }

  async create(userCreateDto: UserCreateDto): Promise<void> {
    await this.usersRepository.createUser(userCreateDto);
  }

  async update(id: number, userUpdateDto: UserUpdateDto): Promise<void> {
    await this.usersRepository.updateUser(id, userUpdateDto);
  }
}
