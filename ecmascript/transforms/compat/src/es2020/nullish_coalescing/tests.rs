use super::*;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;

fn tr(_: ()) -> impl Fold {
    nullish_coalescing()
}

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        nullish_coalescing: true,
        ..Default::default()
    })
}

test_exec!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
    transform_in_default,
    r#"
 function foo(foo, qux = foo.bar ?? "qux") {}
"#,
    r#"
var _bar;
function foo(foo, qux = (_bar = foo.bar) !== null && _bar !== void 0 ? _bar : "qux") {
}
"#
);

test!(
    syntax(),
    |_| tr(()),
    transform_in_function,
    r#"
  
function foo(opts) {
  var foo = opts.foo ?? "default";
}
"#,
    r#"
function foo(opts) {
  var _foo;

  var foo = (_foo = opts.foo) !== null && _foo !== void 0 ? _foo : "default";
}
"#
);

test!(
    syntax(),
    |_| tr(()),
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
    |_| tr(()),
    transform_static_refs_in_function,
    r#"
function foo() {
  var foo = this ?? {};
}

"#,
    r#"
function foo() {
    var ref;
    var foo = (ref = this) !== null && ref !== void 0 ? ref : {
    };
}

"#
);

test!(
    Default::default(),
    |_| tr(()),
    assign_01,
    "
    a ??= b;
    ",
    "
    a = a !== null && a !== void 0 ? a : b;
    "
);
