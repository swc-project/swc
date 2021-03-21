function foo<P extends RouteParams = RP, S extends State = RS>(
    name: string,
    path: string,
    ...middleware: RouterMiddleware<P, S>[]
): Router<P extends RP ? P : (P & RP), S extends RS ? S : (S & RS)>; { }