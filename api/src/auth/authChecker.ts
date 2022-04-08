import { getBearerToken, verifyToken } from '@kibbel/auth';
import type Context from '@kibbel/Context';
import type { AuthChecker } from 'type-graphql';

const authChecker: AuthChecker<Context> = ({ context: { request } }) => {
  // Verify request contains an “Authorization” header
  const { authorization } = request.headers;
  const token = getBearerToken(authorization);
  if (!token) return false;

  // Verify “Authorization” header is from a valid user
  return !!verifyToken({ token, tokenType: 'ACCESS' });
};

export default authChecker;
export { authChecker };
