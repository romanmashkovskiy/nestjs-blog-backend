import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';
import { randomBytes } from 'crypto';
import { Request as Req, Response as Res } from 'express';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { removeTokenCookie, setTokenCookie } from '../utils/auth-cookies';
import {
  AuthForgotPasswordDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  AuthVerifyEmailCheckCodeDto,
  AuthVerifyEmailSendCodeDto,
} from './dtos';
import { JwtPayload } from './interfaces';

const resetPasswordConfig = config.get('resetPassword');

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(req: Req, res: Res): Promise<{ user: Partial<User> }> {
    const { user } = req;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { id, email } = user;

    const payload: JwtPayload = { id, email };

    const accessToken = await this.jwtService.sign(payload);
    setTokenCookie(res, accessToken);
    this.logger.debug(`Generated JWT with payload ${JSON.stringify(payload)}`);

    return { user };
  }

  async register(
    authRegisterDto: AuthRegisterDto,
  ): Promise<{ message: string }> {
    const validateEmailToken = randomBytes(20).toString('hex');
    const date = new Date();
    date.setTime(date.getTime() + resetPasswordConfig.expiresIn * 60 * 60);
    const validateEmailTokenExpires = date;

    await this.usersService.create({
      ...authRegisterDto,
      validateEmailToken,
      validateEmailTokenExpires,
    });

    console.log(
      `http://localhost:3000/account-activate?token=${validateEmailToken}`,
    );

    return { message: 'success' };
  }

  async verifyEmailCheckCode(
    authVerifyEmailCheckCodeDto: AuthVerifyEmailCheckCodeDto,
  ): Promise<{ message: string }> {
    const { token } = authVerifyEmailCheckCodeDto;
    const user = await this.usersService.findUser({
      validateEmailToken: token,
    });

    if (!user) {
      throw new UnprocessableEntityException('Link is invalid');
    }

    await this.usersService.update(user.id, {
      validateEmailToken: null,
      validateEmailTokenExpires: null,
      isEmailVerified: true,
    });

    return { message: 'success' };
  }

  async verifyEmailSendCode(
    authVerifyEmailSendCodeDto: AuthVerifyEmailSendCodeDto,
  ): Promise<{ message: string }> {
    const { email } = authVerifyEmailSendCodeDto;
    const user = await this.usersService.findUser({ email });

    if (!user || (user && user.isEmailVerified)) {
      throw new NotFoundException('Not found');
    }

    const validateEmailToken = randomBytes(20).toString('hex');
    const date = new Date();
    date.setTime(date.getTime() + resetPasswordConfig.expiresIn * 60 * 60);
    const validateEmailTokenExpires = date;

    await this.usersService.update(user.id, {
      validateEmailToken,
      validateEmailTokenExpires,
    });

    console.log(
      `http://localhost:3000/account-activate?token=${validateEmailToken}`,
    );

    return { message: 'success' };
  }

  logout(req: Req, res: Res): { message: string } {
    removeTokenCookie(res);
    return { message: 'success' };
  }

  async forgotPassword(
    authForgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = authForgotPasswordDto;
    const user = await this.usersService.findUser({ email });

    if (!user) {
      throw new NotFoundException('Not found');
    }

    const resetPasswordToken = randomBytes(20).toString('hex');
    const date = new Date();
    date.setTime(date.getTime() + resetPasswordConfig.expiresIn * 60 * 60);
    const resetPasswordTokenExpires = date;

    await this.usersService.update(user.id, {
      resetPasswordToken,
      resetPasswordTokenExpires,
    });

    console.log(
      `http://localhost:3000/restore-password?token=${resetPasswordToken}`,
    );

    return { message: 'success' };
  }

  async resetPassword(
    authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password } = authResetPasswordDto;
    const user = await this.usersService.findUser({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new UnprocessableEntityException('Link is invalid');
    }

    await this.usersService.update(user.id, {
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
      password,
    });

    return { message: 'success' };
  }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.findUser({ email });
    //TODO: why tasks are not returned
    console.log(user);
    if (user && (await user.validatePassword(password))) {
      return this.returnUser(user);
    }
    return null;
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.usersService.findById(id);
    //TODO: why tasks are not returned
    console.log(user);
    if (user) {
      return this.returnUser(user);
    }
    return null;
  }

  private returnUser(user: User): Partial<User> {
    const {
      password,
      resetPasswordToken,
      resetPasswordTokenExpires,
      validateEmailToken,
      validateEmailTokenExpires,
      ...result
    } = user;
    return result;
  }
}
