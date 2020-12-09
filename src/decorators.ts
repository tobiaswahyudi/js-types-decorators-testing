import { DecoratedTypeError } from './DecoratedTypeError';

/***************************************
 *  Logging Decorators
 * ***************************************

    When the class declarations are evaluated, the ParameterDecorators are run first, then the
    MethodDecorators.

    Method decorators can return a modified descriptor or modify them directly, due to shallow copies.
    Parameter decorators cannot return any value (or any returned value is ignored). In the type checking
    decorators, we attach metadata (checker functions) to the class prototype.

    https://www.typescriptlang.org/docs/handbook/decorators.html
*/

export const Logged: MethodDecorator = (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const origMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Function ${propertyKey} is called with args: `, args);
    return origMethod.apply(this, args);
  };
}

export const LogAtInit: MethodDecorator = (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log("Method Decorator:")
  console.log("target:", target);
  console.log("propertyKey:", propertyKey);
  console.log("descriptor:", descriptor);
  console.log();
}

export const LogParamAtInit: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  console.log("Parameter Decorator:")
  console.log("target:", target);
  console.log("propertyKey:", propertyKey);
  console.log("parameterIndex:", parameterIndex);
  console.log();
}

/***************************************
 *  JS-level Type Checking Decorators
 **************************************

 The param annotations attach checker functions to

 */


const METHOD_CHECKERS_KEY = "_DecoratorTypesMethodChecker";

const InitializeMethodCheckersArray = (target: object, propertyKey: string) => {
  if (!Object.getOwnPropertyDescriptor(target, METHOD_CHECKERS_KEY)) {
    // Define an empty <PropertyKey, Validator[]> map for the object prototype.
    Object.defineProperty(target, METHOD_CHECKERS_KEY, {
      value: {}
    });
  }
  const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_CHECKERS_KEY)
  if (propDescriptor?.value && !propDescriptor.value[propertyKey]) {
    // In the Method Checkers map, define a Validator[] array for each PropertyKey.
    propDescriptor.value[propertyKey] = [];
  } else {
    throw new Error(`Unable to initialize param checkers array to method ${propertyKey}.`);
  }
}

const AddMethodParameterChecker = <T>(target: object, propertyKey: string, parameterIndex: number, checker: (arg: T) => boolean) => {
  const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_CHECKERS_KEY)
  if (!propDescriptor?.value || !propDescriptor.value[propertyKey]) {
    throw new Error(`Unable to add parameter ${parameterIndex} checker to method ${propertyKey}.`);
  }
  propDescriptor.value[propertyKey][parameterIndex] = checker;
}



export const ValidateParamTypes: MethodDecorator = (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  const origMethod = descriptor.value;
  const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_CHECKERS_KEY);
  if (!propDescriptor?.value || !propDescriptor.value[propertyKey]) {
    console.warn(`Function ${propertyKey} was annotated @ValidateParamTypes but no param checkers were found.`);
    return;
  }
  const checkers = [...propDescriptor.value[propertyKey]];
  descriptor.value = function (...args: any[]) {
    checkers.forEach(
      (checker, idx) => {
        if (!checker(args[idx])) {
          throw new DecoratedTypeError(`Function ${propertyKey}:\nParameter at index ${idx} failed type check.`);
        }
      }
    )
    return origMethod.apply(this, args);
  };
}

export const String: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  InitializeMethodCheckersArray(target,propertyKey);
  AddMethodParameterChecker(target, propertyKey, parameterIndex,
    function (arg) {
      return typeof (arg) === 'string';
    }
  );
}

export const Number: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  InitializeMethodCheckersArray(target,propertyKey);
  AddMethodParameterChecker(target, propertyKey, parameterIndex,
    function (arg) {
      return typeof (arg) === 'number';
    }
  );
}
