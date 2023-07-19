//// [moduleWithStatementsOfEveryKind.ts]
var A, Y;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(A) {
    var Module, Color, Color1;
    Module || (Module = {}), (Color1 = Color || (Color = {}))[Color1.Blue = 0] = "Blue", Color1[Color1.Red = 1] = "Red";
}(A || (A = {})), function(Y) {
    var Color, A = function A() {
        _class_call_check(this, A);
    };
    Y.A = A;
    var AA = function AA() {
        _class_call_check(this, AA);
    };
    Y.AA = AA;
    var B = function(AA) {
        _inherits(B, AA);
        var _super = _create_super(B);
        function B() {
            return _class_call_check(this, B), _super.apply(this, arguments);
        }
        return B;
    }(AA);
    Y.B = B;
    var BB = function(A) {
        _inherits(BB, A);
        var _super = _create_super(BB);
        function BB() {
            return _class_call_check(this, BB), _super.apply(this, arguments);
        }
        return BB;
    }(A);
    Y.BB = BB, Y.Module || (Y.Module = {}), (Color = Y.Color || (Y.Color = {}))[Color.Blue = 0] = "Blue", Color[Color.Red = 1] = "Red", Y.x = 12, Y.F = function(s) {
        return 2;
    }, Y.array = null, Y.fn = function(s) {
        return "hello " + s;
    }, Y.ol = {
        s: "hello",
        id: 2,
        isvalid: !0
    };
}(Y || (Y = {}));
