import { Contract, Runtype, Unknown } from 'runtypes';



/***************************************
 *  Logging Decorators
 * ***************************************

    When the class declarations are evaluated, the ParameterDecorators are run first, then the
    MethodDecorators.

    Method decorators can return a modified descriptor or modify them directly.
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


const METHOD_RUNTYPES_KEY = "_DecoratorTypesMethodRuntype";

const InitializeMethodRuntypesArray = (target: object, propertyKey: string) => {
  if (!Object.getOwnPropertyDescriptor(target, METHOD_RUNTYPES_KEY)) {
    // Define an empty <PropertyKey, Runtype[]> map for the object prototype.
    Object.defineProperty(target, METHOD_RUNTYPES_KEY, {
      value: {}
    });
  }
  const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_RUNTYPES_KEY)
  if (propDescriptor?.value && !propDescriptor.value[propertyKey]) {
    // In the Method-to-Runtypes map, define a Runtype[] array for each PropertyKey.
    propDescriptor.value[propertyKey] = [];
  } else {
    throw new Error(`Unable to initialize param runtypes array to method ${propertyKey}.`);
  }
}

const AddMethodParameterRuntype = <T>(target: object, propertyKey: string, parameterIndex: number, runtype: Runtype<T>) => {
  const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_RUNTYPES_KEY)
  if (!propDescriptor?.value || !propDescriptor.value[propertyKey]) {
    throw new Error(`Unable to add parameter ${parameterIndex} runtype to method ${propertyKey}.`);
  }
  propDescriptor.value[propertyKey][parameterIndex] = runtype;
}

export const ValidateRTypes = <T>(returnRuntype: Runtype<T>): MethodDecorator => {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const origMethod = descriptor.value;
    // Get the method's Runtype[] array and ensure it is not undefined.
    const propDescriptor = Object.getOwnPropertyDescriptor(target, METHOD_RUNTYPES_KEY);
    if (!propDescriptor?.value || !propDescriptor.value[propertyKey]) {
      console.warn(`Function ${propertyKey} was annotated @ValidateParamTypes but no param runtypes were found.`);
      return;
    }
    // Replace undefined Runtypes with the "Unknown" Runtype
    const runtypes: Runtype[] = [...propDescriptor.value[propertyKey]]
      .map(runtype => runtype || Unknown);
    // Replace the method with a contract-bound version
    descriptor.value = Contract(
      ...runtypes,
      // @ts-ignore - needed here, explanation provided in appendix.
      returnRuntype
    ).enforce(origMethod);
  }
};

export const RType = <T>(runtype: Runtype<T>): ParameterDecorator => {
  return (target: object, propertyKey: string, parameterIndex: number) => {
    InitializeMethodRuntypesArray(target, propertyKey);
    AddMethodParameterRuntype(target, propertyKey, parameterIndex, runtype);
  }
};
/*
export const String: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  InitializeMethodRuntypesArray(target,propertyKey);
  AddMethodParameterRuntype(target, propertyKey, parameterIndex,
    function (arg) {
      return typeof (arg) === 'string';
    }
  );
}

export const Number: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  InitializeMethodRuntypesArray(target,propertyKey);
  AddMethodParameterRuntype(target, propertyKey, parameterIndex,
    function (arg) {
      return typeof (arg) === 'number';
    }
  );
}
*/
