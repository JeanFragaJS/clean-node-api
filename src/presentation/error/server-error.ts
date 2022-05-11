export class ServerError extends Error {
  constructor(stack: string) {
    super(`Server Error, try again later`);
    this.name = 'ServerError';
    this.stack = stack;
  }
}
