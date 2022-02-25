function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
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
    var _foo = new WeakMap(), _foo = new WeakMap();
    // Error
    class A_Field_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo1 = new WeakMap(), _foo1 = new WeakSet();
    // Error
    class A_Field_Method {
        constructor(){
            _classPrivateFieldInit(this, _foo1, {
                writable: true,
                value: "foo"
            });
            _classPrivateMethodInit(this, _foo1);
        }
    }
    function foo() {}
    var _foo2 = new WeakMap(), _foo2 = new WeakMap();
    // Error
    class A_Field_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo2, {
                writable: true,
                value: "foo"
            });
            _classPrivateFieldInit(this, _foo2, {
                get: get_foo,
                set: void 0
            });
        }
    }
    function get_foo() {
        return "";
    }
    var _foo3 = new WeakMap(), _foo3 = new WeakMap();
    // Error
    class A_Field_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo3, {
                writable: true,
                value: "foo"
            });
            _classPrivateFieldInit(this, _foo3, {
                get: void 0,
                set: set_foo
            });
        }
    }
    function set_foo(value) {}
    var _foo4 = new WeakMap();
    // Error
    class A_Field_StaticField {
        constructor(){
            _classPrivateFieldInit(this, _foo4, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo5 = new WeakMap();
    // Error
    class A_Field_StaticMethod {
        constructor(){
            _classPrivateFieldInit(this, _foo5, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo1() {}
    var _foo6 = new WeakMap();
    // Error
    class A_Field_StaticGetter {
        constructor(){
            _classPrivateFieldInit(this, _foo6, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    function get_foo1() {
        return "";
    }
    var _foo7 = new WeakMap();
    // Error
    class A_Field_StaticSetter {
        constructor(){
            _classPrivateFieldInit(this, _foo7, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
    function set_foo1(value) {}
}
function Method() {
    var _foo = new WeakSet(), _foo = new WeakMap();
    // Error
    class A_Method_Field {
        constructor(){
            _classPrivateMethodInit(this, _foo);
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo() {}
    var _foo8 = new WeakSet(), _foo8 = new WeakSet();
    // Error
    class A_Method_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo8);
            _classPrivateMethodInit(this, _foo8);
        }
    }
    function foo2() {}
    function foo2() {}
    var _foo9 = new WeakSet(), _foo9 = new WeakMap();
    // Error
    class A_Method_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo9);
            _classPrivateFieldInit(this, _foo9, {
                get: get_foo,
                set: void 0
            });
        }
    }
    function foo3() {}
    function get_foo() {
        return "";
    }
    var _foo10 = new WeakSet(), _foo10 = new WeakMap();
    // Error
    class A_Method_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo10);
            _classPrivateFieldInit(this, _foo10, {
                get: void 0,
                set: set_foo
            });
        }
    }
    function foo4() {}
    function set_foo(value) {}
    var _foo11 = new WeakSet();
    // Error
    class A_Method_StaticField {
        constructor(){
            _classPrivateMethodInit(this, _foo11);
        }
    }
    var _foo11 = {
        writable: true,
        value: "foo"
    };
    function foo5() {}
    var _foo12 = new WeakSet();
    // Error
    class A_Method_StaticMethod {
        constructor(){
            _classPrivateMethodInit(this, _foo12);
        }
    }
    function foo6() {}
    function foo6() {}
    var _foo13 = new WeakSet();
    // Error
    class A_Method_StaticGetter {
        constructor(){
            _classPrivateMethodInit(this, _foo13);
        }
    }
    var _foo13 = {
        get: get_foo2,
        set: void 0
    };
    function foo7() {}
    function get_foo2() {
        return "";
    }
    var _foo14 = new WeakSet();
    // Error
    class A_Method_StaticSetter {
        constructor(){
            _classPrivateMethodInit(this, _foo14);
        }
    }
    var _foo14 = {
        get: void 0,
        set: set_foo2
    };
    function foo8() {}
    function set_foo2(value) {}
}
function Getter() {
    var _foo = new WeakMap(), _foo = new WeakMap();
    // Error
    class A_Getter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                get: get_foo,
                set: void 0
            });
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function get_foo() {
        return "";
    }
    var _foo15 = new WeakMap(), _foo15 = new WeakSet();
    // Error
    class A_Getter_Method {
        constructor(){
            _classPrivateFieldInit(this, _foo15, {
                get: get_foo3,
                set: void 0
            });
            _classPrivateMethodInit(this, _foo15);
        }
    }
    function get_foo3() {
        return "";
    }
    function foo() {}
    var _foo16 = new WeakMap();
    // Error
    class A_Getter_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo16, {
                get: get_foo4,
                set: void 0
            });
        }
    }
    function get_foo4() {
        return "";
    }
    function get_foo4() {
        return "";
    }
    var _foo17 = new WeakMap();
    //OK
    class A_Getter_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo17, {
                get: get_foo5,
                set: set_foo
            });
        }
    }
    function get_foo5() {
        return "";
    }
    function set_foo(value) {}
    var _foo18 = new WeakMap();
    // Error
    class A_Getter_StaticField {
        constructor(){
            _classPrivateFieldInit(this, _foo18, {
                get: get_foo6,
                set: void 0
            });
        }
    }
    function get_foo6() {
        return "";
    }
    function foo9() {}
    var _foo19 = new WeakMap();
    // Error
    class A_Getter_StaticMethod {
        constructor(){
            _classPrivateFieldInit(this, _foo19, {
                get: get_foo7,
                set: void 0
            });
        }
    }
    function get_foo7() {
        return "";
    }
    function foo10() {}
    var _foo20 = new WeakMap();
    // Error
    class A_Getter_StaticGetter {
        constructor(){
            _classPrivateFieldInit(this, _foo20, {
                get: get_foo8,
                set: void 0
            });
        }
    }
    var _foo20 = {
        get: get_foo8,
        set: void 0
    };
    function get_foo8() {
        return "";
    }
    function get_foo8() {
        return "";
    }
    var _foo21 = new WeakMap();
    // Error
    class A_Getter_StaticSetter {
        constructor(){
            _classPrivateFieldInit(this, _foo21, {
                get: get_foo9,
                set: void 0
            });
        }
    }
    var _foo21 = {
        get: void 0,
        set: set_foo3
    };
    function get_foo9() {
        return "";
    }
    function set_foo3(value) {}
}
function Setter() {
    var _foo = new WeakMap(), _foo = new WeakMap();
    // Error
    class A_Setter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                get: void 0,
                set: set_foo
            });
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function set_foo(value) {}
    var _foo22 = new WeakMap(), _foo22 = new WeakSet();
    // Error
    class A_Setter_Method {
        constructor(){
            _classPrivateFieldInit(this, _foo22, {
                get: void 0,
                set: set_foo4
            });
            _classPrivateMethodInit(this, _foo22);
        }
    }
    function set_foo4(value) {}
    function foo() {}
    var _foo23 = new WeakMap();
    // OK
    class A_Setter_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo23, {
                get: get_foo,
                set: set_foo5
            });
        }
    }
    function set_foo5(value) {}
    function get_foo() {
        return "";
    }
    var _foo24 = new WeakMap();
    // Error
    class A_Setter_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo24, {
                get: void 0,
                set: set_foo6
            });
        }
    }
    function set_foo6(value) {}
    function set_foo6(value) {}
    var _foo25 = new WeakMap();
    // Error
    class A_Setter_StaticField {
        constructor(){
            _classPrivateFieldInit(this, _foo25, {
                get: void 0,
                set: set_foo7
            });
        }
    }
    var _foo25 = {
        writable: true,
        value: "foo"
    };
    function set_foo7(value) {}
    var _foo26 = new WeakMap();
    // Error
    class A_Setter_StaticMethod {
        constructor(){
            _classPrivateFieldInit(this, _foo26, {
                get: void 0,
                set: set_foo8
            });
        }
    }
    function set_foo8(value) {}
    function foo11() {}
    var _foo27 = new WeakMap();
    // Error
    class A_Setter_StaticGetter {
        constructor(){
            _classPrivateFieldInit(this, _foo27, {
                get: void 0,
                set: set_foo9
            });
        }
    }
    var _foo27 = {
        get: get_foo10,
        set: void 0
    };
    function set_foo9(value) {}
    function get_foo10() {
        return "";
    }
    var _foo28 = new WeakMap();
    // Error
    class A_Setter_StaticSetter {
        constructor(){
            _classPrivateFieldInit(this, _foo28, {
                get: void 0,
                set: set_foo10
            });
        }
    }
    var _foo28 = {
        get: void 0,
        set: set_foo10
    };
    function set_foo10(value) {}
    function set_foo10(value) {}
}
function StaticField() {
    var _foo = new WeakMap();
    // Error
    class A_StaticField_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = {
        writable: true,
        value: "foo"
    };
    var _foo29 = new WeakSet();
    // Error
    class A_StaticField_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo29);
        }
    }
    var _foo29 = {
        writable: true,
        value: "foo"
    };
    function foo() {}
    var _foo30 = new WeakMap();
    // Error
    class A_StaticField_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo30, {
                get: get_foo,
                set: void 0
            });
        }
    }
    var _foo30 = {
        writable: true,
        value: "foo"
    };
    function get_foo() {
        return "";
    }
    var _foo31 = new WeakMap();
    // Error
    class A_StaticField_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo31, {
                get: void 0,
                set: set_foo
            });
        }
    }
    var _foo31 = {
        writable: true,
        value: "foo"
    };
    function set_foo(value) {}
    // Error
    class A_StaticField_StaticField {
    }
    var _foo32 = {
        writable: true,
        value: "foo"
    };
    var _foo32 = {
        writable: true,
        value: "foo"
    };
    // Error
    class A_StaticField_StaticMethod {
    }
    var _foo33 = {
        writable: true,
        value: "foo"
    };
    function foo12() {}
    // Error
    class A_StaticField_StaticGetter {
    }
    var _foo34 = {
        writable: true,
        value: "foo"
    };
    var _foo34 = {
        get: get_foo11,
        set: void 0
    };
    function get_foo11() {
        return "";
    }
    // Error
    class A_StaticField_StaticSetter {
    }
    var _foo35 = {
        writable: true,
        value: "foo"
    };
    var _foo35 = {
        get: void 0,
        set: set_foo11
    };
    function set_foo11(value) {}
}
function StaticMethod() {
    var _foo = new WeakMap();
    // Error
    class A_StaticMethod_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo() {}
    var _foo36 = new WeakSet();
    // Error
    class A_StaticMethod_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo36);
        }
    }
    function foo13() {}
    function foo13() {}
    var _foo37 = new WeakMap();
    // Error
    class A_StaticMethod_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo37, {
                get: get_foo,
                set: void 0
            });
        }
    }
    function foo14() {}
    function get_foo() {
        return "";
    }
    var _foo38 = new WeakMap();
    // Error
    class A_StaticMethod_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo38, {
                get: void 0,
                set: set_foo
            });
        }
    }
    function foo15() {}
    function set_foo(value) {}
    // Error
    class A_StaticMethod_StaticField {
    }
    var _foo39 = {
        writable: true,
        value: "foo"
    };
    function foo16() {}
    // Error
    class A_StaticMethod_StaticMethod {
    }
    function foo17() {}
    function foo17() {}
    // Error
    class A_StaticMethod_StaticGetter {
    }
    var _foo40 = {
        get: get_foo12,
        set: void 0
    };
    function foo18() {}
    function get_foo12() {
        return "";
    }
    // Error
    class A_StaticMethod_StaticSetter {
    }
    var _foo41 = {
        get: void 0,
        set: set_foo12
    };
    function foo19() {}
    function set_foo12(value) {}
}
function StaticGetter() {
    var _foo = new WeakMap();
    // Error
    class A_StaticGetter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = {
        get: get_foo,
        set: void 0
    };
    function get_foo() {
        return "";
    }
    var _foo42 = new WeakSet();
    // Error
    class A_StaticGetter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo42);
        }
    }
    var _foo42 = {
        get: get_foo13,
        set: void 0
    };
    function get_foo13() {
        return "";
    }
    function foo() {}
    var _foo43 = new WeakMap();
    // Error
    class A_StaticGetter_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo43, {
                get: get_foo14,
                set: void 0
            });
        }
    }
    var _foo43 = {
        get: get_foo14,
        set: void 0
    };
    function get_foo14() {
        return "";
    }
    function get_foo14() {
        return "";
    }
    var _foo44 = new WeakMap();
    // Error
    class A_StaticGetter_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo44, {
                get: void 0,
                set: set_foo
            });
        }
    }
    var _foo44 = {
        get: get_foo15,
        set: void 0
    };
    function get_foo15() {
        return "";
    }
    function set_foo(value) {}
    // Error
    class A_StaticGetter_StaticField {
    }
    var _foo45 = {
        get: get_foo16,
        set: void 0
    };
    function get_foo16() {
        return "";
    }
    function foo20() {}
    // Error
    class A_StaticGetter_StaticMethod {
    }
    var _foo46 = {
        get: get_foo17,
        set: void 0
    };
    function get_foo17() {
        return "";
    }
    function foo21() {}
    // Error
    class A_StaticGetter_StaticGetter {
    }
    var _foo47 = {
        get: get_foo18,
        set: void 0
    };
    function get_foo18() {
        return "";
    }
    function get_foo18() {
        return "";
    }
    // OK
    class A_StaticGetter_StaticSetter {
    }
    var _foo48 = {
        get: get_foo19,
        set: set_foo13
    };
    function get_foo19() {
        return "";
    }
    function set_foo13(value) {}
}
function StaticSetter() {
    var _foo = new WeakMap();
    // Error
    class A_StaticSetter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = {
        get: void 0,
        set: set_foo
    };
    function set_foo(value) {}
    var _foo49 = new WeakSet();
    // Error
    class A_StaticSetter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo49);
        }
    }
    var _foo49 = {
        get: void 0,
        set: set_foo14
    };
    function set_foo14(value) {}
    function foo() {}
    var _foo50 = new WeakMap();
    // Error
    class A_StaticSetter_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo50, {
                get: get_foo,
                set: void 0
            });
        }
    }
    var _foo50 = {
        get: void 0,
        set: set_foo15
    };
    function set_foo15(value) {}
    function get_foo() {
        return "";
    }
    var _foo51 = new WeakMap();
    // Error
    class A_StaticSetter_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo51, {
                get: void 0,
                set: set_foo16
            });
        }
    }
    var _foo51 = {
        get: void 0,
        set: set_foo16
    };
    function set_foo16(value) {}
    function set_foo16(value) {}
    // Error
    class A_StaticSetter_StaticField {
    }
    var _foo52 = {
        get: void 0,
        set: set_foo17
    };
    var _foo52 = {
        writable: true,
        value: "foo"
    };
    function set_foo17(value) {}
    // Error
    class A_StaticSetter_StaticMethod {
    }
    var _foo53 = {
        get: void 0,
        set: set_foo18
    };
    function set_foo18(value) {}
    function foo22() {}
    // OK
    class A_StaticSetter_StaticGetter {
    }
    var _foo54 = {
        get: get_foo20,
        set: set_foo19
    };
    function set_foo19(value) {}
    function get_foo20() {
        return "";
    }
    // Error
    class A_StaticSetter_StaticSetter {
    }
    var _foo55 = {
        get: void 0,
        set: set_foo20
    };
    function set_foo20(value) {}
    function set_foo20(value) {}
}
