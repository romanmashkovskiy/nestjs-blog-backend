import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';

import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import {
  AuthForgotPasswordDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  AuthVerifyEmailCheckCodeDto,
  AuthVerifyEmailSendCodeDto,
} from './dtos';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req: Req,
    @Response({ passthrough: true }) res: Res,
  ): Promise<{ user: Partial<User> }> {
    return this.authService.login(req, res);
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  register(
    @Body() authRegisterDto: AuthRegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(authRegisterDto);
  }

  @Post('/verify-email/check-code')
  @UsePipes(ValidationPipe)
  verifyEmailCheckCode(
    @Body() authVerifyEmailCheckCodeDto: AuthVerifyEmailCheckCodeDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyEmailCheckCode(authVerifyEmailCheckCodeDto);
  }

  @Post('/verify-email/send-code')
  @UsePipes(ValidationPipe)
  verifyEmailSendCode(
    @Body() authVerifyEmailSendCodeDto: AuthVerifyEmailSendCodeDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyEmailSendCode(authVerifyEmailSendCodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  logout(
    @Request() req: Req,
    @Response({ passthrough: true }) res: Res,
  ): { message: string } {
    return this.authService.logout(req, res);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  forgotPassword(
    @Body() authForgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(authForgotPasswordDto);
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  resetPassword(
    @Body() authResetPasswordDto: AuthResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(authResetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
