type T = { foo: string, [K in keyof O]-: T };
