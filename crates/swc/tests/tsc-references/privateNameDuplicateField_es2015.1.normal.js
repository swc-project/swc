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
    var _foo = new WeakMap();
    var _foo = new WeakMap();
    var _foo1 = new WeakSet();
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
    var _foo1 = new WeakMap();
    function foo() {}
    var _foo2 = new WeakSet();
    // Error
    class A_Field_Getter {
        constructor(){
            _classPrivateFieldInit(this, _foo2, {
                writable: true,
                value: "foo"
            });
            _classPrivateMethodInit(this, _foo2);
        }
    }
    var _foo2 = new WeakMap();
    function foo1() {
        return "";
    }
    var _foo3 = new WeakSet();
    // Error
    class A_Field_Setter {
        constructor(){
            _classPrivateFieldInit(this, _foo3, {
                writable: true,
                value: "foo"
            });
            _classPrivateMethodInit(this, _foo3);
        }
    }
    var _foo3 = new WeakMap();
    function foo2(value) {}
    // Error
    class A_Field_StaticField {
        constructor(){
            _classPrivateFieldInit(this, _foo4, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo4 = new WeakMap();
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    // Error
    class A_Field_StaticMethod {
        constructor(){
            _classPrivateFieldInit(this, _foo5, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo5 = new WeakMap();
    function foo3() {}
    // Error
    class A_Field_StaticGetter {
        constructor(){
            _classPrivateFieldInit(this, _foo6, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo6 = new WeakMap();
    function foo4() {
        return "";
    }
    // Error
    class A_Field_StaticSetter {
        constructor(){
            _classPrivateFieldInit(this, _foo7, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo7 = new WeakMap();
    function foo5(value) {}
}
function Method() {
    var _foo = new WeakSet();
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
    var _foo = new WeakMap();
    function foo() {}
    var _foo8 = new WeakSet(), _foo8 = new WeakSet();
    // Error
    class A_Method_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo8);
            _classPrivateMethodInit(this, _foo8);
        }
    }
    function foo6() {}
    function foo6() {}
    var _foo9 = new WeakSet(), _foo9 = new WeakSet();
    // Error
    class A_Method_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo9);
            _classPrivateMethodInit(this, _foo9);
        }
    }
    function foo7() {}
    function foo7() {
        return "";
    }
    var _foo10 = new WeakSet(), _foo10 = new WeakSet();
    // Error
    class A_Method_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo10);
            _classPrivateMethodInit(this, _foo10);
        }
    }
    function foo8() {}
    function foo8(value) {}
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
    function foo9() {}
    var _foo12 = new WeakSet();
    // Error
    class A_Method_StaticMethod {
        constructor(){
            _classPrivateMethodInit(this, _foo12);
        }
    }
    function foo10() {}
    function foo10() {}
    var _foo13 = new WeakSet();
    // Error
    class A_Method_StaticGetter {
        constructor(){
            _classPrivateMethodInit(this, _foo13);
        }
    }
    function foo11() {}
    function foo11() {
        return "";
    }
    var _foo14 = new WeakSet();
    // Error
    class A_Method_StaticSetter {
        constructor(){
            _classPrivateMethodInit(this, _foo14);
        }
    }
    function foo12() {}
    function foo12(value) {}
}
function Getter() {
    var _foo = new WeakSet();
    // Error
    class A_Getter_Field {
        constructor(){
            _classPrivateMethodInit(this, _foo);
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = new WeakMap();
    function foo() {
        return "";
    }
    var _foo15 = new WeakSet(), _foo15 = new WeakSet();
    // Error
    class A_Getter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo15);
            _classPrivateMethodInit(this, _foo15);
        }
    }
    function foo13() {
        return "";
    }
    function foo13() {}
    var _foo16 = new WeakSet(), _foo16 = new WeakSet();
    // Error
    class A_Getter_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo16);
            _classPrivateMethodInit(this, _foo16);
        }
    }
    function foo14() {
        return "";
    }
    function foo14() {
        return "";
    }
    var _foo17 = new WeakSet(), _foo17 = new WeakSet();
    //OK
    class A_Getter_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo17);
            _classPrivateMethodInit(this, _foo17);
        }
    }
    function foo15() {
        return "";
    }
    function foo15(value) {}
    var _foo18 = new WeakSet();
    // Error
    class A_Getter_StaticField {
        constructor(){
            _classPrivateMethodInit(this, _foo18);
        }
    }
    function foo16() {
        return "";
    }
    function foo16() {}
    var _foo19 = new WeakSet();
    // Error
    class A_Getter_StaticMethod {
        constructor(){
            _classPrivateMethodInit(this, _foo19);
        }
    }
    function foo17() {
        return "";
    }
    function foo17() {}
    var _foo20 = new WeakSet();
    // Error
    class A_Getter_StaticGetter {
        constructor(){
            _classPrivateMethodInit(this, _foo20);
        }
    }
    function foo18() {
        return "";
    }
    function foo18() {
        return "";
    }
    var _foo21 = new WeakSet();
    // Error
    class A_Getter_StaticSetter {
        constructor(){
            _classPrivateMethodInit(this, _foo21);
        }
    }
    function foo19() {
        return "";
    }
    function foo19(value) {}
}
function Setter() {
    var _foo = new WeakSet();
    // Error
    class A_Setter_Field {
        constructor(){
            _classPrivateMethodInit(this, _foo);
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = new WeakMap();
    function foo(value) {}
    var _foo22 = new WeakSet(), _foo22 = new WeakSet();
    // Error
    class A_Setter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo22);
            _classPrivateMethodInit(this, _foo22);
        }
    }
    function foo20(value) {}
    function foo20() {}
    var _foo23 = new WeakSet(), _foo23 = new WeakSet();
    // OK
    class A_Setter_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo23);
            _classPrivateMethodInit(this, _foo23);
        }
    }
    function foo21(value) {}
    function foo21() {
        return "";
    }
    var _foo24 = new WeakSet(), _foo24 = new WeakSet();
    // Error
    class A_Setter_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo24);
            _classPrivateMethodInit(this, _foo24);
        }
    }
    function foo22(value) {}
    function foo22(value) {}
    var _foo25 = new WeakSet();
    // Error
    class A_Setter_StaticField {
        constructor(){
            _classPrivateMethodInit(this, _foo25);
        }
    }
    var _foo25 = {
        writable: true,
        value: "foo"
    };
    function foo23(value) {}
    var _foo26 = new WeakSet();
    // Error
    class A_Setter_StaticMethod {
        constructor(){
            _classPrivateMethodInit(this, _foo26);
        }
    }
    function foo24(value) {}
    function foo24() {}
    var _foo27 = new WeakSet();
    // Error
    class A_Setter_StaticGetter {
        constructor(){
            _classPrivateMethodInit(this, _foo27);
        }
    }
    function foo25(value) {}
    function foo25() {
        return "";
    }
    var _foo28 = new WeakSet();
    // Error
    class A_Setter_StaticSetter {
        constructor(){
            _classPrivateMethodInit(this, _foo28);
        }
    }
    function foo26(value) {}
    function foo26(value) {}
}
function StaticField() {
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
    var _foo = new WeakMap();
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
    var _foo30 = new WeakSet();
    // Error
    class A_StaticField_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo30);
        }
    }
    var _foo30 = {
        writable: true,
        value: "foo"
    };
    function foo27() {
        return "";
    }
    var _foo31 = new WeakSet();
    // Error
    class A_StaticField_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo31);
        }
    }
    var _foo31 = {
        writable: true,
        value: "foo"
    };
    function foo28(value) {}
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
    function foo29() {}
    // Error
    class A_StaticField_StaticGetter {
    }
    var _foo34 = {
        writable: true,
        value: "foo"
    };
    function foo30() {
        return "";
    }
    // Error
    class A_StaticField_StaticSetter {
    }
    var _foo35 = {
        writable: true,
        value: "foo"
    };
    function foo31(value) {}
}
function StaticMethod() {
    // Error
    class A_StaticMethod_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = new WeakMap();
    function foo() {}
    var _foo36 = new WeakSet();
    // Error
    class A_StaticMethod_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo36);
        }
    }
    function foo32() {}
    function foo32() {}
    var _foo37 = new WeakSet();
    // Error
    class A_StaticMethod_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo37);
        }
    }
    function foo33() {}
    function foo33() {
        return "";
    }
    var _foo38 = new WeakSet();
    // Error
    class A_StaticMethod_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo38);
        }
    }
    function foo34() {}
    function foo34(value) {}
    // Error
    class A_StaticMethod_StaticField {
    }
    var _foo39 = {
        writable: true,
        value: "foo"
    };
    function foo35() {}
    // Error
    class A_StaticMethod_StaticMethod {
    }
    function foo36() {}
    function foo36() {}
    // Error
    class A_StaticMethod_StaticGetter {
    }
    function foo37() {}
    function foo37() {
        return "";
    }
    // Error
    class A_StaticMethod_StaticSetter {
    }
    function foo38() {}
    function foo38(value) {}
}
function StaticGetter() {
    // Error
    class A_StaticGetter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = new WeakMap();
    function foo() {
        return "";
    }
    var _foo40 = new WeakSet();
    // Error
    class A_StaticGetter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo40);
        }
    }
    function foo39() {
        return "";
    }
    function foo39() {}
    var _foo41 = new WeakSet();
    // Error
    class A_StaticGetter_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo41);
        }
    }
    function foo40() {
        return "";
    }
    function foo40() {
        return "";
    }
    var _foo42 = new WeakSet();
    // Error
    class A_StaticGetter_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo42);
        }
    }
    function foo41() {
        return "";
    }
    function foo41(value) {}
    // Error
    class A_StaticGetter_StaticField {
    }
    function foo42() {
        return "";
    }
    function foo42() {}
    // Error
    class A_StaticGetter_StaticMethod {
    }
    function foo43() {
        return "";
    }
    function foo43() {}
    // Error
    class A_StaticGetter_StaticGetter {
    }
    function foo44() {
        return "";
    }
    function foo44() {
        return "";
    }
    // OK
    class A_StaticGetter_StaticSetter {
    }
    function foo45() {
        return "";
    }
    function foo45(value) {}
}
function StaticSetter() {
    // Error
    class A_StaticSetter_Field {
        constructor(){
            _classPrivateFieldInit(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = new WeakMap();
    function foo(value) {}
    var _foo43 = new WeakSet();
    // Error
    class A_StaticSetter_Method {
        constructor(){
            _classPrivateMethodInit(this, _foo43);
        }
    }
    function foo46(value) {}
    function foo46() {}
    var _foo44 = new WeakSet();
    // Error
    class A_StaticSetter_Getter {
        constructor(){
            _classPrivateMethodInit(this, _foo44);
        }
    }
    function foo47(value) {}
    function foo47() {
        return "";
    }
    var _foo45 = new WeakSet();
    // Error
    class A_StaticSetter_Setter {
        constructor(){
            _classPrivateMethodInit(this, _foo45);
        }
    }
    function foo48(value) {}
    function foo48(value) {}
    // Error
    class A_StaticSetter_StaticField {
    }
    var _foo46 = {
        writable: true,
        value: "foo"
    };
    function foo49(value) {}
    // Error
    class A_StaticSetter_StaticMethod {
    }
    function foo50(value) {}
    function foo50() {}
    // OK
    class A_StaticSetter_StaticGetter {
    }
    function foo51(value) {}
    function foo51() {
        return "";
    }
    // Error
    class A_StaticSetter_StaticSetter {
    }
    function foo52(value) {}
    function foo52(value) {}
}
