use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2020::nullish_coalescing::{nullish_coalescing, Config};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec};

fn tr(c: Config) -> impl Pass {
    nullish_coalescing(c)
}

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
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
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    transform_static_refs_in_default,
    r#"

function foo(foo, bar = foo ?? "bar") {}

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

"#
);

test!(
    Default::default(),
    |_| tr(Default::default()),
    assign_01,
    "
    a ??= b;
    "
);

test!(
    Default::default(),
    |_| tr(Default::default()),
    issue_1570_1,
    "
    const a = {}
    a.b ??= '1'
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
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_6328,
    "switch ( 0 ) { case 0 ?? 0 : }"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_7290,
    "
    var filter = clone(initialFilter)

    filter.start_point ??= {
        location: null,
        radius: null
    }
    
    filter.end_point ??= {
        location: null,
        radius: null
    }
    "
);

compare_stdout!(
    syntax(),
    |_| tr(Default::default()),
    issue_7290_1,
    "
    var filter = {
        start_point: 1
    };

    filter.start_point ??= {
        location: null,
        radius: null
    }
    
    filter.end_point ??= {
        location: null,
        radius: null
    }

    console.log(filter.start_point)
    console.log(filter.end_point)
    "
);
