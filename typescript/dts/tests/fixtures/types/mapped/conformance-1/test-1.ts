declare function f1<T1>(): { [P in keyof T1]: void };

let x1 = f1();
