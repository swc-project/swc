// satisfaction of a constraint to Function, no errors expected

function foo<T extends (x: string) => string>(x: T): T { return x; }

interface I {
    (): string;
}
var i: I;

class C {
    foo: string;
}

var a: { (): string };
var b: { new (): string };
var c: { (): string; (x): string };

var r1 = foo((x) => x);
var r2 = foo((x: string) => x);
var r3 = foo(function (x) { return x });
var r4 = foo(function (x: string) { return x });
var r5 = foo(i);
var r8 = foo(c);

interface I2<T> {
    (x: T): T;
}
var i2: I2<string>;

class C2<T> {
    foo: T;
}

var a2: { <T>(x: T): T };
var b2: { new <T>(x: T): T };
var c2: { <T>(x: T): T; <T>(x: T, y: T): T };

var r9 = foo(function <U>(x: U) { return x; });
var r10 = foo(<U extends string>(x: U) => x);
var r12 = foo(i2);
var r15 = foo(c2);