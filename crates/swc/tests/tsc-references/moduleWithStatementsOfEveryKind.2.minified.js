//// [moduleWithStatementsOfEveryKind.ts]
var A, Y, Module, Color, Color1, Y1, A1, AA, B, BB, Color2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
A || (A = {}), Module || (Module = {}), (Color1 = Color || (Color = {}))[Color1.Blue = 0] = "Blue", Color1[Color1.Red = 1] = "Red", Y1 = Y || (Y = {}), A1 = function A() {
    _class_call_check(this, A);
}, Y1.A = A1, AA = function AA() {
    _class_call_check(this, AA);
}, Y1.AA = AA, B = function(AA) {
    _inherits(B, AA);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(AA), Y1.B = B, BB = function(A) {
    _inherits(BB, A);
    var _super = _create_super(BB);
    function BB() {
        return _class_call_check(this, BB), _super.apply(this, arguments);
    }
    return BB;
}(A1), Y1.BB = BB, Y1.Module || (Y1.Module = {}), (Color2 = Y1.Color || (Y1.Color = {}))[Color2.Blue = 0] = "Blue", Color2[Color2.Red = 1] = "Red", Y1.x = 12, Y1.F = function(s) {
    return 2;
}, Y1.array = null, Y1.fn = function(s) {
    return 'hello ' + s;
}, Y1.ol = {
    s: 'hello',
    id: 2,
    isvalid: !0
};
