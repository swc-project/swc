use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_compat::es2021;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    es2021::logical_assignments()
}

fn syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

test!(
    syntax(),
    |_| tr(),
    logical_ident,
    "
    a ||= b
    a &&= b
    ",
    "
    a || (a = b);
    a && (a = b);
    "
);

test!(
    syntax(),
    |_| tr(),
    logical_member,
    r#"
    a.b ||= b
    a.b &&= b
    "#,
    "
    var _a, _a1;
    (_a = a).b || (_a.b = b);
    (_a1 = a).b && (_a1.b = b);
    "
);

test!(
    syntax(),
    |_| tr(),
    logical_super,
    "
    class Foo {
        method() {
            return super.f ||= b
        }
    }
    ",
    "
    class Foo {
        method() {
          return super.f || (super.f = b);
        }
    }
    "
);

test!(
    syntax(),
    |_| tr(),
    nullish_ident,
    "a ??= b",
    "a ?? (a = b);"
);

test!(
    syntax(),
    |_| tr(),
    nullish_member,
    "a.b ??= b",
    "
    var _a;
    (_a = a).b ?? (_a.b = b);
    "
);
