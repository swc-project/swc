//// [mappedTypeModifiers.ts]
var v00;
var v00;
var v00;
var v00;
var v00;
var v01;
var v01;
var v01;
var v01;
var v02;
var v02;
var v02;
var v02;
var v02;
var v03;
var v03;
var v03;
var v03;
var v03;
var v04;
var v04;
var v04;
var v04;
var v04;
var v04;
var v04;
var v04;
var b00;
var b00;
var b00;
var b00;
var b00;
var b01;
var b01;
var b01;
var b01;
var b02;
var b02;
var b02;
var b02;
var b02;
var b03;
var b03;
var b03;
var b03;
var b03;
var b04;
var b04;
var b04;
var b04;
var b04;
var b04;
var b04;
var b04;
function f1(x) {
    x.prop; // ok
    (x["other"] || 0).toFixed();
}
function f2(x) {
    x.prop; // ok
    x["other"].toFixed();
}
function f3(x) {
    x.prop; // ok
    x["other"].x.toFixed();
}
function f4(x) {
    x.prop; // ok
    x["other"].toFixed();
}
