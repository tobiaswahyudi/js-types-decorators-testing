import { DecoratedTypeError } from './DecoratedTypeError';
import { Logged, LogAtInit, LogParamAtInit, String, ValidateParamTypes } from './decorators';

class SayHi {

  name = "";

  constructor(name: string) {
    this.name = name;
  }

  @Logged
  @ValidateParamTypes
  greet(@String phrase: string): void {
    console.log(`Hello ${phrase}! I am ${this.name}.`);
  }

  /*
  @LogAtInit
  greet(@LogParamAtInit phrase: string): void {
    // Demonstrate that "this" is bound correctly
    console.log(`Hello ${phrase}! I am ${this.name}.`);
  }
  */
}


const bob = new SayHi("Bob");

// Should be OK
const realString = "world";
bob.greet(realString);

// Should fail
try {
  const impostorString: any = 5;
  bob.greet(impostorString);
} catch (e) {
  if (e instanceof DecoratedTypeError) {
    console.log("Type error caught as expected :", e.message);
  } else {
    console.log("Something really went wrong!");
    throw e;
  }
}
