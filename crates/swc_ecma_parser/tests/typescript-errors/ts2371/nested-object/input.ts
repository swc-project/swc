declare function foo({ a: { b = 1 } }: { a: { b?: number } }): void;
declare function bar({ a: [x = 1] }: { a: number[] }): void;
