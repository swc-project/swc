use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_compat::es2020::nullish_coalescing::{nullish_coalescing, Config};
use swc_ecma_transforms_testing::{test, test_exec};
use swc_ecma_visit::Fold;

fn tr(c: Config) -> impl Fold {
    nullish_coalescing(c)
}

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        ..Default::default()
    })
}

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    runtime_semantics_exec,
    r#"
expect(null ?? undefined).toBeUndefined(undefined);
expect(undefined ?? null).toBeNull();
expect(false ?? true).toBe(false);
expect(0 ?? 1).toBe(0);
expect("" ?? "foo").toBe("");

var obj = { exists: true };
expect(obj.exists ?? false).toBe(true);
expect(obj.doesNotExist ?? "foo").toBe("foo");

var counter = 0;
function sideEffect() { return counter++; }
expect(sideEffect() ?? -1).toBe(0);

var counter2 = 0;
var obj2 = {
    get foo() { return counter2++; }
};
expect(obj2.foo ?? -1).toBe(0);
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    transform_in_default,
    r#"
 function foo(foo, qux = foo.bar ?? "qux") {}
"#,
    r#"
var _foo_bar;
function foo(foo, qux = (_foo_bar = foo.bar) !== null && _foo_bar !== void 0 ? _foo_bar : "qux") {}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    transform_in_function,
    r#"

function foo(opts) {
  var foo = opts.foo ?? "default";
}
"#,
    r#"
function foo(opts) {
  var _opts_foo;

  var foo = (_opts_foo = opts.foo) !== null && _opts_foo !== void 0 ? _opts_foo : "default";
}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    transform_static_refs_in_default,
    r#"

function foo(foo, bar = foo ?? "bar") {}

"#,
    r#"
function foo(foo, bar = foo !== null && foo !== void 0 ? foo : "bar") {}

"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    transform_static_refs_in_function,
    r#"
function foo() {
  var foo = this ?? {};
}

"#,
    r#"
function foo() {
    var _this;
    var foo = (_this = this) !== null && _this !== void 0 ? _this : {
    };
}

"#
);

test!(
    Default::default(),
    |_| tr(Default::default()),
    assign_01,
    "
    a ??= b;
    ",
    "
    a = a !== null && a !== void 0 ? a : b;
    "
);

test!(
    Default::default(),
    |_| tr(Default::default()),
    issue_1570_1,
    "
    const a = {}
    a.b ??= '1'
    ",
    "
    const a = {
    };
    var _a_b;
    _a_b = (_a_b = a.b) !== null && _a_b !== void 0 ? _a_b : a.b = '1';
    "
);

test_exec!(
    Default::default(),
    |_| tr(Default::default()),
    issue_1570_2,
    "
    const a = {}
    a.b ??= '1'
    expect(a.b).toBe('1')
    "
);

test!(
    syntax(),
    |_| tr(Config {
        no_document_all: true
    }),
    loose,
    r#"
function foo(opts) {
    var foo = opts.foo ?? "default";
}
"#,
    r#"
function foo(opts) {
  var _opts_foo;

  var foo = (_opts_foo = opts.foo) != null ? _opts_foo : "default";
}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_6328,
    "switch ( 0 ) { case 0 ?? 0 : }",
    r#"
    var _ref;
    switch ( 0 ) { case (_ref = 0) !== null && _ref !== void 0 ? _ref : 0: }
"#
);
