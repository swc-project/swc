export declare function foo__1<T__2>(obj__2: T__2): T__2 extends () => infer P ? P : never;
export function bar__1<T__4>(obj__4: T__4) {
    return foo__1(obj__4);
}
