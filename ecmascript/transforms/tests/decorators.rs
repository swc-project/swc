#![cfg(all(
    feature = "swc_ecma_transforms_compat",
    feature = "swc_ecma_transforms_module",
    feature = "swc_ecma_transforms_optimization",
    feature = "swc_ecma_transforms_proposal",
))]

use swc_common::chain;
use swc_common::Mark;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver::resolver;
use swc_ecma_transforms_compat::es2015::classes;
use swc_ecma_transforms_compat::es2015::function_name;
use swc_ecma_transforms_compat::es2020::class_properties;
use swc_ecma_transforms_module::common_js;
use swc_ecma_transforms_optimization::simplify::inlining;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_proposal::decorators::Config;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::Fold;

fn ts() -> Syntax {
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    })
}

fn syntax(decorators_before_export: bool) -> Syntax {
    Syntax::Es(EsConfig {
        decorators_before_export,
        decorators: true,
        class_props: true,
        ..Default::default()
    })
}

fn tr() -> impl Fold {
    chain!(decorators(Default::default()), class_properties(),)
}

fn ts_transform() -> impl Fold {
    chain!(
        decorators(Config {
            legacy: true,
            ..Default::default()
        }),
        strip(),
    )
}

/// Folder for `transformation_*` tests
fn transformation() -> impl Fold {
    chain!(decorators(Default::default()), strip(),)
}

// transformation_declaration
test!(
    syntax(false),
    |_| transformation(),
    transformation_declaration,
    r#"
@dec()
class A {}
"#,
    r#"
let A = _decorate([dec()], function (_initialize) {
  

  class A {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: A,
    d: []
  };
});

"#
);
// transformation_initialize_after_super_multiple
test!(
    syntax(false),
    |_| transformation(),
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


"#,
    r#"
let B = _decorate([dec], function (_initialize, _A) {
  

  class B extends _A {
    constructor() {
      const foo = () => {
        super();

        _initialize(this);
      };

      if (a) {
        super();

        _initialize(this);
      } else {
        foo();
      }

      while (0) {
        super();

        _initialize(this);
      }

      super();

      _initialize(this);
    }

  }

  return {
    F: B,
    d: []
  };
}, A);

"#
);
// transformation_export_default_anonymous
test!(
    syntax(false),
    |_| transformation(),
    transformation_export_default_anonymous,
    r#"
export default @dec() class {}

"#,
    r#"
export default _decorate([dec()], function (_initialize) {
  class _class {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: _class,
    d: []
  };
});

"#
);
// transformation_initialize_after_super_statement
test!(
    syntax(false),
    |_| transformation(),
    transformation_initialize_after_super_statement,
    r#"
@dec
class B extends A {
  constructor() {
    super();
  }
}

"#,
    r#"
let B = _decorate([dec], function (_initialize, _A) {
  

  class B extends _A {
    constructor() {
      super();

      _initialize(this);
    }

  }

  return {
    F: B,
    d: []
  };
}, A);

"#
);
// element_descriptors_created_own_method_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| tr(),
    misc_method_name_not_shadow,
    r#"
var method = 1;

@decorator
class Foo {
  method() {
    return method;
  }
}

"#,
    r#"
var method = 1;
let Foo = _decorate([decorator], function (_initialize) {
  

  class Foo {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: Foo,
    d: [{
      kind: "method",
      key: "method",
      value: function method1() {
        return method;
      }
    }]
  };
});

"#
);
// element_descriptors_original_class_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| tr(),
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

"#,
    r#"
let Foo = _decorate([_ => desc = _], function (_initialize) {
  

  class Foo {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: Foo,
    d: [{
      kind: "method",
      key: getKeyI(),
      value: function () {
        return 1;
      }
    }, {
      kind: "method",
      key: getKeyJ(),
      value: function () {
        return 2;
      }
    }]
  };
});

"#
);
// transformation_only_decorated
test!(
    syntax(false),
    |_| transformation(),
    transformation_only_decorated,
    r#"
class B {
  foo = 2;
  bar() {}
}

"#,
    r#"
class B {
  bar() {}
  constructor() {
    this.foo = 2;
  }

}

"#
);
// ordering_finishers_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
// transformation_initiailzer_after_super_bug_8808
test!(
    syntax(false),
    |_| transformation(),
    transformation_initiailzer_after_super_bug_8808,
    r#"
@decorator(parameter)
class Sub extends Super {
  constructor() {
    super().method();
  }
}
"#,
    r#"
let Sub = _decorate([decorator(parameter)], function (_initialize, _Super) {
  

  class Sub extends _Super {
    constructor() {
      var _temp;

      (_temp = super(), _initialize(this), _temp).method();
    }

  }

  return {
    F: Sub,
    d: []
  };
}, Super);

"#
);
// duplicated_keys_original_method_overwritten_no_decorators_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    syntax(false),
    |_| transformation(),
    transformation_arguments,
    r#"
@dec(a, b, ...c)
class A {
  @dec(a, b, ...c) method() {}
}
"#,
    r#"
let A = _decorate([dec(a, b, ...c)], function (_initialize) {
  

  class A {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: A,
    d: [{
      kind: "method",
      decorators: [dec(a, b, ...c)],
      key: "method",
      value: function method() {}
    }]
  };
});

"#
);
// duplicated_keys_original_method_overwritten_both_decorated_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| transformation(),
    transformation_initialize_after_super_expression,
    r#"
@dec
class B extends A {
  constructor() {
    (0, super());
  }
}

"#,
    r#"
let B = _decorate([dec], function (_initialize, _A) {
  

  class B extends _A {
    constructor() {
      var _temp;

      _temp = super(), _initialize(this), _temp;
    }

  }

  return {
    F: B,
    d: []
  };
}, A);

"#
);
// element_descriptors_not_reused_field_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| transformation(),
    transformation_export_default_named,
    r#"
export default @dec() class Foo {}

"#,
    r#"
let Foo = _decorate([dec()], function (_initialize) {
  class Foo {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: Foo,
    d: []
  };
});
export { Foo as default };

"#
);
// element_descriptors_original_own_field_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| transformation(),
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

"#,
    r#"
() => {
  

  let Foo = _decorate([dec], function (_initialize) {
    class Foo {
      constructor() {
        _initialize(this);
      }

    }

    return {
      F: Foo,
      d: [{
        kind: "method",
        key: "method",
        value: function method() {}
      }]
    };
  });
};

() => {
  let Foo = _decorate([dec], function (_initialize2) {
    

    class Foo {
      constructor() {
        _initialize2(this);
      }

    }

    return {
      F: Foo,
      d: [{
        kind: "method",
        key: "method",
        value: function method() {}
      }]
    };
  });
};

"#
);
// element_descriptors_created_static_method_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| transformation(),
    transformation_extends,
    r#"
@dec class A extends B {}

"#,
    r#"
let A = _decorate([dec], function (_initialize, _B) {
  

  class A extends _B {
    constructor(...args) {
      super(...args);

      _initialize(this);
    }

  }

  return {
    F: A,
    d: []
  };
}, B);

"#
);
// finishers
// transformation_extends_await
test!(
    syntax(false),
    |_| transformation(),
    transformation_extends_await,
    r#"
async function g() {
  @dec class A extends (await B) {}
}

"#,
    r#"
async function g() {
  let A = _decorate([dec], function (_initialize, _super) {
    

    class A extends _super {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: A,
      d: []
    };
  }, await B);
}

"#
);
// transformation_extends_yield
test!(
    syntax(false),
    |_| transformation(),
    transformation_extends_yield,
    r#"
function* g() {
  @dec class A extends (yield B) {}
}

"#,
    r#"
function* g() {
  let A = _decorate([dec], function (_initialize, _super) {
    

    class A extends _super {
      constructor(...args) {
        super(...args);

        _initialize(this);
      }

    }

    return {
      F: A,
      d: []
    };
  }, (yield B));
}

"#
);
// element_descriptors_created_static_field_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| transformation(),
    transformation_initialize_after_super_bug_8931,
    r#"
@dec
class B extends A {
  constructor() {
    super();
    [];
  }
}

"#,
    r#"
let B = _decorate([dec], function (_initialize, _A) {
  

  class B extends _A {
    constructor() {
      super();

      _initialize(this);

      [];
    }

  }

  return {
    F: B,
    d: []
  };
}, A);

"#
);
// duplicated_keys
// ordering_static_field_initializers_after_methods_exec
test_exec!(
    // Babel 7.3.0 fails
    ignore,
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    syntax(false),
    |_| transformation(),
    transformation_expression,
    r#"
(@dec() class {});
"#,
    r#"
_decorate([dec()], function (_initialize) {
  

  class _class {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: _class,
    d: []
  };
});

"#
);
// duplicated_keys_original_method_prototype_and_static_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    syntax(false),
    |_| tr(),
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

"#,
    r#"
let Foo = _decorate([_ => desc = _], function (_initialize) {
  

  class Foo {
    constructor() {
      _initialize(this);
    }

  }

  return {
    F: Foo,
    d: [{
      kind: "method",
      key: getKey(),
      value: function () {
        return 1;
      }
    }, {
      kind: "method",
      key: getKey(),
      value: function () {
        return 2;
      }
    }]
  };
});

"#
);
// element_descriptors_created_prototype_method_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
    |_| tr(),
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
// element_descriptors_original_own_field_without_initiailzer_exec
test_exec!(
    syntax(false),
    |_| tr(),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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

// legacy_regression_10264
test!(
    syntax(true),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        strip()
    ),
    legacy_regression_10264,
    r#"
function myDecorator(decoratee) {}

@myDecorator
export default class {}

"#,
    r#"
var _class;
function myDecorator(decoratee) {
}
let _class1 = _class = myDecorator((_class = class {
}) || _class) || _class;
export { _class1 as default }


"#
);

//// legacy_regression_7030
//test!(
//    syntax(false),
//    |_| tr(r#"{
//  "presets": ["env"]
//}
//"#),
//    legacy_regression_7030,
//    r#"
//function generateAsyncAction(type) {
//  type = type.toUpperCase()
//  const request = createAction(type+'_REQUEST',
//      undefined, requestMetaCreator
//  )
//  request.request = request // crazy
//  request.success = createAction(type+'_SUCCESS', undefined, metaCreator)
//  request.error = createAction(type+'_ERROR', undefined, metaCreator)
//  request.cancel = createAction(type+'_CANCEL', undefined, metaCreator)
//  request.progress = createAction(type+'_PROGRESS', undefined, metaCreator)
//  request.process = createAction(type+'_PROCESS', undefined, metaCreator)
//
//  return request
//}
//
//class A extends B {
//  constructor(timestamp) {
//    super()
//    this.timestamp = timestamp
//    this.moment = moment(timestamp)
//  }
//}
//
//"#,
//    r#"
//function _typeof(obj) { if (typeof Symbol === "function" && typeof
// Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return
// typeof obj; }; } else { _typeof = function _typeof(obj) { return obj &&
// typeof Symbol === "function" && obj.constructor === Symbol && obj !==
// Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
//
//function _classCallCheck(instance, Constructor) { if (!(instance instanceof
// Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
//function _possibleConstructorReturn(self, call) { if (call && (_typeof(call)
// === "object" || typeof call === "function")) { return call; } return
// _assertThisInitialized(self); }
//
//function _assertThisInitialized(self) { if (self === void 0) { throw new
// ReferenceError("this hasn't been initialised - super() hasn't been called");
// } return self; }
//
//function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ?
// Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ ||
// Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
//
//function _inherits(subClass, superClass) { if (typeof superClass !==
// "function" && superClass !== null) { throw new TypeError("Super expression
// must either be null or a function"); } subClass.prototype =
// Object.create(superClass && superClass.prototype, { constructor: { value:
// subClass, writable: true, configurable: true } }); if (superClass)
// _setPrototypeOf(subClass, superClass); }
//
//function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ||
// function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return
// _setPrototypeOf(o, p); }
//
//function generateAsyncAction(type) {
//  type = type.toUpperCase();
//  var request = createAction(type + '_REQUEST', undefined,
// requestMetaCreator);  request.request = request; // crazy
//
//  request.success = createAction(type + '_SUCCESS', undefined, metaCreator);
//  request.error = createAction(type + '_ERROR', undefined, metaCreator);
//  request.cancel = createAction(type + '_CANCEL', undefined, metaCreator);
//  request.progress = createAction(type + '_PROGRESS', undefined, metaCreator);
//  request.process = createAction(type + '_PROCESS', undefined, metaCreator);
//  return request;
//}
//
//var A =
// /*#__PURE__*/
//function (_B) {
//  "use strict";
//
//  _inherits(A, _B);
//
//  function A(timestamp) {
//    var _this;
//
//    _classCallCheck(this, A);
//
//    _this = _possibleConstructorReturn(this, _getPrototypeOf(A).call(this));
//    _this.timestamp = timestamp;
//    _this.moment = moment(timestamp);
//    return _this;
//  }
//
//  return A;
//}(B);
//
//"#
//);

//// legacy_class_static_methods_numeric_props
//test_exec!(
//    syntax(false),
//    |_| tr(r#"{
//  "presets": ["env"],
//  "plugins": [
//    ["proposal-decorators", { "legacy": true }],
//    [class_properties(), { "loose": true }]
//  ]
//}
//"#),
//    legacy_class_static_methods_numeric_props_exec,
//    r#"
//function dec(target, name, descriptor){
//  expect(target).toBeTruthy();
//  expect(name).toBe(4);
//  expect(typeof descriptor).toBe("object");
//}
//
//class Example {
//  @dec
//  static 4() {}
//}
//
//"#
//);

//// legacy_class_prototype_properties_mutate_descriptor
//test_exec!(
//    syntax(false),
//    |_| tr(r#"{
//  "presets": ["env"],
//  "plugins": [
//    ["proposal-decorators", { "legacy": true }],
//    [class_properties(), { "loose": true }]
//  ]
//}
//"#),
//    legacy_class_prototype_properties_mutate_descriptor_exec,
//    r#"
//function dec(target, name, descriptor) {
//  expect(target).toBeTruthy();
//  expect(typeof name).toBe("string");
//  expect(typeof descriptor).toBe("object");
//
//  target.decoratedProps = (target.decoratedProps || []).concat([name]);
//
//  let initializer = descriptor.initializer;
//  Object.assign(descriptor, {
//    enumerable: name.indexOf('enum') !== -1,
//    configurable: name.indexOf('conf') !== -1,
//    writable: name.indexOf('write') !== -1,
//    initializer: function(...args){
//      return '__' + initializer.apply(this, args) + '__';
//    },
//  });
//}
//
//function plainDec(target, name, descriptor) {
//  expect(target).toBeTruthy();
//  expect(typeof name).toBe("string");
//  expect(typeof descriptor).toBe("object");
//
//  target.decoratedProps = (target.decoratedProps || []).concat([name]);
//
//  return descriptor;
//}
//
//class Example {
//  @dec
//  enumconfwrite = 1;
//
//  @dec
//  enumconf = 2;
//
//  @dec
//  enumwrite = 3;
//
//  @dec
//  enum = 4;
//
//  @dec
//  confwrite = 5;
//
//  @dec
//  conf = 6;
//
//  @dec
//  write = 7;
//
//  @dec
//  _ = 8;
//
//  @plainDec
//  plain = 9;
//}
//
//const inst = new Example();
//
//expect(Example.prototype).toHaveProperty("decoratedProps");
//expect(inst.decoratedProps).toEqual([
//  "enumconfwrite",
//  "enumconf",
//  "enumwrite",
//  "enum",
//  "confwrite",
//  "conf",
//  "write",
//  "_",
//  "plain",
//]);
//
//const descs = Object.getOwnPropertyDescriptors(inst);
//
//expect(descs.enumconfwrite.enumerable).toBeTruthy();
//expect(descs.enumconfwrite.writable).toBeTruthy();
//expect(descs.enumconfwrite.configurable).toBeTruthy();
//expect(inst.enumconfwrite).toBe("__1__");
//
//expect(descs.enumconf.enumerable).toBeTruthy();
//expect(descs.enumconf.writable).toBe(false);
//expect(descs.enumconf.configurable).toBeTruthy();
//expect(inst.enumconf).toBe("__2__");
//
//expect(descs.enumwrite.enumerable).toBeTruthy();
//expect(descs.enumwrite.writable).toBeTruthy();
//expect(descs.enumwrite.configurable).toBe(false);
//expect(inst.enumwrite).toBe("__3__");
//
//expect(descs.enum.enumerable).toBeTruthy();
//expect(descs.enum.writable).toBe(false);
//expect(descs.enum.configurable).toBe(false);
//expect(inst.enum).toBe("__4__");
//
//expect(descs.confwrite.enumerable).toBe(false);
//expect(descs.confwrite.writable).toBeTruthy();
//expect(descs.confwrite.configurable).toBeTruthy();
//expect(inst.confwrite).toBe("__5__");
//
//expect(descs.conf.enumerable).toBe(false);
//expect(descs.conf.writable).toBe(false);
//expect(descs.conf.configurable).toBeTruthy();
//expect(inst.conf).toBe("__6__");
//
//expect(descs.write.enumerable).toBe(false);
//expect(descs.write.writable).toBeTruthy();
//expect(descs.write.configurable).toBe(false);
//expect(inst.write).toBe("__7__");
//
//expect(descs._.enumerable).toBe(false);
//expect(descs._.writable).toBe(false);
//expect(descs._.configurable).toBe(false);
//expect(inst._).toBe("__8__");
//
//expect(descs.plain.enumerable).toBeTruthy();
//expect(descs.plain.writable).toBeTruthy();
//expect(descs.plain.configurable).toBeTruthy();
//expect(inst.plain).toBe(9);
//
//"#
//);

//// legacy_object_properties_mutate_descriptor
//test_exec!(
//    syntax(false),
//    |_| tr(r#"{
//  "presets": ["env"],
//  "plugins": [
//    ["proposal-decorators", { "legacy": true }],
//    [class_properties(), { "loose": true }]
//  ]
//}
//"#),
//    legacy_object_properties_mutate_descriptor_exec,
//    r#"
//function dec(target, name, descriptor) {
//  expect(target).toBeTruthy();
//  expect(typeof name).toBe("string");
//  expect(typeof descriptor).toBe("object");
//
//  target.decoratedProps = (target.decoratedProps || []).concat([name]);
//
//  let initializer = descriptor.initializer;
//  Object.assign(descriptor, {
//    enumerable: name.indexOf("enum") !== -1,
//    configurable: name.indexOf("conf") !== -1,
//    writable: name.indexOf("write") !== -1,
//    initializer: function(...args){
//      return '__' + initializer.apply(this, args) + '__';
//    },
//  });
//}
//
//const inst = {
//  @dec
//  enumconfwrite: 1,
//
//  @dec
//  enumconf: 2,
//
//  @dec
//  enumwrite: 3,
//
//  @dec
//  enum: 4,
//
//  @dec
//  confwrite: 5,
//
//  @dec
//  conf: 6,
//
//  @dec
//  write: 7,
//
//  @dec
//  _: 8,
//};
//
//
//expect(inst).toHaveProperty("decoratedProps");
//expect(inst.decoratedProps).toEqual([
//  "enumconfwrite",
//  "enumconf",
//  "enumwrite",
//  "enum",
//  "confwrite",
//  "conf",
//  "write",
//  "_",
//]);
//
//const descs = Object.getOwnPropertyDescriptors(inst);
//
//expect(descs.enumconfwrite.enumerable).toBeTruthy();
//expect(descs.enumconfwrite.writable).toBeTruthy();
//expect(descs.enumconfwrite.configurable).toBeTruthy();
//expect(inst.enumconfwrite).toBe("__1__");
//
//expect(descs.enumconf.enumerable).toBeTruthy();
//expect(descs.enumconf.writable).toBe(false);
//expect(descs.enumconf.configurable).toBeTruthy();
//expect(inst.enumconf).toBe("__2__");
//
//expect(descs.enumwrite.enumerable).toBeTruthy();
//expect(descs.enumwrite.writable).toBeTruthy();
//expect(descs.enumwrite.configurable).toBe(false);
//expect(inst.enumwrite).toBe("__3__");
//
//expect(descs.enum.enumerable).toBeTruthy();
//expect(descs.enum.writable).toBe(false);
//expect(descs.enum.configurable).toBe(false);
//expect(inst.enum).toBe("__4__");
//
//expect(descs.confwrite.enumerable).toBe(false);
//expect(descs.confwrite.writable).toBeTruthy();
//expect(descs.confwrite.configurable).toBeTruthy();
//expect(inst.confwrite).toBe("__5__");
//
//expect(descs.conf.enumerable).toBe(false);
//expect(descs.conf.writable).toBe(false);
//expect(descs.conf.configurable).toBeTruthy();
//expect(inst.conf).toBe("__6__");
//
//expect(descs.write.enumerable).toBe(false);
//expect(descs.write.writable).toBeTruthy();
//expect(descs.write.configurable).toBe(false);
//expect(inst.write).toBe("__7__");
//
//expect(descs._.enumerable).toBe(false);
//expect(descs._.writable).toBe(false);
//expect(descs._.configurable).toBe(false);
//expect(inst._).toBe("__8__");
//
//"#
//);

// legacy_decl_to_expression_class_decorators
test!(
    syntax(false),
    |_| decorators(Config {
        legacy: true,
        ..Default::default()
    }),
    legacy_decl_to_expression_class_decorators,
    r#"
export default @dec class A {}
@dec class B {}
"#,
    r#"
    var _class, _class1;
    export default _class = dec((_class = class A {
    }) || _class) || _class;
    let B = _class1 = dec((_class1 = class B {
    }) || _class1) || _class1;
"#
);

// legacy_class_prototype_methods_numeric_props
test_exec!(
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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

// legacy_decl_to_expression_method_decorators
test!(
    syntax(false),
    |_| decorators(Config {
        legacy: true,
        ..Default::default()
    }),
    legacy_decl_to_expression_method_decorators,
    r#"
export default class A {
  @dec foo() {}
}
class B {
  @dec foo() {}
}
"#,
    r#"
var _class, _class1;
let A = ((_class = class A{
     foo() {
    }
}) || _class, _applyDecoratedDescriptor(_class.prototype, 'foo', [dec], Object.getOwnPropertyDescriptor(_class.prototype, 'foo'), _class.prototype), _class);
let B = ((_class1 = class B{
     foo() {
    }
}) || _class1, _applyDecoratedDescriptor(_class1.prototype, 'foo', [dec], Object.getOwnPropertyDescriptor(_class1.prototype, 'foo'), _class1.prototype), _class1);
export { A as default }

"#
);

// legacy_class_prototype_properties_return_descriptor
test_exec!(
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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

// legacy_regression_8041
test!(
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
    legacy_regression_8041,
    r#"
export default class {
  @foo
  bar() {}
}

"#,
    r#"
var _class;
let _class1 = ((_class = function() {
    class _class2{
         bar() {
        }
    }
    return _class2;
}()) || _class, _applyDecoratedDescriptor(_class.prototype, 'bar', [foo], Object.getOwnPropertyDescriptor(_class.prototype, 'bar'), _class.prototype), _class);
export { _class1 as default }
"#
);

// legacy_class_prototype_methods_return_descriptor
test_exec!(
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    syntax(false),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
    ),
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

test!(
    syntax(false),
    |_| decorators(Config {
        legacy: true,
        ..Default::default()
    }),
    issue_591_1,
    "
export class Example {
  @foo() bar = '1';
  @foo() baz = '2';
}",
    "var _class, _descriptor, _descriptor1;
var _dec = foo(), _dec1 = foo();
export let Example = ((_class = class Example{
    constructor(){
        _initializerDefineProperty(this, 'bar', _descriptor, this);
        _initializerDefineProperty(this, 'baz', _descriptor1, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'bar', [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '1';
    }
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, 'baz', [_dec1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '2';
    }
}), _class);
"
);

test!(
    syntax(false),
    |_| decorators(Config {
        legacy: true,
        ..Default::default()
    }),
    issue_591_2,
    "class Example {
  @foo() bar = '1';
  @foo() baz = '2';
}",
    "var _class, _descriptor, _descriptor1;
var _dec = foo(), _dec1 = foo();
let Example = ((_class = class Example{
    constructor(){
        _initializerDefineProperty(this, 'bar', _descriptor, this);
        _initializerDefineProperty(this, 'baz', _descriptor1, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'bar', [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '1';
    }
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, 'baz', [_dec1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '2';
    }
}), _class);
"
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(
        decorators(Config {
            legacy: true,
            ..Default::default()
        }),
        strip()
    ),
    issue_823_1,
    "import {Debounce} from 'lodash-decorators';
class Person {
  private static debounceTime: number = 500 as const;

  @Debounce(Person.debounceTime)
  save() {
    console.log('Hello World!');
  }
}

const p = new Person();
p.save();",
    "var _class;
var _class1, _dec;
import { Debounce } from 'lodash-decorators';
let Person = ((_class1 = (_class = class Person {
    save() {
        console.log('Hello World!');
    }
}, _class.debounceTime = 500, _class)) || _class1, _dec = Debounce(_class1.debounceTime), \
     _applyDecoratedDescriptor(_class1.prototype, 'save', [
    _dec
], Object.getOwnPropertyDescriptor(_class1.prototype, 'save'), _class1.prototype), _class1);
const p = new Person();
p.save();"
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(
        decorators(Config {
            legacy: true,
            ..Default::default()
        }),
        strip(),
        // classes(),
    ),
    issue_823_2,
    "import {Debounce} from 'lodash-decorators';
class Person {
  private static debounceTime: number = 500 as const;

  @Debounce(Person.debounceTime)
  save() {
    console.log('Hello World!');
  }
}

const p = new Person();
p.save();",
    "var _class;
var _class1, _dec;
import { Debounce } from 'lodash-decorators';
let Person = ((_class1 = (_class = class Person {
    save() {
        console.log('Hello World!');
    }
}, _class.debounceTime = 500, _class)) || _class1, _dec = Debounce(_class1.debounceTime), \
     _applyDecoratedDescriptor(_class1.prototype, 'save', [
    _dec
], Object.getOwnPropertyDescriptor(_class1.prototype, 'save'), _class1.prototype), _class1);
const p = new Person();
p.save();
"
);

test!(
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    }),
    |_| chain!(
        decorators(Config {
            legacy: true,
            ..Default::default()
        }),
        strip(),
        classes(),
    ),
    issue_823_3,
    "import {Debounce} from 'lodash-decorators';
class Person {
  private static debounceTime: number = 500 as const;

  @Debounce(Person.debounceTime)
  save() {
    console.log('Hello World!');
  }
}

const p = new Person();
p.save();",
    "var _class;
var _class1, _dec;
import { Debounce } from 'lodash-decorators';
let Person = ((_class1 = (_class = function() {
    'use strict';
    function Person() {
        _classCallCheck(this, Person);
    }
    _createClass(Person, [
        {
            key: 'save',
            value: function save() {
                console.log('Hello World!');
            }
        }
    ]);
    return Person;
}(), _class.debounceTime = 500, _class)) || _class1, _dec = Debounce(_class1.debounceTime), \
     _applyDecoratedDescriptor(_class1.prototype, 'save', [
    _dec
], Object.getOwnPropertyDescriptor(_class1.prototype, 'save'), _class1.prototype), _class1);
const p = new Person();
p.save();"
);

test!(
    ts(),
    |_| ts_transform(),
    issue_862_1,
    "
 @Entity()
export class Product extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public price!: number;

  @Column({ enum: ProductType })
  public type!: ProductType;

  @Column()
  public productEntityId!: string;

  /* ANCHOR: Relations ------------------------------------------------------ */
  @OneToMany(() => Order, (order) => order.product)
  public orders!: Order[];

  @OneToMany(() => Discount, (discount) => discount.product)
  public discounts!: Discount[];
}   
",
    "var _class, _descriptor, _descriptor1, _descriptor2, _descriptor3, _descriptor4, \
     _descriptor5;
var _dec = PrimaryGeneratedColumn('uuid'), _dec1 = Column(), _dec2 = Column({
    enum: ProductType
}), _dec3 = Column(), _dec4 = OneToMany(()=>Order
, (order)=>order.product
), _dec5 = OneToMany(()=>Discount
, (discount)=>discount.product
), _dec6 = Entity();
export let Product = _class = _dec6(((_class = class Product extends TimestampedEntity {
    constructor(...args){
        super(...args);
        _initializerDefineProperty(this, 'id', _descriptor, this);
        _initializerDefineProperty(this, 'price', _descriptor1, this);
        _initializerDefineProperty(this, 'type', _descriptor2, this);
        _initializerDefineProperty(this, 'productEntityId', _descriptor3, this);
        _initializerDefineProperty(this, 'orders', _descriptor4, this);
        _initializerDefineProperty(this, 'discounts', _descriptor5, this);
      }
  }) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'id', [
    _dec
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0,
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, 'price', [
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0,
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'type', [
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0,
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'productEntityId', [
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0,
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'orders', [
    _dec4
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0,
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'discounts', [
    _dec5
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class)) || _class;
"
);

test!(
    ts(),
    |_| ts_transform(),
    issue_862_2,
    "@Entity()
export class Product extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
}
",
    "var _class, _descriptor;
    var _dec = PrimaryGeneratedColumn(\"uuid\"), _dec1 = Entity();
    export let Product = _class = _dec1(((_class = class Product extends TimestampedEntity {
        constructor(...args){
            super(...args);
            _initializerDefineProperty(this, 'id', _descriptor, this);
        }
    }) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'id', [
    _dec
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class)) || _class;
"
);

test_exec!(
    ts(),
    |_| ts_transform(),
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

test!(
    ts(),
    |_| ts_transform(),
    issue_863_1,
    "class ProductController {
  @bar()
  findById(
    @foo()
    id: number
  ) {
    // ...
  }
}",
    " var _class, _dec;
let ProductController = ((_class = class ProductController {
    findById(id) {
    }
}) || _class, foo()(_class.prototype, 'findById', 0), _dec = bar(), \
     _applyDecoratedDescriptor(_class.prototype, 'findById', [
    _dec
], Object.getOwnPropertyDescriptor(_class.prototype, 'findById'), _class.prototype), _class);"
);

test_exec!(
    ts(),
    |_| ts_transform(),
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

expect(logs).toEqual([0, 1])

const c = new ProductController();
c.findById(100);
"
);

test!(
    ts(),
    |_| chain!(
        inlining::inlining(inlining::Config {}),
        decorators(Config {
            legacy: true,
            ..Default::default()
        }),
        strip(),
    ),
    issue_879_1,
    "export default class X {
    @networked
    prop: string = '';
}",
    "var _class, _descriptor;
let X = ((_class = class X {
    constructor(){
        _initializerDefineProperty(this, 'prop', _descriptor, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'prop', [
    networked
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '';
    }
}), _class);
export { X as default };
"
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    legacy_metadata_generics_base,
    "@Decorate
  class MyClass {
    constructor(
      private generic: Generic<A>,
      generic2: Generic<A, B>
    ) {}
  
    @Run
    method(
      generic: Inter<A>,
      @Arg() generic2: InterGen<A, B>
    ) {}
  }",
    r#"
    var _class, _dec, _dec1, _dec2;
var _dec3 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Generic === "undefined" ? Object : Generic,
    typeof Generic === "undefined" ? Object : Generic
]), _dec4 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function);
let MyClass = _class = Decorate(_class = _dec4(_class = _dec3(((_class = class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){
    }
    method(generic: Inter<A>, generic2: InterGen<A, B>) {
    }
}) || _class, _dec = function(target, key) {
    return Arg()(target, key, 1);
}, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Inter === "undefined" ? Object : Inter,
    typeof InterGen === "undefined" ? Object : InterGen
]), _applyDecoratedDescriptor(_class.prototype, "method", [
    Run,
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class.prototype, "method"), _class.prototype), _class)) || _class) || _class) || _class;
"#
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    legacy_metadata_generics_1,
    "@Decorate
class MyClass {
  constructor(
    private generic: Generic<A>,
    generic2: Generic<A, B>
  ) {}
}",
    r#"var _class;
    var _dec = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Generic === "undefined" ? Object : Generic,
        typeof Generic === "undefined" ? Object : Generic
    ]), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function);
    let MyClass = _class = Decorate(_class = _dec1(_class = _dec((_class = class MyClass {
        constructor(private generic: Generic<A>, generic2: Generic<A, B>){
        }
    }) || _class) || _class) || _class) || _class;
    "#
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    legacy_metadata_nest_injection,
    "import { AppService } from './app.service';

    import { Session, Res } from '@nestjs/common';
    import * as express from 'express';

    @Controller()
    export class AppController {
      constructor(private appService: AppService) {}
    
      @Inject()
      appService: AppService;
    
      @Inject()
      private appService2: AppService;
    
      @Get()
      getHello(): string {
        return this.appService.getHello();
      }

      @Get('/callback')
      callback(@Res() res: express.Response, @Session() session: express.Express.Session) {
        const token = await this.getToken(code)
        const user = await this.getUserInfo(token.access_token)

        session.oauth2Token = token
        session.user = user
        return res.redirect(state.returnUrl ?? '/')
      }
    }",
    r#"var _class, _descriptor, _descriptor1, _dec, _dec1, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7;
    import { AppService } from "./app.service";
    import { Session, Res } from "@nestjs/common";
    import * as express from "express";
    var _dec8 = Inject(), _dec9 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof AppService === "undefined" ? Object : AppService), _dec10 = Inject(), _dec11 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", typeof AppService === "undefined" ? Object : AppService), _dec12 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof AppService === "undefined" ? Object : AppService
    ]), _dec13 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec14 = Controller();
    export let AppController = _class = _dec14(_class = _dec13(_class = _dec12(((_class = class AppController {
        constructor(private appService: AppService){
            _initializerDefineProperty(this, "appService", _descriptor, this);
            _initializerDefineProperty(this, "appService2", _descriptor1, this);
        }
        getHello(): string {
            return this.appService.getHello();
        }
        callback(res: express.Response, session: express.Express.Session) {
            const token = await this.getToken(code);
            const user = await this.getUserInfo(token.access_token);
            session.oauth2Token = token;
            session.user = user;
            return res.redirect(state.returnUrl ?? "/");
        }
    }) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "appService", [
        _dec8,
        _dec9
    ], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: void 0,
    }), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "appService2", [
        _dec10,
        _dec11
    ], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: void 0,
    }), _dec = Get(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", []), _applyDecoratedDescriptor(_class.prototype, "getHello", [
        _dec,
        _dec1,
        _dec2
    ], Object.getOwnPropertyDescriptor(_class.prototype, "getHello"), _class.prototype), _dec3 = Get("/callback"), _dec4 = function(target, key) {
        return Res()(target, key, 0);
    }, _dec5 = function(target, key) {
        return Session()(target, key, 1);
    }, _dec6 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof express === "undefined" || typeof express.Response === "undefined" ? Object : express.Response,
        typeof express === "undefined" || typeof express.Express === "undefined" || typeof express.Express.Session === "undefined" ? Object : express.Express.Session
    ]), _applyDecoratedDescriptor(_class.prototype, "callback", [
        _dec3,
        _dec4,
        _dec5,
        _dec6,
        _dec7
    ], Object.getOwnPropertyDescriptor(_class.prototype, "callback"), _class.prototype), _class)) || _class) || _class) || _class;"#
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    legacy_metadata_parameter_decorated_types,
    "class Injected {}

    class MyClass {
      constructor(@inject() parameter: Injected) {}  
    }
    
    class MyOtherClass {
      constructor(
        @inject() private readonly parameter: Injected, 
        @inject('KIND') otherParam: Injected
      ) {}
    
      methodUndecorated(@demo() param: string, otherParam) {}
    
      @decorate('named')
      method(@inject() param: Injected, @arg() schema: Schema) {}
    }
    
    @Decorate
    class DecoratedClass {
      constructor(
        @inject() private readonly module: Injected,
        @inject() otherModule: Injected
      ) {}
      
      @decorate('example')
      method(@inject() param: string) {}
    }",
    r##"
    var _class, _class1, _dec, _dec1, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class2, _dec8, _dec9, _dec10, _dec11;
    class Injected {
    }
    var _dec12 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ]), _dec13 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec14 = function(target, key) {
        return inject()(target, undefined, 0);
    };
    let MyClass = _class = _dec14(_class = _dec13(_class = _dec12((_class = class MyClass {
        constructor(parameter: Injected){
        }
    }) || _class) || _class) || _class) || _class;
    var _dec15 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ]), _dec16 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec17 = function(target, key) {
        return inject("KIND")(target, undefined, 1);
    }, _dec18 = function(target, key) {
        return inject()(target, undefined, 0);
    };
    let MyOtherClass = _class1 = _dec18(_class1 = _dec17(_class1 = _dec16(_class1 = _dec15(((_class1 = class MyOtherClass {
        constructor(private readonly parameter: Injected, otherParam: Injected){
        }
        methodUndecorated(param: string, otherParam) {
        }
        method(param: Injected, schema: Schema) {
        }
    }) || _class1, _dec = function(target, key) {
        return demo()(target, key, 0);
    }, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        String,
        void 0
    ]), _applyDecoratedDescriptor(_class1.prototype, "methodUndecorated", [
        _dec,
        _dec1,
        _dec2
    ], Object.getOwnPropertyDescriptor(_class1.prototype, "methodUndecorated"), _class1.prototype), _dec3 = decorate("named"), _dec4 = function(target, key) {
        return inject()(target, key, 0);
    }, _dec5 = function(target, key) {
        return arg()(target, key, 1);
    }, _dec6 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Schema === "undefined" ? Object : Schema
    ]), _applyDecoratedDescriptor(_class1.prototype, "method", [
        _dec3,
        _dec4,
        _dec5,
        _dec6,
        _dec7
    ], Object.getOwnPropertyDescriptor(_class1.prototype, "method"), _class1.prototype), _class1)) || _class1) || _class1) || _class1) || _class1;
    var _dec19 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ]), _dec20 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec21 = function(target, key) {
        return inject()(target, undefined, 1);
    }, _dec22 = function(target, key) {
        return inject()(target, undefined, 0);
    };
    let DecoratedClass = _class2 = Decorate(_class2 = _dec22(_class2 = _dec21(_class2 = _dec20(_class2 = _dec19(((_class2 = class DecoratedClass {
        constructor(private readonly module: Injected, otherModule: Injected){
        }
        method(param: string) {
        }
    }) || _class2, _dec8 = decorate("example"), _dec9 = function(target, key) {
        return inject()(target, key, 0);
    }, _dec10 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec11 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        String
    ]), _applyDecoratedDescriptor(_class2.prototype, "method", [
        _dec8,
        _dec9,
        _dec10,
        _dec11
    ], Object.getOwnPropertyDescriptor(_class2.prototype, "method"), _class2.prototype), _class2)) || _class2) || _class2) || _class2) || _class2) || _class2;
    "##
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    legacy_metadata_type_serialization,
    "import { Service } from './service';
    import { Decorate } from './Decorate';
    
    const sym = Symbol();
    
    @Decorate()
    class Sample {
      constructor(
        private p0: String,
        p1: Number,
        p2: 10,
        p3: 'ABC',    
        p4: boolean,
        p5: string,
        p6: number,
        p7: Object,
        p8: () => any,
        p9: 'abc' | 'def',
        p10: String | Number,
        p11: Function,
        p12: null,
        p13: undefined,
        p14: any,
        p15: (abc: any) => void,
        p16: false,
        p17: true,
        p18: string = 'abc'
      ) {}
    
      @Decorate
      method(
        @Arg() p0: Symbol,
        p1: typeof sym,
        p2: string | null,
        p3: never,
        p4: string | never,
        p5: (string | null),
        p6: Maybe<string>,
        p7: Object | string,
        p8: string & MyStringType,
        p9: string[],
        p10: [string, number],
        p11: void,
        p12: this is number,
        p13: null | undefined,
        p14: (string | (string | null)),
        p15: Object,
        p16: any,
        p17: bigint,
      ) {}
    
      /**
       * Member Expression
       */
      @Decorate()
      method2(
        p0: Decorate.Name = 'abc',
        p1: Decorate.Name 
      ) {}
    
      /**
       * Assignments
       */
      @Decorate()
      assignments(
        p0: string = 'abc'
      ) {}
    }",
    r##"var _class, _dec, _dec1, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8;
import { Service } from "./service";
import { Decorate } from "./Decorate";
const sym = Symbol();
var _dec9 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof String === "undefined" ? Object : String,
    typeof Number === "undefined" ? Object : Number,
    Number,
    String,
    Boolean,
    String,
    Number,
    typeof Object === "undefined" ? Object : Object,
    Function,
    String,
    Object,
    typeof Function === "undefined" ? Object : Function,
    void 0,
    void 0,
    Object,
    Function,
    Boolean,
    Boolean,
    void 0
]), _dec10 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec11 = Decorate();
let Sample = _class = _dec11(_class = _dec10(_class = _dec9(((_class = class Sample {
    constructor(private p0: String, p1: Number, p2: 10, p3: "ABC", p4: boolean, p5: string, p6: number, p7: Object, p8: () => any, p9: "abc" | "def", p10: String | Number, p11: Function, p12: null, p13: undefined, p14: any, p15: (abc: any) => void, p16: false, p17: true, p18: string = "abc"){
    }
    method(p0: Symbol, p1: typeof sym, p2: string | null, p3: never, p4: string | never, p5: (string | null), p6: Maybe<string>, p7: Object | string, p8: string & MyStringType, p9: string[], p10: [string, number], p11: void, p12: this is number, p13: null | undefined, p14: (string | (string | null)), p15: Object, p16: any, p17: bigint) {
    }
    method2(p0: Decorate.Name. = "abc", p1: Decorate.Name.) {
    }
    assignments(p0: string = "abc") {
    }
}) || _class, _dec = function(target, key) {
    return Arg()(target, key, 0);
}, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Symbol === "undefined" ? Object : Symbol,
    Object,
    void 0,
    void 0,
    void 0,
    void 0,
    typeof Maybe === "undefined" ? Object : Maybe,
    Object,
    Object,
    Array,
    Array,
    void 0,
    Boolean,
    void 0,
    Object,
    typeof Object === "undefined" ? Object : Object,
    Object,
    Number
]), _applyDecoratedDescriptor(_class.prototype, "method", [
    Decorate,
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class.prototype, "method"), _class.prototype), _dec3 = Decorate(), _dec4 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec5 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    void 0,
    typeof Decorate === "undefined" || typeof Decorate.Name === "undefined" ? Object : Decorate.Name
]), _applyDecoratedDescriptor(_class.prototype, "method2", [
    _dec3,
    _dec4,
    _dec5
], Object.getOwnPropertyDescriptor(_class.prototype, "method2"), _class.prototype), _dec6 = Decorate(), _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec8 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    void 0
]), _applyDecoratedDescriptor(_class.prototype, "assignments", [
    _dec6,
    _dec7,
    _dec8
], Object.getOwnPropertyDescriptor(_class.prototype, "assignments"), _class.prototype), _class)) || _class) || _class) || _class;"##,
    ok_if_code_eq
);

test!(
    ts(),
    |_| decorators(Config {
        legacy: true,
        emit_metadata: true,
    }),
    issue_1160_1,
    "
    enum MyEnum {
      x = \"xxx\",
      y = \"yyy\"
    }
    
    class Xpto {
      @Decorator()
      value!: MyEnum;
    }
    
    function Decorator() {
      return function (...args) {};
    }
    ",
    "
    var _class, _descriptor;
enum MyEnum {
    x = \"xxx\",
    y = \"yyy\"
}
var _dec = Decorator(), _dec1 = typeof Reflect !== \"undefined\" && typeof Reflect.metadata === \
     \"function\" && Reflect.metadata(\"design:type\", String);
let Xpto = ((_class = class Xpto {
    constructor(){
        _initializerDefineProperty(this, \"value\", _descriptor, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, \"value\", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class);
function Decorator() {
    return function(...args) {
    };
}
",
    ok_if_code_eq
);

// decorators_legacy_interop_local_define_property
test!(
    // See: https://github.com/swc-project/swc/issues/421
    ignore,
    Default::default(),
    |_| chain!(
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        class_properties(),
        classes()
    ),
    decorators_legacy_interop_local_define_property,
    r#"
function dec() {}

// Create a local function binding so babel has to change the name of the helper
function _defineProperty() {}

class A {
@dec a;

@dec b = 123;

c = 456;
}

"#,
    r#"
var _class, _descriptor, _descriptor2, _temp;

function dec() {} // Create a local function binding so babel has to change the name of the helper


function _defineProperty() {}

let A = (_class = (_temp = function A() {
"use strict";

_classCallCheck(this, A);

_initializerDefineProperty(this, "a", _descriptor, this);

_initializerDefineProperty(this, "b", _descriptor2, this);

_defineProperty2(this, "c", 456);
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "a", [dec], {
configurable: true,
enumerable: true,
writable: true,
initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "b", [dec], {
configurable: true,
enumerable: true,
writable: true,
initializer: function () {
  return 123;
}
})), _class);

"#
);

fn issue_395_syntax() -> ::swc_ecma_parser::Syntax {
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        decorators: true,
        ..Default::default()
    })
}

test!(
    issue_395_syntax(),
    |_| chain!(
        decorators(Default::default()),
        common_js(
            Mark::fresh(Mark::root()),
            common_js::Config {
                strict: false,
                strict_mode: true,
                no_interop: true,
                ..Default::default()
            }
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
",
    "
'use strict';
var _moduleAJs = require('./moduleA.js');
let Demo = _decorate([(0, _moduleAJs).default('0.0.1')], function(_initialize) {
  class Demo{
      constructor(){
          _initialize(this);
          this.author = 'alan';
      }
  }
  return {
      F: Demo,
      d: []
  };
});

"
);

test!(
    issue_395_syntax(),
    |_| chain!(
        decorators(Default::default()),
        common_js::common_js(
            Mark::fresh(Mark::root()),
            common_js::Config {
                strict: false,
                strict_mode: true,
                no_interop: true,
                ..Default::default()
            }
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
",
    "
'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;
const Test = (version)=>{
  return (target)=>{
      target.version = version;
  };
};
var _default = Test;
exports.default = _default;
"
);

// function_name_function_assignment
test!(
    ignore,
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
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

"#,
    r#"
var foo;

foo = function foo() {};

var _baz;

_baz = function baz() {
_baz();
};

_baz = 12;

bar = function (_bar) {
function bar() {
  return _bar.apply(this, arguments);
}

bar.toString = function () {
  return _bar.toString();
};

return bar;
}(function () {
bar();
});

"#
);

// function_name_shorthand_property
test!(
    // not important
    ignore,
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
    ),
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

"#,
    r#"
var Utils = {
get: function get() {}
};
var {
get: _get
} = Utils;
var bar = {
get: function get(arg) {
  _get(arg, "baz");
}
};

var f = function f({
foo: _foo = "bar"
}) {
var obj = {
  // same name as parameter
  foo: function foo() {
    _foo;
  }
};
};

"#
);

// function_name_object
test!(
    ignore,
    Default::default(),
    |_| chain!(
        resolver(),
        function_name(),
        classes(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        })
    ),
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

"#,
    r#"
var obj = {
f: function f() {
  (function f() {
    console.log(f);
  })();
},
h: function (_h) {
  function h() {
    return _h.apply(this, arguments);
  }

  h.toString = function () {
    return _h.toString();
  };

  return h;
}(function () {
  console.log(h);
}),
m: function m() {
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
    |_| chain!(
        resolver(),
        function_name(),
        classes(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        })
    ),
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

"#,
    r#"
var _foo = "yes",
  foob = "no";
export { _foo as foo, foob };

function _whatever() {}

export { _whatever as whatever };

function _wowzers() {}

export { _wowzers as default };
var bar = {
foo: function foo() {
  _foo;
},
whatever: function whatever() {
  _whatever;
},
wowzers: function wowzers() {
  _wowzers;
}
};

"#
);

// function_name_global
test!(
    // Cost of development is too high.
    ignore,
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        function_name(),
        classes(),
    ),
    function_name_global,
    r#"
var test = {
setInterval: function(fn, ms) {
  setInterval(fn, ms);
}
};

"#,
    r#"
var test = {
setInterval: function (_setInterval) {
  function setInterval(_x, _x2) {
    return _setInterval.apply(this, arguments);
  }

  setInterval.toString = function () {
    return _setInterval.toString();
  };

  return setInterval;
}(function (fn, ms) {
  setInterval(fn, ms);
})
};

"#
);

// function_name_modules
test!(
    Default::default(),
    |_| chain!(
        resolver(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
        classes(),
        function_name(),
        common_js(Mark::fresh(Mark::root()), Default::default()),
    ),
    function_name_modules,
    r#"
import events from "events";

class Template {
events() {
  return events;
}
}

console.log(new Template().events());

"#,
    r#"
"use strict";

var _events = _interopRequireDefault(require("events"));

let Template =
/*#__PURE__*/
function () {
'use strict';
function Template() {
  _classCallCheck(this, Template);
}

_createClass(Template, [{
  key: "events",
  value: function events() {
    return _events.default;
  }
}]);
return Template;
}();

console.log(new Template().events());

"#
);

// function_name_eval
test!(
    Default::default(),
    |_| chain!(
        resolver(),
        function_name(),
        classes(),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        })
    ),
    function_name_eval,
    r#"
var a = {
eval: function () {
  return eval;
}
};

"#,
    r#"
var a = {
eval: function _eval() {
  return eval;
}
};

"#
);

test!(
    ts(),
    |_| decorators(decorators::Config {
        legacy: true,
        ..Default::default()
    }),
    swc_node_210,
    "
    class Foo{
      @dec
      [foo]() {
      }
    }
    ",
    "
    var _class;
    let Foo = ((_class = class Foo {
        [foo]() {
        }
    }) || _class, _applyDecoratedDescriptor(_class.prototype, foo, [
        dec
    ], Object.getOwnPropertyDescriptor(_class.prototype, foo), _class.prototype), _class);
    "
);

test!(
    ts(),
    |_| decorators(decorators::Config {
        legacy: true,
        emit_metadata: true,
        ..Default::default()
    }),
    issue_1421_1,
    "
    class User {
      @column() currency!: 'usd' | 'eur' | 'yen';
    }
    ",
    "
    var _class, _descriptor;
    var _dec = column(), _dec1 = typeof Reflect !== 'undefined' && typeof Reflect.metadata === \
     'function' && Reflect.metadata('design:type', String);
    let User = ((_class = class User {
        constructor(){
            _initializerDefineProperty(this, 'currency', _descriptor, this);
        }
    }) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, 'currency', [
        _dec,
        _dec1
    ], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: void 0
    }), _class);
    "
);
