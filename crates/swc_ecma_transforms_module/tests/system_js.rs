#![deny(warnings)]

use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_module::system_js::{system_js, Config};
use swc_ecma_transforms_testing::{test, test_fixture, FixtureTestConfig, Tester};

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

fn tr(_tester: &mut Tester<'_>, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        system_js(Default::default(), unresolved_mark, config),
    )
}

test!(
    module,
    syntax(),
    |tester| tr(tester, Default::default()),
    allow_continuous_assignment,
    r#"var e = {}; e.a = e.b = e.c = e.d = e.e = e.f = e.g = e.h = e.i = e.j = e.k = e.l = e.m = e.n = e.o = e.p = e.q = e.r = e.s = e.t = e.u = e.v = e.w = e.x = e.y = e.z = e.A = e.B = e.C = e.D = e.E = e.F = e.G = e.H = e.I = e.J = e.K = e.L = e.M = e.N = e.O = e.P = e.Q = e.R = e.S = void 0;"#
);

test!(
    module,
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: true,
            ..Default::default()
        }
    ),
    allow_top_level_this_true,
    r#"export var v = this;"#
);

test!(
    module,
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false,
            ..Default::default()
        }
    ),
    iife,
    r#"
    (function(a) {
        this.foo = a;
    })(this);
    "#
);

test!(
    module,
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false,
            ..Default::default()
        }
    ),
    top_level_this_false_class,
    r#"
    const a = this;
    class A {
        constructor() {
          this.a = 1;
        }
        test() {
          this.a = 2;
        }
    }"#
);

test!(
    module,
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false,
            ..Default::default()
        }
    ),
    allow_top_level_this_false,
    r#"export var v = this;
    function a() {
        function d () {}
        var b = this; 
    } "#
);

test!(
    module,
    syntax(),
    |tester| tr(tester, Default::default()),
    imports,
    r#"
    import.meta.url;
    import.meta.fn();
    await import('./test2');
    "#
);

// TODO: test get-module-name-option, tla

#[testing::fixture("tests/fixture/systemjs/**/input.mjs")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.mjs");

    test_fixture(
        syntax(),
        &|tester| tr(tester, Default::default()),
        &input,
        &output,
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
