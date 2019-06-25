// @strict: true
// @declaration: true
// @target: esnext

let v1 = 'abc' as const;
let v2 = `abc` as const;
let v3 = 10 as const;
let v4 = -10 as const;
let v5 = +10 as const;
let v6 = 10n as const;
let v7 = -10n as const;
let v8 = true as const;
let v9 = false as const;

let c1 = 'abc' as const;
let c2 = `abc` as const;
let c3 = 10 as const;
let c4 = -10 as const;
let c5 = +10 as const;
let c6 = 10n as const;
let c7 = -10n as const;
let c8 = true as const;
let c9 = false as const;

let vv1 = v1;
let vc1 = c1;

let a1 = [] as const;
let a2 = [1, 2, 3] as const;
let a3 = [10, 'hello', true] as const;
let a4 = [...[1, 2, 3]] as const;
let a5 = [1, 2, 3];
let a6 = [...a5] as const;
let a7 = [...a6];
let a8 = ['abc', ...a7] as const;
let a9 = [...a8];

declare let d: { [x: string]: string };

let o1 = { x: 10, y: 20 } as const;
let o2 = { a: 1, 'b': 2, ['c']: 3, d() {}, ['e' + '']: 4 } as const;
let o3 = { ...o1, ...o2 } as const;
let o4 = { a: 1, b: 2 };
let o5 = { ...o4 } as const;
let o6 = { ...o5 };
let o7 = { ...d } as const;
let o8 = { ...o7 };
let o9 = { x: 10, foo() { this.x = 20 } } as const;  // Error

let p1 = (10) as const;
let p2 = ((-10)) as const;
let p3 = ([(10)]) as const;
let p4 = [[[[10]]]] as const;

let x1 = { x: 10, y: [20, 30], z: { a: { b: 42 } } } as const;

let q1 = <const> 10;
let q2 = <const> 'abc';
let q3 = <const> true;
let q4 = <const> [1, 2, 3];
let q5 = <const> { x: 10, y: 20 };

declare function id<T>(x: T): T;

let e1 = v1 as const;  // Error
let e2 = (true ? 1 : 0) as const;  // Error
let e3 = id(1) as const;  // Error
