//// [intersectionTypeAssignment.ts]
var a;
var b;
var x;
var y;
a = x;
a = y;
x = a; // Error
y = a; // Error
b = x;
b = y;
x = b; // Error
y = b; // Error
x = y;
y = x;
