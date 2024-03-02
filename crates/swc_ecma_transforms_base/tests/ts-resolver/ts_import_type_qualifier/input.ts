import { MyClass } from "./MyClass.ts";
const test = new MyClass();

// MyClass identifier here should be different
// than the one above.
export type MyType = import("./deps.ts").MyClass;
export type MyType2 = import("./deps.ts").MyClass<MyClass>;
