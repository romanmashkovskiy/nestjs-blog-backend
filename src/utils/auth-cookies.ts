import * as config from 'config';
import { parse, serialize } from 'cookie';

const jwtConfig = config.get('jwt');

const TOKEN_NAME = 'token';

export const setTokenCookie = (res, token) => {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: jwtConfig.expiresIn,
    expires: new Date(Date.now() + jwtConfig.expiresIn * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
  });

  res.setHeader('Set-Cookie', cookie);
};

export const removeTokenCookie = (res) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
};

export const parseCookies = (req) => {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
};

export const getTokenCookie = (req) => {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
};
