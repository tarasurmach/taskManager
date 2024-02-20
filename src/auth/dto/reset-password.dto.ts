import {IsString, Matches, MaxLength, MinLength, registerDecorator, ValidationArguments} from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;


    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Match('password', 'Passwords do not match' )
    password2: string;
}

export function Match<T extends any = Object>(key:keyof T, message?:string) {
    return (object:any, propName:string) => {
        registerDecorator({
            name:"Match",
            target: object.constructor,
            propertyName:propName,
            constraints:[key],
            validator:{
                validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
                    const [relatedPropertyName] = validationArguments.constraints;
                    const relatedValue = validationArguments.object[relatedPropertyName];
                    return relatedValue === value
                },
                defaultMessage(validationArguments?: ValidationArguments): string {
                    const [relatedPropertyName] = validationArguments.constraints;
                    return message ?? `${propName} must match ${relatedPropertyName}`
                }
            }
        })
    }
}