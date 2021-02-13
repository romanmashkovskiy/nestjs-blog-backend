import {
  IsDefined,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthResetPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, {
    message: 'password too weak',
  })
  password: string;

  @IsDefined()
  @IsNotEmpty()
  token: string;
}
