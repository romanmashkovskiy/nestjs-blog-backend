import { IsDefined, IsNotEmpty } from 'class-validator';

export class AuthVerifyEmailCheckCodeDto {
  @IsDefined()
  @IsNotEmpty()
  token: string;
}
