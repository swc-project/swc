//// [moduleWithStatementsOfEveryKind.ts]
var A, Y, Module, Y1, A1, AA, B, BB, Color;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
A || (A = {}), Module || (Module = {}), Y1 = Y || (Y = {}), A1 = function A() {
    _class_call_check(this, A);
}, Y1.A = A1, AA = function AA() {
    _class_call_check(this, AA);
}, Y1.AA = AA, B = /*#__PURE__*/ function(AA) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, AA), B;
}(AA), Y1.B = B, BB = /*#__PURE__*/ function(A) {
    function BB() {
        return _class_call_check(this, BB), _call_super(this, BB, arguments);
    }
    return _inherits(BB, A), BB;
}(A1), Y1.BB = BB, Y1.Module || (Y1.Module = {}), (Color = Y1.Color || (Y1.Color = {}))[Color.Blue = 0] = "Blue", Color[Color.Red = 1] = "Red", Y1.x = 12, Y1.F = function(s) {
    return 2;
}, Y1.array = null, Y1.fn = function(s) {
    return 'hello ' + s;
}, Y1.ol = {
    s: 'hello',
    id: 2,
    isvalid: !0
};
