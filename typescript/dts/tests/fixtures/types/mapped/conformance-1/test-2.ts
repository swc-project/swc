declare function f2<T1 extends string>(): { [P in keyof T1]: void };

let x2 = f2();