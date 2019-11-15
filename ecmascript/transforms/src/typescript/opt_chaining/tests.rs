use super::*;
use swc_ecma_parser::{Syntax, TsConfig};

fn tr(_: ()) -> impl Pass {
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
  var ref, _foo$bar2, _foo$bar3, _foo$bar4, _foo$bar5, _foo$bar6, _foo$bar6$baz, _foo$bar7, _foo$bar7$baz;

  foo === null || foo === void 0 ? void 0 : foo.bar;
  foo === null || foo === void 0 ? void 0 : (ref = foo.bar) === null || ref === void 0 ? void 0 : ref.baz;
  foo === null || foo === void 0 ? void 0 : foo(foo);
  foo === null || foo === void 0 ? void 0 : foo.bar();
  (_foo$bar2 = foo.bar) === null || _foo$bar2 === void 0 ? void 0 : _foo$bar2.call(foo, foo.bar, false);
  foo === null || foo === void 0 ? void 0 : (_foo$bar3 = foo.bar) === null || _foo$bar3 === void 0 ? void 0 : _foo$bar3.call(foo, foo.bar, true);
  (_foo$bar4 = foo.bar) === null || _foo$bar4 === void 0 ? void 0 : _foo$bar4.baz(foo.bar, false);
  foo === null || foo === void 0 ? void 0 : (_foo$bar5 = foo.bar) === null || _foo$bar5 === void 0 ? void 0 : _foo$bar5.baz(foo.bar, true);
  (_foo$bar6 = foo.bar) === null || _foo$bar6 === void 0 ? void 0 : (_foo$bar6$baz = _foo$bar6.baz) === null || _foo$bar6$baz === void 0 ? void 0 : _foo$bar6$baz.call(_foo$bar6, foo.bar, false);
  foo === null || foo === void 0 ? void 0 : (_foo$bar7 = foo.bar) === null || _foo$bar7 === void 0 ? void 0 : (_foo$bar7$baz = _foo$bar7.baz) === null || _foo$bar7$baz === void 0 ? void 0 : _foo$bar7$baz.call(_foo$bar7, foo.bar, true);
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
var ref, _a, _a$b$c, _a$b, _a$b$c$d, _a$b$c2, _a$b$c2$d, _orders, _orders2, _orders2$, _client, _orders$client$key, _a2, _c, _a3;

(ref = foo) === null || ref === void 0 ? void 0 : ref.bar;
(_a = a) === null || _a === void 0 ? void 0 : (_a$b$c = _a.b.c) === null || _a$b$c === void 0 ? void 0 : _a$b$c.d.e;
(_a$b = a.b) === null || _a$b === void 0 ? void 0 : (_a$b$c$d = _a$b.c.d) === null || _a$b$c$d === void 0 ? void 0 : _a$b$c$d.e;
(_a$b$c2 = a.b.c) === null || _a$b$c2 === void 0 ? void 0 : (_a$b$c2$d = _a$b$c2.d) === null || _a$b$c2$d === void 0 ? void 0 : _a$b$c2$d.e;
(_orders = orders) === null || _orders === void 0 ? void 0 : _orders[0].price;
(_orders2 = orders) === null || _orders2 === void 0 ? void 0 : (_orders2$ = _orders2[0]) === null || _orders2$ === void 0 ? void 0 : _orders2$.price;
orders[(_client = client) === null || _client === void 0 ? void 0 : _client.key].price;
(_orders$client$key = orders[client.key]) === null || _orders$client$key === void 0 ? void 0 : _orders$client$key.price;
(0, (_a2 = a) === null || _a2 === void 0 ? void 0 : _a2.b).c;
(0, (_c = (0, (_a3 = a) === null || _a3 === void 0 ? void 0 : _a3.b).c) === null || _c === void 0 ? void 0 : _c.d).e;

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

"#,
    r#"
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18;

(ref = foo) === null || ref === void 0 ? void 0 : ref(foo);
(ref1 = foo) === null || ref1 === void 0 ? void 0 : ref1.bar();
(ref2 = (ref3 = foo).bar) === null || ref2 === void 0 ? void 0 : ref2.call(ref3, foo.bar, false);
(ref4 = foo) === null || ref4 === void 0 ? void 0 : (ref5 = ref4.bar) === null || ref5 === void 0 ? void 0 : ref5.call(ref4, foo.bar, true);
(ref6 = foo) === null || ref6 === void 0 ? void 0 : ref6().bar;
(ref7 = foo) === null || ref7 === void 0 ? void 0 : (ref8 = ref7()) === null || ref8 === void 0 ? void 0 : ref8.bar;
(ref9 = (ref10 = foo).bar) === null || ref9 === void 0 ? void 0 : ref9.call(ref10).baz;
(ref11 = (ref12 = foo).bar) === null || ref11 === void 0 ? void 0 : (ref13 = ref11.call(ref12)) === null || ref13 === void 0 ? void 0 : ref13.baz;
(ref14 = foo) === null || ref14 === void 0 ? void 0 : (ref15 = ref14.bar) === null || ref15 === void 0 ? void 0 : ref15.call(ref14).baz;
(ref16 = foo) === null || ref16 === void 0 ? void 0 : (ref17 = ref16.bar) === null || ref17 === void 0 ? void 0 : (ref18 = ref17.call(ref16)) === null || ref18 === void 0 ? void 0 : ref18.baz;

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
    var _super$method;

    return (_super$method = super.method) === null || _super$method === void 0 ? void 0 : _super$method.call(this);
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
      : ref1.call(ref1);"
);
