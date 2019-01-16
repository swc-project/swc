use super::*;
use crate::helpers::Helpers;
use std::sync::Arc;

fn tr(_: Arc<Helpers>) -> impl Fold<Module> {
    decorators()
}

// transformation_declaration
test!(
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_declaration,
    r#"
@dec()
class A {}
"#,
    r#"
let A = _decorate([dec()], function (_initialize) {
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
var _method = 1;
let Foo = _decorate([decorator], function (_initialize) {
  "use strict";

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
      value: function method() {
        return _method;
      }
    }]
  };
});

"#
);
// element_descriptors_original_class_exec
test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_only_decorated,
    r#"
class B {
  foo = 2;
  bar() {}
}

"#,
    r#"
class B {
  constructor() {
    _defineProperty(this, "foo", 2);
  }

  bar() {}

}

"#
);
// ordering_finishers_exec
test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_arguments,
    r#"
@dec(a, b, ...c)
class A {
  @dec(a, b, ...c) method() {}
}
"#,
    r#"
let A = _decorate([dec(a, b, ...c)], function (_initialize) {
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

  class B extends _A {
    constructor() {
      var _temp;

      0, (_temp = super(), _initialize(this), _temp);
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_strict_directive,
    r#"
(() => {
  "use strict";

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
  "use strict";

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
    "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_extends,
    r#"
@dec class A extends B {}

"#,
    r#"
let A = _decorate([dec], function (_initialize, _B) {
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_extends_await,
    r#"
async function g() {
  @dec class A extends (await B) {}
}

"#,
    r#"
async function g() {
  let A = _decorate([dec], function (_initialize, _super) {
    "use strict";

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
  }, (await B));
}

"#
);
// transformation_extends_yield
test!(
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_extends_yield,
    r#"
function* g() {
  @dec class A extends (yield B) {}
}

"#,
    r#"
function* g() {
  let A = _decorate([dec], function (_initialize, _super) {
    "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
    transformation_expression,
    r#"
(@dec() class {});
"#,
    r#"
_decorate([dec()], function (_initialize) {
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    tr(Default::default()),
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
  "use strict";

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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(Default::default()),
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
