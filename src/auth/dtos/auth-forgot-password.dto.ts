import { IsDefined, IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @IsDefined()
  @IsEmail()
  email: string;
}
