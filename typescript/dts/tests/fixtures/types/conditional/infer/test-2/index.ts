export type BadNested<T> = { x: T extends number ? T : string };

export declare function foo2<T1>(
    obj: T1
): T1 extends { [K in keyof BadNested<infer P>]: BadNested<infer P>[K] }
    ? P
    : never;

export function bar2<T2>(obj: T2) {
    return foo2(obj);
}
