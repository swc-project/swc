export class Context {
        app!: Application;
        request!: ServerRequest;
        url!: URL;

        response: Response & { headers: Headers } = { headers: new Headers() };
        params: Record<string, string> = {};
        customContext: any;

        #store?: Map<string | symbol, unknown>;

        #body: Promise<unknown> | undefined;

        constructor(opts: ContextOptions);
        constructor(c: Context);
        constructor(optionsOrContext: ContextOptions | Context) {
          if (optionsOrContext instanceof Context) {
            Object.assign(this, optionsOrContext);
            this.customContext = this;
            return;
          }
        }
    }
