namespace Foo__2 {
    export type ServerHandle__3 = HandleFunction__3 | http.Server;
    export class IncomingMessage__3 extends http.IncomingMessage {
        originalUrl?: http.IncomingMessage["url"] | undefined;
    }
    type NextFunction__3 = (err?: any) => void;
    export type SimpleHandleFunction__3 = (req: IncomingMessage__3, res: http.ServerResponse) => void;
    export type NextHandleFunction__3 = (req: IncomingMessage__3, res: http.ServerResponse, next: NextFunction__3) => void;
    export type ErrorHandleFunction__3 = (err: any, req: IncomingMessage__3, res: http.ServerResponse, next: NextFunction__3) => void;
    export type HandleFunction__3 = SimpleHandleFunction__3 | NextHandleFunction__3 | ErrorHandleFunction__3;
}
