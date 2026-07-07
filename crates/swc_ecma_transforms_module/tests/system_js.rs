#![deny(warnings)]

use std::path::PathBuf;

use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::{AssignExpr, Expr, Lit, Pass, Pat, Prop, PropName, SetterProp};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_module::system_js::{system_js, Config};
use swc_ecma_transforms_testing::{test, test_fixture, FixtureTestConfig, Tester};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

fn syntax() -> Syntax {
    Syntax::Es(Default::default())
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax::default())
}

fn tr(_tester: &mut Tester<'_>, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        system_js(Default::default(), unresolved_mark, config),
    )
}

fn tr_ts(_tester: &mut Tester<'_>, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, true),
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

#[test]
fn export_setter_uses_parameter_ident() {
    Tester::run(|tester| {
        let pass = tr(tester, Default::default());
        let program = tester.apply_transform(
            pass,
            "input.mjs",
            syntax(),
            Some(true),
            r#"
            let a;
            export { a };
            ({ a } = source);
            "#,
        )?;
        let mut value_ctxt = ExportSetterValueCtxt::default();
        program.visit_with(&mut value_ctxt);

        assert_eq!(value_ctxt.param, value_ctxt.assignment_value);
        assert!(value_ctxt.param.is_some());

        Ok(())
    });
}

#[test]
fn export_object_uses_computed_proto_key() {
    Tester::run(|tester| {
        let pass = tr(tester, Default::default());
        let program = tester.apply_transform(
            pass,
            "input.mjs",
            syntax(),
            Some(true),
            r#"
            let a = 1;
            export { a as "__proto__", a as b };
            a = 2;
            "#,
        )?;
        let mut proto_keys = ProtoExportObjectKeys::default();
        program.visit_with(&mut proto_keys);

        assert!(proto_keys.computed_proto);
        assert!(!proto_keys.ident_proto);

        Ok(())
    });
}

#[derive(Default)]
struct ProtoExportObjectKeys {
    computed_proto: bool,
    ident_proto: bool,
}

impl Visit for ProtoExportObjectKeys {
    noop_visit_type!(fail);

    fn visit_prop(&mut self, n: &Prop) {
        if let Prop::KeyValue(key_value) = n {
            match &key_value.key {
                PropName::Ident(ident) if ident.sym == *"__proto__" => {
                    self.ident_proto = true;
                }
                PropName::Computed(computed) => {
                    if let Expr::Lit(Lit::Str(value)) = &*computed.expr {
                        if value.value == *"__proto__" {
                            self.computed_proto = true;
                        }
                    }
                }
                _ => {}
            }
        }

        n.visit_children_with(self);
    }
}

#[derive(Default)]
struct ExportSetterValueCtxt {
    param: Option<SyntaxContext>,
    assignment_value: Option<SyntaxContext>,
}

impl Visit for ExportSetterValueCtxt {
    noop_visit_type!(fail);

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        if let Pat::Ident(param) = &*n.param {
            if param.id.sym == *"_value" {
                self.param = Some(param.id.ctxt);
            }
        }

        n.visit_children_with(self);
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        if let Expr::Ident(value) = &*n.right {
            if value.sym == *"_value" {
                self.assignment_value = Some(value.ctxt);
            }
        }

        n.visit_children_with(self);
    }
}

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

#[testing::fixture("tests/fixture/systemjs/**/input.ts")]
fn fixture_ts(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.js");

    test_fixture(
        ts_syntax(),
        &|tester| tr_ts(tester, Default::default()),
        &input,
        &output,
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
