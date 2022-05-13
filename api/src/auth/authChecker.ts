import type { IContext } from '@kibbel/Context';
import type { AuthChecker } from 'type-graphql';

const authChecker: AuthChecker<IContext> = ({ context: { user } }) => {
  return !!user;
};

export { authChecker };
