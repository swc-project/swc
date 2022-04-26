export class ServiceError extends Error {
    readonly code: ServiceError.Code = ServiceError.Code.badResponse;
    readonly name: string = "ServiceError.BadResponse";
}

export namespace ServiceError {
    export const enum Code {
        serviceNotFound = 404,
        serviceNotCompatible = 426,
        serviceGone = 410,
        implementation = 500,
        timedOut = 504,
        badRequest = 400,
        badResponse = 422,
    }

    export class ServiceNotFound extends ServiceError {
        // Service was probably not registered, or using the wrong channel
        readonly code = Code.serviceNotFound;
        readonly name = "ServiceError.ServiceNotFound";
    }

    export function toMessageBody(
        error: unknown,
    ): { code: number; message?: string; stack?: string } {
        return { code: ServiceError.Code.implementation };
    }
}