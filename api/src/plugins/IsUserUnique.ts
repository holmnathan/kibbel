import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '@kibbel/entities';

@ValidatorConstraint({ async: true })
class IsUserUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: any, _args: ValidationArguments) {
    const user = await User.findOne({ email });
    if (user) return false;
    return true;
  }
}
const IsUserUnique = (options?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: options ?? {},
      constraints: [],
      validator: IsUserUniqueConstraint,
    });
  };
};

export { IsUserUnique, IsUserUniqueConstraint };
