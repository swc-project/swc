export class BadRequestError extends Error {
    constructor(message){
        super(message), this.message = message;
    }
}
