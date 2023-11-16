export type Test = typeof MyClass<string>;
export type Test1 = typeof import("./other.ts").MyClass<string>;
