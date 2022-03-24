import { AuthChecker } from 'type-graphql';
import Context from '../Context';
import { verifyToken } from './token';

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
