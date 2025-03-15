//// [arrayOfFunctionTypes3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
[
    function() {
        return 1;
    },
    function() {}
][0]();
var a, b, c, a2, b2, c2, C = function C() {
    _class_call_check(this, C);
};
new [
    C,
    C
][0]();
var r4 = [
    a,
    b,
    c
][0];
r4(''), r4(1), (0, [
    a2,
    b2,
    c2
][0])('');
