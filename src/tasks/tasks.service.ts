import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async updateTaskStatusById(
    id: number,
    status: TasksStatus,
    user: User,
  ): Promise<Task> {
    const result = await this.taskRepository.update(
      { id, userId: user.id },
      { status },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return await this.getTaskById(id, user);
  }
}
