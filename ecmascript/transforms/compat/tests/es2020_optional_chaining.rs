use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_compat::es2020::optional_chaining;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn tr(_: ()) -> impl Fold {
    optional_chaining()
}

fn syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

// general_memoize_loose

// general_lhs_assignment_read_and_update

// general_function_call_loose

// regression_7642

// general_super_method_call_loose

// general_lhs_update

// general_assignment
test!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
(ref1 = (ref2 = a.b) === null || ref2 === void 0 ? void 0 : ref2.c.d) === null || ref1 === void 0 ? void 0 : ref1.e;
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
    |_| tr(()),
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
    |_| tr(()),
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

"#,
    r#"
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
foo === null || foo === void 0 ? void 0 : foo(foo);
foo === null || foo === void 0 ? void 0 : foo.bar();
(ref = foo.bar) === null || ref === void 0 ? void 0 : ref.call(foo, foo.bar, false);
foo === null || foo === void 0 ? void 0 : (ref1 = foo.bar) === null || ref1 === void 0 ? void 0 : ref1.call(foo, foo.bar, true);
foo === null || foo === void 0 ? void 0 : foo().bar;
foo === null || foo === void 0 ? void 0 : (ref2 = foo()) === null || ref2 === void 0 ? void 0 : ref2.bar;
(ref3 = foo.bar) === null || ref3 === void 0 ? void 0 : ref3.call(foo).baz;
(ref4 = foo.bar) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.call(foo)) === null || ref5 === void 0 ? void 0 : ref5.baz;
foo === null || foo === void 0 ? void 0 : (ref6 = foo.bar) === null || ref6 === void 0 ? void 0 : ref6.call(foo).baz;
foo === null || foo === void 0 ? void 0 : (ref7 = foo.bar) === null || ref7 === void 0 ? void 0 : (ref8 = ref7.call(foo)) === null || ref8 === void 0 ? void 0 : ref8.baz;"#
);

// general_unary_exec
test_exec!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
    general_call_exec,
    r#"

"#
);

// general_delete
test!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
    simple_1,
    "obj?.a",
    "obj === null || obj === void 0 ? void 0 : obj.a;"
);

test!(
    syntax(),
    |_| tr(()),
    simple_2,
    "obj?.a?.b",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b;"
);

test!(
    syntax(),
    |_| tr(()),
    simple_3,
    "obj?.a?.b.c",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b.c;"
);

test!(
    syntax(),
    |_| tr(()),
    call_1,
    "obj?.a?.b()",
    "var ref;
obj === null || obj === void 0 ? void 0 : (ref = obj.a) === null || ref === void 0 ? void 0 : \
     ref.b();",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
    issue_732_1,
    "test.a?.b.c.d",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c.d"
);

test!(
    syntax(),
    |_| tr(()),
    issue_732_2,
    "test.a?.b.c",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c;"
);

test!(
    syntax(),
    |_| tr(()),
    issue_732_3,
    "test.a?.b.c.d.e.f.g.h.i",
    "var ref;
(ref = test.a) === null || ref === void 0 ? void 0 : ref.b.c.d.e.f.g.h.i"
);

// https://github.com/Brooooooklyn/swc-node/issues/62
test!(
    syntax(),
    |_| tr(()),
    swc_node_issue_62,
    "a.focus?.()",
    "var ref;
    (ref = a.focus) === null || ref === void 0 ? void 0 : ref.call(a);"
);

test!(
    syntax(),
    |_| tr(()),
    issue_1092_1,
    "a?.b.c()",
    "a === null || a === void 0 ? void 0 : a.b.c();"
);

test!(
    syntax(),
    |_| tr(()),
    issue_1092_2,
    "a?.b.c.d.e.f.g.h()",
    "a === null || a === void 0 ? void 0 : a.b.c.d.e.f.g.h();"
);

test_exec!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
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
    |_| tr(()),
    issue_1136_1,
    "
    const PATCHES = new Map();

    const ident = 'foo';
    const patch = PATCHES.get(ident)?.();
    ",
    "
    var ref;
    const PATCHES = new Map();
    const ident = \"foo\";
    var _obj = PATCHES.get(ident);
    const patch = (ref = _obj) === null || ref === void 0 ? void 0 : ref.call(_obj);
    "
);
