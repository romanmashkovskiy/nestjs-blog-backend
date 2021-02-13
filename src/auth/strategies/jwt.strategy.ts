import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from '../../users/user.entity';
import { AuthService } from '../auth.service';
import { getTokenCookie } from '../../utils/auth-cookies';

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

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.authService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
