#![cfg(all(
    feature = "swc_ecma_transforms_compat",
    feature = "swc_ecma_transforms_module",
    feature = "swc_ecma_transforms_optimization",
    feature = "swc_ecma_transforms_proposal",
))]

use std::{fs, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    class_fields_use_set::class_fields_use_set,
    es2015::{classes, function_name},
    es2022::class_properties,
};
use swc_ecma_transforms_module::common_js;
use swc_ecma_transforms_proposal::{decorators, decorators::Config};
use swc_ecma_transforms_testing::{test, test_exec, test_fixture, Tester};
use swc_ecma_transforms_typescript::{strip, typescript};

fn ts() -> Syntax {
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    })
}

fn syntax(decorators_before_export: bool) -> Syntax {
    Syntax::Es(EsSyntax {
        decorators_before_export,
        decorators: true,
        ..Default::default()
    })
}

fn tr(_: &Tester) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, true),
        decorators(Default::default()),
        class_fields_use_set(true),
        class_properties(Default::default(), unresolved_mark),
    )
}

fn ts_transform(t: &Tester) -> impl Pass {
    simple_strip(
        t,
        Config {
            legacy: true,
            ..Default::default()
        },
    )
}

fn simple_strip(_: &Tester, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        decorators(config),
        resolver(unresolved_mark, top_level_mark, false),
        typescript(
            typescript::Config {
                no_empty_export: true,
                ..Default::default()
            },
            unresolved_mark,
            top_level_mark,
        ),
        class_fields_use_set(true),
        class_properties(
            class_properties::Config {
                set_public_fields: true,
                ..Default::default()
            },
            unresolved_mark,
        ),
    )
}

/// Folder for `transformation_*` tests
fn transformation(t: &Tester) -> impl Pass {
    simple_strip(t, Default::default())
}

// transformation_declaration
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_declaration,
    r#"
@dec()
class A {}
"#
);
// transformation_initialize_after_super_multiple
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_initialize_after_super_multiple,
    r#"
@dec
class B extends A {
  constructor() {
    const foo = () => { super(); };

    if (a) { super(); }
    else { foo(); }

    while (0) { super(); }

    super();
  }
}


"#
);
// transformation_export_default_anonymous
test!(
    syntax(false),
    |t| transformation(t),
    transformation_export_default_anonymous,
    r#"
export default @dec() class {}

"#
);
// transformation_initialize_after_super_statement
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_initialize_after_super_statement,
    r#"
@dec
class B extends A {
  constructor() {
    super();
  }
}

"#
);
// element_descriptors_created_own_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_own_method_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

function method() {}

@pushElement({
  kind: "method",
  placement: "own",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: method,
  }
})
class A {}

expect(A).not.toHaveProperty("foo");
expect(A.prototype).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(new A(), "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: method,
});

"#
);
// finishers_return_class_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    finishers_return_class_exec,
    r#"
class C {}

function decorator(el) {
  return Object.assign(el, {
    finisher() {
      return C;
    },
  });
}

class A {
  @decorator
  foo() {}
}

expect(A).toBe(C);

"#
);
// misc_method_name_not_shadow
test!(
    module,
    syntax(false),
    |t| tr(t),
    misc_method_name_not_shadow,
    r#"
var method = 1;

@decorator
class Foo {
  method() {
    return method;
  }
}

"#
);
// element_descriptors_original_class_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_class_exec,
    r#"
var el = null;

@(_ => el = _)
class A {}

expect(el).toEqual(Object.defineProperty({
  kind: "class",
  elements: []
}, Symbol.toStringTag, { value: "Descriptor" }));

@(_ => el = _)
class B {
  foo = 2;
  static bar() {}
  get baz() {}
  set baz(x) {}
}

expect(el.elements).toHaveLength(3);

"#
);
// duplicated_keys_create_existing_element_with_extras_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_create_existing_element_with_extras_exec,
    r#"
function decorate(el) {
  el.extras = [{
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    }
  }];

  return el;
}

expect(() => {
  class A {
    @decorate
    bar() {}

    foo() {}
  }
}).toThrow(TypeError);



"#
);
// finishers_no_in_extras_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    finishers_no_in_extras_exec,
    r#"
class C {}

function decorator(el) {
  return Object.assign(el, {
    extras: [
      Object.assign({}, el, {
        key: "bar",
        finisher() {
          return C;
        }
      })
    ]
  });
}

expect(() => {
  class A {
    @decorator
    foo() {}
  }
}).toThrow();

"#
);
// duplicated_keys_computed_keys_same_value
test!(
    module,
    syntax(false),
    |t| tr(t),
    duplicated_keys_computed_keys_same_value,
    r#"
@(_ => desc = _)
class Foo {
  [getKeyI()]() {
    return 1;
  }

  [getKeyJ()]() {
    return 2;
  }
}

"#
);
// transformation_only_decorated
test!(
    syntax(false),
    |t| transformation(t),
    transformation_only_decorated,
    r#"
class B {
  foo = 2;
  bar() {}
}

"#
);
// ordering_finishers_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    ordering_finishers_exec,
    r#"
var log = [];

function push(x) { log.push(x); return x; }

function logFinisher(x) {
  return function (el) {
    return Object.assign(el, {
      finisher() { push(x); }
    });
  };
}

@logFinisher(9)
@logFinisher(8)
class A {
  @logFinisher(1)
  @logFinisher(0)
  foo;

  @logFinisher(3)
  @logFinisher(2)
  static bar() {}

  @logFinisher(5)
  @logFinisher(4)
  static baz;

  @logFinisher(7)
  @logFinisher(6)
  asd() {}
}

var numsFrom0to9 = Array.from({ length: 10 }, (_, i) => i);
expect(log).toEqual(numsFrom0to9);

"#
);
// transformation_initializer_after_super_bug_8808
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_initiailzer_after_super_bug_8808,
    r#"
@decorator(parameter)
class Sub extends Super {
  constructor() {
    super().method();
  }
}
"#
);
// duplicated_keys_original_method_overwritten_no_decorators_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_original_method_overwritten_no_decorators_exec,
    r#"
var el;

@(_ => el = _)
class A {
  method() {
    return 1;
  }

  method() {
    return 2;
  }
}

expect(el.elements).toHaveLength(1);

expect(A.prototype.method()).toBe(2);

"#
);
// transformation_arguments
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_arguments,
    r#"
@dec(a, b, ...c)
class A {
  @dec(a, b, ...c) method() {}
}
"#
);
// duplicated_keys_original_method_overwritten_both_decorated_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_original_method_overwritten_both_decorated_exec,
    r#"
expect(() => {
  class A {
    @(el => el)
    method() {
      return 1;
    }

    @(el => el)
    method() {
      return 2;
    }
  }
}).toThrow(ReferenceError);

"#
);
// ordering_field_initializers_after_methods_exec
test_exec!(
    // Babel 7.3.0 fails
    ignore,
    syntax(false),
    |t| tr(t),
    ordering_field_initializers_after_methods_exec,
    r#"
var counter = 0;

@(x => x)
class A {
  foo = (() => {
    counter++;
    expect(typeof this.method).toBe("function");
    expect(this.foo).toBeUndefined();
    expect(this.bar).toBeUndefined();
    return "foo";
  })();

  method() {}

  bar = (() => {
    counter++;
    expect(typeof this.method).toBe("function");
    expect(this.foo).toBe("foo");
    expect(this.bar).toBeUndefined();
  })();
}

expect(counter).toBe(0);

new A();

expect(counter).toBe(2);

"#
);
// misc_to_primitive_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    misc_to_primitive_exec,
    r#"
let calls = 0;
const baz = {
  [Symbol.toPrimitive]() {
    calls++;
    return "baz";
  }
}

function dec() {}

@dec
class A {
  [baz]() {}
}

expect(calls).toBe(1);

"#
);
// ordering
// transformation_initialize_after_super_expression
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_initialize_after_super_expression,
    r#"
@dec
class B extends A {
  constructor() {
    (0, super());
  }
}

"#
);
// element_descriptors_not_reused_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_not_reused_field_exec,
    r#"
var dec1, dec2;

class A {
  @(_ => dec1 = _)
  @(_ => dec2 = _)
  field = {}
}

expect(dec1).toEqual(dec2);
expect(dec1).not.toBe(dec2);
expect(dec1.descriptor).toEqual(dec2.descriptor);
expect(dec1.descriptor).not.toBe(dec2.descriptor);
expect(dec1.initializer).toBe(dec2.initializer);

"#
);
// transformation_export_default_named
test!(
    syntax(false),
    |t| transformation(t),
    transformation_export_default_named,
    r#"
export default @dec() class Foo {}

"#
);
// element_descriptors_original_own_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_own_field_exec,
    r#"
var el = null;
var val = {};

class A {
  @(_ => el = _)
  foo = val;
}

expect(el).toEqual(Object.defineProperty({
  kind: "field",
  key: "foo",
  placement: "own",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer: expect.any(Function),
}, Symbol.toStringTag, { value: "Descriptor" }));

expect(el.initializer()).toBe(val);

"#
);
// transformation
// ordering_decorators_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    ordering_decorators_exec,
    r#"
var log = [];

function push(x) { log.push(x); return x; }

function logDecoratorRun(a, b) {
  push(a);
  return function (el) { push(b); return el; };
}

@logDecoratorRun(0, 23)
@logDecoratorRun(1, 22)
class A {
  @logDecoratorRun(2, 15)
  @logDecoratorRun(3, 14)
  [push(4)] = "4";

  @logDecoratorRun(5, 17)
  @logDecoratorRun(6, 16)
  static [push(7)]() {}

  @logDecoratorRun(8, 19)
  @logDecoratorRun(9, 18)
  static [push(10)] = "10";

  @logDecoratorRun(11, 21)
  @logDecoratorRun(12, 20)
  [push(13)]() {}
}

var numsFrom0to23 = Array.from({ length: 24 }, (_, i) => i);
expect(log).toEqual(numsFrom0to23);

"#
);
// transformation_async_generator_method
// element_descriptors_default_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_default_exec,
    r#"
function decorate(el) {
  el.descriptor.value = 2;
}

var Foo;

expect(() => {
  Foo = @(() => void 0) class Foo {
    @decorate
    bar() {}
  }
}).not.toThrow();

expect(Foo.prototype.bar).toBe(2);

"#
);
// element_descriptors_original_prototype_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_prototype_method_exec,
    r#"
var el = null;

class A {
  @(_ => el = _)
  foo() {}
}

expect(el).toEqual(Object.defineProperty({
  kind: "method",
  key: "foo",
  placement: "prototype",
  descriptor: {
    enumerable: false,
    configurable: true,
    writable: true,
    value: A.prototype.foo,
  },
}, Symbol.toStringTag, { value: "Descriptor" }));

"#
);
// misc_method_name_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    misc_method_name_exec,
    r#"
function decorator() {}

@decorator
class Foo {
  method() {}
}

expect(Foo.prototype.method.name).toBe("method");

"#
);
// transformation_strict_directive
test!(
    ignore,
    syntax(false),
    |t| transformation(t),
    transformation_strict_directive,
    r#"
(() => {


  @dec
  class Foo {
    method() {}
  }
});

(() => {
  @dec
  class Foo {
    method() {}
  }
});

"#
);
// element_descriptors_created_static_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_static_method_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

function method() {}

@pushElement({
  kind: "method",
  placement: "static",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: method,
  }
})
class A {}

expect(A.prototype).not.toHaveProperty("foo");
expect(new A()).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(A, "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: method,
});

"#
);
// misc_method_name_not_shadow_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    misc_method_name_not_shadow_exec,
    r#"
function decorator() {}

var method = 1;

@decorator
class Foo {
  method() {
    return method;
  }
}

expect(new Foo().method()).toBe(1);
expect(Foo.prototype.method.name).toBe("method");

"#
);
// transformation_class_decorators_yield_await
// duplicated_keys_original_method_overwritten_second_decorated_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_original_method_overwritten_second_decorated_exec,
    r#"
expect(() => {
  class A {
    @(el => el)
    method() {
      return 1;
    }

    method() {
      return 2;
    }
  }
}).toThrow(ReferenceError);

"#
);
// duplicated_keys_get_set_both_decorated_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_get_set_both_decorated_exec,
    r#"
function dec(el) { return el }

expect(() => {
  class A {
    @dec
    get foo() {}

    @dec
    set foo(x) {}
  }
}).toThrow(ReferenceError);

"#
);
// duplicated_keys_original_method_overwritten_first_decorated_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_original_method_overwritten_first_decorated_exec,
    r#"
expect(() => {
  class A {
    method() {
      return 1;
    }

    @(el => el)
    method() {
      return 2;
    }
  }
}).toThrow(ReferenceError);

"#
);
// element_descriptors_created_prototype_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_prototype_field_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

var value = {};

@pushElement({
  kind: "field",
  placement: "prototype",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer() {
    return value;
  }
})
class A {}

expect(A).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(A.prototype, "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: value,
});

"#
);
// transformation_extends
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_extends,
    r#"
@dec class A extends B {}

"#
);
// finishers
// transformation_extends_await
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_extends_await,
    r#"
async function g() {
  @dec class A extends (await B) {}
}

"#
);
// transformation_extends_yield
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_extends_yield,
    r#"
function* g() {
  @dec class A extends (yield B) {}
}

"#
);
// element_descriptors_created_static_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_static_field_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

var value = {};

@pushElement({
  kind: "field",
  placement: "static",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer() {
    return value;
  }
})
class A {}

expect(A.prototype).not.toHaveProperty("foo");
expect(new A()).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(A, "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: value,
});

"#
);
// element_descriptors_created_own_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_own_field_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

var value = {};

@pushElement({
  kind: "field",
  placement: "own",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer() {
    return value;
  }
})
class A {}

expect(A).not.toHaveProperty("foo");
expect(A.prototype).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(new A(), "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: value,
});

"#
);
// element_descriptors_not_reused_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_not_reused_method_exec,
    r#"
var dec1, dec2;

class A {
  @(_ => dec1 = _)
  @(_ => dec2 = _)
  fn() {}
}

expect(dec1).toEqual(dec2);
expect(dec1).not.toBe(dec2);
expect(dec1.descriptor).toEqual(dec2.descriptor);
expect(dec1.descriptor).not.toBe(dec2.descriptor);
expect(dec1.descriptor.value).toBe(dec2.descriptor.value);

"#
);
// element_descriptors_not_reused_class_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_not_reused_class_exec,
    r#"
var dec1, dec2;

@(_ => dec1 = _)
@(_ => dec2 = _)
class A {}

expect(dec1).toEqual(dec2);
expect(dec1).not.toBe(dec2);

"#
);
// duplicated_keys_computed_keys_same_ast_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_computed_keys_same_ast_exec,
    r#"
var i = 0;

function getKey() {
  return (i++).toString();
}

var desc;

@(_ => desc = _)
class Foo {
  [getKey()]() {
    return 1;
  }

  [getKey()]() {
    return 2;
  }
}

expect(desc.elements).toHaveLength(2);

expect(desc.elements[0].key).toBe("0");
expect(desc.elements[0].descriptor.value()).toBe(1);

expect(desc.elements[1].key).toBe("1");
expect(desc.elements[1].descriptor.value()).toBe(2);

expect(i).toBe(2);

"#
);
// transformation_initialize_after_super_bug_8931
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_initialize_after_super_bug_8931,
    r#"
@dec
class B extends A {
  constructor() {
    super();
    [];
  }
}

"#
);
// duplicated_keys
// ordering_static_field_initializers_after_methods_exec
test_exec!(
    // Babel 7.3.0 fails
    ignore,
    syntax(false),
    |t| tr(t),
    ordering_static_field_initializers_after_methods_exec,
    r#"
var counter = 0;

@(x => x)
class A {
  static foo = (() => {
    counter++;
    expect(typeof this.method).toBe("function");
    expect(this.foo).toBeUndefined();
    expect(this.bar).toBeUndefined();
    return "foo";
  })();

  static method() {}

  static bar = (() => {
    counter++;
    expect(typeof this.method).toBe("function");
    expect(this.foo).toBe("foo");
    expect(this.bar).toBeUndefined();
  })();
}

expect(counter).toBe(2);

"#
);
// element_descriptors_original_static_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_static_method_exec,
    r#"
var el = null;

class A {
  @(_ => el = _)
  static foo() {}
}

expect(el).toEqual(Object.defineProperty({
  kind: "method",
  key: "foo",
  placement: "static",
  descriptor: {
    enumerable: false,
    configurable: true,
    writable: true,
    value: A.foo,
  },
}, Symbol.toStringTag, { value: "Descriptor" }));

"#
);
// duplicated_keys_extras_duplicated_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_extras_duplicated_exec,
    r#"
function decorate(el) {
  el.extras = [{
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    }
  }, {
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    }
  }];

  return el;
}

expect(() => {
  class A {
    @decorate
    method() {}
  }
}).toThrow(TypeError);



"#
);
// duplicated_keys_extras_same_as_return_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_extras_same_as_return_exec,
    r#"
function decorate(el) {
  return {
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    },
    extras: [{
      kind: "method",
      key: "foo",
      descriptor: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function() {},
      }
    }]
  };
}

expect(() => {
  class A {
    @decorate
    method() {}
  }
}).toThrow(TypeError);



"#
);
// finishers_class_as_parameter_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    finishers_class_as_parameter_exec,
    r#"
var C;

function decorator(el) {
  return Object.assign(el, {
    finisher(Class) {
      C = Class;
    },
  });
}

class A {
  @decorator
  foo() {}
}

expect(C).toBe(A);

"#
);
// duplicated_keys_moved_and_created_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_moved_and_created_exec,
    r#"
var value1, value2 = {};

function makeStatic(el) {
  el.placement = "static";
  return el;
}

function defineBar(el) {
  el.extras = [{
    key: "bar",
    kind: "method",
    placement: "prototype",
    descriptor: {
      value: value2,
    },
  }];
  return el;
}

function storeValue(el) {
  value1 = el.descriptor.value;
  return el;
}

class Foo {
  @defineBar
  @makeStatic
  @storeValue
  bar() {}
}

expect(Foo.bar).toBe(value1);
expect(Foo.prototype.bar).toBe(value2);

"#
);
// transformation_expression
test!(
    module,
    syntax(false),
    |t| transformation(t),
    transformation_expression,
    r#"
(@dec() class {});
"#
);
// duplicated_keys_original_method_prototype_and_static_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_original_method_prototype_and_static_exec,
    r#"
var el;

@(_ => el = _)
class A {
  method() {
    return 1;
  }

  static method() {
    return 2;
  }
}

expect(el.elements).toHaveLength(2);

expect(A.prototype.method()).toBe(1);
expect(A.method()).toBe(2);

"#
);
// element_descriptors
// duplicated_keys_computed_keys_same_ast
test!(
    module,
    syntax(false),
    |t| tr(t),
    duplicated_keys_computed_keys_same_ast,
    r#"
@(_ => desc = _)
class Foo {
  [getKey()]() {
    return 1;
  }

  [getKey()]() {
    return 2;
  }
}

"#
);
// element_descriptors_created_prototype_method_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_created_prototype_method_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

function method() {}

@pushElement({
  kind: "method",
  placement: "prototype",
  key: "foo",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: method,
  }
})
class A {}

expect(A).not.toHaveProperty("foo");

expect(Object.getOwnPropertyDescriptor(A.prototype, "foo")).toEqual({
  enumerable: true,
  configurable: true,
  writable: true,
  value: method,
});

"#
);
// duplicated_keys_create_existing_element_from_method_decorator_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_create_existing_element_from_method_decorator_exec,
    r#"
function decorate() {
  return {
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    }
  };
}

expect(() => {
  class A {
    @decorate
    bar() {}

    foo() {}
  }
}).toThrow(TypeError);



"#
);
// element_descriptors_original_static_field_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_static_field_exec,
    r#"
var el = null;
var val = { foo: 2 };

class A {
  @(_ => el = _)
  static foo = val;
}

expect(el).toEqual(Object.defineProperty({
  kind: "field",
  key: "foo",
  placement: "static",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer: expect.any(Function),
}, Symbol.toStringTag, { value: "Descriptor" }));

expect(el.initializer()).toBe(val);

"#
);
// duplicated_keys_coalesce_get_set_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_coalesce_get_set_exec,
    r#"
var el, el1;

@(_ => el = _)
class A {
  @(_ => el1 = _)
  get foo() { return 1; }

  set foo(x) { return 2; }
}

expect(el.elements).toHaveLength(1);

expect(el1).toEqual(expect.objectContaining({
  descriptor: expect.objectContaining({
    get: expect.any(Function),
    set: expect.any(Function)
  })
}));

var desc = Object.getOwnPropertyDescriptor(A.prototype, "foo");
expect(desc.get()).toBe(1);
expect(desc.set()).toBe(2);

"#
);
// misc
// transformation_extends_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    transformation_extends_exec,
    r#"
class B {}

@(_ => _)
class A extends B {}

expect(new A).toBeInstanceOf(A);
expect(new A).toBeInstanceOf(B);

"#
);
// duplicated_keys_create_existing_element_from_class_decorator_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_create_existing_element_from_class_decorator_exec,
    r#"
function pushElement(e) {
  return function (c) { c.elements.push(e); return c };
}

expect(() => {
  @pushElement({
    kind: "method",
    key: "foo",
    descriptor: {
      enumerable: true,
      configurable: true,
      writable: true,
      value: function() {},
    }
  })
  class A {
    foo() {}
  }
}).toThrow(TypeError);



"#
);
// duplicated_keys_computed_keys_same_value_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    duplicated_keys_computed_keys_same_value_exec,
    r#"
var i = 0;
var j = 0;

function getKeyI() {
  return (i++).toString();
}
function getKeyJ() {
  return (j++).toString();
}

var desc;

@(_ => desc = _)
class Foo {
  [getKeyI()]() {
    return 1;
  }

  [getKeyJ()]() {
    return 2;
  }
}

expect(desc.elements).toHaveLength(1);

expect(desc.elements[0].key).toBe("0");
expect(desc.elements[0].descriptor.value()).toBe(2);

expect(i).toBe(1);
expect(j).toBe(1);

"#
);
// element_descriptors_original_own_field_without_initializer_exec
test_exec!(
    syntax(false),
    |t| tr(t),
    element_descriptors_original_own_field_without_initiailzer_exec,
    r#"
var el = null;

class A {
  @(_ => el = _)
  foo;
}

expect(el).toEqual(Object.defineProperty({
  kind: "field",
  key: "foo",
  placement: "own",
  descriptor: {
    enumerable: true,
    configurable: true,
    writable: true,
  },
  initializer: undefined,
}, Symbol.toStringTag, { value: "Descriptor" }));

"#
);

// legacy_class_constructors_return_new_constructor
test_exec!(
    syntax(true),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_constructors_return_new_constructor_exec,
    r#"
function dec(cls){
  return class Child extends cls {
    child(){}
  };
}

@dec
class Parent {
  parent(){}
}

expect(typeof Parent.prototype.parent).toBe("function");
expect(typeof Parent.prototype.child).toBe("function");

"#
);

// legacy_class_prototype_methods_numeric_props
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_methods_numeric_props_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(name).toBe(4);
  expect(typeof descriptor).toBe("object");
}

class Example {
  @dec
  4() {};
}

"#
);

// legacy_class_static_properties_mutate_descriptor
test_exec!(
    // I tested using typescript playground and node js
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_static_properties_mutate_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let initializer = descriptor.initializer;
  Object.assign(descriptor, {
    enumerable: name.indexOf("enum") !== -1,
    configurable: name.indexOf("conf") !== -1,
    writable: name.indexOf("write") !== -1,
    initializer: function(...args){
      return '__' + initializer.apply(this, args) + '__';
    },
  });
}

class Example {
  @dec
  static enumconfwrite = 1;

  @dec
  static enumconf = 2;

  @dec
  static enumwrite = 3;

  @dec
  static enum = 4;

  @dec
  static confwrite = 5;

  @dec
  static conf = 6;

  @dec
  static write = 7;

  @dec
  static _ = 8;
}

const inst = new Example();

expect(Example).toHaveProperty("decoratedProps");
expect(Example.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(Example);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(Example.enumconfwrite).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(Example.enumconf).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(Example.enumwrite).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(Example.enum).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(Example.confwrite).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(Example.conf).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(Example.write).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(Example._).toBe("__8__");

"#
);

// legacy_class_static_methods_string_props
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_static_methods_string_props_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(name).toBe("str");
  expect(typeof descriptor).toBe("object");
}

class Example {
   @dec
   static "str"() {};
}

"#
);

// legacy_class_prototype_properties_string_literal_properties
test_exec!(
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_properties_string_literal_properties_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  return descriptor;
}

class Example {
  @dec "a-prop";
}

let inst = new Example();

expect(Example.prototype).toHaveProperty("decoratedProps");
expect(inst.decoratedProps).toEqual([
  "a-prop"
]);

expect(inst).toHaveProperty("a-prop");
expect(inst["a-prop"]).toBeUndefined();

// const descs = Object.getOwnPropertyDescriptors(inst);

// expect(descs["a-prop"].enumerable).toBeTruthy();
// expect(descs["a-prop"].writable).toBeTruthy();
// expect(descs["a-prop"].configurable).toBeTruthy();

"#
);

// legacy_class_prototype_methods_mutate_descriptor
test_exec!(
    // I tested on typescript playground
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_methods_mutate_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  Object.assign(descriptor, {
    enumerable: name.indexOf("enum") !== -1,
    configurable: name.indexOf("conf") !== -1,
    writable: name.indexOf("write") !== -1,
    value: function(...args) {
      return "__" + value.apply(this, args) + "__";
    },
  });
}

class Example {
  @dec
  enumconfwrite(){
    return 1;
  }

  @dec
  enumconf(){
    return 2;
  }

  @dec
  enumwrite(){
    return 3;
  }

  @dec
  enum(){
    return 4;
  }

  @dec
  confwrite(){
    return 5;
  }

  @dec
  conf(){
    return 6;
  }

  @dec
  write(){
    return 7;
  }

  @dec
  _(){
    return 8;
  }
}

expect(Example.prototype).toHaveProperty('decoratedProps');
expect(Example.prototype.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const inst = new Example();

const descs = Object.getOwnPropertyDescriptors(Example.prototype);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(inst.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._()).toBe("__8__");

"#
);

// legacy_object_properties_numeric_props
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_properties_numeric_props_exec,
    r#"
function dec(target, name, descriptor){
  expect(target).toBeTruthy();
  expect(name).toBe(4);
  expect(typeof descriptor).toBe("object");
}

const inst = {
  @dec
  4: 1
};

"#
);

// legacy_class_prototype_properties_return_descriptor
test_exec!(
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_properties_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let initializer = descriptor.initializer;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    initializer: function(...args){
      return '__' + initializer.apply(this, args) + '__';
    },
  };
}

class Example {
  @dec
  enumconfwrite = 1;

  @dec
  enumconf = 2;

  @dec
  enumwrite = 3;

  @dec
  enum = 4;

  @dec
  confwrite = 5;

  @dec
  conf = 6;

  @dec
  write = 7;

  @dec
  _ = 8;
}

const inst = new Example();

expect(Example.prototype).toHaveProperty("decoratedProps");
expect(inst.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(inst);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(inst.confwrite).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._).toBe("__8__");

"#
);

// legacy_object_properties_string_props
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_properties_string_props_exec,
    r#"
function dec(target, name, descriptor){
  expect(target).toBeTruthy();
  expect(name).toBe("str");
  expect(typeof descriptor).toBe("object");
}

const inst = {
  @dec
  "str": 1
};

"#
);

// legacy_object_properties_return_descriptor
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_properties_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let initializer = descriptor.initializer;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    initializer: function(...args){
      return '__' + initializer.apply(this, args) + '__';
    },
  };
}

const inst = {
  @dec
  enumconfwrite: 1,

  @dec
  enumconf: 2,

  @dec
  enumwrite: 3,

  @dec
  enum: 4,

  @dec
  confwrite: 5,

  @dec
  conf: 6,

  @dec
  write: 7,

  @dec
  _: 8,
};

expect(inst).toHaveProperty("decoratedProps");
expect(inst.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(inst);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(inst.confwrite).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._).toBe("__8__");

"#
);

// legacy_class_prototype_methods_string_props
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_methods_string_props_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(name).toBe("str");
  expect(typeof descriptor).toBe("object");
}

class Example {
   @dec
   "str"() {};
}

"#
);

// legacy_class_prototype_methods_return_descriptor
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_methods_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    value: function(...args){
      return '__' + value.apply(this, args) + '__';
    },
  };
}

class Example {
  @dec
  enumconfwrite() {
    return 1;
  }

  @dec
  enumconf() {
    return 2;
  }

  @dec
  enumwrite() {
    return 3;
  }

  @dec
  enum() {
    return 4;
  }

  @dec
  confwrite() {
    return 5;
  }

  @dec
  conf() {
    return 6;
  }

  @dec
  write() {
    return 7;
  }

  @dec
  _() {
    return 8;
  }
}


expect(Example.prototype).toHaveProperty('decoratedProps');
expect(Example.prototype.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);


const inst = new Example();

const descs = Object.getOwnPropertyDescriptors(Example.prototype);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(inst.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._()).toBe("__8__");

"#
);

// legacy_object_ordering_reverse_order
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_ordering_reverse_order_exec,
    r#"
const calls = [];
function dec(id){
  return function(){
    calls.push(id);
  };
}

const obj = {
  @dec(2)
  @dec(1)
  method1(){},

  @dec(4)
  @dec(3)
  prop1: 1,

  @dec(6)
  @dec(5)
  method2(){},

  @dec(8)
  @dec(7)
  prop2: 2,
}

expect(calls).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

"#
);

// legacy_object_methods_numeric_props
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_methods_numeric_props_exec,
    r#"
function dec(target, name, descriptor){
  expect(target).toBeTruthy();
  expect(name).toBe(4);
  expect(typeof descriptor).toBe("object");
}

const inst = {
  @dec
  4(){
  }
};

"#
);

// legacy_class_static_properties_return_descriptor
test_exec!(
    // I tested using typescript playground and node js
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_static_properties_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let initializer = descriptor.initializer;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    initializer: function(...args){
      return '__' + initializer.apply(this, args) + '__';
    },
  };
}

class Example {
  @dec
  static enumconfwrite = 1;

  @dec
  static enumconf = 2;

  @dec
  static enumwrite = 3;

  @dec
  static enum = 4;

  @dec
  static confwrite = 5;

  @dec
  static conf = 6;

  @dec
  static write = 7;

  @dec
  static _ = 8;
}

const inst = new Example();

expect(Example).toHaveProperty("decoratedProps");
expect(Example.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(Example);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(Example.enumconfwrite).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(Example.enumconf).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(Example.enumwrite).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(Example.enum).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(Example.confwrite).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable);
expect(Example.conf).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(Example.write).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(Example._).toBe("__8__");

"#
);

// legacy_class_export_default
test_exec!(
    // We wrap exec tests in a function like it('should work', function(){
    //  // .. code
    // }), but it prevents swc_ecma_parser from parsing the code
    // below correctly.
    ignore,
    syntax(true),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_export_default_exec,
    r#"
const calls = [];

function foo(target) {
  calls.push(target.name);
}

@foo
export default class Foo {
  bar() {
    class Baz {}
  }
}

expect(calls).toEqual(["Foo"]);

"#
);

// legacy_class_ordering_reverse_order
test_exec!(
    syntax(true),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_ordering_reverse_order_exec,
    r#"
const calls = [];

function dec(id){
  return function(){
    calls.push(id);
  };
}

@dec(10)
@dec(9)
class Example2 {
  @dec(2)
  @dec(1)
  method1() {};

  @dec(4)
  @dec(3)
  prop1 = 1;

  @dec(6)
  @dec(5)
  method2() {};

  @dec(8)
  @dec(7)
  prop2 = 2;
}

expect(calls).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

"#
);

// legacy_object_methods_mutate_descriptor
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(true),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_methods_mutate_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  Object.assign(descriptor, {
    enumerable: name.indexOf("enum") !== -1,
    configurable: name.indexOf("conf") !== -1,
    writable: name.indexOf("write") !== -1,
    value: function(...args) {
      return "__" + value.apply(this, args) + "__";
    },
  });
}

const inst = {
  @dec
  enumconfwrite(){
    return 1;
  },

  @dec
  enumconf(){
    return 2;
  },

  @dec
  enumwrite(){
    return 3;
  },

  @dec
  enum(){
    return 4;
  },

  @dec
  confwrite(){
    return 5;
  },

  @dec
  conf(){
    return 6;
  },

  @dec
  write(){
    return 7;
  },

  @dec
  _(){
    return 8;
  },
}

expect(inst).toHaveProperty('decoratedProps');
expect(inst.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(inst);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable);
expect(inst.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._()).toBe("__8__");

"#
);

// legacy_class_static_methods_return_descriptor
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_static_methods_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    value: function(...args){
      return '__' + value.apply(this, args) + '__';
    },
  };
}

class Example {
  @dec
  static enumconfwrite() {
    return 1;
  }

  @dec
  static enumconf() {
    return 2;
  }

  @dec
  static enumwrite() {
    return 3;
  }

  @dec
  static enum() {
    return 4;
  }

  @dec
  static confwrite() {
    return 5;
  }

  @dec
  static conf() {
    return 6;
  }

  @dec
  static write() {
    return 7;
  }

  @dec
  static _() {
    return 8;
  }
}


expect(Example).toHaveProperty("decoratedProps");
expect(Example.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(Example);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(Example.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(Example.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(Example.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(Example.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable);
expect(Example.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(Example.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(Example.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(Example._()).toBe("__8__");

"#
);

// legacy_object_methods_return_descriptor
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_methods_return_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    value: function(...args){
      return '__' + value.apply(this, args) + '__';
    },
  };
}

const inst = {
  @dec
  enumconfwrite(){
    return 1;
  },

  @dec
  enumconf(){
    return 2;
  },

  @dec
  enumwrite(){
    return 3;
  },

  @dec
  enum(){
    return 4;
  },

  @dec
  confwrite(){
    return 5;
  },

  @dec
  conf(){
    return 6;
  },

  @dec
  write(){
    return 7;
  },

  @dec
  _(){
    return 8;
  },
}

expect(inst).toHaveProperty('decoratedProps');
expect(inst.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(inst);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(inst.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(inst.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(inst.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(inst.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(inst.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(inst.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(inst.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(inst._()).toBe("__8__");

"#
);

// legacy_object_methods_string_props
test_exec!(
    // Legacy decorator for object literals
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_object_methods_string_props_exec,
    r#"
function dec(target, name, descriptor){
  expect(target).toBeTruthy();
  expect(name).toBe("str");
  expect(typeof descriptor).toBe("object");
}

const inst = {
  @dec
  "str"(){

  }
};

"#
);

// legacy_class_prototype_properties_child_classes_properties
test_exec!(
    ignore,
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_prototype_properties_child_classes_properties_exec,
    r#"
function dec(target, name, descriptor){
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let initializer = descriptor.initializer;
  descriptor.initializer = function(...args){
    return "__" + initializer.apply(this, args) + "__";
  };
}

class Base {
  @dec
  prop2 = 4;
}

class Example extends Base {
  @dec
  prop = 3;
}

let inst = new Example();

expect(inst.prop).toBe("__3__");
expect(inst.prop2).toBe("__4__");

"#
);

// legacy_class_static_methods_mutate_descriptor
test_exec!(
    syntax(false),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
        )
    },
    legacy_class_static_methods_mutate_descriptor_exec,
    r#"
function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  Object.assign(descriptor, {
    enumerable: name.indexOf("enum") !== -1,
    configurable: name.indexOf("conf") !== -1,
    writable: name.indexOf("write") !== -1,
    value: function(...args) {
      return "__" + value.apply(this, args) + "__";
    },
  });
}

class Example {
  @dec
  static enumconfwrite(){
    return 1;
  }

  @dec
  static enumconf(){
    return 2;
  }

  @dec
  static enumwrite(){
    return 3;
  }

  @dec
  static enum(){
    return 4;
  }

  @dec
  static confwrite(){
    return 5;
  }

  @dec
  static conf(){
    return 6;
  }

  @dec
  static write(){
    return 7;
  }

  @dec
  static _(){
    return 8;
  }
}

expect(Example).toHaveProperty("decoratedProps");
expect(Example.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

const descs = Object.getOwnPropertyDescriptors(Example);

expect(descs.enumconfwrite.enumerable).toBeTruthy();
expect(descs.enumconfwrite.writable).toBeTruthy();
expect(descs.enumconfwrite.configurable).toBeTruthy();
expect(Example.enumconfwrite()).toBe("__1__");

expect(descs.enumconf.enumerable).toBeTruthy();
expect(descs.enumconf.writable).toBe(false);
expect(descs.enumconf.configurable).toBeTruthy();
expect(Example.enumconf()).toBe("__2__");

expect(descs.enumwrite.enumerable).toBeTruthy();
expect(descs.enumwrite.writable).toBeTruthy();
expect(descs.enumwrite.configurable).toBe(false);
expect(Example.enumwrite()).toBe("__3__");

expect(descs.enum.enumerable).toBeTruthy();
expect(descs.enum.writable).toBe(false);
expect(descs.enum.configurable).toBe(false);
expect(Example.enum()).toBe("__4__");

expect(descs.confwrite.enumerable).toBe(false);
expect(descs.confwrite.writable).toBeTruthy();
expect(descs.confwrite.configurable).toBeTruthy();
expect(Example.confwrite()).toBe("__5__");

expect(descs.conf.enumerable).toBe(false);
expect(descs.conf.writable).toBe(false);
expect(descs.conf.configurable).toBeTruthy();
expect(Example.conf()).toBe("__6__");

expect(descs.write.enumerable).toBe(false);
expect(descs.write.writable).toBeTruthy();
expect(descs.write.configurable).toBe(false);
expect(Example.write()).toBe("__7__");

expect(descs._.enumerable).toBe(false);
expect(descs._.writable).toBe(false);
expect(descs._.configurable).toBe(false);
expect(Example._()).toBe("__8__");

"#
);

// legacy_regression_8512
test_exec!(
    syntax(false),
    |_| decorators(Config {
        legacy: true,
        ..Default::default()
    }),
    legacy_regression_8512_exec,
    r#"
function dec(Class, key, desc) {
  return desc;
}

class Foo {
  @dec
  get bar() {}
}

"#
);

test_exec!(
    ts(),
    |t| ts_transform(t),
    issue_862_3,
    "var log: number[] = [];
function push(x: number) { log.push(x); return x; }

function saveOrder(x: number) {
    return function (el: any) {
        log.push(x);
        return el;
    };
}

@saveOrder(1)
class Product {
    @saveOrder(0)
    public id!: string;
}

var nums = Array.from({ length: 2 }, (_, i) => i);
expect(log).toEqual(nums)"
);

test_exec!(
    ts(),
    |t| ts_transform(t),
    issue_863_2,
    "const logs: number[] = [];

function foo() {
  return function (target: any, member: any, ix: any) {
    logs.push(0);
  };
}
function bar() {
  return function (target: any, member: any, ix: any) {
    logs.push(1);
  };
}

class ProductController {
  findById(
    @foo()
    @bar()
    id: number
  ) {
    // ...
  }
}

expect(logs).toEqual([1, 0])

const c = new ProductController();
c.findById(100);
"
);

// decorators_legacy_interop_local_define_property
test!(
    // See: https://github.com/swc-project/swc/issues/421
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            class_properties(Default::default(), unresolved_mark),
            classes(Default::default()),
        )
    },
    decorators_legacy_interop_local_define_property,
    r#"
function dec() {}

// Create a local function binding so babel has to change the name of the helper
function _define_property() {}

class A {
@dec a;

@dec b = 123;

c = 456;
}

"#
);

fn issue_395_syntax() -> ::swc_ecma_parser::Syntax {
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsSyntax {
        decorators: true,
        ..Default::default()
    })
}

test!(
    issue_395_syntax(),
    |_| (
        decorators(Default::default()),
        common_js(
            Default::default(),
            Mark::fresh(Mark::root()),
            common_js::Config {
                strict: false,
                strict_mode: true,
                no_interop: true,
                ..Default::default()
            },
            Default::default(),
        ),
    ),
    issue_395_1,
    "
import Test from './moduleA.js'

@Test('0.0.1')
class Demo {
 constructor() {
    this.author = 'alan'
 }
}
"
);

test!(
    issue_395_syntax(),
    |_| (
        decorators(Default::default()),
        common_js::common_js(
            Default::default(),
            Mark::fresh(Mark::root()),
            common_js::Config {
                strict: false,
                strict_mode: true,
                no_interop: true,
                ..Default::default()
            },
            Default::default(),
        ),
    ),
    issue_395_2,
    "
const Test = (version) => {
return (target) => {
  target.version = version
}
}

export default Test
"
);

// function_name_function_assignment
test!(
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_function_assignment,
    r#"
var foo;
foo = function() {
};

var baz;
baz = function() {
baz();
};
baz = 12;

bar = function() {
bar();
};

"#
);

// function_name_shorthand_property
test!(
    // not important
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
        )
    },
    function_name_shorthand_property,
    r#"
var Utils = {
get: function() {}
};

var { get } = Utils;

var bar = {
get: function(arg) {
  get(arg, "baz");
}
};

var f = function ({ foo = "bar" }) {
var obj = {
  // same name as parameter
  foo: function () {
    foo;
  }
};
};

"#
);

// function_name_object
test!(
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            function_name(),
            classes(Default::default()),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
        )
    },
    function_name_object,
    r#"
var obj = {
f: function () {
  (function f() {
    console.log(f);
  })();
},

h: function () {
  console.log(h);
},

m: function () {
  doSmth();
}
};

"#
);

// function_name_export
test!(
    // not important
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            function_name(),
            classes(Default::default()),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
        )
    },
    function_name_export,
    r#"
export var foo = "yes", foob = "no";

export function whatever() {}

export default function wowzers() {}

var bar = {
foo: function () {
  foo;
},

whatever: function () {
  whatever;
},

wowzers: function () {
  wowzers;
}
};

"#
);

// function_name_global
test!(
    // Cost of development is too high.
    ignore,
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            function_name(),
            classes(Default::default()),
        )
    },
    function_name_global,
    r#"
var test = {
setInterval: function(fn, ms) {
  setInterval(fn, ms);
}
};

"#
);

// function_name_modules
test!(
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            classes(Default::default()),
            function_name(),
            common_js(
                Default::default(),
                Mark::fresh(Mark::root()),
                Default::default(),
                Default::default(),
            ),
        )
    },
    function_name_modules,
    r#"
import events from "events";

class Template {
events() {
  return events;
}
}

console.log(new Template().events());

"#
);

// function_name_eval
test!(
    Default::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            function_name(),
            classes(Default::default()),
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
        )
    },
    function_name_eval,
    r#"
var a = {
eval: function () {
  return eval;
}
};

"#
);

test!(
    module,
    ts(),
    |_| decorators(Default::default()),
    issue_846_1,
    "
  class SomeClass {
    @dec
    someMethod() {}
  }

  class OtherClass extends SomeClass {
    @dec
    anotherMethod() {
      super.someMethod()
    }
  }
  "
);

test_exec!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |t| simple_strip(
        t,
        Config {
            legacy: true,
            emit_metadata: true,
            use_define_for_class_fields: false,
        }
    ),
    issue_1362_1,
    "
    const { IsString } = require('class-validator');

    class CreateUserDto {
      @IsString()
      id!: string;
    }
    "
);

#[testing::fixture("tests/fixture/decorator/**/exec.ts")]
fn fixture_exec(input: PathBuf) {
    let code = fs::read_to_string(input).expect("failed to read file");

    swc_ecma_transforms_testing::exec_tr(
        "decorator",
        Syntax::Typescript(TsSyntax {
            decorators: true,
            ..Default::default()
        }),
        |_t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                decorators(Config {
                    legacy: true,
                    emit_metadata: true,
                    use_define_for_class_fields: false,
                }),
                strip(unresolved_mark, top_level_mark),
                class_fields_use_set(true),
            )
        },
        &code,
    );
}

#[testing::fixture("tests/fixture/legacy-only/**/input.ts")]
fn legacy_only(input: PathBuf) {
    let output = input.with_file_name("output.ts");

    test_fixture(
        ts(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                decorators(Config {
                    legacy: true,
                    emit_metadata: false,
                    use_define_for_class_fields: false,
                }),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}

#[testing::fixture("tests/fixture/legacy-metadata/**/input.ts")]
fn legacy_metadata(input: PathBuf) {
    let output = input.with_file_name("output.ts");

    test_fixture(
        ts(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                decorators(Config {
                    legacy: true,
                    emit_metadata: true,
                    use_define_for_class_fields: false,
                }),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
