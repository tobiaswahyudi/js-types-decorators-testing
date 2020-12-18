import { DecoratedTypeError } from './DecoratedTypeError';
import { Logged, LogAtInit, LogParamAtInit, String, ValidateParamTypes } from './decorators';

/****************************************************************
*   Decorating Class Methods
****************************************************************/
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

/****************************************************************
*   Decorating Standalone Functions
****************************************************************/

// @Logged
// function simonSays(phrase: string): void {
//   console.log(`Simon says: ${phrase}!`);
// }

// const simonSays = ((phrase: string) => {
//   console.log(`Simon says: ${phrase}!`);
// })::Logged;

// const simonSays = {
//   @Logged
//   func(phrase: string){
//     console.log(`Simon says: ${phrase}!`);
//   }
// }.func;

// simonSays("jump");


// interface Person {
//   name: String,
//   age: Number
// }

// const aPerson: Person = {
//   name: "robert",
//   age: 42
// }
// const notAPerson: Number = 5;

// function getNameLength(person: Person): Number {
//     return person.name.length;
// }

// getNameLength(aPerson);
// // >> 6

// getNameLength(notAPerson);
