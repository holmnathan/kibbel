import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../entities';

@ValidatorConstraint({ async: true })
class IsUserUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: any, args: ValidationArguments) {
    const user = await User.findOne({ email });
    if (user) return false;
    return true;
  }
}
const IsUserUnique = (validationOptions?: ValidationOptions) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserUniqueConstraint,
    });
  };
};

export { IsUserUnique, IsUserUniqueConstraint };
