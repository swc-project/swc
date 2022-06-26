import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
    var r1arg1;
    var r1arg2;
    var r1 = foo2(r1arg1); // any
    var r1a = [
        r1arg2,
        r1arg1
    ];
    var r1b = [
        r1arg1,
        r1arg2
    ];
    var r2arg1;
    var r2arg2;
    var r2 = foo7(r2arg1); // any
    var r2a = [
        r2arg2,
        r2arg1
    ];
    var r2b = [
        r2arg1,
        r2arg2
    ];
    var r3arg1;
    var r3arg2;
    var r3 = foo8(r3arg1); // any
    var r3a = [
        r3arg2,
        r3arg1
    ];
    var r3b = [
        r3arg1,
        r3arg2
    ];
    var r4arg1;
    var r4arg2;
    var r4 = foo10(r4arg1); // any
    var r4a = [
        r4arg2,
        r4arg1
    ];
    var r4b = [
        r4arg1,
        r4arg2
    ];
    var r5arg1;
    var r5arg2;
    var r5 = foo11(r5arg1); // any
    var r5a = [
        r5arg2,
        r5arg1
    ];
    var r5b = [
        r5arg1,
        r5arg2
    ];
    var r6arg1;
    var r6arg2;
    var r6 = foo12(r6arg1); // new (x: Array<Base>, y: Array<Derived2>) => Array<Derived>
    var r6a = [
        r6arg2,
        r6arg1
    ];
    var r6b = [
        r6arg1,
        r6arg2
    ];
    var r7arg1;
    var r7arg2;
    var r7 = foo15(r7arg1); // (x: { a: string; b: number }) => number): number;
    var r7a = [
        r7arg2,
        r7arg1
    ];
    var r7b = [
        r7arg1,
        r7arg2
    ];
    var r7arg3;
    var r7c = foo15(r7arg3); // any
    var r7d = [
        r7arg2,
        r7arg3
    ];
    var r7e = [
        r7arg3,
        r7arg2
    ];
    var r8arg;
    var r8 = foo16(r8arg); // any
    var r9arg;
    var r9 = foo17(r9arg); // // (x: { <T extends Derived >(a: T): T; <T extends Base >(a: T): T; }): any[]; (x: { <T extends Derived2>(a: T): T; <T extends Base>(a: T): T; }): any[];
})(Errors || (Errors = {}));
var WithGenericSignaturesInBaseType;
(function(WithGenericSignaturesInBaseType) {
    var r2arg2;
    var r2 = foo2(r2arg2); // <T>(x:T) => T[] since we can infer from generic signatures now
    var r3arg2;
    var r3 = foo3(r3arg2); // any
})(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}));
