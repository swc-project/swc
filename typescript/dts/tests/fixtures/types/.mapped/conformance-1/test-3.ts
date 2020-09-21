declare function f3<T1 extends number>(): { [P in keyof T1]: void };

let x3 = f3();