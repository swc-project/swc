//// [genericCallWithObjectTypeArgsAndNumericIndexer.ts]
// Type inference infers from indexers in target type, no errors expected
 //function other3<T extends U, U extends Date>(arg: T) {
 //    var b: { [x: number]: T };
 //    var r2 = foo(b);
 //    var d = r2[1];
 //    // BUG 821629
 //    //var u: U = r2[1]; // ok
 //}
