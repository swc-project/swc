//// [genericCallWithObjectTypeArgsAndStringIndexer.ts]
// Type inference infers from indexers in target type, no errors expected
function foo(x) {
    return x;
}
var a;
var r = foo(a);
function other(arg) {
    var b;
    var r2 = foo(b); // T
}
function other2(arg) {
    var b;
    var r2 = foo(b);
    var d = r2['hm']; // ok
}
function other3(arg) {
    var b;
    var r2 = foo(b);
    var d = r2['hm']; // ok
// BUG 821629
//var u: U = r2['hm']; // ok
} //function other3<T extends U, U extends Date>(arg: T) {
 //    var b: { [x: string]: T };
 //    var r2 = foo(b);
 //    var d: Date = r2['hm']; // ok
 //    // BUG 821629
 //    //var u: U = r2['hm']; // ok
 //}
