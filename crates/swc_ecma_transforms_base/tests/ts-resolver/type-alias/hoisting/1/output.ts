module Foo__1 {
    export type ServerHandle__2 = HandleFunction__2 | http.Server;
    export class IncomingMessage__2 extends http.IncomingMessage {
        originalUrl?: http.IncomingMessage["url"] | undefined;
    }
    type NextFunction__2 = (err?: any) => void;
    export type SimpleHandleFunction__2 = (req: IncomingMessage__2, res: http.ServerResponse) => void;
    export type NextHandleFunction__2 = (req: IncomingMessage__2, res: http.ServerResponse, next: NextFunction__2) => void;
    export type ErrorHandleFunction__2 = (err: any, req: IncomingMessage__2, res: http.ServerResponse, next: NextFunction__2) => void;
    export type HandleFunction__2 = SimpleHandleFunction__2 | NextHandleFunction__2 | ErrorHandleFunction__2;
}
