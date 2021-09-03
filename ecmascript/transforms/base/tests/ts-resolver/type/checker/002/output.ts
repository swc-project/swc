export declare function foo<T__2>(obj__2: T__2): T__2 extends () => infer P ? P : never;
export function bar<T__3>(obj__3: T__3) {
    return foo(obj__3);
}
