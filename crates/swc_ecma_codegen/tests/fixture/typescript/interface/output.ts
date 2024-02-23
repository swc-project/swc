const symbol1 = Symbol();
const symbol2 = Symbol();
const symbol3 = Symbol();
export interface Test {
    [symbol1]: string;
    [symbol2](): string;
    get [symbol3](): string;
    set [symbol3](value: string);
    prop1: string;
    method1(value: string, param2: number): string;
    get method2(): string;
    set method2(value: string);
}
