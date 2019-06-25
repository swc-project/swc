// object types with call signatures can override members of Function
// no errors expected below 

interface I {
    (): void;
    apply(a: any, b?: any): void;
    call(thisArg: number, ...argArray: number[]): any;
}

var i: I;
var r1: (a: any, b?: any) => void = i.apply;
var r1b: (thisArg: number, ...argArray: number[]) => void = i.call;
var r1c = i.arguments;

var x: {
    (): void;
    apply(a: any, b?: any): void;
    call(thisArg: number, ...argArray: number[]): any;
}

var r2: (a: any, b?: any) => void = x.apply;
var r2b: (thisArg: number, ...argArray: number[]) => void = x.call;
var r2c = x.arguments;
