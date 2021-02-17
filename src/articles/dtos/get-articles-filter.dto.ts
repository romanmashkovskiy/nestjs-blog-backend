import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetArticlesFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
