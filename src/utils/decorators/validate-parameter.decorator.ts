import {plainToClass, plainToInstance} from "class-transformer";
import {validateSync, ValidationOptions, ValidatorOptions} from "class-validator";
import {BadRequestException} from "@nestjs/common";
import "reflect-metadata"

const validateMetadataKey = Symbol("validate")

export function ApplyValidation(inputClass: new (...args:any[])=> any, options?:ValidationOptions) {
    return function (target:any, property:string|symbol, descriptor:PropertyDescriptor) {
        const originalMethod = target[property];
        target[property] = function (...args:any[]) {
            const argumentsToValidate = Reflect.getOwnMetadata(validateMetadataKey, target, property);
            for (const index of argumentsToValidate) {
                const value = args[index];
                console.log("before validation")
                const validatedObject = plainToInstance(inputClass, value);
                const errors = validateSync(validatedObject, options);
                if(errors.length > 0) throw new BadRequestException(`Validation failed: ${errors.map(error => Object.values(error.constraints || {})).flat().join(', ')}`)
                console.log("after validation")
            }
            return originalMethod.apply(this, args);
        }
    }
}

export function validateParameter(target:any, propertyKey:string, index:number) {
    const existingRequiredParameters = Reflect.getOwnMetadata(validateMetadataKey, target, propertyKey) ?? [];
    existingRequiredParameters.push(index);
    Reflect.defineMetadata(validateMetadataKey, existingRequiredParameters, target, propertyKey);
}


