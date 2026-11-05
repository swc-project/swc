export {};
declare function eval(): void;
declare function arguments(): void;
declare function f(eval: number, arguments: number): void;
declare function callback(cb: (eval: number) => void): void;
declare namespace N {
    function eval(arguments: number): void;
    interface I { method(eval: number): void; }
}
declare class C {
    constructor(eval: number);
    method(eval: number, arguments: number): void;
}
