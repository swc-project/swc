export class Query {
        public text: string;
        public args: EncodedArg[];
        public fields?: string[];

        constructor(config: QueryObjectConfig);
        constructor(text: string, ...args: unknown[]);
    }
