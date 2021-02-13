import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, {
    message: 'password too weak',
  })
  password: string;

  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  resetPasswordToken?: string;

  @IsDate()
  resetPasswordTokenExpires?: Date;

  @IsString()
  validateEmailToken?: string;

  @IsString()
  validateEmailTokenExpires?: Date;

  @IsBoolean()
  isEmailVerified?: boolean;
}
