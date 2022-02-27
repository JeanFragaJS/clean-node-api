export class ServerError extends Error {
  constructor() {
    super(`Server Error, try again later`);
    this.name = 'ServerError';
  }
}
