import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// checking subtype relations for function types as it relates to contextual signature instantiation
// error cases, so function calls will all result in 'any'
var Errors;
(function(Errors) {
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var Derived = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _create_super(Derived);
        function Derived() {
            _class_call_check(this, Derived);
            return _super.apply(this, arguments);
        }
        return Derived;
    }(Base);
    var Derived2 = /*#__PURE__*/ function(Derived) {
        "use strict";
        _inherits(Derived2, Derived);
        var _super = _create_super(Derived2);
        function Derived2() {
            _class_call_check(this, Derived2);
            return _super.apply(this, arguments);
        }
        return Derived2;
    }(Derived);
    var OtherDerived = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(OtherDerived, Base);
        var _super = _create_super(OtherDerived);
        function OtherDerived() {
            _class_call_check(this, OtherDerived);
            return _super.apply(this, arguments);
        }
        return OtherDerived;
    }(Base);
    var r1 = foo2(function(x) {
        return null;
    }); // any
    var r1a = [
        function(x) {
            return [
                ""
            ];
        },
        function(x) {
            return null;
        }
    ];
    var r1b = [
        function(x) {
            return null;
        },
        function(x) {
            return [
                ""
            ];
        }
    ];
    var r2arg = function(x) {
        return function(r) {
            return null;
        };
    };
    var r2arg2 = function(x) {
        return function(r) {
            return null;
        };
    };
    var r2 = foo7(r2arg); // any
    var r2a = [
        r2arg2,
        r2arg
    ];
    var r2b = [
        r2arg,
        r2arg2
    ];
    var r3arg = function(x, y) {
        return function(r) {
            return null;
        };
    };
    var r3arg2 = function(x, y) {
        return function(r) {
            return null;
        };
    };
    var r3 = foo8(r3arg); // any
    var r3a = [
        r3arg2,
        r3arg
    ];
    var r3b = [
        r3arg,
        r3arg2
    ];
    var r4arg = function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
        return null;
    };
    var r4arg2 = function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
        return null;
    };
    var r4 = foo10(r4arg); // any
    var r4a = [
        r4arg2,
        r4arg
    ];
    var r4b = [
        r4arg,
        r4arg2
    ];
    var r5arg = function(x, y) {
        return null;
    };
    var r5arg2 = function(x, y) {
        return null;
    };
    var r5 = foo11(r5arg); // any
    var r5a = [
        r5arg2,
        r5arg
    ];
    var r5b = [
        r5arg,
        r5arg2
    ];
    var r6arg = function(x, y) {
        return null;
    };
    var r6arg2 = function(x, y) {
        return null;
    };
    var r6 = foo12(r6arg); // (x: Array<Base>, y: Array<Derived2>) => Array<Derived>
    var r6a = [
        r6arg2,
        r6arg
    ];
    var r6b = [
        r6arg,
        r6arg2
    ];
    var r7arg = function(x) {
        return null;
    };
    var r7arg2 = function(x) {
        return 1;
    };
    var r7 = foo15(r7arg); // any
    var r7a = [
        r7arg2,
        r7arg
    ];
    var r7b = [
        r7arg,
        r7arg2
    ];
    var r7arg3 = function(x) {
        return 1;
    };
    var r7c = foo15(r7arg3); // (x: { a: string; b: number }) => number): number;
    var r7d = [
        r7arg2,
        r7arg3
    ];
    var r7e = [
        r7arg3,
        r7arg2
    ];
    var r8arg = function(x) {
        return null;
    };
    var r8 = foo16(r8arg); // any
    var r9arg = function(x) {
        return null;
    };
    var r9 = foo17(r9arg); // (x: { <T extends Derived >(a: T): T; <T extends Base >(a: T): T; }): any[]; (x: { <T extends Derived2>(a: T): T; <T extends Base>(a: T): T; }): any[];
})(Errors || (Errors = {}));
var WithGenericSignaturesInBaseType;
(function(WithGenericSignaturesInBaseType) {
    var r2arg2 = function(x) {
        return [
            ""
        ];
    };
    var r2 = foo2(r2arg2); // <T>(x:T) => T[] since we can infer from generic signatures now
    var r3arg2 = function(x) {
        return null;
    };
    var r3 = foo3(r3arg2); // any
})(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}));
