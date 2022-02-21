function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
// @strict: true
// @target: es6
function Field() {
    var foo = function foo() {};
    var foo1 = function foo1() {
        return "";
    };
    var foo2 = function foo2(value) {};
    var foo3 = function foo3() {};
    var foo4 = function foo4() {
        return "";
    };
    var foo5 = function foo5(value) {};
    var A_Field_Field = function A_Field_Field() {
        "use strict";
        _classCallCheck(this, A_Field_Field);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo = new WeakMap();
    var _foo1 = new WeakSet();
    var A_Field_Method = function A_Field_Method() {
        "use strict";
        _classCallCheck(this, A_Field_Method);
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: "foo"
        });
        _classPrivateMethodInit(this, _foo1);
    };
    var _foo1 = new WeakMap();
    var _foo2 = new WeakSet();
    var A_Field_Getter = function A_Field_Getter() {
        "use strict";
        _classCallCheck(this, A_Field_Getter);
        _classPrivateFieldInit(this, _foo2, {
            writable: true,
            value: "foo"
        });
        _classPrivateMethodInit(this, _foo2);
    };
    var _foo2 = new WeakMap();
    var _foo3 = new WeakSet();
    var A_Field_Setter = function A_Field_Setter() {
        "use strict";
        _classCallCheck(this, A_Field_Setter);
        _classPrivateFieldInit(this, _foo3, {
            writable: true,
            value: "foo"
        });
        _classPrivateMethodInit(this, _foo3);
    };
    var _foo3 = new WeakMap();
    var A_Field_StaticField = function A_Field_StaticField() {
        "use strict";
        _classCallCheck(this, A_Field_StaticField);
        _classPrivateFieldInit(this, _foo4, {
            writable: true,
            value: "foo"
        });
    };
    var _foo4 = new WeakMap();
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var A_Field_StaticMethod = function A_Field_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_Field_StaticMethod);
        _classPrivateFieldInit(this, _foo5, {
            writable: true,
            value: "foo"
        });
    };
    var _foo5 = new WeakMap();
    var A_Field_StaticGetter = function A_Field_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_Field_StaticGetter);
        _classPrivateFieldInit(this, _foo6, {
            writable: true,
            value: "foo"
        });
    };
    var _foo6 = new WeakMap();
    var A_Field_StaticSetter = function A_Field_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_Field_StaticSetter);
        _classPrivateFieldInit(this, _foo7, {
            writable: true,
            value: "foo"
        });
    };
    var _foo7 = new WeakMap();
}
function Method() {
    var foo = function foo() {};
    var foo6 = function foo6() {};
    var foo6 = function foo6() {};
    var foo7 = function foo7() {};
    var foo7 = function foo7() {
        return "";
    };
    var foo8 = function foo8() {};
    var foo8 = function foo8(value) {};
    var foo9 = function foo9() {};
    var foo10 = function foo10() {};
    var foo10 = function foo10() {};
    var foo11 = function foo11() {};
    var foo11 = function foo11() {
        return "";
    };
    var foo12 = function foo12() {};
    var foo12 = function foo12(value) {};
    var _foo = new WeakSet();
    var A_Method_Field = function A_Method_Field() {
        "use strict";
        _classCallCheck(this, A_Method_Field);
        _classPrivateMethodInit(this, _foo);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo8 = new WeakSet(), _foo8 = new WeakSet();
    var A_Method_Method = function A_Method_Method() {
        "use strict";
        _classCallCheck(this, A_Method_Method);
        _classPrivateMethodInit(this, _foo8);
        _classPrivateMethodInit(this, _foo8);
    };
    var _foo9 = new WeakSet(), _foo9 = new WeakSet();
    var A_Method_Getter = function A_Method_Getter() {
        "use strict";
        _classCallCheck(this, A_Method_Getter);
        _classPrivateMethodInit(this, _foo9);
        _classPrivateMethodInit(this, _foo9);
    };
    var _foo10 = new WeakSet(), _foo10 = new WeakSet();
    var A_Method_Setter = function A_Method_Setter() {
        "use strict";
        _classCallCheck(this, A_Method_Setter);
        _classPrivateMethodInit(this, _foo10);
        _classPrivateMethodInit(this, _foo10);
    };
    var _foo11 = new WeakSet();
    var A_Method_StaticField = function A_Method_StaticField() {
        "use strict";
        _classCallCheck(this, A_Method_StaticField);
        _classPrivateMethodInit(this, _foo11);
    };
    var _foo11 = {
        writable: true,
        value: "foo"
    };
    var _foo12 = new WeakSet();
    var A_Method_StaticMethod = function A_Method_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_Method_StaticMethod);
        _classPrivateMethodInit(this, _foo12);
    };
    var _foo13 = new WeakSet();
    var A_Method_StaticGetter = function A_Method_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_Method_StaticGetter);
        _classPrivateMethodInit(this, _foo13);
    };
    var _foo14 = new WeakSet();
    var A_Method_StaticSetter = function A_Method_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_Method_StaticSetter);
        _classPrivateMethodInit(this, _foo14);
    };
}
function Getter() {
    var foo = function foo() {
        return "";
    };
    var foo13 = function foo13() {
        return "";
    };
    var foo13 = function foo13() {};
    var foo14 = function foo14() {
        return "";
    };
    var foo14 = function foo14() {
        return "";
    };
    var foo15 = function foo15() {
        return "";
    };
    var foo15 = function foo15(value) {};
    var foo16 = function foo16() {
        return "";
    };
    var foo16 = function foo16() {};
    var foo17 = function foo17() {
        return "";
    };
    var foo17 = function foo17() {};
    var foo18 = function foo18() {
        return "";
    };
    var foo18 = function foo18() {
        return "";
    };
    var foo19 = function foo19() {
        return "";
    };
    var foo19 = function foo19(value) {};
    var _foo = new WeakSet();
    var A_Getter_Field = function A_Getter_Field() {
        "use strict";
        _classCallCheck(this, A_Getter_Field);
        _classPrivateMethodInit(this, _foo);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo15 = new WeakSet(), _foo15 = new WeakSet();
    var A_Getter_Method = function A_Getter_Method() {
        "use strict";
        _classCallCheck(this, A_Getter_Method);
        _classPrivateMethodInit(this, _foo15);
        _classPrivateMethodInit(this, _foo15);
    };
    var _foo16 = new WeakSet(), _foo16 = new WeakSet();
    var A_Getter_Getter = function A_Getter_Getter() {
        "use strict";
        _classCallCheck(this, A_Getter_Getter);
        _classPrivateMethodInit(this, _foo16);
        _classPrivateMethodInit(this, _foo16);
    };
    var _foo17 = new WeakSet(), _foo17 = new WeakSet();
    var A_Getter_Setter = function A_Getter_Setter() {
        "use strict";
        _classCallCheck(this, A_Getter_Setter);
        _classPrivateMethodInit(this, _foo17);
        _classPrivateMethodInit(this, _foo17);
    };
    var _foo18 = new WeakSet();
    var A_Getter_StaticField = function A_Getter_StaticField() {
        "use strict";
        _classCallCheck(this, A_Getter_StaticField);
        _classPrivateMethodInit(this, _foo18);
    };
    var _foo19 = new WeakSet();
    var A_Getter_StaticMethod = function A_Getter_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_Getter_StaticMethod);
        _classPrivateMethodInit(this, _foo19);
    };
    var _foo20 = new WeakSet();
    var A_Getter_StaticGetter = function A_Getter_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_Getter_StaticGetter);
        _classPrivateMethodInit(this, _foo20);
    };
    var _foo21 = new WeakSet();
    var A_Getter_StaticSetter = function A_Getter_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_Getter_StaticSetter);
        _classPrivateMethodInit(this, _foo21);
    };
}
function Setter() {
    var foo = function foo(value) {};
    var foo20 = function foo20(value) {};
    var foo20 = function foo20() {};
    var foo21 = function foo21(value) {};
    var foo21 = function foo21() {
        return "";
    };
    var foo22 = function foo22(value) {};
    var foo22 = function foo22(value) {};
    var foo23 = function foo23(value) {};
    var foo24 = function foo24(value) {};
    var foo24 = function foo24() {};
    var foo25 = function foo25(value) {};
    var foo25 = function foo25() {
        return "";
    };
    var foo26 = function foo26(value) {};
    var foo26 = function foo26(value) {};
    var _foo = new WeakSet();
    var A_Setter_Field = function A_Setter_Field() {
        "use strict";
        _classCallCheck(this, A_Setter_Field);
        _classPrivateMethodInit(this, _foo);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo22 = new WeakSet(), _foo22 = new WeakSet();
    var A_Setter_Method = function A_Setter_Method() {
        "use strict";
        _classCallCheck(this, A_Setter_Method);
        _classPrivateMethodInit(this, _foo22);
        _classPrivateMethodInit(this, _foo22);
    };
    var _foo23 = new WeakSet(), _foo23 = new WeakSet();
    var A_Setter_Getter = function A_Setter_Getter() {
        "use strict";
        _classCallCheck(this, A_Setter_Getter);
        _classPrivateMethodInit(this, _foo23);
        _classPrivateMethodInit(this, _foo23);
    };
    var _foo24 = new WeakSet(), _foo24 = new WeakSet();
    var A_Setter_Setter = function A_Setter_Setter() {
        "use strict";
        _classCallCheck(this, A_Setter_Setter);
        _classPrivateMethodInit(this, _foo24);
        _classPrivateMethodInit(this, _foo24);
    };
    var _foo25 = new WeakSet();
    var A_Setter_StaticField = function A_Setter_StaticField() {
        "use strict";
        _classCallCheck(this, A_Setter_StaticField);
        _classPrivateMethodInit(this, _foo25);
    };
    var _foo25 = {
        writable: true,
        value: "foo"
    };
    var _foo26 = new WeakSet();
    var A_Setter_StaticMethod = function A_Setter_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_Setter_StaticMethod);
        _classPrivateMethodInit(this, _foo26);
    };
    var _foo27 = new WeakSet();
    var A_Setter_StaticGetter = function A_Setter_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_Setter_StaticGetter);
        _classPrivateMethodInit(this, _foo27);
    };
    var _foo28 = new WeakSet();
    var A_Setter_StaticSetter = function A_Setter_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_Setter_StaticSetter);
        _classPrivateMethodInit(this, _foo28);
    };
}
function StaticField() {
    var foo = function foo() {};
    var foo27 = function foo27() {
        return "";
    };
    var foo28 = function foo28(value) {};
    var foo29 = function foo29() {};
    var foo30 = function foo30() {
        return "";
    };
    var foo31 = function foo31(value) {};
    var A_StaticField_Field = function A_StaticField_Field() {
        "use strict";
        _classCallCheck(this, A_StaticField_Field);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = {
        writable: true,
        value: "foo"
    };
    var _foo = new WeakMap();
    var _foo29 = new WeakSet();
    var A_StaticField_Method = function A_StaticField_Method() {
        "use strict";
        _classCallCheck(this, A_StaticField_Method);
        _classPrivateMethodInit(this, _foo29);
    };
    var _foo29 = {
        writable: true,
        value: "foo"
    };
    var _foo30 = new WeakSet();
    var A_StaticField_Getter = function A_StaticField_Getter() {
        "use strict";
        _classCallCheck(this, A_StaticField_Getter);
        _classPrivateMethodInit(this, _foo30);
    };
    var _foo30 = {
        writable: true,
        value: "foo"
    };
    var _foo31 = new WeakSet();
    var A_StaticField_Setter = function A_StaticField_Setter() {
        "use strict";
        _classCallCheck(this, A_StaticField_Setter);
        _classPrivateMethodInit(this, _foo31);
    };
    var _foo31 = {
        writable: true,
        value: "foo"
    };
    var A_StaticField_StaticField = function A_StaticField_StaticField() {
        "use strict";
        _classCallCheck(this, A_StaticField_StaticField);
    };
    var _foo32 = {
        writable: true,
        value: "foo"
    };
    var _foo32 = {
        writable: true,
        value: "foo"
    };
    var A_StaticField_StaticMethod = function A_StaticField_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_StaticField_StaticMethod);
    };
    var _foo33 = {
        writable: true,
        value: "foo"
    };
    var A_StaticField_StaticGetter = function A_StaticField_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_StaticField_StaticGetter);
    };
    var _foo34 = {
        writable: true,
        value: "foo"
    };
    var A_StaticField_StaticSetter = function A_StaticField_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_StaticField_StaticSetter);
    };
    var _foo35 = {
        writable: true,
        value: "foo"
    };
}
function StaticMethod() {
    var foo = function foo() {};
    var foo32 = function foo32() {};
    var foo32 = function foo32() {};
    var foo33 = function foo33() {};
    var foo33 = function foo33() {
        return "";
    };
    var foo34 = function foo34() {};
    var foo34 = function foo34(value) {};
    var foo35 = function foo35() {};
    var foo36 = function foo36() {};
    var foo36 = function foo36() {};
    var foo37 = function foo37() {};
    var foo37 = function foo37() {
        return "";
    };
    var foo38 = function foo38() {};
    var foo38 = function foo38(value) {};
    var A_StaticMethod_Field = function A_StaticMethod_Field() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_Field);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo36 = new WeakSet();
    var A_StaticMethod_Method = function A_StaticMethod_Method() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_Method);
        _classPrivateMethodInit(this, _foo36);
    };
    var _foo37 = new WeakSet();
    var A_StaticMethod_Getter = function A_StaticMethod_Getter() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_Getter);
        _classPrivateMethodInit(this, _foo37);
    };
    var _foo38 = new WeakSet();
    var A_StaticMethod_Setter = function A_StaticMethod_Setter() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_Setter);
        _classPrivateMethodInit(this, _foo38);
    };
    var A_StaticMethod_StaticField = function A_StaticMethod_StaticField() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_StaticField);
    };
    var _foo39 = {
        writable: true,
        value: "foo"
    };
    var A_StaticMethod_StaticMethod = function A_StaticMethod_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_StaticMethod);
    };
    var A_StaticMethod_StaticGetter = function A_StaticMethod_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_StaticGetter);
    };
    var A_StaticMethod_StaticSetter = function A_StaticMethod_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_StaticMethod_StaticSetter);
    };
}
function StaticGetter() {
    var foo = function foo() {
        return "";
    };
    var foo39 = function foo39() {
        return "";
    };
    var foo39 = function foo39() {};
    var foo40 = function foo40() {
        return "";
    };
    var foo40 = function foo40() {
        return "";
    };
    var foo41 = function foo41() {
        return "";
    };
    var foo41 = function foo41(value) {};
    var foo42 = function foo42() {
        return "";
    };
    var foo42 = function foo42() {};
    var foo43 = function foo43() {
        return "";
    };
    var foo43 = function foo43() {};
    var foo44 = function foo44() {
        return "";
    };
    var foo44 = function foo44() {
        return "";
    };
    var foo45 = function foo45() {
        return "";
    };
    var foo45 = function foo45(value) {};
    var A_StaticGetter_Field = function A_StaticGetter_Field() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_Field);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo40 = new WeakSet();
    var A_StaticGetter_Method = function A_StaticGetter_Method() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_Method);
        _classPrivateMethodInit(this, _foo40);
    };
    var _foo41 = new WeakSet();
    var A_StaticGetter_Getter = function A_StaticGetter_Getter() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_Getter);
        _classPrivateMethodInit(this, _foo41);
    };
    var _foo42 = new WeakSet();
    var A_StaticGetter_Setter = function A_StaticGetter_Setter() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_Setter);
        _classPrivateMethodInit(this, _foo42);
    };
    var A_StaticGetter_StaticField = function A_StaticGetter_StaticField() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_StaticField);
    };
    var A_StaticGetter_StaticMethod = function A_StaticGetter_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_StaticMethod);
    };
    var A_StaticGetter_StaticGetter = function A_StaticGetter_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_StaticGetter);
    };
    var A_StaticGetter_StaticSetter = function A_StaticGetter_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_StaticGetter_StaticSetter);
    };
}
function StaticSetter() {
    var foo = function foo(value) {};
    var foo46 = function foo46(value) {};
    var foo46 = function foo46() {};
    var foo47 = function foo47(value) {};
    var foo47 = function foo47() {
        return "";
    };
    var foo48 = function foo48(value) {};
    var foo48 = function foo48(value) {};
    var foo49 = function foo49(value) {};
    var foo50 = function foo50(value) {};
    var foo50 = function foo50() {};
    var foo51 = function foo51(value) {};
    var foo51 = function foo51() {
        return "";
    };
    var foo52 = function foo52(value) {};
    var foo52 = function foo52(value) {};
    var A_StaticSetter_Field = function A_StaticSetter_Field() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_Field);
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = new WeakMap();
    var _foo43 = new WeakSet();
    var A_StaticSetter_Method = function A_StaticSetter_Method() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_Method);
        _classPrivateMethodInit(this, _foo43);
    };
    var _foo44 = new WeakSet();
    var A_StaticSetter_Getter = function A_StaticSetter_Getter() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_Getter);
        _classPrivateMethodInit(this, _foo44);
    };
    var _foo45 = new WeakSet();
    var A_StaticSetter_Setter = function A_StaticSetter_Setter() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_Setter);
        _classPrivateMethodInit(this, _foo45);
    };
    var A_StaticSetter_StaticField = function A_StaticSetter_StaticField() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_StaticField);
    };
    var _foo46 = {
        writable: true,
        value: "foo"
    };
    var A_StaticSetter_StaticMethod = function A_StaticSetter_StaticMethod() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_StaticMethod);
    };
    var A_StaticSetter_StaticGetter = function A_StaticSetter_StaticGetter() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_StaticGetter);
    };
    var A_StaticSetter_StaticSetter = function A_StaticSetter_StaticSetter() {
        "use strict";
        _classCallCheck(this, A_StaticSetter_StaticSetter);
    };
}
