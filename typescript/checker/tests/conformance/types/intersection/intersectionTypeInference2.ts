declare function f<T>(x: { prop: T }): T;

declare const a: { prop: string } & { prop: number };
declare const b: { prop: string & number };

f(a);  // string & number
f(b);  // string & number

// Repro from #18354

declare function f2<T, Key extends keyof T>(obj: {[K in keyof T]: T[K]}, key: Key): T[Key];

declare const obj: { a: string } & { b: string };
f2(obj, 'a');
f2(obj, 'b');
