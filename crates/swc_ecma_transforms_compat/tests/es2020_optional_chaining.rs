use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2020::{optional_chaining, optional_chaining::Config},
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture};

fn tr(c: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        optional_chaining(c, unresolved_mark),
    )
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
expect(test).toBe(true);

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

test!(syntax(), |_| tr(Default::default()), simple_1, "obj?.a");

test!(syntax(), |_| tr(Default::default()), simple_2, "obj?.a?.b");

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
    pr_2791,
    r#"UNCONFIRMED_CALLBACK_MAP.get(pid)?.(error, response)"#
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
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            (
                resolver(unresolved_mark, top_level_mark, false),
                optional_chaining(
                    Config {
                        no_document_all: true,
                        ..Default::default()
                    },
                    Mark::new(),
                ),
            )
        },
        &src,
    );
}

#[testing::fixture("tests/optional-chaining/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(
                    swc_ecma_transforms_compat::es2022::class_properties::Config {
                        private_as_properties: false,
                        ..Default::default()
                    },
                    unresolved_mark,
                ),
                optional_chaining(Default::default(), unresolved_mark),
            )
        },
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
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(
                    swc_ecma_transforms_compat::es2022::class_properties::Config {
                        private_as_properties: false,
                        pure_getter: true,
                        no_document_all: true,

                        ..Default::default()
                    },
                    unresolved_mark,
                ),
                optional_chaining(
                    Config {
                        no_document_all: true,
                        pure_getter: true,
                    },
                    Mark::new(),
                ),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
