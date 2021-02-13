import { IsDefined, IsEmail } from 'class-validator';

export class AuthVerifyEmailSendCodeDto {
  @IsDefined()
  @IsEmail()
  email: string;
}
