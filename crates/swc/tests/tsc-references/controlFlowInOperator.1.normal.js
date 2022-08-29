//// [controlFlowInOperator.ts]
var a = "a";
var b = "b";
var d = "d";
if ("a" in c) {
    c; // A
    c["a"]; // number;
}
if ("d" in c) {
    c; // never
}
if (a in c) {
    c; // A
    c[a]; // number;
}
if (d in c) {
    c; // never
}
