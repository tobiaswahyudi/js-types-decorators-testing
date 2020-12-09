export class DecoratedTypeError extends Error {
  message: string;
  constructor(msg: string) {
    super(`DecoratedTypeError: ${msg}`);
    this.message = msg;
  }
};
