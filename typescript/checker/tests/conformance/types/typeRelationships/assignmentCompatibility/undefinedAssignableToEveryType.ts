class C {
    foo: string;
}
var ac: C;
interface I {
    foo: string;
}
var ai: I;

enum E { A }
var ae: E;

var b: number = undefined;
var c: string = undefined;
var d: boolean = undefined;
var e: Date = undefined;
var f: any = undefined;
var g: void = undefined;
var h: Object = undefined;
var i: {} = undefined;
var j: () => {} = undefined;
var k: Function = undefined;
var l: (x: number) => string = undefined;
ac = undefined;
ai = undefined;
ae = undefined;
var m: number[] = undefined;
var n: { foo: string } = undefined;
var o: <T>(x: T) => T = undefined;
var p: Number = undefined;
var q: String = undefined;

function foo<T, U, V extends Date>(x: T, y: U, z: V) {
    x = undefined;
    y = undefined;
    z = undefined;
}
//function foo<T, U extends T, V extends Date>(x: T, y: U, z: V) {
//    x = undefined;
//    y = undefined;
//    z = undefined;
//}