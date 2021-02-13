import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRegisterDto {
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
}
