import type { AuthChecker } from 'type-graphql';
import type Context from '@kibbel/Context';
import { verifyToken } from '@kibbel/auth';

const authChecker: AuthChecker<Context> = ({ context: { request } }) => {
  // Verify request contains an “Authorization” header
  const { authorization } = request.headers;
  if (!authorization) {
    return false;
  }

  // Verify “Authorization” header is from a valid user
  return !!verifyToken({ token: authorization, tokenType: 'ACCESS' });
};

export default authChecker;
export { authChecker };
