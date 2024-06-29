declare function f1(x: any): x is number;
declare function f2(x: any): x is number => number;
declare function f3(x: any): x is (number) => number;
declare function f4(x: any): x is (y: number) => number;
declare function f5(x: any): x is number => x is number;
