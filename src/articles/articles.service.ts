import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import {
  ArticleCreateDto,
  ArticleUpdateDto,
  GetArticlesFilterDto,
} from './dtos';
import { User } from '../users/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleRepository)
    private articleRepository: ArticleRepository,
  ) {}

  getArticles(filterDto: GetArticlesFilterDto): Promise<Article[]> {
    return this.articleRepository.getArticles(filterDto);
  }

  createArticle(
    articleCreateDto: ArticleCreateDto,
    user: User,
  ): Promise<Article> {
    return this.articleRepository.createArticle(articleCreateDto, user);
  }

  getMyArticles(
    filterDto: GetArticlesFilterDto,
    user: User,
  ): Promise<Article[]> {
    return this.articleRepository.getMyArticles(filterDto, user);
  }

  async getArticleById(id: number): Promise<Article> {
    const found = await this.articleRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return found;
  }

  async getMyArticleById(id: number, user: User): Promise<Article> {
    const found = await this.articleRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return found;
  }

  async deleteMyArticleById(
    id: number,
    user: User,
  ): Promise<{ message: string }> {
    const result = await this.articleRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return { message: 'success' };
  }

  async updateMyArticleById(
    id: number,
    user: User,
    articleUpdateDto: ArticleUpdateDto,
  ): Promise<Article> {
    const result = await this.articleRepository.update(
      { id, userId: user.id },
      { ...articleUpdateDto },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return await this.getMyArticleById(id, user);
  }
}
