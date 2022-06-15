import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
// @strict: true
// @target: es6
function Field() {
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Field_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
            _class_private_field_init(this, _foo1, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap(), _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: void 0
            });
            _class_private_field_init(this, _foo2, {
                writable: true,
                value: "foo"
            });
        }
    }
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap(), _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo
            });
            _class_private_field_init(this, _foo3, {
                writable: true,
                value: "foo"
            });
        }
    }
    function set_foo(value) {}
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_StaticField {
        constructor(){
            _class_private_field_init(this, _foo4, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_StaticMethod {
        constructor(){
            _class_private_field_init(this, _foo5, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo1() {}
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_StaticGetter {
        constructor(){
            _class_private_field_init(this, _foo6, {
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
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Field_StaticSetter {
        constructor(){
            _class_private_field_init(this, _foo7, {
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
    var _foo = /*#__PURE__*/ new WeakSet(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Method_Field {
        constructor(){
            _class_private_method_init(this, _foo);
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo() {}
    var _foo1 = /*#__PURE__*/ new WeakSet(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Method_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
            _class_private_method_init(this, _foo1);
        }
    }
    function foo1() {}
    function foo1() {}
    var _foo2 = /*#__PURE__*/ new WeakSet(), _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Method_Getter {
        constructor(){
            _class_private_method_init(this, _foo2);
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: void 0
            });
        }
    }
    function foo2() {}
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakSet(), _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Method_Setter {
        constructor(){
            _class_private_method_init(this, _foo3);
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo
            });
        }
    }
    function foo3() {}
    function set_foo(value) {}
    var _foo4 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Method_StaticField {
        constructor(){
            _class_private_method_init(this, _foo4);
        }
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    function foo4() {}
    var _foo5 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Method_StaticMethod {
        constructor(){
            _class_private_method_init(this, _foo5);
        }
    }
    function foo5() {}
    function foo5() {}
    var _foo6 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Method_StaticGetter {
        constructor(){
            _class_private_method_init(this, _foo6);
        }
    }
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    function foo6() {}
    function get_foo1() {
        return "";
    }
    var _foo7 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Method_StaticSetter {
        constructor(){
            _class_private_method_init(this, _foo7);
        }
    }
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
    function foo7() {}
    function set_foo1(value) {}
}
function Getter() {
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                get: get_foo,
                set: void 0
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function get_foo() {
        return "";
    }
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Getter_Method {
        constructor(){
            _class_private_field_init(this, _foo1, {
                get: get_foo1,
                set: void 0
            });
            _class_private_method_init(this, _foo1);
        }
    }
    function get_foo1() {
        return "";
    }
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo2,
                set: void 0
            });
        }
    }
    function get_foo2() {
        return "";
    }
    function get_foo2() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    //OK
    class A_Getter_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: get_foo3,
                set: set_foo
            });
        }
    }
    function get_foo3() {
        return "";
    }
    function set_foo(value) {}
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_StaticField {
        constructor(){
            _class_private_field_init(this, _foo4, {
                get: get_foo4,
                set: void 0
            });
        }
    }
    function get_foo4() {
        return "";
    }
    function foo1() {}
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_StaticMethod {
        constructor(){
            _class_private_field_init(this, _foo5, {
                get: get_foo5,
                set: void 0
            });
        }
    }
    function get_foo5() {
        return "";
    }
    function foo2() {}
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_StaticGetter {
        constructor(){
            _class_private_field_init(this, _foo6, {
                get: get_foo6,
                set: void 0
            });
        }
    }
    var _foo6 = {
        get: get_foo6,
        set: void 0
    };
    function get_foo6() {
        return "";
    }
    function get_foo6() {
        return "";
    }
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Getter_StaticSetter {
        constructor(){
            _class_private_field_init(this, _foo7, {
                get: get_foo7,
                set: void 0
            });
        }
    }
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
    function get_foo7() {
        return "";
    }
    function set_foo1(value) {}
}
function Setter() {
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                get: void 0,
                set: set_foo
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function set_foo(value) {}
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_Setter_Method {
        constructor(){
            _class_private_field_init(this, _foo1, {
                get: void 0,
                set: set_foo1
            });
            _class_private_method_init(this, _foo1);
        }
    }
    function set_foo1(value) {}
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // OK
    class A_Setter_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: set_foo2
            });
        }
    }
    function set_foo2(value) {}
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo3
            });
        }
    }
    function set_foo3(value) {}
    function set_foo3(value) {}
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_StaticField {
        constructor(){
            _class_private_field_init(this, _foo4, {
                get: void 0,
                set: set_foo4
            });
        }
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    function set_foo4(value) {}
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_StaticMethod {
        constructor(){
            _class_private_field_init(this, _foo5, {
                get: void 0,
                set: set_foo5
            });
        }
    }
    function set_foo5(value) {}
    function foo1() {}
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_StaticGetter {
        constructor(){
            _class_private_field_init(this, _foo6, {
                get: void 0,
                set: set_foo6
            });
        }
    }
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    function set_foo6(value) {}
    function get_foo1() {
        return "";
    }
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_Setter_StaticSetter {
        constructor(){
            _class_private_field_init(this, _foo7, {
                get: void 0,
                set: set_foo7
            });
        }
    }
    var _foo7 = {
        get: void 0,
        set: set_foo7
    };
    function set_foo7(value) {}
    function set_foo7(value) {}
}
function StaticField() {
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticField_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    var _foo = {
        writable: true,
        value: "foo"
    };
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_StaticField_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
        }
    }
    var _foo1 = {
        writable: true,
        value: "foo"
    };
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticField_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: void 0
            });
        }
    }
    var _foo2 = {
        writable: true,
        value: "foo"
    };
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticField_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo
            });
        }
    }
    var _foo3 = {
        writable: true,
        value: "foo"
    };
    function set_foo(value) {}
    // Error
    class A_StaticField_StaticField {
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    // Error
    class A_StaticField_StaticMethod {
    }
    var _foo5 = {
        writable: true,
        value: "foo"
    };
    function foo1() {}
    // Error
    class A_StaticField_StaticGetter {
    }
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    var _foo6 = {
        writable: true,
        value: "foo"
    };
    function get_foo1() {
        return "";
    }
    // Error
    class A_StaticField_StaticSetter {
    }
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
    var _foo7 = {
        writable: true,
        value: "foo"
    };
    function set_foo1(value) {}
}
function StaticMethod() {
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticMethod_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }
    function foo() {}
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_StaticMethod_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
        }
    }
    function foo1() {}
    function foo1() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticMethod_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: void 0
            });
        }
    }
    function foo2() {}
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticMethod_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo
            });
        }
    }
    function foo3() {}
    function set_foo(value) {}
    // Error
    class A_StaticMethod_StaticField {
    }
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    function foo4() {}
    // Error
    class A_StaticMethod_StaticMethod {
    }
    function foo5() {}
    function foo5() {}
    // Error
    class A_StaticMethod_StaticGetter {
    }
    var _foo5 = {
        get: get_foo1,
        set: void 0
    };
    function foo6() {}
    function get_foo1() {
        return "";
    }
    // Error
    class A_StaticMethod_StaticSetter {
    }
    var _foo6 = {
        get: void 0,
        set: set_foo1
    };
    function foo7() {}
    function set_foo1(value) {}
}
function StaticGetter() {
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticGetter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
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
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_StaticGetter_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
        }
    }
    var _foo1 = {
        get: get_foo1,
        set: void 0
    };
    function get_foo1() {
        return "";
    }
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticGetter_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo2,
                set: void 0
            });
        }
    }
    var _foo2 = {
        get: get_foo2,
        set: void 0
    };
    function get_foo2() {
        return "";
    }
    function get_foo2() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticGetter_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo
            });
        }
    }
    var _foo3 = {
        get: get_foo3,
        set: void 0
    };
    function get_foo3() {
        return "";
    }
    function set_foo(value) {}
    // Error
    class A_StaticGetter_StaticField {
    }
    var _foo4 = {
        get: get_foo4,
        set: void 0
    };
    function get_foo4() {
        return "";
    }
    function foo1() {}
    // Error
    class A_StaticGetter_StaticMethod {
    }
    var _foo5 = {
        get: get_foo5,
        set: void 0
    };
    function get_foo5() {
        return "";
    }
    function foo2() {}
    // Error
    class A_StaticGetter_StaticGetter {
    }
    var _foo6 = {
        get: get_foo6,
        set: void 0
    };
    function get_foo6() {
        return "";
    }
    function get_foo6() {
        return "";
    }
    // OK
    class A_StaticGetter_StaticSetter {
    }
    var _foo7 = {
        get: get_foo7,
        set: set_foo1
    };
    function get_foo7() {
        return "";
    }
    function set_foo1(value) {}
}
function StaticSetter() {
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticSetter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
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
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    class A_StaticSetter_Method {
        constructor(){
            _class_private_method_init(this, _foo1);
        }
    }
    var _foo1 = {
        get: void 0,
        set: set_foo1
    };
    function set_foo1(value) {}
    function foo() {}
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticSetter_Getter {
        constructor(){
            _class_private_field_init(this, _foo2, {
                get: get_foo,
                set: void 0
            });
        }
    }
    var _foo2 = {
        get: void 0,
        set: set_foo2
    };
    function set_foo2(value) {}
    function get_foo() {
        return "";
    }
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    class A_StaticSetter_Setter {
        constructor(){
            _class_private_field_init(this, _foo3, {
                get: void 0,
                set: set_foo3
            });
        }
    }
    var _foo3 = {
        get: void 0,
        set: set_foo3
    };
    function set_foo3(value) {}
    function set_foo3(value) {}
    // Error
    class A_StaticSetter_StaticField {
    }
    var _foo4 = {
        get: void 0,
        set: set_foo4
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    function set_foo4(value) {}
    // Error
    class A_StaticSetter_StaticMethod {
    }
    var _foo5 = {
        get: void 0,
        set: set_foo5
    };
    function set_foo5(value) {}
    function foo1() {}
    // OK
    class A_StaticSetter_StaticGetter {
    }
    var _foo6 = {
        get: get_foo1,
        set: set_foo6
    };
    function set_foo6(value) {}
    function get_foo1() {
        return "";
    }
    // Error
    class A_StaticSetter_StaticSetter {
    }
    var _foo7 = {
        get: void 0,
        set: set_foo7
    };
    function set_foo7(value) {}
    function set_foo7(value) {}
}
