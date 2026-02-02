// Test case for issue #11142: TypeScript expressions in destructuring assignment

// ============================================
// Expr::TsNonNull - Non-null assertion: expr!
// ============================================

// Original issue case: array element swapping with non-null assertions
let arrayCopy = [1, 2, 3];
let currentIndex = 0;
let randomIndex = 1;
[arrayCopy[currentIndex]!, arrayCopy[randomIndex]!] = [
    arrayCopy[randomIndex]!,
    arrayCopy[currentIndex]!,
];

// Simple non-null assertion in array destructuring
let a: number | null = 1;
let b: number | null = 2;
[a!, b!] = [b!, a!];

// Non-null assertion with member expressions
let obj: { x?: number; y?: number } = { x: 1, y: 2 };
[obj.x!, obj.y!] = [obj.y!, obj.x!];

// Non-null assertion in object destructuring
({ x: obj.x! } = { x: 5 });

// Complex nested case
let arr: (number | null)[][] = [[1, 2], [3, 4]];
[arr[0]![0]!, arr[1]![1]!] = [arr[1]![1]!, arr[0]![0]!];

// ============================================
// Expr::TsTypeAssertion - Type assertion: <Type>expr
// ============================================

// Type assertion in array destructuring
let x: unknown = 1;
let y: unknown = 2;
[<number>x, <number>y] = [<number>y, <number>x];

// Type assertion with member expression
let data: { value?: unknown } = { value: 10 };
[<number>data.value] = [20];

// Type assertion in object destructuring
({ prop: <number>data.value } = { prop: 30 });

// ============================================
// Expr::TsInstantiation - Type instantiation: expr<Type>
// ============================================

// Type instantiation in destructuring (generic function reference)
declare function identity<T>(x: T): T;
let fn1: <T>(x: T) => T;
let fn2: <T>(x: T) => T;
[fn1, fn2] = [identity<number>, identity<string>];

// ============================================
// Expr::TsSatisfies - Satisfies expression: expr satisfies Type
// ============================================

// Satisfies in array destructuring
let s1: unknown = "hello";
let s2: unknown = "world";
[s1 satisfies string, s2 satisfies string] = [s2 satisfies string, s1 satisfies string];

// Satisfies with member expression
let config: { setting?: unknown } = { setting: "value" };
[config.setting satisfies string] = ["new value" satisfies string];

// Satisfies in object destructuring
({ key: config.setting satisfies string } = { key: "updated" });

// ============================================
// Combined cases
// ============================================

// Multiple TypeScript expression types in same destructuring
let mixed: { a?: number | null; b?: unknown } = { a: 1, b: 2 };
[mixed.a!, <number>mixed.b] = [<number>mixed.b, mixed.a!];
