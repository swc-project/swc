use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_compat::es2021;
use swc_ecma_transforms_testing::{test, test_exec};
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

test_exec!(
    syntax(),
    |_| tr(),
    null_coalescing,
    "var x = undefined;
    var sets = 0;
    var obj = {
      get x() {
        return x;
      },
    
      set x(value) {
        sets++;
        x = value;
      },
    };
    
    expect(obj.x ??= 1).toBe(1);
    expect(sets).toBe(1);
    expect(obj.x ??= 2).toBe(1);
    expect(sets).toBe(1);
    
    var gets = 0;
    var deep = {
      get obj() {
        gets++;
        return obj;
      },
    };
    
    obj.x = undefined;
    expect(deep.obj.x ??= 1).toBe(1);
    expect(gets).toBe(1);
    expect(deep.obj.x ??= 2).toBe(1);
    expect(gets).toBe(2);
    
    var key = 0;
    obj.x = undefined;
    expect(obj[++key] ??= 1).toBe(1);
    expect(key).toBe(1);
    key = 0;
    expect(obj[++key] ??= 2).toBe(1);
    expect(key).toBe(1);
    
    obj.x = undefined;
    key = 0;
    expect(deep.obj[++key] ??= 1).toBe(1);
    expect(gets).toBe(3);
    expect(key).toBe(1);
    key = 0;
    expect(deep.obj[++key] ??= 2).toBe(1);
    expect(gets).toBe(4);
    expect(key).toBe(1);"
);
