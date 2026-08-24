use std::{cell::RefCell, path::PathBuf, rc::Rc};

use swc::{
    config::{Config, JscConfig, ModuleConfig, Options},
    Compiler,
};
use swc_common::{comments::SingleThreadedComments, SyntaxContext};
use swc_ecma_ast::{
    fn_pass, noop_pass, ArrowExpr, EsVersion, Ident, JSXElement, Program, TsAsExpr, TsTypeAnn,
};
#[cfg(feature = "flow")]
use swc_ecma_parser::FlowSyntax;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_visit::{Visit, VisitWith};

#[derive(Default)]
struct ProgramShape {
    has_typescript: bool,
    has_jsx: bool,
    has_arrow: bool,
    render_ctxt: Option<SyntaxContext>,
}

impl Visit for ProgramShape {
    fn visit_ts_as_expr(&mut self, node: &TsAsExpr) {
        self.has_typescript = true;
        node.visit_children_with(self);
    }

    fn visit_ts_type_ann(&mut self, node: &TsTypeAnn) {
        self.has_typescript = true;
        node.visit_children_with(self);
    }

    fn visit_jsx_element(&mut self, node: &JSXElement) {
        self.has_jsx = true;
        node.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        self.has_arrow = true;
        node.visit_children_with(self);
    }

    fn visit_ident(&mut self, node: &Ident) {
        if node.sym == *"render" {
            self.render_ctxt = Some(node.ctxt);
        }
    }
}

fn program_shape(program: &Program) -> ProgramShape {
    let mut shape = ProgramShape::default();
    program.visit_with(&mut shape);
    shape
}

fn pipeline_options() -> Options {
    Options {
        config: Config {
            jsc: JscConfig {
                syntax: Some(Syntax::Typescript(TsSyntax {
                    tsx: true,
                    ..Default::default()
                })),
                target: Some(EsVersion::Es5),
                ..Default::default()
            },
            module: Some(ModuleConfig::CommonJs(Default::default())),
            ..Default::default()
        },
        swcrc: false,
        ..Default::default()
    }
}

fn assert_factory_boundary(program: &Program) {
    let shape = program_shape(program);
    assert!(shape.has_typescript);
    assert!(shape.has_jsx);
    assert_ne!(shape.render_ctxt, Some(SyntaxContext::empty()));
}

#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn legacy_custom_passes_keep_their_public_order(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let calls = Rc::new(RefCell::new(Vec::new()));

        compiler
            .process_js_with_custom_pass(
                source_file,
                None,
                &handler,
                &pipeline_options(),
                SingleThreadedComments::default(),
                {
                    let calls = calls.clone();
                    move |program| {
                        assert_factory_boundary(program);
                        calls.borrow_mut().push("before_factory");
                        fn_pass(move |program| {
                            let shape = program_shape(program);
                            assert!(!shape.has_typescript);
                            assert!(shape.has_jsx);
                            assert!(shape.has_arrow);
                            calls.borrow_mut().push("before_pass");
                        })
                    }
                },
                {
                    let calls = calls.clone();
                    move |program| {
                        assert_factory_boundary(program);
                        calls.borrow_mut().push("after_factory");
                        fn_pass(move |program| {
                            let shape = program_shape(program);
                            assert!(!shape.has_jsx);
                            assert!(!shape.has_arrow);
                            calls.borrow_mut().push("after_pass");
                        })
                    }
                },
            )
            .expect("failed to compile with legacy custom passes");

        assert_eq!(
            calls.borrow().as_slice(),
            [
                "before_factory",
                "after_factory",
                "before_pass",
                "after_pass",
            ]
        );
        Ok(())
    })
    .unwrap();
}

/// Locks the public legacy split between `BuiltInput::program` and
/// `BuiltInput::pass` without depending on the pass graph's concrete shape.
#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn build_as_input_keeps_its_delayed_pass_boundary(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let comments = SingleThreadedComments::default();
        let options = pipeline_options();

        let built = options
            .build_as_input(
                &cm,
                &source_file.name,
                |syntax, target, is_module| {
                    compiler
                        .parse_js(
                            source_file.clone(),
                            &handler,
                            target,
                            syntax,
                            is_module,
                            Some(&comments),
                        )
                        .map(|program| (program, false))
                },
                None,
                None,
                None,
                None,
                &handler,
                None,
                Some(&comments),
                |program| {
                    assert_factory_boundary(program);
                    noop_pass()
                },
            )
            .expect("failed to build legacy input");

        assert_factory_boundary(&built.program);
        let external_helpers = built.external_helpers;
        let program = compiler.run_transform(&handler, external_helpers, || {
            built.program.apply(built.pass)
        });
        let shape = program_shape(&program);
        assert!(!shape.has_typescript);
        assert!(!shape.has_jsx);
        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/rust-api/pipeline/flow/input.js")]
fn legacy_custom_pass_api_transforms_flow(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let options = Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Flow(FlowSyntax::default())),
                    ..Default::default()
                },
                is_module: Some(swc::config::IsModule::Unknown),
                minify: true.into(),
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        };

        let output = compiler
            .process_js_with_custom_pass(
                source_file,
                None,
                &handler,
                &options,
                SingleThreadedComments::default(),
                |_| noop_pass(),
                |_| noop_pass(),
            )
            .expect("failed to compile Flow through the legacy API");

        assert!(output.code.contains("unused"));
        assert!(!output.code.contains("@flow"));
        assert!(!output.code.contains("import type"));
        Ok(())
    })
    .unwrap();
}
