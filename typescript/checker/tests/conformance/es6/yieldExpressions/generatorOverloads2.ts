//@target: ES6
declare module M {
    function* f(s: string): Iterable<any>;
    function* f(s: number): Iterable<any>;
    function* f(s: any): Iterable<any>;
}