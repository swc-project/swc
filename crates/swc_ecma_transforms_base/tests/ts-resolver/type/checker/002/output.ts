export declare function foo__2<T__3>(obj__3: T__3): T__3 extends () => infer P ? P : never;
export function bar__2<T__4>(obj__4: T__4) {
    return foo__2(obj__4);
}
