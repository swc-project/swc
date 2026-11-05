mod common;

use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{arrow, block_scoping, classes, classes::Config, spread},
    es2016, es2017, es2018, es2022,
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{compare_stdout, test_exec, test_fixture, Tester};

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: &Tester) -> impl Pass {
    classes(Default::default())
}

fn spec_tr(_: &Tester) -> impl Pass {
    let unresolved_mark = Mark::new();
    (
        resolver(unresolved_mark, Mark::new(), false),
        classes(Default::default()),
        spread(Default::default(), unresolved_mark),
        block_scoping(unresolved_mark),
    )
}

test_exec!(
    syntax(),
    |t| tr(t),
    custom_nested,
    r#"
class Hello{
  constructor(){
    return {
      toString () {
        return 'hello';
      }
    };
  }
}
class Outer extends Hello{
  constructor(){
    var _ref = super();
    class Inner{
      constructor(){
        this[_ref] = 'hello';
      }
    }
    return new Inner();
  }
}
expect(new Outer().hello).toBe('hello');
"#
);

// spec_constructor_only

// extend_builtins_wrap_native_super

// spec_name_method_collision

// exec_super

// regression_5769_exec
test_exec!(
    syntax(),
    |t| tr(t),
    regression_5769_exec,
    r#"
class Point {
  getX() {
    expect(this.x).toBe(3); // C
  }
}

class ColorPoint extends Point {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    expect(this.x).toBe(3);   // A
    expect(super.x).toBeUndefined();  // B
  }

  m() {
    this.getX()
  }
}

const cp = new ColorPoint();
cp.m();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_5_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_5_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    Foo[this];
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_statement

// get_set_set_semantics_getter_defined_on_parent

// spec_derived_constructor_must_call_super

// get_set_get_semantics_data_defined_on_parent

// extend_builtins_spec

// spec_super_reference_before_in_lambda_2

// regression_8499

// regression_5817

// spec_super_reference_before_in_lambda_3

// get_set_set_semantics_not_defined_on_parent_setter_on_obj

// get_set_get_semantics_setter_defined_on_parent

// spec_this_not_allowed_before_super_in_derived_classes_4

// spec_calling_super_properties

// spec_super_reference_before_bare_super

// spec_super_reference_before_bare_super_inline

// spec_instance_getter_and_setter

// regression_2941

// regression_t2494

// spec_inferred_expression_name

// regression_8499_exec
test_exec!(
    // Wrong test (babel + jest fails)
    ignore,
    syntax(),
    |t| tr(t),
    regression_8499_exec,
    r#"
// Pretend that `Reflect.construct` isn't supported.
this.Reflect = undefined;

this.HTMLElement = function() {
  // Here, `this.HTMLElement` is this function, not the original HTMLElement
  // constructor. `this.constructor` should be this function too, but isn't.
  constructor = this.constructor;
};

var constructor;

class CustomElement extends HTMLElement {};
new CustomElement();

expect(constructor).toBe(CustomElement);



"#
);

// spec_default_super

// spec_default_super

// get_set_get_semantics_getter_defined_on_parent

// spec

// spec_this_not_allowed_before_super_in_derived_classes

// get_set_call_semantics_getter_defined_on_parent

// spec_derived_constructor_must_call_super_4_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_4_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_retain_no_call_on

// spec_export_default

// get_set_call_semantics_data_defined_on_parent

// spec_static

// regression_t6755

// get_set_memoized_update

// spec_nested_class_super_property_in_key

// spec_super_reference_in_prop_expression

// spec_super_reference_before_in_lambda_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    super();
  }
}

new Foo();
"#
);

// spec_nested_class_super_call_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_call_in_key_exec,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    class Inner {
      [super()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_4_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_4_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => this;
    super();
    fn();
  }
}

new Foo();

"#
);

// spec_this_not_allowed_before_super_in_derived_classes_2

// spec_accessing_super_properties

// exec_shadow

// spec_computed_methods

// extend_builtins_shadowed

// get_set_set_semantics_data_defined_on_parent

// get_set_set_semantics_not_defined_on_parent_getter_on_obj

// get_set

// spec_returning_from_derived_constructor_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_returning_from_derived_constructor_exec,
    r#"

class Foo {
  constructor() {
    return { x: 1 };
  }
}

expect(new Foo().x).toBe(1);

class Bar extends Foo {
  constructor() {
    super();
    return;
  }
}

expect(new Bar().x).toBe(1);

class Bar2 extends Foo {
  constructor() {
    super();
    expect(this.x).toBe(1);
    return { x: 2 };
  }
}

expect(new Bar2().x).toBe(2);


let singleton;
class Sub extends Foo {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = super();
  }
}

let instance = new Sub;
expect(instance).toBe(singleton);

instance = new Sub;
expect(instance).toBe(singleton);

class Null extends Foo {
  constructor() {
    if (false) {
      super();
    }
    return null;
    super();
  }
}

expect(() => {
  new Null();
}).toThrow("this");

"#
);

// regression_2694

// regression_5769

// spec_super_function_fallback

// regression_t7537

// regression_3028

// spec_super_illegal_non_constructor_call

// spec_instance_setter

// spec_nested_object_super_call_in_key

// get_set_set_semantics_not_defined_on_parent_not_on_obj

// spec_derived_constructor_no_super_return_falsy

// spec_this_not_allowed_before_super_in_derived_classes_5

// exec_super_change

// spec_constructor

// spec_preserves_directives

// spec_super_reference_before_in_lambda

// spec_derived_constructor_no_super_return_object

// regression_t6750

// spec_instance_method

// regression_t2997

// spec_constructor_binding_collision

// spec_super_class_anonymous

// spec_method_return_type_annotation

// spec_nested_class_super_call_in_key

// extend_builtins_builtin_objects_throw_when_wrapped

// regression_2663

// get_set_set_semantics_setter_defined_on_parent_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_setter_defined_on_parent_exec,
    r#"

let value = 1;
class Base {
  set test(v) {
    value = v;
  }
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(value).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

// regression_5817_exec
test_exec!(
    syntax(),
    |t| tr(t),
    regression_5817_exec,
    r#"
// https://github.com/babel/babel/issues/5817

class Parent {}

class Table extends Parent {
  constructor() {
    super();
    this.returnParam = (param) => {
      return param;
    }
  }
}

const table = new Table();

expect(table.returnParam(false)).toBe(false);

"#
);

// exec_class_prototype

// spec_instance_getter

// spec_this_not_allowed_before_super_in_derived_classes_3

// spec_accessing_super_class

// spec_this_not_allowed_before_super_in_derived_classes_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    this.foo = "bar";
    super();
  }
}

expect(() => new Foo()).toThrow();

"#
);

// spec_nested_object_super_property_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_property_in_key_exec,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    const Inner = {
      [super.toString()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// regression_t6712

// get_set_set_semantics_setter_defined_on_parent

// get_set_call_semantics_not_defined_on_parent

// spec_derived_constructor_must_call_super_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_2_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    if (eval("false")) super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_declaration

// spec_nested_object_super_property_in_key

// get_set_set_semantics_not_defined_on_parent_setter_on_obj_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_setter_on_obj_exec,
    r#"

class Base {
}

let value = 2;
class Obj extends Base {
  set test(v) {
    value = v;
  }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(value).toBe(2);
expect(obj.test).toBe(3);

"#
);

// exec_expression

// spec_this_not_allowed_before_super_in_derived_classes_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_2_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super(this);
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_super_reference_before_bare_super_inline_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_bare_super_inline_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super.foo(super());
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// get_set_call_semantics_setter_defined_on_parent

// spec_super_class

// spec_super_call_only_allowed_in_derived_constructor

// spec_nested_object_super_call_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_object_super_call_in_key_exec,
    r#"

class Hello {
  constructor() {
    return {
      toString() {
        return 'hello';
      },
    };
  }
}

class Outer extends Hello {
  constructor() {
    const Inner = {
      [super()]() {
        return 'hello';
      },
    };

    return Inner;
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_derived_constructor_must_call_super_2

// spec_derived_constructor_must_call_super_3

// spec_this_not_allowed_before_super_in_derived_classes_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_this_not_allowed_before_super_in_derived_classes_3_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => this;
    fn();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// get_set_set_semantics_not_defined_on_parent_data_on_obj

// get_set_memoized_assign

// spec_nested_class_super_property_in_key_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_nested_class_super_property_in_key_exec,
    r#"

class Hello {
  toString() {
    return 'hello';
  }
}

class Outer extends Hello {
  constructor() {
    super();
    class Inner {
      [super.toString()]() {
        return 'hello';
      }
    }

    return new Inner();
  }
}

expect(new Outer().hello()).toBe('hello');

"#
);

// spec_relaxed_method_coercion

// spec_derived_constructor_must_call_super_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_3_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    const fn = () => super();
    fn();
  }
}

new Foo();

"#
);

// spec_computed_methods_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_computed_methods_exec,
    r#"
const sym = Symbol();

class Foo {
  [sym] () {
    return 1;
  }
}

class Bar extends Foo {
  [sym] () {
    return super[sym]() + 2;
  }
}

let i = new Bar();

expect(i[sym]()).toBe(3);

"#
);

// spec_derived_constructor_must_call_super_4

// spec_super_class_id_member_expression

// spec_delay_arrow_function_for_bare_super_derived

// extend_builtins_overwritten_null

// spec_default_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_default_super_exec,
    r#"
class Test {
  constructor() {
    return super.constructor;
  }

  static test() {
    return super.constructor;
  }
}

// Instances
expect(Object.getPrototypeOf(Test.prototype)).toBe(Object.prototype);
expect(new Test()).toBe(Object);

// Static
expect(Object.getPrototypeOf(Test)).toBe(Function.prototype);
expect(Test.test()).toBe(Function);

"#
);

// spec_super_reference_before_in_lambda_3_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_3_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    super();
    t();
  }
}

new Foo();

"#
);

// regression

// get_set_get_semantics_not_defined_on_parent

// extend_builtins_super_called

// spec_plain_class

// spec_super_reference_before_bare_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_bare_super_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {
    super.foo();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_super_reference_before_in_lambda_2_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_before_in_lambda_2_exec,
    r#"
class Bar {
  test() {}
}

class Foo extends Bar {
  constructor() {
    const t = () => super.test()
    t();
    super();
  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// spec_derived_constructor_must_call_super_exec
test_exec!(
    syntax(),
    |t| spec_tr(t),
    spec_derived_constructor_must_call_super_exec,
    r#"
class Bar {}

class Foo extends Bar {
  constructor() {

  }
}

expect(() => new Foo()).toThrow("this hasn't been initialised");

"#
);

// exec_return

// spec_export_super_class

// extend_builtins_wrap_native_super_exec
test_exec!(
    syntax(),
    |t| tr(t),
    extend_builtins_wrap_native_super_exec,
    r#"
// basic sanity check to confirm the external wrapNativeSuper helper works

class Test1 extends Array {
  name() {
    return 'test1';
  }
}

class Test2 extends Array {
  name() {
    return 'test2';
  }
}

var t1 = new Test1();
var t2 = new Test2();

expect(Test1).not.toBe(Test2);
expect(t1).not.toBe(t2);
expect(t1.name()).toBe('test1');
expect(t2.name()).toBe('test2');
expect(t1).toBeInstanceOf(Test1);
expect(t2).toBeInstanceOf(Test2);
expect(t1).toBeInstanceOf(Array);
expect(t2).toBeInstanceOf(Array);

"#
);

// spec_super_reference_in_prop_expression_exec
test_exec!(
    // babel also fails on this
    ignore,
    syntax(),
    |t| spec_tr(t),
    spec_super_reference_in_prop_exression_exec,
    r#"
let called = false;

class A {
  method() {
    called = true;
  }

  get methodName() {
    return "method";
  }
}

class B extends A {
  constructor() {
    super[super().methodName]()
  }
}

new B();
expect(called).toBe(true);

"#
);

// extend_builtins_imported_babel_plugin_transform_builtin_classes

// get_set_set_semantics_getter_defined_on_parent_exec
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_getter_defined_on_parent_exec,
    r#"

let called = false;
class Base {
  get test() {
    called = true;
    return 1;
  }
};

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(() => {
  obj.set();
}).toThrow();
expect(called).toBe(false);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(2);

"#
);

// extend_builtins_shadowed

//// regression_2694
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [],
//  "presets": ["env"]
//}
//"#),
//    regression_2694,
//    r#"
//import BaseFoo from './BaseFoo';
//
//export default class SubFoo extends BaseFoo {
//  static talk() {
//    super.talk();
//    console.log('SubFoo.talk');
//  }
//}
//
//"#
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule" {
//  value: true
//});
//exports["default"] = void 0;
//
//var BaseFoo2 = _interop_require_default(require("./BaseFoo"));
//
//var SubFoo =
// /*#__PURE__*/
//function (BaseFoo) {
//  _inherits(SubFoo, BaseFoo);
//
//  function SubFoo() {
//    _class_call_check(this, SubFoo);
//    return _possible_constructor_return(this,
// _get_prototype_of(SubFoo).apply(this, arguments));  }
//
//  _create_class(SubFoo, null, [{
//    key: "talk"
//    value: function talk() {
//      _get(_get_prototype_of(SubFoo), "talk" this).call(this);
//      console.log('SubFoo.talk');
//    }
//  }]);
//  return SubFoo;
//}(BaseFoo2["default"]);
//
//exports["default"] = SubFoo;
//
//"#
//);

//// regression_t2494
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env" "react"]
//}
//"#),
//    regression_t2494,
//    r#"
//var x = {
//  Foo: class extends Foo {}
//};
//
//"#
//    r#"
//var x = {
//  Foo:
//  /*#__PURE__*/
//  function (Foo) {
//    "use strict";
//
//    _inherits(_class, Foo);
//
//    function _class() {
//      _class_call_check(this, _class);
//      return _possible_constructor_return(this,
// _get_prototype_of(_class).apply(this, arguments));    }
//
//    return _class;
//  }(Foo)
//};
//
//"#
//);

// extend_builtins_imported_babel_plugin_transform_builtin_classes
test_exec!(
    syntax(),
    |_| (classes(Default::default()), block_scoping(Mark::new())),
    extend_builtins_imported_babel_plugin_transform_builtin_classes_exec,
    r#"
// Imported from
// https://github.com/WebReflection/babel-plugin-transform-builtin-classes/blob/85efe1374e1c59a8323c7eddd4326f6c93d9f64f/test/test.js

class List extends Array {
  constructor(value) {
    super().push(value);
  }
  push(value) {
    super.push(value);
    return this;
  }
}

expect(new List(1)).toBeInstanceOf(List);
expect(new List(2)).toBeInstanceOf(Array);

var l = new List(3);
expect(l).toHaveLength(1);
expect(l[0]).toBe(3);
expect(l.push(4)).toBe(l);
expect(l).toHaveLength(2);
expect(l.join()).toBe('3,4');

class SecondLevel extends List {
  method() {
    return this;
  }
}

expect(new SecondLevel(1)).toBeInstanceOf(SecondLevel);
expect(new SecondLevel(2)).toBeInstanceOf(List);
expect(new SecondLevel(3)).toBeInstanceOf(Array);

var s = new SecondLevel(4);
expect(s).toHaveLength(1);
expect(s[0]).toBe(4);
expect(s.push(5)).toBe(s);
expect(s).toHaveLength(2);
expect(s.join()).toBe('4,5');
expect(s.method()).toBe(s);

"#
);

// get_set_call_semantics_setter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_setter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  set test(v) {
    throw new Error("gobbledygook");
  }
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Assert that this throws, but that it's not
  // a gobbledygook error that is thrown
}).toThrowError(TypeError)

"#
);

// get_set_call_semantics_not_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_not_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  call() {
    return super.test();
  }

  test() {
    throw new Error("gobbledygook");
  }
}

const obj = new Obj();
expect(() => {
  obj.call();

  // Asser that this throws, but that it's not
  // Obj.p.test's error that is thrown
}).toThrowError(TypeError)

"#
);

// get_set_set_semantics_not_defined_on_parent_getter_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_getter_on_obj_exec,
    r#"
"use strict";
class Base {
}

let called = false;
class Obj extends Base {
  get test() {
    called = true;
  }

  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(called).toBe(false);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

//// regression_t6712
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env" "react"]
//}
//"#),
//    regression_t6712,
//    r#"
//class A {
//  foo() {
//    const foo = 2;
//  }
//}
//
//"#
//    r#"
//var A =
// /*#__PURE__*/
//function () {
//  "use strict";
//
//  function A() {
//    _class_call_check(this, A);
//  }
//
//  _create_class(A, [{
//    key: "foo"
//    value: function foo() {
//      var foo = 2;
//    }
//  }]);
//  return A;
//}();
//
//"#
//);

// get_set_set_semantics_not_defined_on_parent_data_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_data_on_obj_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

//// regression_2663
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env" "react"]
//}
//"#),
//    regression_2663,
//    r#"
//import net from 'net';
//import { EventEmitter } from 'events';
//import BinarySerializer from './helpers/binary-serializer';
//// import ...
//
//export default class Connection extends EventEmitter {
//    constructor(endpoint, joinKey, joinData, roomId) {
//        super();
//
//        this.isConnected = false;
//        this.roomId = roomId;
//
//        // ...
//    }
//
//    send(message) {
//        this.sock.write(BinarySerializer.serializeMessage(message));
//    }
//
//    disconnect() {
//        this.sock.close();
//    }
//}
//
//"#
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule" {
//  value: true
//});
//exports["default"] = void 0;
//
//var _net = _interop_require_default(require("net"));
//
//var _events = require("events");
//
//var _binarySerializer =
// _interop_require_default(require("./helpers/binary-serializer"));
//
//// import ...
//var Connection =
// /*#__PURE__*/
//function (_EventEmitter) {
//  _inherits(Connection, _EventEmitter);
//
//  function Connection(endpoint, joinKey, joinData, roomId) {
//    var _this;
//
//    _class_call_check(this, Connection);
//    _this = _possible_constructor_return(this,
// _get_prototype_of(Connection).call(this));    _this.isConnected = false;
//    _this.roomId = roomId; // ...
//
//    return _this;
//  }
//
//  _create_class(Connection, [{
//    key: "send"
//    value: function send(message) {
//      this.sock.write(_binarySerializer["default"].serializeMessage(message));
//    }
//  }, {
//    key: "disconnect"
//    value: function disconnect() {
//      this.sock.close();
//    }
//  }]);
//  return Connection;
//}(_events.EventEmitter);
//
//exports["default"] = Connection;
//
//"#
//);

// extend_builtins_spec
test_exec!(
    syntax(),
    |_| (classes(Default::default()), block_scoping(Mark::new())),
    extend_builtins_spec_exec,
    r#"
class List extends Array {}

expect(new List).toBeInstanceOf(List);
expect(new List).toBeInstanceOf(Array);

"#
);

// get_set_call_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  test(...args) {
    expect(this).toBe(obj);
    expect(args).toEqual([1, 2, 3]);
    return 1;
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// get_set_memoized_assign
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_memoized_assign_exec,
    r#"
"use strict";
class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  assign() {
    super[proper.prop] += 1;
  }

  assign2() {
    super[i] += 1;
  }
}

const obj = new Obj();

obj.assign();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.assign2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

// get_set_get_semantics_setter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_setter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  set test(v) {
    throw new Error("called");
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

// regression_t7010

//// regression_2941
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [ "proposal-class-properties"],
//  "presets": ["env" "react"]
//}
//"#),
//    regression_2941,
//    r#"
//export default class {}
//
//"#
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule" {
//  value: true
//});
//exports["default"] = void 0;
//
//var _default = function _default() {
//  _class_call_check(this, _default);
//};
//
//exports["default"] = _default;
//
//"#
//);

// get_set_call_semantics_getter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_call_semantics_getter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  get test() {
    expect(this).toBe(obj);
    return function(...args) {
      expect(this).toBe(obj);
      expect(args).toEqual([1, 2, 3]);
      return 1;
    };
  }
}

class Obj extends Base {
  call() {
    super.test(1, 2, 3);
    super.test(1, ...[2, 3]);
    super.test(...[1, 2, 3]);
    return super.test(...arguments);
  }

  test() {
    throw new Error("called");
  }
}

const obj = new Obj();
expect(obj.call(1, 2, 3)).toBe(1);

"#
);

// get_set_set_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base  {
}
Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true,
});

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBe(1);
expect(Obj.prototype.test).toBe(2);
expect(obj.test).toBe(3);

"#
);

// get_set_get_semantics_getter_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_getter_defined_on_parent_exec,
    r#"
"use strict";
class Base {
  get test() {
    expect(this).toBe(obj);
    return 1;
  }
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// get_set_memoized_update
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_memoized_update_exec,
    r#"
"use strict";
class Base {}
Object.defineProperty(Base.prototype, 0, {
  value: 0,
  writable: true,
  configurable: true,
});
Object.defineProperty(Base.prototype, 1, {
  value: 1,
  writable: true,
  configurable: true,
});

let i = 0;
const proper = {
  get prop() {
    return i++;
  },
};

class Obj extends Base {
  update() {
    super[proper.prop]++;
  }

  update2() {
    super[i]++;
  }
}

const obj = new Obj();

obj.update();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(1);

obj.update2();
expect(i).toBe(1);
expect(obj[0]).toBe(1);
expect(obj[1]).toBe(2);

"#
);

// get_set_get_semantics_not_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_not_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();

"#
);

// get_set_set_semantics_not_defined_on_parent_not_on_obj
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_set_semantics_not_defined_on_parent_not_on_obj_exec,
    r#"
"use strict";
class Base {
}

class Obj extends Base {
  set() {
    return super.test = 3;
  }
}

const obj = new Obj();
expect(obj.set()).toBe(3);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBeUndefined();
expect(obj.test).toBe(3);

"#
);

// extend_builtins_builtin_objects_throw_when_wrapped
test_exec!(
    syntax(),
    |_| (classes(Default::default()), block_scoping(Mark::new())),
    extend_builtins_builtin_objects_throw_when_wrapped_exec,
    r#"
// JSON is wrapped because it starts with an uppercase letter, but it
// should not be possible to extend it anyway.

expect(() => class BetterJSON extends JSON {}).toThrow();

"#
);

// get_set_get_semantics_data_defined_on_parent
test_exec!(
    syntax(),
    |t| tr(t),
    get_set_get_semantics_data_defined_on_parent_exec,
    r#"
"use strict";
class Base {
}
Object.defineProperty(Base.prototype, 'test', {
  value: 1,
  writable: true,
  configurable: true,
});

class Obj extends Base {
  get() {
    return super.test;
  }
}
Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true,
});

const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBe(1);

"#
);

// extend_builtins_overwritten_null
test_exec!(
    // Just don't do this.
    ignore,
    syntax(),
    |_| (classes(Default::default()), block_scoping(Mark::new())),
    extend_builtins_overwritten_null_exec,
    r#"
var env = {
  Array: null,
};

// We need to use "with" to avoid leaking the modified Array to other tests.
with (env) {
  class List extends Array {}
  expect(List.prototype.__proto__).toBeUndefined();
}

"#
);

// extend_builtins_super_called
test_exec!(
    // Just don't do this. With is evil.
    ignore,
    syntax(),
    |_| (classes(Default::default()), block_scoping(Mark::new())),
    extend_builtins_super_called_exec,
    r#"
var called = false;

var env = {
  Array: function Array() {
    called = true;
  }
};

// We need to use "with" to avoid leaking the modified Array to other tests.
with (env) {
  class List extends Array {};
  new List();

  expect(called).toBe(true);
}

"#
);

test_exec!(
    syntax(),
    |_| classes(Default::default()),
    issue_846,
    r#"
class SomeClass {
  someMethod() {
     return 1;
  }
}

class OtherClass extends SomeClass {
  anotherMethod() {
    expect(super.someMethod()).toBe(1);
    return 2;
  }
}

const obj = new OtherClass();
expect(obj.anotherMethod()).toBe(2);
"#
);

test_exec!(
    syntax(),
    |_| classes(Default::default()),
    super_binding_exec,
    "
  class Foo {}
  class Test extends Foo {
    foo() {
      return 3;
    }
  }
  Foo = 3;
  expect(new Test().foo()).toBe(3);
  "
);

#[testing::fixture("tests/classes/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                class_properties(Default::default(), unresolved_mark),
                classes(Default::default()),
            )
        },
        &src,
    );
}

// Pipeline directories have their own runner; update this exclusion when adding
// one.
#[testing::fixture("tests/classes/**/input.js", exclude("/tests/classes/(classes|classes-arrow|classes-block-scoping|classes-constant-super|classes-no-class-calls|classes-set-class-methods|classes-super-is-callable-constructor|resolver-class-properties-es2015-typescript-resolver|resolver-es2022-es2018-es2017-es2016-es2015-typescript-resolver)/"))]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                class_properties(Default::default(), unresolved_mark),
                classes(Default::default()),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}

test_exec!(
    syntax(),
    |_| classes(Config {
        constant_super: true,
        ..Default::default()
    }),
    issue_5936,
    "
class Superclass {
  doStuff() {
  }
}

class Subclass extends Superclass {
  doStuff() {
    console.log('hola');
    super.doStuff();
  }
}

expect(() => new Subclass().doStuff()).not.toThrowError()
"
);

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "classes")]
    Classes,
    #[serde(rename = "classes-arrow")]
    ClassesArrow,
    #[serde(rename = "classes-block-scoping")]
    ClassesBlockScoping,
    #[serde(rename = "resolver-es2022-es2018-es2017-es2016-es2015-typescript-resolver")]
    ResolverEs2022Es2018Es2017Es2016Es2015TypescriptResolver,
    #[serde(rename = "resolver-class-properties-es2015-typescript-resolver")]
    ResolverClassPropertiesEs2015TypescriptResolver,
    #[serde(rename = "classes-constant-super")]
    ClassesConstantSuper,
    #[serde(rename = "classes-set-class-methods")]
    ClassesSetClassMethods,
    #[serde(rename = "classes-super-is-callable-constructor")]
    ClassesSuperIsCallableConstructor,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/classes/classes/**/input.js")]
#[testing::fixture("tests/classes/classes-arrow/**/input.js")]
#[testing::fixture("tests/classes/classes-block-scoping/**/input.js")]
#[testing::fixture("tests/classes/classes-constant-super/**/input.js")]
#[testing::fixture("tests/classes/classes-set-class-methods/**/input.js")]
#[testing::fixture("tests/classes/classes-super-is-callable-constructor/**/input.js")]
#[testing::fixture(
    "tests/classes/resolver-class-properties-es2015-typescript-resolver/**/input.js"
)]
#[testing::fixture(
    "tests/classes/resolver-es2022-es2018-es2017-es2016-es2015-typescript-resolver/**/input.js"
)]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::Classes => Box::new(tr(t)),
                CasePipeline::ClassesArrow => Box::new((tr(t), arrow(Mark::new()))),
                CasePipeline::ClassesBlockScoping => Box::new((tr(t), block_scoping(Mark::new()))),
                CasePipeline::ResolverEs2022Es2018Es2017Es2016Es2015TypescriptResolver => {
                    Box::new({
                        let unresolved_mark = Mark::new();
                        let top_level_mark = Mark::new();
                        (
                            resolver(unresolved_mark, top_level_mark, true),
                            es2022::es2022(Default::default(), unresolved_mark),
                            es2018::es2018(Default::default()),
                            es2017::es2017(Default::default(), unresolved_mark),
                            es2016::es2016(),
                            es2015::es2015(
                                unresolved_mark,
                                Some(t.comments.clone()),
                                Default::default(),
                            ),
                        )
                    })
                }
                CasePipeline::ResolverClassPropertiesEs2015TypescriptResolver => Box::new({
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();
                    (
                        resolver(unresolved_mark, top_level_mark, true),
                        class_properties(Default::default(), unresolved_mark),
                        es2015::es2015(
                            unresolved_mark,
                            Some(t.comments.clone()),
                            Default::default(),
                        ),
                    )
                }),
                CasePipeline::ClassesConstantSuper => Box::new(classes(Config {
                    constant_super: true,
                    ..Default::default()
                })),
                CasePipeline::ClassesSetClassMethods => Box::new(classes(Config {
                    set_class_methods: true,
                    ..Default::default()
                })),
                CasePipeline::ClassesSuperIsCallableConstructor => Box::new(classes(Config {
                    super_is_callable_constructor: true,
                    ..Default::default()
                })),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
