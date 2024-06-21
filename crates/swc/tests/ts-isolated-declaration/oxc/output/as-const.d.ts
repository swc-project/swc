declare const F: {
    readonly string;
    readonly templateLiteral;
    readonly number: 1.23;
    readonly bigint;
    readonly boolean: true;
    readonly null: null;
    readonly undefined;
    readonly arrow: (a: string) => void;
    readonly object: {
        readonly a;
        readonly b;
    };
    readonly array: readonly [any, {
            readonly b;
        }];
};
