//// [moduleWithStatementsOfEveryKind.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A;
(function(A) {
    var F = function F(s) {
        return 2;
    };
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
        var _super = _create_super(B);
        function B() {
            _class_call_check(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(AA);
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _create_super(BB);
        function BB() {
            _class_call_check(this, BB);
            return _super.apply(this, arguments);
        }
        return BB;
    }(A1);
    var Module;
    (function(Module) {
        var A = function A() {
            "use strict";
            _class_call_check(this, A);
        };
    })(Module || (Module = {}));
    var Color;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color || (Color = {}));
    var x = 12;
    var array = null;
    var fn = function(s) {
        return "hello " + s;
    };
    var ol = {
        s: "hello",
        id: 2,
        isvalid: true
    };
})(A || (A = {}));
var Y;
(function(Y) {
    var F = function F(s) {
        return 2;
    };
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
        var _super = _create_super(B);
        function B() {
            _class_call_check(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(AA);
    Y.B = B;
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _create_super(BB);
        function BB() {
            _class_call_check(this, BB);
            return _super.apply(this, arguments);
        }
        return BB;
    }(A);
    Y.BB = BB;
    var Module;
    (function(Module) {
        var A = function A() {
            "use strict";
            _class_call_check(this, A);
        };
    })(Module = Y.Module || (Y.Module = {}));
    var Color;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color = Y.Color || (Y.Color = {}));
    var x = 12;
    Object.defineProperty(Y, "x", {
        enumerable: true,
        get: function get() {
            return x;
        },
        set: function set(v) {
            x = v;
        }
    });
    Y.F = F;
    var array = null;
    Object.defineProperty(Y, "array", {
        enumerable: true,
        get: function get() {
            return array;
        },
        set: function set(v) {
            array = v;
        }
    });
    var fn = function(s) {
        return "hello " + s;
    };
    Object.defineProperty(Y, "fn", {
        enumerable: true,
        get: function get() {
            return fn;
        },
        set: function set(v) {
            fn = v;
        }
    });
    var ol = {
        s: "hello",
        id: 2,
        isvalid: true
    };
    Object.defineProperty(Y, "ol", {
        enumerable: true,
        get: function get() {
            return ol;
        },
        set: function set(v) {
            ol = v;
        }
    });
})(Y || (Y = {}));
