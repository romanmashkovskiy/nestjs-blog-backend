import { IsDefined, IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
