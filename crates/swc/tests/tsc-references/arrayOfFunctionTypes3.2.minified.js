//// [arrayOfFunctionTypes3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
[
    function() {
        return 1;
    },
    function() {}
][0]();
var C = function C() {
    _class_call_check(this, C);
};
new [
    C,
    C
][0](), (void 0)(''), (void 0)(1), (0, [
    void 0,
    void 0,
    void 0
][0])('');
