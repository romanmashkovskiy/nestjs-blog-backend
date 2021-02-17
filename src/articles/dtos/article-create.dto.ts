import { IsNotEmpty } from 'class-validator';

export class ArticleCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  markdown: string;
}
