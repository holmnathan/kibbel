import { sign, verify } from 'jsonwebtoken';
import { User } from '../entities';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const createRefreshToken = ({ id, email }: User) => {
  const refreshToken = sign(
    { id, email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Expires in 7 days
  );
  return refreshToken;
};

const createAccessToken = ({ id, email }: User) => {
  const accessToken = sign(
    { id, email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: 900 } // 15 minutes in seconds
  );
  return accessToken;
};

const verifyAccessToken = (jwtToken: string) => {
  try {
    const payload = verify(jwtToken, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    console.log(error);
  }
};

export { createAccessToken, createRefreshToken, verifyAccessToken };
