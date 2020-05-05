declare function f4<T1 extends Number>(): { [P in keyof T1]: void };

let x4 = f4();