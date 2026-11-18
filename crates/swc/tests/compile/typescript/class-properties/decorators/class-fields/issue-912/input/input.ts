export class BadRequestError extends Error {
    constructor(public readonly message: string) {
      super(message)
    }
}
