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

var _obj$a, _obj$b, _obj$a2;

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
const b = obj === null || obj === void 0 ? void 0 : (_obj$a = obj.a) === null || _obj$a === void 0 ? void 0 : _obj$a.b;
const bad = obj === null || obj === void 0 ? void 0 : (_obj$b = obj.b) === null || _obj$b === void 0 ? void 0 : _obj$b.b;
let val;
val = obj === null || obj === void 0 ? void 0 : (_obj$a2 = obj.a) === null || _obj$a2 === void 0 ? void 0 : _obj$a2.b;

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
  var _foo$bar, _foo$bar2, _foo$bar3, _foo$bar4, _foo$bar5, _foo$bar6, _foo$bar6$baz, _foo$bar7, _foo$bar7$baz;

  foo === null || foo === void 0 ? void 0 : foo.bar;
  foo === null || foo === void 0 ? void 0 : (_foo$bar = foo.bar) === null || _foo$bar === void 0 ? void 0 : _foo$bar.baz;
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

(1, a?.b, 2);

"#,
    r#"
var _user$address, _user$address2, _a, _a2;

var street = (_user$address = user.address) === null || _user$address === void 0 ? void 0 : _user$address.street;
street = (_user$address2 = user.address) === null || _user$address2 === void 0 ? void 0 : _user$address2.street;
test((_a = a) === null || _a === void 0 ? void 0 : _a.b, 1);
1, (_a2 = a) === null || _a2 === void 0 ? void 0 : _a2.b, 2;

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
var _foo, _a, _a$b$c, _a$b, _a$b$c$d, _a$b$c2, _a$b$c2$d, _orders, _orders2, _orders2$, _client, _orders$client$key, _a2, _c, _a3;

(_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar;
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

var _obj$a, _obj$b, _obj$b2;

const obj = {
  a: {
    b: 0
  }
};
let test = +(obj === null || obj === void 0 ? void 0 : (_obj$a = obj.a) === null || _obj$a === void 0 ? void 0 : _obj$a.b);
test = +(obj === null || obj === void 0 ? void 0 : obj.a.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj$b = obj.b) === null || _obj$b === void 0 ? void 0 : _obj$b.b);
test = +(obj === null || obj === void 0 ? void 0 : (_obj$b2 = obj.b) === null || _obj$b2 === void 0 ? void 0 : _obj$b2.b);

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
var _foo, _foo2, _foo$bar, _foo3, _foo4, _foo4$bar, _foo5, _foo6, _foo7, _foo$bar2, _foo8, _foo$bar3, _foo9, _foo$bar3$call, _foo10, _foo10$bar, _foo11, _foo11$bar, _foo11$bar$call;

(_foo = foo) === null || _foo === void 0 ? void 0 : _foo(foo);
(_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2.bar();
(_foo$bar = (_foo3 = foo).bar) === null || _foo$bar === void 0 ? void 0 : _foo$bar.call(_foo3, foo.bar, false);
(_foo4 = foo) === null || _foo4 === void 0 ? void 0 : (_foo4$bar = _foo4.bar) === null || _foo4$bar === void 0 ? void 0 : _foo4$bar.call(_foo4, foo.bar, true);
(_foo5 = foo) === null || _foo5 === void 0 ? void 0 : _foo5().bar;
(_foo6 = foo) === null || _foo6 === void 0 ? void 0 : (_foo7 = _foo6()) === null || _foo7 === void 0 ? void 0 : _foo7.bar;
(_foo$bar2 = (_foo8 = foo).bar) === null || _foo$bar2 === void 0 ? void 0 : _foo$bar2.call(_foo8).baz;
(_foo$bar3 = (_foo9 = foo).bar) === null || _foo$bar3 === void 0 ? void 0 : (_foo$bar3$call = _foo$bar3.call(_foo9)) === null || _foo$bar3$call === void 0 ? void 0 : _foo$bar3$call.baz;
(_foo10 = foo) === null || _foo10 === void 0 ? void 0 : (_foo10$bar = _foo10.bar) === null || _foo10$bar === void 0 ? void 0 : _foo10$bar.call(_foo10).baz;
(_foo11 = foo) === null || _foo11 === void 0 ? void 0 : (_foo11$bar = _foo11.bar) === null || _foo11$bar === void 0 ? void 0 : (_foo11$bar$call = _foo11$bar.call(_foo11)) === null || _foo11$bar$call === void 0 ? void 0 : _foo11$bar$call.baz;

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

var _obj$a, _obj$b;

const obj = {
  a: {
    b: 0
  }
};
let test = obj === null || obj === void 0 ? void 0 : (_obj$a = obj.a) === null || _obj$a === void 0 ? void 0 : delete _obj$a.b;
test = obj === null || obj === void 0 ? void 0 : delete obj.a.b;
test = obj === null || obj === void 0 ? void 0 : (_obj$b = obj.b) === null || _obj$b === void 0 ? void 0 : delete _obj$b.b;
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
