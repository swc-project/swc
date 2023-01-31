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
  var _foo_bar, _foo_get, _foo_bar1, _foo_bar2, _foo_bar3, _foo_bar_baz, _foo_bar4, _foo_bar_baz1, _foo_bar5, _foo_bar6, _foo_bar7, _foo_bar8;
  foo == null ? void 0 : foo.bar;
  foo == null ? void 0 : (_foo_bar = foo.bar) == null ? void 0 : _foo_bar.baz;
  foo == null ? void 0 : foo(foo);
  foo == null ? void 0 : foo.bar();
  (_foo_get = foo.get(bar)) == null ? void 0 : _foo_get();
  (_foo_bar1 = foo.bar()) == null ? void 0 : _foo_bar1();
  (_foo_bar2 = foo[bar]()) == null ? void 0 : _foo_bar2();
  (_foo_bar_baz = (_foo_bar3 = foo.bar()).baz) == null ? void 0 : _foo_bar_baz.call(_foo_bar3);
  (_foo_bar_baz1 = (_foo_bar4 = foo[bar]()).baz) == null ? void 0 : _foo_bar_baz1.call(_foo_bar4);
  foo.bar == null ? void 0 : foo.bar(foo.bar, false);
  foo == null ? void 0 : foo.bar == null ? void 0 : foo.bar(foo.bar, true);
  (_foo_bar5 = foo.bar) == null ? void 0 : _foo_bar5.baz(foo.bar, false);
  foo == null ? void 0 : (_foo_bar6 = foo.bar) == null ? void 0 : _foo_bar6.baz(foo.bar, true);
  (_foo_bar7 = foo.bar) == null ? void 0 : _foo_bar7.baz == null ? void 0 : _foo_bar7.baz(foo.bar, false);
  foo == null ? void 0 : (_foo_bar8 = foo.bar) == null ? void 0 : _foo_bar8.baz == null ? void 0 : _foo_bar8.baz(foo.bar, true);
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

// indirect_eval_call
test!(
    syntax(),
    |_| tr(Default::default()),
    indirect_eval_call,
    r#"
eval?.();
eval?.("console.log()");
window.eval?.("console.log()");
"#,
    r#"
var _window_eval;
eval === null || eval === void 0 ? void 0 : (0, eval)();
eval === null || eval === void 0 ? void 0 : (0, eval)("console.log()");
(_window_eval = window.eval) === null || _window_eval === void 0 ? void 0 : _window_eval.call(window, "console.log()");
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

var _obj_a, _obj_b, _obj_a1;
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
const b = obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b;
const bad = obj === null || obj === void 0 ? void 0 : (_obj_b = obj.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b;
let val;
val = obj === null || obj === void 0 ? void 0 : (_obj_a1 = obj.a) === null || _obj_a1 === void 0 ? void 0 : _obj_a1.b;
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
    var _foo_bar, _foo_bar1, _foo_bar2, _foo_bar3, _foo_bar4, _foo_bar5, _foo_bar_baz, _foo_bar6, _foo_bar_baz1;
    foo === null || foo === void 0 ? void 0 : foo.bar;
    foo === null || foo === void 0 ? void 0 : (_foo_bar = foo.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.baz;
    foo === null || foo === void 0 ? void 0 : foo(foo);
    foo === null || foo === void 0 ? void 0 : foo.bar();
    (_foo_bar1 = foo.bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(foo, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar2 = foo.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(foo, foo.bar, true);
    (_foo_bar3 = foo.bar) === null || _foo_bar3 === void 0 ? void 0 : _foo_bar3.baz(foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar4 = foo.bar) === null || _foo_bar4 === void 0 ? void 0 : _foo_bar4.baz(foo.bar, true);
    (_foo_bar5 = foo.bar) === null || _foo_bar5 === void 0 ? void 0 : (_foo_bar_baz = _foo_bar5.baz) === null || _foo_bar_baz === void 0 ? void 0 : _foo_bar_baz.call(_foo_bar5, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar6 = foo.bar) === null || _foo_bar6 === void 0 ? void 0 : (_foo_bar_baz1 = _foo_bar6.baz) === null || _foo_bar_baz1 === void 0 ? void 0 : _foo_bar_baz1.call(_foo_bar6, foo.bar, true);
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
var _user_address, _user_address1;
var street = (_user_address = user.address) === null || _user_address === void 0 ? void 0 : _user_address.street;
street = (_user_address1 = user.address) === null || _user_address1 === void 0 ? void 0 : _user_address1.street;
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
var _a_b_c, _a_b_c_d, _a_b, _a_b_c1, _a_b_c_d1, _orders_, _orders_client_key, _c;
foo === null || foo === void 0 ? void 0 : foo.bar;
(_a_b_c = a === null || a === void 0 ? void 0 : a.b.c) === null || _a_b_c === void 0 ? void 0 : _a_b_c.d.e;
(_a_b_c_d = (_a_b = a.b) === null || _a_b === void 0 ? void 0 : _a_b.c.d) === null || _a_b_c_d === void 0 ? void 0 : _a_b_c_d.e;
(_a_b_c1 = a.b.c) === null || _a_b_c1 === void 0 ? void 0 : (_a_b_c_d1 = _a_b_c1.d) === null || _a_b_c_d1 === void 0 ? void 0 : _a_b_c_d1.e;
orders === null || orders === void 0 ? void 0 : orders[0].price;
orders === null || orders === void 0 ? void 0 : (_orders_ = orders[0]) === null || _orders_ === void 0 ? void 0 : _orders_.price;
orders[client === null || client === void 0 ? void 0 : client.key].price;
(_orders_client_key = orders[client.key]) === null || _orders_client_key === void 0 ? void 0 : _orders_client_key.price;
(0, a === null || a === void 0 ? void 0 : a.b).c;
(0, (_c = (0, a === null || a === void 0 ? void 0 : a.b).c) === null || _c === void 0 ? void 0 : _c.d).e;
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

var _obj_a, _obj_b, _obj_b1;
const obj = {
    a: {
        b: 0
    }
};
let test = +(obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 : _obj_a.b);
test = +(obj === null || obj === void 0 ? void 0 : obj.a.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj_b = obj.b) === null || _obj_b === void 0 ? void 0 : _obj_b.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj_b1 = obj.b) === null || _obj_b1 === void 0 ? void 0 : _obj_b1.b);
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
var _foo_bar, _foo_bar1, _foo, _foo_bar2, _foo_bar3, _foo_bar_call, _foo_bar4, _foo_bar5, _foo_bar_call1, _foo_bar6;
foo === null || foo === void 0 ? void 0 : foo(foo);
foo === null || foo === void 0 ? void 0 : foo.bar();
(_foo_bar = foo.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.call(foo, foo.bar, false);
foo === null || foo === void 0 ? void 0 : (_foo_bar1 = foo.bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(foo, foo.bar, true);
foo === null || foo === void 0 ? void 0 : foo().bar;
foo === null || foo === void 0 ? void 0 : (_foo = foo()) === null || _foo === void 0 ? void 0 : _foo.bar;
(_foo_bar2 = foo.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(foo).baz;
(_foo_bar3 = foo.bar) === null || _foo_bar3 === void 0 ? void 0 : (_foo_bar_call = _foo_bar3.call(foo)) === null || _foo_bar_call === void 0 ? void 0 : _foo_bar_call.baz;
foo === null || foo === void 0 ? void 0 : (_foo_bar4 = foo.bar) === null || _foo_bar4 === void 0 ? void 0 : _foo_bar4.call(foo).baz;
foo === null || foo === void 0 ? void 0 : (_foo_bar5 = foo.bar) === null || _foo_bar5 === void 0 ? void 0 : (_foo_bar_call1 = _foo_bar5.call(foo)) === null || _foo_bar_call1 === void 0 ? void 0 : _foo_bar_call1.baz;
(_foo_bar6 = foo === null || foo === void 0 ? void 0 : foo.bar()) === null || _foo_bar6 === void 0 ? void 0 : _foo_bar6();
"#
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

var _obj_a, _obj_b;
const obj = {
    a: {
        b: 0
    }
};
let test = obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 : delete _obj_a.b;
test = obj === null || obj === void 0 ? void 0 : delete obj.a.b;
test = obj === null || obj === void 0 ? void 0 : (_obj_b = obj.b) === null || _obj_b === void 0 ? void 0 : delete _obj_b.b;
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
    var _super_method;
    return (_super_method = super.method) === null || _super_method === void 0 ? void 0 : _super_method.call(this);
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
    "var _obj_a;
    obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? \
     void 0 : _obj_a.b;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_3,
    "obj?.a?.b.c",
    "var _obj_a;
    obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? \
     void 0 : _obj_a.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    call_1,
    "obj?.a?.b()",
    "var _obj_a;
    obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? \
     void 0 : _obj_a.b();",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    call_2,
    "a?.b?.c?.()",
    "var _a_b, _a_b_c;

    a === null || a === void 0 ? void 0 : (_a_b = a.b) === null || _a_b === void 0 ? void 0 : \
     (_a_b_c = _a_b.c) === null || _a_b_c === void 0 ? void 0 : _a_b_c.call(_a_b);"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_1,
    "test.a?.b.c.d",
    "var _test_a;
    (_test_a = test.a) === null || _test_a === void 0 ? void 0 : _test_a.b.c.d;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_2,
    "test.a?.b.c",
    "var _test_a;
    (_test_a = test.a) === null || _test_a === void 0 ? void 0 : _test_a.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_3,
    "test.a?.b.c.d.e.f.g.h.i",
    "var _test_a;
    (_test_a = test.a) === null || _test_a === void 0 ? void 0 : _test_a.b.c.d.e.f.g.h.i;"
);

// https://github.com/Brooooooklyn/swc-node/issues/62
test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_issue_62,
    "a.focus?.()",
    "var _a_focus;
    (_a_focus = a.focus) === null || _a_focus === void 0 ? void 0 : _a_focus.call(a);"
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
var _obj_a, _obj_a_b;
obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? void 0 \
     : (_obj_a_b = _obj_a.b) === null || _obj_a_b === void 0 ? void 0 : _obj_a_b.c();
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_95_3,
    "
expect(obj?.a?.b?.c()).toBe(2)
",
    "
var _obj_a, _obj_a_b;
expect(obj === null || obj === void 0 ? void 0 : (_obj_a = obj.a) === null || _obj_a === void 0 ? \
     void 0 : (_obj_a_b = _obj_a.b) === null || _obj_a_b === void 0 ? void 0 : \
     _obj_a_b.c()).toBe(2);
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
    var _PATCHES_get;
    const PATCHES = new Map();
    const ident = 'foo';
    const patch = (_PATCHES_get = PATCHES.get(ident)) === null || _PATCHES_get === void 0 ? void 0 : _PATCHES_get();
    "#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    pr_2791,
    r#"UNCONFIRMED_CALLBACK_MAP.get(pid)?.(error, response)"#,
    r#"
var _UNCONFIRMED_CALLBACK_MAP_get;
(_UNCONFIRMED_CALLBACK_MAP_get = UNCONFIRMED_CALLBACK_MAP.get(pid)) === null || _UNCONFIRMED_CALLBACK_MAP_get === void 0 ? void 0 : _UNCONFIRMED_CALLBACK_MAP_get(error, response);
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
          var _this_object, _this_object_arg;
          return (_this_object_arg = (_this_object = this.object)[arg]) === null || \
     _this_object_arg === void 0 ? void 0 : _this_object_arg.call(_this_object)
      };
    }
    bug();  
    "
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    issue_6346,
    "expect([1]?.filter(() => true).map?.(() => 2)).toEqual([2]);"
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

#[testing::fixture("tests/opt-chain/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(&input).unwrap();

    compare_stdout(
        Default::default(),
        |_| optional_chaining(Default::default()),
        &src,
    );
}
