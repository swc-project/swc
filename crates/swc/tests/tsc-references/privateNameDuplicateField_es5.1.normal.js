import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
// @strict: true
// @target: es6
function Field() {
    var foo = function foo() {};
    var get_foo = function get_foo() {
        return "";
    };
    var set_foo = function set_foo(value) {};
    var foo1 = function foo1() {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_Field = function A_Field_Field() {
        "use strict";
        _class_call_check(this, A_Field_Field);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Field_Method = function A_Field_Method() {
        "use strict";
        _class_call_check(this, A_Field_Method);
        _class_private_method_init(this, _foo1);
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: "foo"
        });
    };
    var _foo2 = /*#__PURE__*/ new WeakMap(), _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_Getter = function A_Field_Getter() {
        "use strict";
        _class_call_check(this, A_Field_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: void 0
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: "foo"
        });
    };
    var _foo3 = /*#__PURE__*/ new WeakMap(), _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_Setter = function A_Field_Setter() {
        "use strict";
        _class_call_check(this, A_Field_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo
        });
        _class_private_field_init(this, _foo3, {
            writable: true,
            value: "foo"
        });
    };
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_StaticField = function A_Field_StaticField() {
        "use strict";
        _class_call_check(this, A_Field_StaticField);
        _class_private_field_init(this, _foo4, {
            writable: true,
            value: "foo"
        });
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_StaticMethod = function A_Field_StaticMethod() {
        "use strict";
        _class_call_check(this, A_Field_StaticMethod);
        _class_private_field_init(this, _foo5, {
            writable: true,
            value: "foo"
        });
    };
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_StaticGetter = function A_Field_StaticGetter() {
        "use strict";
        _class_call_check(this, A_Field_StaticGetter);
        _class_private_field_init(this, _foo6, {
            writable: true,
            value: "foo"
        });
    };
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Field_StaticSetter = function A_Field_StaticSetter() {
        "use strict";
        _class_call_check(this, A_Field_StaticSetter);
        _class_private_field_init(this, _foo7, {
            writable: true,
            value: "foo"
        });
    };
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
}
function Method() {
    var foo = function foo() {};
    var foo1 = function foo1() {};
    var foo1 = function foo1() {};
    var foo2 = function foo2() {};
    var get_foo = function get_foo() {
        return "";
    };
    var foo3 = function foo3() {};
    var set_foo = function set_foo(value) {};
    var foo4 = function foo4() {};
    var foo5 = function foo5() {};
    var foo5 = function foo5() {};
    var foo6 = function foo6() {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var foo7 = function foo7() {};
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakSet(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Method_Field = function A_Method_Field() {
        "use strict";
        _class_call_check(this, A_Method_Field);
        _class_private_method_init(this, _foo);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo1 = /*#__PURE__*/ new WeakSet(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Method_Method = function A_Method_Method() {
        "use strict";
        _class_call_check(this, A_Method_Method);
        _class_private_method_init(this, _foo1);
        _class_private_method_init(this, _foo1);
    };
    var _foo2 = /*#__PURE__*/ new WeakSet(), _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Method_Getter = function A_Method_Getter() {
        "use strict";
        _class_call_check(this, A_Method_Getter);
        _class_private_method_init(this, _foo2);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: void 0
        });
    };
    var _foo3 = /*#__PURE__*/ new WeakSet(), _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Method_Setter = function A_Method_Setter() {
        "use strict";
        _class_call_check(this, A_Method_Setter);
        _class_private_method_init(this, _foo3);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo
        });
    };
    var _foo4 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Method_StaticField = function A_Method_StaticField() {
        "use strict";
        _class_call_check(this, A_Method_StaticField);
        _class_private_method_init(this, _foo4);
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo5 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Method_StaticMethod = function A_Method_StaticMethod() {
        "use strict";
        _class_call_check(this, A_Method_StaticMethod);
        _class_private_method_init(this, _foo5);
    };
    var _foo6 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Method_StaticGetter = function A_Method_StaticGetter() {
        "use strict";
        _class_call_check(this, A_Method_StaticGetter);
        _class_private_method_init(this, _foo6);
    };
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    var _foo7 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Method_StaticSetter = function A_Method_StaticSetter() {
        "use strict";
        _class_call_check(this, A_Method_StaticSetter);
        _class_private_method_init(this, _foo7);
    };
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
}
function Getter() {
    var get_foo = function get_foo() {
        return "";
    };
    var get_foo1 = function get_foo1() {
        return "";
    };
    var foo = function foo() {};
    var get_foo2 = function get_foo2() {
        return "";
    };
    var get_foo2 = function get_foo2() {
        return "";
    };
    var get_foo3 = function get_foo3() {
        return "";
    };
    var set_foo = function set_foo(value) {};
    var get_foo4 = function get_foo4() {
        return "";
    };
    var foo1 = function foo1() {};
    var get_foo5 = function get_foo5() {
        return "";
    };
    var foo2 = function foo2() {};
    var get_foo6 = function get_foo6() {
        return "";
    };
    var get_foo6 = function get_foo6() {
        return "";
    };
    var get_foo7 = function get_foo7() {
        return "";
    };
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_Field = function A_Getter_Field() {
        "use strict";
        _class_call_check(this, A_Getter_Field);
        _class_private_field_init(this, _foo, {
            get: get_foo,
            set: void 0
        });
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Getter_Method = function A_Getter_Method() {
        "use strict";
        _class_call_check(this, A_Getter_Method);
        _class_private_field_init(this, _foo1, {
            get: get_foo1,
            set: void 0
        });
        _class_private_method_init(this, _foo1);
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_Getter = function A_Getter_Getter() {
        "use strict";
        _class_call_check(this, A_Getter_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo2,
            set: void 0
        });
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    //OK
    var A_Getter_Setter = function A_Getter_Setter() {
        "use strict";
        _class_call_check(this, A_Getter_Setter);
        _class_private_field_init(this, _foo3, {
            get: get_foo3,
            set: set_foo
        });
    };
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_StaticField = function A_Getter_StaticField() {
        "use strict";
        _class_call_check(this, A_Getter_StaticField);
        _class_private_field_init(this, _foo4, {
            get: get_foo4,
            set: void 0
        });
    };
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_StaticMethod = function A_Getter_StaticMethod() {
        "use strict";
        _class_call_check(this, A_Getter_StaticMethod);
        _class_private_field_init(this, _foo5, {
            get: get_foo5,
            set: void 0
        });
    };
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_StaticGetter = function A_Getter_StaticGetter() {
        "use strict";
        _class_call_check(this, A_Getter_StaticGetter);
        _class_private_field_init(this, _foo6, {
            get: get_foo6,
            set: void 0
        });
    };
    var _foo6 = {
        get: get_foo6,
        set: void 0
    };
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Getter_StaticSetter = function A_Getter_StaticSetter() {
        "use strict";
        _class_call_check(this, A_Getter_StaticSetter);
        _class_private_field_init(this, _foo7, {
            get: get_foo7,
            set: void 0
        });
    };
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
}
function Setter() {
    var set_foo = function set_foo(value) {};
    var set_foo1 = function set_foo1(value) {};
    var foo = function foo() {};
    var set_foo2 = function set_foo2(value) {};
    var get_foo = function get_foo() {
        return "";
    };
    var set_foo3 = function set_foo3(value) {};
    var set_foo3 = function set_foo3(value) {};
    var set_foo4 = function set_foo4(value) {};
    var set_foo5 = function set_foo5(value) {};
    var foo1 = function foo1() {};
    var set_foo6 = function set_foo6(value) {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var set_foo7 = function set_foo7(value) {};
    var set_foo7 = function set_foo7(value) {};
    var _foo = /*#__PURE__*/ new WeakMap(), _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_Field = function A_Setter_Field() {
        "use strict";
        _class_call_check(this, A_Setter_Field);
        _class_private_field_init(this, _foo, {
            get: void 0,
            set: set_foo
        });
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo1 = /*#__PURE__*/ new WeakMap(), _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_Setter_Method = function A_Setter_Method() {
        "use strict";
        _class_call_check(this, A_Setter_Method);
        _class_private_field_init(this, _foo1, {
            get: void 0,
            set: set_foo1
        });
        _class_private_method_init(this, _foo1);
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // OK
    var A_Setter_Getter = function A_Setter_Getter() {
        "use strict";
        _class_call_check(this, A_Setter_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: set_foo2
        });
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_Setter = function A_Setter_Setter() {
        "use strict";
        _class_call_check(this, A_Setter_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo3
        });
    };
    var _foo4 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_StaticField = function A_Setter_StaticField() {
        "use strict";
        _class_call_check(this, A_Setter_StaticField);
        _class_private_field_init(this, _foo4, {
            get: void 0,
            set: set_foo4
        });
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo5 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_StaticMethod = function A_Setter_StaticMethod() {
        "use strict";
        _class_call_check(this, A_Setter_StaticMethod);
        _class_private_field_init(this, _foo5, {
            get: void 0,
            set: set_foo5
        });
    };
    var _foo6 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_StaticGetter = function A_Setter_StaticGetter() {
        "use strict";
        _class_call_check(this, A_Setter_StaticGetter);
        _class_private_field_init(this, _foo6, {
            get: void 0,
            set: set_foo6
        });
    };
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    var _foo7 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_Setter_StaticSetter = function A_Setter_StaticSetter() {
        "use strict";
        _class_call_check(this, A_Setter_StaticSetter);
        _class_private_field_init(this, _foo7, {
            get: void 0,
            set: set_foo7
        });
    };
    var _foo7 = {
        get: void 0,
        set: set_foo7
    };
}
function StaticField() {
    var foo = function foo() {};
    var get_foo = function get_foo() {
        return "";
    };
    var set_foo = function set_foo(value) {};
    var foo1 = function foo1() {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticField_Field = function A_StaticField_Field() {
        "use strict";
        _class_call_check(this, A_StaticField_Field);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = {
        writable: true,
        value: "foo"
    };
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_StaticField_Method = function A_StaticField_Method() {
        "use strict";
        _class_call_check(this, A_StaticField_Method);
        _class_private_method_init(this, _foo1);
    };
    var _foo1 = {
        writable: true,
        value: "foo"
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticField_Getter = function A_StaticField_Getter() {
        "use strict";
        _class_call_check(this, A_StaticField_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: void 0
        });
    };
    var _foo2 = {
        writable: true,
        value: "foo"
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticField_Setter = function A_StaticField_Setter() {
        "use strict";
        _class_call_check(this, A_StaticField_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo
        });
    };
    var _foo3 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticField_StaticField = function A_StaticField_StaticField() {
        "use strict";
        _class_call_check(this, A_StaticField_StaticField);
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticField_StaticMethod = function A_StaticField_StaticMethod() {
        "use strict";
        _class_call_check(this, A_StaticField_StaticMethod);
    };
    var _foo5 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticField_StaticGetter = function A_StaticField_StaticGetter() {
        "use strict";
        _class_call_check(this, A_StaticField_StaticGetter);
    };
    var _foo6 = {
        get: get_foo1,
        set: void 0
    };
    var _foo6 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticField_StaticSetter = function A_StaticField_StaticSetter() {
        "use strict";
        _class_call_check(this, A_StaticField_StaticSetter);
    };
    var _foo7 = {
        get: void 0,
        set: set_foo1
    };
    var _foo7 = {
        writable: true,
        value: "foo"
    };
}
function StaticMethod() {
    var foo = function foo() {};
    var foo1 = function foo1() {};
    var foo1 = function foo1() {};
    var foo2 = function foo2() {};
    var get_foo = function get_foo() {
        return "";
    };
    var foo3 = function foo3() {};
    var set_foo = function set_foo(value) {};
    var foo4 = function foo4() {};
    var foo5 = function foo5() {};
    var foo5 = function foo5() {};
    var foo6 = function foo6() {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var foo7 = function foo7() {};
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticMethod_Field = function A_StaticMethod_Field() {
        "use strict";
        _class_call_check(this, A_StaticMethod_Field);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_StaticMethod_Method = function A_StaticMethod_Method() {
        "use strict";
        _class_call_check(this, A_StaticMethod_Method);
        _class_private_method_init(this, _foo1);
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticMethod_Getter = function A_StaticMethod_Getter() {
        "use strict";
        _class_call_check(this, A_StaticMethod_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: void 0
        });
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticMethod_Setter = function A_StaticMethod_Setter() {
        "use strict";
        _class_call_check(this, A_StaticMethod_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo
        });
    };
    // Error
    var A_StaticMethod_StaticField = function A_StaticMethod_StaticField() {
        "use strict";
        _class_call_check(this, A_StaticMethod_StaticField);
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticMethod_StaticMethod = function A_StaticMethod_StaticMethod() {
        "use strict";
        _class_call_check(this, A_StaticMethod_StaticMethod);
    };
    // Error
    var A_StaticMethod_StaticGetter = function A_StaticMethod_StaticGetter() {
        "use strict";
        _class_call_check(this, A_StaticMethod_StaticGetter);
    };
    var _foo5 = {
        get: get_foo1,
        set: void 0
    };
    // Error
    var A_StaticMethod_StaticSetter = function A_StaticMethod_StaticSetter() {
        "use strict";
        _class_call_check(this, A_StaticMethod_StaticSetter);
    };
    var _foo6 = {
        get: void 0,
        set: set_foo1
    };
}
function StaticGetter() {
    var get_foo = function get_foo() {
        return "";
    };
    var get_foo1 = function get_foo1() {
        return "";
    };
    var foo = function foo() {};
    var get_foo2 = function get_foo2() {
        return "";
    };
    var get_foo2 = function get_foo2() {
        return "";
    };
    var get_foo3 = function get_foo3() {
        return "";
    };
    var set_foo = function set_foo(value) {};
    var get_foo4 = function get_foo4() {
        return "";
    };
    var foo1 = function foo1() {};
    var get_foo5 = function get_foo5() {
        return "";
    };
    var foo2 = function foo2() {};
    var get_foo6 = function get_foo6() {
        return "";
    };
    var get_foo6 = function get_foo6() {
        return "";
    };
    var get_foo7 = function get_foo7() {
        return "";
    };
    var set_foo1 = function set_foo1(value) {};
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticGetter_Field = function A_StaticGetter_Field() {
        "use strict";
        _class_call_check(this, A_StaticGetter_Field);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = {
        get: get_foo,
        set: void 0
    };
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_StaticGetter_Method = function A_StaticGetter_Method() {
        "use strict";
        _class_call_check(this, A_StaticGetter_Method);
        _class_private_method_init(this, _foo1);
    };
    var _foo1 = {
        get: get_foo1,
        set: void 0
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticGetter_Getter = function A_StaticGetter_Getter() {
        "use strict";
        _class_call_check(this, A_StaticGetter_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo2,
            set: void 0
        });
    };
    var _foo2 = {
        get: get_foo2,
        set: void 0
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticGetter_Setter = function A_StaticGetter_Setter() {
        "use strict";
        _class_call_check(this, A_StaticGetter_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo
        });
    };
    var _foo3 = {
        get: get_foo3,
        set: void 0
    };
    // Error
    var A_StaticGetter_StaticField = function A_StaticGetter_StaticField() {
        "use strict";
        _class_call_check(this, A_StaticGetter_StaticField);
    };
    var _foo4 = {
        get: get_foo4,
        set: void 0
    };
    // Error
    var A_StaticGetter_StaticMethod = function A_StaticGetter_StaticMethod() {
        "use strict";
        _class_call_check(this, A_StaticGetter_StaticMethod);
    };
    var _foo5 = {
        get: get_foo5,
        set: void 0
    };
    // Error
    var A_StaticGetter_StaticGetter = function A_StaticGetter_StaticGetter() {
        "use strict";
        _class_call_check(this, A_StaticGetter_StaticGetter);
    };
    var _foo6 = {
        get: get_foo6,
        set: void 0
    };
    // OK
    var A_StaticGetter_StaticSetter = function A_StaticGetter_StaticSetter() {
        "use strict";
        _class_call_check(this, A_StaticGetter_StaticSetter);
    };
    var _foo7 = {
        get: get_foo7,
        set: set_foo1
    };
}
function StaticSetter() {
    var set_foo = function set_foo(value) {};
    var set_foo1 = function set_foo1(value) {};
    var foo = function foo() {};
    var set_foo2 = function set_foo2(value) {};
    var get_foo = function get_foo() {
        return "";
    };
    var set_foo3 = function set_foo3(value) {};
    var set_foo3 = function set_foo3(value) {};
    var set_foo4 = function set_foo4(value) {};
    var set_foo5 = function set_foo5(value) {};
    var foo1 = function foo1() {};
    var set_foo6 = function set_foo6(value) {};
    var get_foo1 = function get_foo1() {
        return "";
    };
    var set_foo7 = function set_foo7(value) {};
    var set_foo7 = function set_foo7(value) {};
    var _foo = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticSetter_Field = function A_StaticSetter_Field() {
        "use strict";
        _class_call_check(this, A_StaticSetter_Field);
        _class_private_field_init(this, _foo, {
            writable: true,
            value: "foo"
        });
    };
    var _foo = {
        get: void 0,
        set: set_foo
    };
    var _foo1 = /*#__PURE__*/ new WeakSet();
    // Error
    var A_StaticSetter_Method = function A_StaticSetter_Method() {
        "use strict";
        _class_call_check(this, A_StaticSetter_Method);
        _class_private_method_init(this, _foo1);
    };
    var _foo1 = {
        get: void 0,
        set: set_foo1
    };
    var _foo2 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticSetter_Getter = function A_StaticSetter_Getter() {
        "use strict";
        _class_call_check(this, A_StaticSetter_Getter);
        _class_private_field_init(this, _foo2, {
            get: get_foo,
            set: void 0
        });
    };
    var _foo2 = {
        get: void 0,
        set: set_foo2
    };
    var _foo3 = /*#__PURE__*/ new WeakMap();
    // Error
    var A_StaticSetter_Setter = function A_StaticSetter_Setter() {
        "use strict";
        _class_call_check(this, A_StaticSetter_Setter);
        _class_private_field_init(this, _foo3, {
            get: void 0,
            set: set_foo3
        });
    };
    var _foo3 = {
        get: void 0,
        set: set_foo3
    };
    // Error
    var A_StaticSetter_StaticField = function A_StaticSetter_StaticField() {
        "use strict";
        _class_call_check(this, A_StaticSetter_StaticField);
    };
    var _foo4 = {
        get: void 0,
        set: set_foo4
    };
    var _foo4 = {
        writable: true,
        value: "foo"
    };
    // Error
    var A_StaticSetter_StaticMethod = function A_StaticSetter_StaticMethod() {
        "use strict";
        _class_call_check(this, A_StaticSetter_StaticMethod);
    };
    var _foo5 = {
        get: void 0,
        set: set_foo5
    };
    // OK
    var A_StaticSetter_StaticGetter = function A_StaticSetter_StaticGetter() {
        "use strict";
        _class_call_check(this, A_StaticSetter_StaticGetter);
    };
    var _foo6 = {
        get: get_foo1,
        set: set_foo6
    };
    // Error
    var A_StaticSetter_StaticSetter = function A_StaticSetter_StaticSetter() {
        "use strict";
        _class_call_check(this, A_StaticSetter_StaticSetter);
    };
    var _foo7 = {
        get: void 0,
        set: set_foo7
    };
}
