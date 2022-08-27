//// [restElementWithAssignmentPattern1.ts]
var a, b;
[...[a, b = 0]] = [
    "",
    1
];
