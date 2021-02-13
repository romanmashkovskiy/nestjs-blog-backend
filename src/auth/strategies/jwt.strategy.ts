import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as config from 'config';
import { Strategy } from 'passport-jwt';

import { User } from '../../users/user.entity';
import { getTokenCookie } from '../../utils/auth-cookies';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: getTokenCookie,
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    const { id } = payload;

    const user = await this.authService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
