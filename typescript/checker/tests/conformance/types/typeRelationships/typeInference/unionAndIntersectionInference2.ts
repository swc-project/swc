declare function f1<T>(x: T | string): T;

var a1: string;
var b1: string | string[];
var c1: string[] | string;
var d1: string | { name: string };
var e1: number | string | boolean;
f1(a1); // string
f1(b1); // string[]
f1(c1); // string[]
f1(d1); // { name: string }
f1(e1); // number | boolean

declare function f2<T>(x: T & { name: string }): T;

var a2: string & { name: string };
var b2: { name: string } & string[];
var c2: string & { name: string } & number;
var d2: string & { name: string } & number & { name: string };
f2(a2); // string
f2(b2); // string[]
f2(c2); // string & number
f2(d2); // string & number
