/*
 *  Logging Decorators
 */

export const Logged: MethodDecorator = (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log("Method Decorator:")
  console.log("target:",target);
  console.log("propertyKey:",propertyKey);
  console.log("descriptor:",descriptor);
  console.log();

  const origMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log("The decorated function is called with args: ", args);
    return origMethod.apply(this, args);
  };
}

export const LogParam: ParameterDecorator = (target: object, propertyKey: string, parameterIndex: number) => {
  console.log("Parameter Decorator:")
  console.log("target:",target);
  console.log("propertyKey:",propertyKey);
  console.log("parameterIndex:",parameterIndex);
  console.log();

  return target;
}
