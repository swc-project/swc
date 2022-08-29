//// [restElementWithAssignmentPattern2.ts]
var a, b;
[...{ 0: a = "" , b  }] = [
    "",
    1
];
