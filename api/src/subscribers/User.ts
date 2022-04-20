import { User } from '@kibbel/entities';
import { hash } from 'bcrypt';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
} from 'typeorm';

// Import Environment Variables
const SALT_ROUNDS = !!Number(process.env.SALT_ROUNDS)
  ? Number(process.env.SALT_ROUNDS)
  : 10;

@EventSubscriber()
class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Hash a User’s password
   *
   * @Remarks
   * Checks data transfer object has password field (entity.password) and overwrites the password with its hashed value.
   *
   * @param entity - A @see {@link User Class} data transfer object
   *
   * @returns Promise<void>
   */
  private async hashPassword(entity: User): Promise<void> {
    if (entity.password)
      entity.password = await hash(entity.password, SALT_ROUNDS);
  }

  /**
   * Called before user insertion.
   */
  async beforeInsert({ entity }: InsertEvent<User>): Promise<void> {
    await this.hashPassword(entity);
  }

  /**
   * Called before user update.
   */
  async beforeUpdate({ entity }: UpdateEvent<User>): Promise<void> {
    await this.hashPassword(entity as User);
  }
}

export { UserSubscriber };
