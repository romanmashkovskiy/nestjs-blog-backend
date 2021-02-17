import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '../users/user.entity';
import { Article } from './article.entity';
import { ArticleCreateDto, GetArticlesFilterDto } from './dtos';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  private logger = new Logger('ArticleRepository');

  async getArticles(filterDto: GetArticlesFilterDto): Promise<Article[]> {
    const { search } = filterDto;

    const query = this.createQueryBuilder('article');

    if (search) {
      query.andWhere(
        '(article.title LIKE :search OR article.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get articles, DTO: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createArticle(
    articleCreateDto: ArticleCreateDto,
    user: User,
  ): Promise<Article> {
    const { title, description, markdown } = articleCreateDto;

    const article = new Article();

    article.title = title;
    article.description = description;
    article.markdown = markdown;
    article.user = user;

    try {
      await article.save();
    } catch (error) {
      this.logger.error(
        `Failed to create article for user "${user.firstName} ${
          user.lastName
        }", DTO: ${JSON.stringify(articleCreateDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete article.user;
    return article;
  }

  async getMyArticles(
    filterDto: GetArticlesFilterDto,
    user: User,
  ): Promise<Article[]> {
    const { search } = filterDto;

    const query = this.createQueryBuilder('article');

    query.andWhere('article.userId = :userId', { userId: user.id });

    if (search) {
      query.andWhere(
        '(article.title LIKE :search OR article.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get articles for user "${user.firstName} ${
          user.lastName
        }", DTO: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
