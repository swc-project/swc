namespace Foo {
    export type ServerHandle = HandleFunction | http.Server;

    export class IncomingMessage extends http.IncomingMessage {
        originalUrl?: http.IncomingMessage["url"] | undefined;
    }

    type NextFunction = (err?: any) => void;

    export type SimpleHandleFunction = (
        req: IncomingMessage,
        res: http.ServerResponse
    ) => void;
    export type NextHandleFunction = (
        req: IncomingMessage,
        res: http.ServerResponse,
        next: NextFunction
    ) => void;
    export type ErrorHandleFunction = (
        err: any,
        req: IncomingMessage,
        res: http.ServerResponse,
        next: NextFunction
    ) => void;
    export type HandleFunction =
        | SimpleHandleFunction
        | NextHandleFunction
        | ErrorHandleFunction;
}
