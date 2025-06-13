import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsStartsWith0x(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'is0xString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' && value.startsWith('0x');
        },
        defaultMessage(_args: ValidationArguments) {
          return `${propertyName} must be a string starting with 0x`;
        },
      },
    });
  };
}
