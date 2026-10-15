namespace Foo__2 {
    export type ServerHandle__3 = HandleFunction__3 | http.Server;
    export class IncomingMessage__3 extends http.IncomingMessage {
        originalUrl?: http.IncomingMessage["url"] | undefined;
    }
    type NextFunction__3 = (err__4?: any) => void;
    export type SimpleHandleFunction__3 = (req__5: IncomingMessage__3, res__5: http.ServerResponse) => void;
    export type NextHandleFunction__3 = (req__6: IncomingMessage__3, res__6: http.ServerResponse, next__6: NextFunction__3) => void;
    export type ErrorHandleFunction__3 = (err__7: any, req__7: IncomingMessage__3, res__7: http.ServerResponse, next__7: NextFunction__3) => void;
    export type HandleFunction__3 = SimpleHandleFunction__3 | NextHandleFunction__3 | ErrorHandleFunction__3;
}
