use std::{fs::read_to_string, path::PathBuf};

use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2020::{optional_chaining, optional_chaining::Config};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture};
use swc_ecma_visit::Fold;

fn tr(c: Config) -> impl Fold {
    optional_chaining(c)
}

fn syntax() -> Syntax {
    Syntax::Typescript(Default::default())
}

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

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_1,
    "obj?.a",
    "var _obj;
    (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_2,
    "obj?.a?.b",
    "var _obj_a, _obj;
    (_obj_a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === null || _obj_a === \
     void 0 ? void 0 : _obj_a.b;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    simple_3,
    "obj?.a?.b.c",
    "var _obj_a_b, _obj;
    (_obj_a_b = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === null || _obj_a_b \
     === void 0 ? void 0 : _obj_a_b.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_1,
    "test.a?.b.c.d",
    "var _test_a_b_c;
    (_test_a_b_c = test.a) === null || _test_a_b_c === void 0 ? void 0 : _test_a_b_c.b.c.d;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_2,
    "test.a?.b.c",
    "var _test_a_b;
    (_test_a_b = test.a) === null || _test_a_b === void 0 ? void 0 : _test_a_b.b.c;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_732_3,
    "test.a?.b.c.d.e.f.g.h.i",
    "var _test_a_b_c_d_e_f_g_h;
    (_test_a_b_c_d_e_f_g_h = test.a) === null || _test_a_b_c_d_e_f_g_h === void 0 ? void 0 : \
     _test_a_b_c_d_e_f_g_h.b.c.d.e.f.g.h.i"
);

// https://github.com/Brooooooklyn/swc-node/issues/62
test!(
    syntax(),
    |_| tr(Default::default()),
    swc_node_issue_62,
    "a.focus?.()",
    "var _a_focus, _object;
    (_object = a) === null || _object === void 0 ? void 0 : (_a_focus = _object.focus) === null || \
     _a_focus === void 0 ? void 0 : _a_focus.call(_object);"
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
    var _obj_a_b_c, _object, _obj_a, _obj;
    (_object = (_obj_a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === null || \
     _obj_a === void 0 ? void 0 : _obj_a.b) === null || _object === void 0 ? void 0 : (_obj_a_b_c \
     = _object.c) === null || _obj_a_b_c === void 0 ? void 0 : _obj_a_b_c.call(_object);
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
    var _obj_a_b_c, _object, _obj_a, _obj;
    expect((_object = (_obj_a = (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.a) === \
     null || _obj_a === void 0 ? void 0 : _obj_a.b) === null || _object === void 0 ? void 0 : \
     (_obj_a_b_c = _object.c) === null || _obj_a_b_c === void 0 ? void 0 : \
     _obj_a_b_c.call(_object)).toBe(2);
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
          var _this_object_arg, _object;
          return (_this_object_arg = (_object = (_object = this.object)[arg]) === null || _object \
     === void 0) === null || _this_object_arg === void 0 ? void 0 : \
     _this_object_arg.call(_object);
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

#[testing::fixture("tests/optional-chaining/**/exec.js")]
fn exec(input: PathBuf) {
    let src = read_to_string(input).unwrap();

    compare_stdout(
        Default::default(),
        |_| optional_chaining(Default::default()),
        &src,
    );
}

#[testing::fixture("tests/optional-chaining/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| optional_chaining(Default::default()),
        &input,
        &output,
        Default::default(),
    );
}

#[testing::fixture("tests/optional-chaining-loose/**/input.js")]
fn fixture_loose(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            optional_chaining(Config {
                no_document_all: true,
                pure_getter: true,
            })
        },
        &input,
        &output,
        Default::default(),
    );
}
