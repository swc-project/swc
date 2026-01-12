//// [moduleWithStatementsOfEveryKind.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function(A) {
    var A1 = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    var AA = function AA() {
        "use strict";
        _class_call_check(this, AA);
    };
    var B = /*#__PURE__*/ function(AA) {
        "use strict";
        _inherits(B, AA);
        function B() {
            _class_call_check(this, B);
            return _call_super(this, B, arguments);
        }
        return B;
    }(AA);
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        function BB() {
            _class_call_check(this, BB);
            return _call_super(this, BB, arguments);
        }
        return BB;
    }(A1);
    (function(Module) {
        var A = function A() {
            "use strict";
            _class_call_check(this, A);
        };
    })(Module || (Module = {}));
    var Color = /*#__PURE__*/ function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
        return Color;
    }({});
    var x = 12;
    function F(s) {
        return 2;
    }
    var array = null;
    var fn = function(s) {
        return 'hello ' + s;
    };
    var ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
    var Module;
})(A || (A = {}));
(function(Y) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    Y.A = A;
    var AA = function AA() {
        "use strict";
        _class_call_check(this, AA);
    };
    Y.AA = AA;
    var B = /*#__PURE__*/ function(AA) {
        "use strict";
        _inherits(B, AA);
        function B() {
            _class_call_check(this, B);
            return _call_super(this, B, arguments);
        }
        return B;
    }(AA);
    Y.B = B;
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        function BB() {
            _class_call_check(this, BB);
            return _call_super(this, BB, arguments);
        }
        return BB;
    }(A);
    Y.BB = BB;
    (function(Module) {
        var A = function A() {
            "use strict";
            _class_call_check(this, A);
        };
    })(Y.Module || (Y.Module = {}));
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Y.Color || (Y.Color = {}));
    Y.x = 12;
    function F(s) {
        return 2;
    }
    Y.F = F;
    Y.array = null;
    Y.fn = function(s) {
        return 'hello ' + s;
    };
    Y.ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(Y || (Y = {}));
var A, Y;
