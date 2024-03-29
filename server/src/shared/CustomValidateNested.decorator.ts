import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments,
    validateSync,
} from 'class-validator';
import {plainToInstance, Transform} from "class-transformer";
import { plainToClass } from 'class-transformer';

/**
 * @decorator
 * @description A custom decorator to validate a validation-schema within a validation schema upload N levels
 * @param schema The validation Class
 */
export function CustomValidateNested(
    schema: new () => any,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'ValidateNested',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    args.value;
                    if (Array.isArray(value)) {
                        for (let i = 0; i < (<Array<any>>value).length; i++) {
                            if (validateSync(plainToInstance(schema, value[i])).length) {
                                return false;
                            }
                        }
                        return true;
                    } else
                        return validateSync(plainToInstance(schema, value)).length
                            ? false
                            : true;
                },
                defaultMessage(args) {
                    if (Array.isArray(args.value)) {
                        for (let i = 0; i < (<Array<any>>args.value).length; i++) {
                            return (
                                `${args.property}::index${i} -> ` +
                                validateSync(plainToInstance(schema, args.value[i]))
                                    .map((e) => e.constraints)
                                    .reduce((acc, next) => acc.concat(Object.values(next)), [])
                            ).toString();
                        }
                    } else
                        return (
                            `${args.property}: ` +
                            validateSync(plainToInstance(schema, args.value))
                                .map((e) => e.constraints)
                                .reduce((acc, next) => acc.concat(Object.values(next)), [])
                        ).toString();
                },
            },
        });
    };
}