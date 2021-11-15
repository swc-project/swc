use std::{fs::read_to_string, path::PathBuf};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_compat::es2020::{opt_chaining::Config, optional_chaining};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec};
use swc_ecma_visit::Fold;

fn tr(c: Config) -> impl Fold {
    optional_chaining(c)
}

fn syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

// general_memoize_loose
test!(
    syntax(),
    |_| tr(Config {
        no_document_all: true,
        pure_getter: true
    }),
    general_memoize_loose,
    r#"
"use strict";

function test(foo) {
  foo?.bar;

  foo?.bar?.baz;

  foo?.(foo);

  foo?.bar()

  foo.get(bar)?.()

  foo.bar()?.()
  foo[bar]()?.()

  foo.bar().baz?.()
  foo[bar]().baz?.()

  foo.bar?.(foo.bar, false)

  foo?.bar?.(foo.bar, true)

  foo.bar?.baz(foo.bar, false)

  foo?.bar?.baz(foo.bar, true)

  foo.bar?.baz?.(foo.bar, false)

  foo?.bar?.baz?.(foo.bar, true)
}
"#,
    r#"
"use strict";

function test(foo) {
  var ref, ref1, ref2, ref3, _obj, ref4, _obj1, ref5, ref6, ref7, ref8, ref9;

  foo == null ? void 0 : foo.bar;
  foo == null ? void 0 : (ref = foo.bar) == null ? void 0 : ref.baz;
  foo == null ? void 0 : foo(foo);
  foo == null ? void 0 : foo.bar();
  (ref1 = foo.get(bar)) == null ? void 0 : ref1();
  (ref2 = foo.bar()) == null ? void 0 : ref2();
  (ref3 = foo[bar]()) == null ? void 0 : ref3();
  (ref4 = (_obj = foo.bar()).baz) == null ? void 0 : ref4.call(_obj);
  (ref5 = (_obj1 = foo[bar]()).baz) == null ? void 0 : ref5.call(_obj1);
  foo.bar == null ? void 0 : foo.bar(foo.bar, false);
  foo == null ? void 0 : foo.bar == null ? void 0 : foo.bar(foo.bar, true);
  (ref6 = foo.bar) == null ? void 0 : ref6.baz(foo.bar, false);
  foo == null ? void 0 : (ref7 = foo.bar) == null ? void 0 : ref7.baz(foo.bar, true);
  (ref8 = foo.bar) == null ? void 0 : ref8.baz == null ? void 0 : ref8.baz(foo.bar, false);
  foo == null ? void 0 : (ref9 = foo.bar) == null ? void 0 : ref9.baz == null ? void 0 : ref9.baz(foo.bar, true);
}
"#
);

// general_lhs_assignment_read_and_update

// general_function_call_loose
test!(
    syntax(),
    |_| tr(Config {
        pure_getter: true,
        no_document_all: true
    }),
    general_function_call_loose,
    r#"
foo?.(foo);

foo?.bar()

foo.bar?.(foo.bar, false)

foo?.bar?.(foo.bar, true)
"#,
    r#"
foo == null ? void 0 : foo(foo);
foo == null ? void 0 : foo.bar();
foo.bar == null ? void 0 : foo.bar(foo.bar, false);
foo == null ? void 0 : foo.bar == null ? void 0 : foo.bar(foo.bar, true);
"#
);

// general_function_param_loose
test!(
    ignore,
    syntax(),
    |_| tr(Config {
        pure_getter: true,
        no_document_all: true
    }),
    general_function_param_loose,
    r#"
function f(a = x?.y) {}

function g({ a, b = a?.c }) {}

function h(a, { b = a.b?.c?.d.e }) {}

function i(a, { b = (a.b?.c?.d).e }) {}

function j(a, { b = a?.b?.c().d.e }) {}
"#,
    r#"
function f(a = (() => {
  var _x;

  return (_x = x) == null ? void 0 : _x.y;
})()) {}

function g({
  a,
  b = a == null ? void 0 : a.c
}) {}

function h(a, {
  b = (() => {
    var _a$b, _a$b$c;

    return (_a$b = a.b) == null ? void 0 : (_a$b$c = _a$b.c) == null ? void 0 : _a$b$c.d.e;
  })()
}) {}

function i(a, {
  b = (() => {
    var _a$b2, _a$b2$c;

    return (_a$b2 = a.b) == null ? void 0 : (_a$b2$c = _a$b2.c) == null ? void 0 : _a$b2$c.d;
  })().e
}) {}

function j(a, {
  b = (() => {
    var _a$b3;

    return a == null ? void 0 : (_a$b3 = a.b) == null ? void 0 : _a$b3.c().d.e;
  })()
}) {}
"#
);

test!(
    ignore,
    syntax(),
    |_| tr(Config {
        pure_getter: true,
        no_document_all: true
    }),
    general_method_key_loose,
    r#"
let x;
const a = {
  [x.y?.z]() {}
};
"#,
    r#"
var _x$y;

let x;
const a = {
  [(_x$y = x.y) == null ? void 0 : _x$y.z]() {}

};
"#
);

// regression_7642

// general_super_method_call_loose
test!(
    ignore,
    syntax(),
    |_| tr(Config {
        pure_getter: true,
        no_document_all: true
    }),
    general_super_method_call_loose,
    r#"
"use strict";
class Base {
  method() {
    return 'Hello!';
  }
}

class Derived extends Base {
    method() {
        return super.method?.()
    }
}
"#,
    r#"
"use strict";

class Base {
  method() {
    return 'Hello!';
  }
}

class Derived extends Base {
  method() {
    return super.method == null ? void 0 : super.method();
  }
}
"#
);

// general_lhs_update

// general_assignment
test!(
    syntax(),
    |_| tr(Default::default()),
    general_assignment,
    r#"
"use strict";

const obj = {
  a: {
    b: {
      c: {
        d: 2,
      },
    },
  },
};

const a = obj?.a;

const b = obj?.a?.b;

const bad = obj?.b?.b;

let val;
val = obj?.a?.b;

"#,
    r#"
"use strict";

var ref, ref1, ref2;

const obj = {
  a: {
    b: {
      c: {
        d: 2
      }
    }
  }
};
const a = obj === null || obj === void 0 ? void 0 : obj.a;
const b = obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : ref.b;
const bad = obj === null || obj === void 0 ? void 0 : (ref1 = obj.b) === null || ref1 === void 0 ? void 0 : ref1.b;
let val;
val = obj === null || obj === void 0 ? void 0 : (ref2 = obj.a) === null || ref2 === void 0 ? void 0 : ref2.b;

"#
);

// general_memoize
test!(
    syntax(),
    |_| tr(Default::default()),
    general_memoize,
    r#"
function test(foo) {
  foo?.bar;

  foo?.bar?.baz;

  foo?.(foo);

  foo?.bar()

  foo.bar?.(foo.bar, false)

  foo?.bar?.(foo.bar, true)

  foo.bar?.baz(foo.bar, false)

  foo?.bar?.baz(foo.bar, true)

  foo.bar?.baz?.(foo.bar, false)

  foo?.bar?.baz?.(foo.bar, true)
}

"#,
    r#"
function test(foo) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
    foo === null || foo === void 0 ? void 0 : foo.bar;
    foo === null || foo === void 0 ? void 0 : (ref = foo.bar) === null || ref === void 0 ? void 0 : ref.baz;
    foo === null || foo === void 0 ? void 0 : foo(foo);
    foo === null || foo === void 0 ? void 0 : foo.bar();
    (ref1 = foo.bar) === null || ref1 === void 0 ? void 0 : ref1.call(foo, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (ref2 = foo.bar) === null || ref2 === void 0 ? void 0 : ref2.call(foo, foo.bar, true);
    (ref3 = foo.bar) === null || ref3 === void 0 ? void 0 : ref3.baz(foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (ref4 = foo.bar) === null || ref4 === void 0 ? void 0 : ref4.baz(foo.bar, true);
    (ref5 = foo.bar) === null || ref5 === void 0 ? void 0 : (ref6 = ref5.baz) === null || ref6 === void 0 ? void 0 : ref6.call(ref5, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (ref7 = foo.bar) === null || ref7 === void 0 ? void 0 : (ref8 = ref7.baz) === null || ref8 === void 0 ? void 0 : ref8.call(ref7, foo.bar, true);
}
"#
);

// general_containers
test!(
    syntax(),
    |_| tr(Default::default()),
    general_containers,
    r#"
var street = user.address?.street
street = user.address?.street

test(a?.b,  1);

(a?.b, 2);

"#,
    r#"
var ref, ref1;

var street = (ref = user.address) === null || ref === void 0 ? void 0 : ref.street;
street = (ref1 = user.address) === null || ref1 === void 0 ? void 0 : ref1.street;
test(a === null || a === void 0 ? void 0 : a.b, 1);
a === null || a === void 0 ? void 0 : a.b, 2;

"#
);

// general_function_call_spread

// general_lhs_assignment

// general_delete_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    general_delete_exec,
    r#"
"use strict";

const obj = {
  a: {
    b: 0,
  },
};

let test = delete obj?.a?.b;
expect(obj.a.b).toBeUndefined();
expect(test).toBe(true);

test = delete obj?.a.b;
expect(obj.a.b).toBeUndefined();
expect(test).toBe(true);

test = delete obj?.b?.b;
expect(obj.b).toBeUndefined();
expect(test).toBeUndefined();

delete obj?.a;
expect(obj.a).toBeUndefined();

"#
);

// general_member_access
test!(
    syntax(),
    |_| tr(Default::default()),
    general_member_access,
    r#"
foo?.bar;

a?.b.c?.d.e;

a.b?.c.d?.e;

a.b.c?.d?.e;

orders?.[0].price;

orders?.[0]?.price;

orders[client?.key].price;

orders[client.key]?.price;

(0, a?.b).c;

(0, (0, a?.b).c?.d).e;

"#,
    r#"
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
foo === null || foo === void 0 ? void 0 : foo.bar;
(ref = a === null || a === void 0 ? void 0 : a.b.c) === null || ref === void 0 ? void 0 : ref.d.e;
(ref2 = (ref1 = a.b) === null || ref1 === void 0 ? void 0 : ref1.c.d) === null || ref2 === void 0 ? void 0 : ref2.e;
(ref3 = a.b.c) === null || ref3 === void 0 ? void 0 : (ref4 = ref3.d) === null || ref4 === void 0 ? void 0 : ref4.e;
orders === null || orders === void 0 ? void 0 : orders[0].price;
orders === null || orders === void 0 ? void 0 : (ref5 = orders[0]) === null || ref5 === void 0 ? void 0 : ref5.price;
orders[client === null || client === void 0 ? void 0 : client.key].price;
(ref6 = orders[client.key]) === null || ref6 === void 0 ? void 0 : ref6.price;
(0, a === null || a === void 0 ? void 0 : a.b).c;
(0, (ref7 = (0, a === null || a === void 0 ? void 0 : a.b).c) === null || ref7 === void 0 ? void 0 : ref7.d).e;
"#
);

// general_unary
test!(
    syntax(),
    |_| tr(Default::default()),
    general_unary,
    r#"
"use strict";

const obj = {
  a: {
    b: 0,
  },
};

let test = +obj?.a?.b;

test = +obj?.a.b;

test = +obj?.b?.b;

test = +obj?.b?.b;

"#,
    r#"
"use strict";

var ref, ref1, ref2;

const obj = {
  a: {
    b: 0
  }
};
let test = +(obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : ref.b);
test = +(obj === null || obj === void 0 ? void 0 : obj.a.b);
test = +(obj === null || obj === void 0 ? void 0 : (ref1 = obj.b) === null || ref1 === void 0 ? void 0 : ref1.b);
test = +(obj === null || obj === void 0 ? void 0 : (ref2 = obj.b) === null || ref2 === void 0 ? void 0 : ref2.b);

"#
);

// regression_8354

// general_function_call
test!(
    syntax(),
    |_| tr(Default::default()),
    general_function_call,
    r#"
foo?.(foo);

foo?.bar()

foo.bar?.(foo.bar, false)

foo?.bar?.(foo.bar, true)

foo?.().bar

foo?.()?.bar

foo.bar?.().baz

foo.bar?.()?.baz

foo?.bar?.().baz

foo?.bar?.()?.baz

foo?.bar()?.()

"#,
    r#"
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
foo === null || foo === void 0 ? void 0 : foo(foo);
foo === null || foo === void 0 ? void 0 : foo.bar();
(ref = foo.bar) === null || ref === void 0 ? void 0 : ref.call(foo, foo.bar, false);
foo === null || foo === void 0 ? void 0 : (ref1 = foo.bar) === null || ref1 === void 0 ? void 0 : ref1.call(foo, foo.bar, true);
foo === null || foo === void 0 ? void 0 : foo().bar;
foo === null || foo === void 0 ? void 0 : (ref2 = foo()) === null || ref2 === void 0 ? void 0 : ref2.bar;
(ref3 = foo.bar) === null || ref3 === void 0 ? void 0 : ref3.call(foo).baz;
(ref4 = foo.bar) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.call(foo)) === null || ref5 === void 0 ? void 0 : ref5.baz;
foo === null || foo === void 0 ? void 0 : (ref6 = foo.bar) === null || ref6 === void 0 ? void 0 : ref6.call(foo).baz;
foo === null || foo === void 0 ? void 0 : (ref7 = foo.bar) === null || ref7 === void 0 ? void 0 : (ref8 = ref7.call(foo)) === null || ref8 === void 0 ? void 0 : ref8.baz;
(ref9 = foo === null || foo === void 0 ? void 0 : foo.bar()) === null || ref9 === void 0 ? void 0 : ref9();"#
);

// general_unary_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    general_unary_exec,
    r#"
"use strict";

const obj = {
  a: {
    b: 0,
  },
};

let test = +obj?.a?.b;
expect(test).toBe(0);

test = +obj?.a.b;
expect(test).toBe(0);

test = +obj?.b?.b;
expect(test).toBe(NaN);

test = +obj?.b?.b;
expect(test).toBe(NaN);

"#
);

// general_call_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    general_call_exec,
    r#"

"#
);

// general_delete
test!(
    syntax(),
    |_| tr(Default::default()),
    general_delete,
    r#"
"use strict";

const obj = {
  a: {
    b: 0,
  },
};

let test = delete obj?.a?.b;

test = delete obj?.a.b;

test = delete obj?.b?.b;

delete obj?.a;

"#,
    r#"
"use strict";

var ref, ref1;

const obj = {
  a: {
    b: 0
  }
};
let test = obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : delete ref.b;
test = obj === null || obj === void 0 ? void 0 : delete obj.a.b;
test = obj === null || obj === void 0 ? void 0 : (ref1 = obj.b) === null || ref1 === void 0 ? void 0 : delete ref1.b;
obj === null || obj === void 0 ? void 0 : delete obj.a;

"#
);

// regression_8354_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    regression_8354_exec,
    r#"
const foo = undefined;
const bar = 'bar';
const foobar = foo?.replace(`foo${bar}`, '');

expect(foobar).toBe(undefined);
"#
);

// general_assignment_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    general_assignment_exec,
    r#"
"use strict";

const obj = {
  a: {
    b: {
      c: {
        d: 2,
      },
    },
  },
};

const a = obj?.a;
expect(a).toBe(obj.a);

const b = obj?.a?.b;
expect(b).toBe(obj.a.b);

const bad = obj?.b?.b;
expect(bad).toBeUndefined();

let val;
val = obj?.a?.b;
expect(val).toBe(obj.a.b);

expect(() => {
  const bad = obj?.b.b;
}).toThrow();

"#
);

// general_super_method_call
test!(
    syntax(),
    |_| tr(Default::default()),
    general_super_method_call,
    r#"
"use strict";
class Base {
  method() {
    return 'Hello!';
  }
}

class Derived extends Base {
    method() {
        return super.method?.()
    }
}

"#,
    r#"
"use strict";

class Base {
  method() {
    return 'Hello!';
  }

}

class Derived extends Base {
  method() {
    var ref;

    return (ref = super.method) === null || ref === void 0 ? void 0 : ref.call(this);
  }

}

"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_1,
    "obj?.a",
    "obj === null || obj === void 0 ? void 0 : obj.a;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_2,
    "obj?.a?.b",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_3,
    "obj?.a?.b.c",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    call_1,
    "obj?.a?.b()",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b();",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    call_2,
    "a?.b?.c?.()",
    "var ref, ref1;

a === null || a === void 0
  ? void 0
  : (ref = a.b) === null || ref === void 0
    ? void 0
    : (ref1 = ref.c) === null || ref1 === void 0
      ? void 0
      : ref1.call(ref);"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_1,
    "test.a?.b.c.d",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c.d"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_2,
    "test.a?.b.c",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_3,
    "test.a?.b.c.d.e.f.g.h.i",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c.d.e.f.g.h.i"
);

// https://github.com/Brooooooklyn/swc-node/issues/62
test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_issue_62,
    "a.focus?.()",
    "var ref;
    (ref = a.focus) === null || ref === void 0 ? void 0 : ref.call(a);"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1092_1,
    "a?.b.c()",
    "a === null || a === void 0 ? void 0 : a.b.c();"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1092_2,
    "a?.b.c.d.e.f.g.h()",
    "a === null || a === void 0 ? void 0 : a.b.c.d.e.f.g.h();"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_95,
    "
  const obj = {
    a: {
      b: {
        c: function () {
          return this.foo
        },
        foo: 2,
      },
      foo: 1,
    },
  }

  expect(obj?.a?.b?.c()).toBe(2)
  "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_95_2,
    "
obj?.a?.b?.c()
",
    "
    var ref, ref1;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     (ref1 = ref.b) === null || ref1 === void 0 ? void 0 : ref1.c();"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_95_3,
    "
expect(obj?.a?.b?.c()).toBe(2)
",
    "
  var ref, ref1;
expect(obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 \
     : (ref1 = ref.b) === null || ref1 === void 0 ? void 0 : ref1.c()).toBe(2);
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1130_1,
    "
const result = data?.filter(item => Math.random() > 0.5).map(item => JSON.stringify(item));
    ",
    "
const result = data === null || data === void 0 ? void 0 : data.filter(item => Math.random() > \
     0.5).map(item => JSON.stringify(item));
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1130_2,
    "
const r = d?.filter(i => Math.random() > 0.5).map(i => JSON.stringify(i));
  ",
    "
const r = d === null || d === void 0 ? void 0 : d.filter(i => Math.random() > 0.5).map(i => \
     JSON.stringify(i));
  "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1133_1,
    "
async function foo() {
  const item = await data?.foo();
}
    ",
    "
    async function foo() {
      const item = await (data === null || data === void 0 ? void 0 : data.foo());
    }
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1136_1,
    r#"
    const PATCHES = new Map();

    const ident = 'foo';
    const patch = PATCHES.get(ident)?.();
    "#,
    r#"
    var ref;
    const PATCHES = new Map();
    const ident = "foo";
    const patch = (ref = PATCHES.get(ident)) === null || ref === void 0 ? void 0 : ref();
    "#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1836_1,
    "
    function bug() {
      const arrowFn = (arg) => this.object[arg]?.();
    }

    bug();
    ",
    "
    function bug() {
        const arrowFn = (arg)=>{
            var _object, ref;
            return (ref = (_object = this.object)[arg]) === null || ref === void 0 ? void 0 : \
     ref.call(_object);
        };
    }
    bug();
    "
);

test_exec!(
    ignore,
    syntax(),
    |_| tr(Config {
        no_document_all: true,
        pure_getter: true
    }),
    general_parenthesized_expression_member_call_loose,
    r#"
class Foo {
  constructor() {
    this.x = 1;
    this.self = this;
  }
  m() { return this.x; };
  getSelf() { return this }

  test() {
    const Foo = this;
    const o = { Foo: Foo };
    const fn = function () {
      return o;
    };

    expect((Foo?.["m"])()).toEqual(1);
    expect((Foo?.["m"])().toString).toEqual(1..toString);
    expect((Foo?.["m"])().toString()).toEqual('1');

    expect(((Foo?.["m"]))()).toEqual(1);
    expect(((Foo?.["m"]))().toString).toEqual(1..toString);
    expect(((Foo?.["m"]))().toString()).toEqual('1');

    expect((o?.Foo.m)()).toEqual(1);
    expect((o?.Foo.m)().toString).toEqual(1..toString);
    expect((o?.Foo.m)().toString()).toEqual('1');

    expect((((o.Foo?.self.getSelf)())?.m)()).toEqual(1);
    expect((((o.Foo.self?.getSelf)())?.m)()).toEqual(1);

    expect((((fn()?.Foo?.self.getSelf)())?.m)()).toEqual(1);
    expect((((fn?.().Foo.self?.getSelf)())?.m)()).toEqual(1);
  }

  testNull() {
    const o = null;

    expect(() => { (o?.Foo.m)() }).toThrow();
    expect(() => { (o?.Foo.m)().toString }).toThrow();
    expect(() => { (o?.Foo.m)().toString() }).toThrow();

    expect(() => { (((o.Foo?.self.getSelf)())?.m)() }).toThrow();
    expect(() => { (((o.Foo.self?.getSelf)())?.m)() }).toThrow();

    expect(() => (((fn()?.Foo?.self.getSelf)())?.m)()).toThrow();
    expect(() => (((fn?.().Foo.self?.getSelf)())?.m)()).toThrow();
  }
}

(new Foo).test();
(new Foo).testNull();
"#
);

#[testing::fixture("tests/fixture/opt-chain/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(&input).unwrap();

    compare_stdout(
        Default::default(),
        |_| optional_chaining(Default::default()),
        &src,
    );
}
