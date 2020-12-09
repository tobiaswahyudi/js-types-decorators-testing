import { Logged, LogParam } from './decorators';

class SayHi {

  name = "";

  constructor(name: string) {
    this.name = name;
  }

  @Logged
  greet(@LogParam phrase: string): void {
    console.log(`Hello ${phrase}! I am ${this.name}.`);
  }
}

new SayHi("Bob").greet("world");
