//// [intersectionTypeInference2.ts]
//!   x cannot reassign to a variable declared with `const`
//!     ,-[11:1]
//!   8 | 
//!   9 | // Repro from #18354
//!  10 | 
//!  11 | declare function f2<T, Key extends keyof T>(obj: {[K in keyof T]: T[K]}, key: Key): T[Key];
//!     :                                             ^|^
//!     :                                              `-- cannot reassign
//!  12 | 
//!  13 | declare const obj: { a: string } & { b: string };
//!     :               ^|^
//!     :                `-- const variable was declared here
//!  14 | f2(obj, 'a');
//!  15 | f2(obj, 'b');
//!     `----
