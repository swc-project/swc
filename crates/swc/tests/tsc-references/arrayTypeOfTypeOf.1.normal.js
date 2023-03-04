//// [arrayTypeOfTypeOf.ts]
// array type cannot use typeof.
var x = 1;
var xs; // Not an error.  This is equivalent to Array<typeof x>
var xs2;
var xs3;
var xs4;
