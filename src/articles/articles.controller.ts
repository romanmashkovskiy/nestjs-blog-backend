import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../auth/decorators';
import { User } from '../users/user.entity';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import {
  ArticleCreateDto,
  ArticleUpdateDto,
  GetArticlesFilterDto,
} from './dtos';

@Controller()
export class ArticlesController {
  private logger = new Logger('ArticlesController');

  constructor(private articlesService: ArticlesService) {}

  @Get('/articles')
  getArticles(
    @Query(ValidationPipe) filterDto: GetArticlesFilterDto,
  ): Promise<Article[]> {
    return this.articlesService.getArticles(filterDto);
  }

  @Post('/articles')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createArticle(
    @Body() articleCreateDto: ArticleCreateDto,
    @GetUser() user: User,
  ): Promise<Article> {
    this.logger.verbose(
      `User "${user.firstName} ${
        user.lastName
      }" creating a new article. Data: ${JSON.stringify(articleCreateDto)}`,
    );
    return this.articlesService.createArticle(articleCreateDto, user);
  }

  @Get('/my-articles')
  @UseGuards(AuthGuard())
  getMyArticles(
    @Query(ValidationPipe) filterDto: GetArticlesFilterDto,
    @GetUser() user: User,
  ): Promise<Article[]> {
    this.logger.verbose(
      `User "${user.firstName} ${
        user.lastName
      }" retrieving his/her articles. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.articlesService.getMyArticles(filterDto, user);
  }

  @Get('/articles/:id')
  getArticleById(@Param('id', ParseIntPipe) id: number): Promise<Article> {
    return this.articlesService.getArticleById(id);
  }

  @Get('/my-articles/:id')
  @UseGuards(AuthGuard())
  getMyArticleById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articlesService.getMyArticleById(id, user);
  }

  @Delete('/my-articles/:id')
  @UseGuards(AuthGuard())
  deleteMyArticleById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.articlesService.deleteMyArticleById(id, user);
  }

  @Patch('/my-articles/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  updateMyArticleById(
    @Param('id', ParseIntPipe) id: number,
    @Body() articleUpdateDto: ArticleUpdateDto,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articlesService.updateMyArticleById(id, user, articleUpdateDto);
  }
}
