import { AuthChecker } from 'type-graphql';
import Context from '../Context';
import { verifyAccessToken } from './token';

const authChecker: AuthChecker<Context> = ({ context: { request } }) => {
  // Verify request contains an “Authorization” header
  const { authorization } = request.headers;
  if (!authorization) {
    return false;
  }

  // Verify “Authorization” header is from a valid user
  return !!verifyAccessToken(authorization);
};

export default authChecker;
export { authChecker };
