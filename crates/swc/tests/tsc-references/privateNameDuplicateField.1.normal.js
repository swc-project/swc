//// [privateNameDuplicateField.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
function Field() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_Field_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_Field_Method {
        constructor(){
            _foo1.add(this);
            _class_private_field_init(this, _foo1, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo1, "foo");
        }
    }
    // Error
    class A_Field_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
            _class_private_field_init(this, _foo2, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo2, "foo");
        }
    }
    // Error
    class A_Field_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
            _class_private_field_init(this, _foo3, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo3, "foo");
        }
    }
    // Error
    class A_Field_StaticField {
        constructor(){
            _class_private_field_init(this, _foo4, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo4, "foo");
        }
    }
    // Error
    class A_Field_StaticMethod {
        constructor(){
            _class_private_field_init(this, _foo5, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo5, "foo");
        }
    }
    // Error
    class A_Field_StaticGetter {
        constructor(){
            _class_private_field_init(this, _foo6, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo6, "foo");
        }
    }
    // Error
    class A_Field_StaticSetter {
        constructor(){
            _class_private_field_init(this, _foo7, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo7, "foo");
        }
    }
    function set_foo1(value) {}
    _foo7.set(A_Field_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
function Method() {
    var _foo = new WeakSet(), _foo = new WeakMap(), _foo1 = new WeakSet(), _foo1 = new WeakSet(), _foo2 = new WeakSet(), _foo2 = new WeakMap(), _foo3 = new WeakSet(), _foo3 = new WeakMap(), _foo4 = new WeakSet(), _foo4 = new WeakMap(), _foo5 = new WeakSet(), _foo6 = new WeakSet(), _foo6 = new WeakMap(), _foo7 = new WeakSet(), _foo7 = new WeakMap();
    // Error
    class A_Method_Field {
        constructor(){
            _foo.add(this);
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_Method_Method {
        constructor(){
            _foo1.add(this);
            _foo1.add(this);
        }
    }
    // Error
    class A_Method_Getter {
        constructor(){
            _foo2.add(this);
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_Method_Setter {
        constructor(){
            _foo3.add(this);
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_Method_StaticField {
        constructor(){
            _foo4.add(this);
        }
    }
    // Error
    class A_Method_StaticMethod {
        constructor(){
            _foo5.add(this);
        }
    }
    // Error
    class A_Method_StaticGetter {
        constructor(){
            _foo6.add(this);
        }
    }
    // Error
    class A_Method_StaticSetter {
        constructor(){
            _foo7.add(this);
        }
    }
    function foo() {}
    function set_foo1(value) {}
    _foo7.set(A_Method_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
function Getter() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_Getter_Field {
        constructor(){
            _foo.set(this, {
                get: get_foo,
                set: void 0
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_Getter_Method {
        constructor(){
            _foo1.set(this, {
                get: get_foo,
                set: void 0
            });
            _foo1.add(this);
        }
    }
    // Error
    class A_Getter_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    //OK
    class A_Getter_Setter {
        constructor(){
            _foo3.set(this, {
                get: get_foo,
                set: set_foo
            });
        }
    }
    // Error
    class A_Getter_StaticField {
        constructor(){
            _foo4.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_Getter_StaticMethod {
        constructor(){
            _foo5.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_Getter_StaticGetter {
        constructor(){
            _foo6.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_Getter_StaticSetter {
        constructor(){
            _foo7.set(this, {
                get: get_foo1,
                set: void 0
            });
        }
    }
    function get_foo1() {
        return "";
    }
    function set_foo1(value) {}
    _foo7.set(A_Getter_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
function Setter() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_Setter_Field {
        constructor(){
            _foo.set(this, {
                get: void 0,
                set: set_foo
            });
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_Setter_Method {
        constructor(){
            _foo1.set(this, {
                get: void 0,
                set: set_foo
            });
            _foo1.add(this);
        }
    }
    // OK
    class A_Setter_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: set_foo
            });
        }
    }
    // Error
    class A_Setter_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_Setter_StaticField {
        constructor(){
            _foo4.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_Setter_StaticMethod {
        constructor(){
            _foo5.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_Setter_StaticGetter {
        constructor(){
            _foo6.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_Setter_StaticSetter {
        constructor(){
            _foo7.set(this, {
                get: void 0,
                set: set_foo1
            });
        }
    }
    function set_foo1(value) {}
    function set_foo1(value) {}
    _foo7.set(A_Setter_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
function StaticField() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_StaticField_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_StaticField_Method {
        constructor(){
            _foo1.add(this);
        }
    }
    // Error
    class A_StaticField_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_StaticField_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_StaticField_StaticField {
    }
    // Error
    class A_StaticField_StaticMethod {
    }
    // Error
    class A_StaticField_StaticGetter {
    }
    // Error
    class A_StaticField_StaticSetter {
    }
    function set_foo1(value) {}
    _foo7.set(A_StaticField_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
    _foo7.set(A_StaticField_StaticSetter, {
        writable: true,
        value: "foo"
    });
}
function StaticMethod() {
    var _foo = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap();
    // Error
    class A_StaticMethod_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_StaticMethod_Method {
        constructor(){
            _foo1.add(this);
        }
    }
    // Error
    class A_StaticMethod_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_StaticMethod_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_StaticMethod_StaticField {
    }
    // Error
    class A_StaticMethod_StaticMethod {
    }
    // Error
    class A_StaticMethod_StaticGetter {
    }
    // Error
    class A_StaticMethod_StaticSetter {
    }
    function foo() {}
    function set_foo1(value) {}
    _foo6.set(A_StaticMethod_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
function StaticGetter() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_StaticGetter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_StaticGetter_Method {
        constructor(){
            _foo1.add(this);
        }
    }
    // Error
    class A_StaticGetter_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_StaticGetter_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_StaticGetter_StaticField {
    }
    // Error
    class A_StaticGetter_StaticMethod {
    }
    // Error
    class A_StaticGetter_StaticGetter {
    }
    // OK
    class A_StaticGetter_StaticSetter {
    }
    function get_foo1() {
        return "";
    }
    function set_foo1(value) {}
    _foo7.set(A_StaticGetter_StaticSetter, {
        get: get_foo1,
        set: set_foo1
    });
}
function StaticSetter() {
    var _foo = new WeakMap(), _foo = new WeakMap(), _foo1 = new WeakMap(), _foo1 = new WeakSet(), _foo2 = new WeakMap(), _foo2 = new WeakMap(), _foo3 = new WeakMap(), _foo3 = new WeakMap(), _foo4 = new WeakMap(), _foo4 = new WeakMap(), _foo5 = new WeakMap(), _foo6 = new WeakMap(), _foo7 = new WeakMap();
    // Error
    class A_StaticSetter_Field {
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: void 0
            });
            _class_private_field_set(this, _foo, "foo");
        }
    }
    // Error
    class A_StaticSetter_Method {
        constructor(){
            _foo1.add(this);
        }
    }
    // Error
    class A_StaticSetter_Getter {
        constructor(){
            _foo2.set(this, {
                get: get_foo,
                set: void 0
            });
        }
    }
    // Error
    class A_StaticSetter_Setter {
        constructor(){
            _foo3.set(this, {
                get: void 0,
                set: set_foo
            });
        }
    }
    // Error
    class A_StaticSetter_StaticField {
    }
    // Error
    class A_StaticSetter_StaticMethod {
    }
    // OK
    class A_StaticSetter_StaticGetter {
    }
    // Error
    class A_StaticSetter_StaticSetter {
    }
    function set_foo1(value) {}
    function set_foo1(value) {}
    _foo7.set(A_StaticSetter_StaticSetter, {
        get: void 0,
        set: set_foo1
    });
}
