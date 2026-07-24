use std::{
    cell::{Cell, RefCell},
    io::{self, Write},
    path::PathBuf,
    rc::Rc,
    sync::{Arc, Mutex},
};

use anyhow::{bail, Error};
#[cfg(feature = "flow")]
use swc::{config::JsMinifyOptions, BoolOrDataConfig};
use swc::{
    config::{
        Config, InputSourceMap, IsModule, JscConfig, JscExperimental, ModuleConfig, Options,
        SourceMapsConfig,
    },
    CompileInput, Compiler, PipelineContext, PipelineHooks,
};
use swc_common::{
    comments::SingleThreadedComments, errors::Handler, FileName, Mark, SyntaxContext,
};
use swc_ecma_ast::*;
#[cfg(feature = "flow")]
use swc_ecma_parser::FlowSyntax;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms::helpers::{inject_helpers, Helpers, HELPERS};
use swc_ecma_visit::{Visit, VisitMutWith, VisitWith};

#[derive(Default)]
struct ProgramShape {
    has_typescript: bool,
    has_jsx: bool,
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

#[derive(Default)]
struct HelperDeclarations {
    has_class_call_check: bool,
}

impl Visit for HelperDeclarations {
    fn visit_fn_decl(&mut self, node: &FnDecl) {
        self.has_class_call_check |= node.ident.sym == *"_class_call_check";
        node.visit_children_with(self);
    }
}

fn has_class_call_check_declaration(program: &Program) -> bool {
    let mut declarations = HelperDeclarations::default();
    program.visit_with(&mut declarations);
    declarations.has_class_call_check
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
                preserve_all_comments: true.into(),
                ..Default::default()
            },
            module: Some(ModuleConfig::CommonJs(Default::default())),
            ..Default::default()
        },
        swcrc: false,
        ..Default::default()
    }
}

#[cfg(feature = "flow")]
fn flow_pipeline_options(is_module: IsModule) -> Options {
    Options {
        config: Config {
            jsc: JscConfig {
                syntax: Some(Syntax::Flow(FlowSyntax::default())),
                minify: Some(JsMinifyOptions {
                    compress: BoolOrDataConfig::from_bool(true),
                    mangle: BoolOrDataConfig::from_bool(false),
                    ..Default::default()
                }),
                ..Default::default()
            },
            is_module: Some(is_module),
            module: Some(ModuleConfig::CommonJs(Default::default())),
            ..Default::default()
        },
        swcrc: false,
        ..Default::default()
    }
}

#[derive(Clone, Default)]
struct DiagnosticBuffer(Arc<Mutex<Vec<u8>>>);

impl DiagnosticBuffer {
    fn contents(&self) -> String {
        String::from_utf8(self.0.lock().unwrap().clone()).unwrap()
    }
}

impl Write for DiagnosticBuffer {
    fn write(&mut self, bytes: &[u8]) -> io::Result<usize> {
        self.0.lock().unwrap().extend_from_slice(bytes);
        Ok(bytes.len())
    }

    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

struct StageHooks {
    calls: Rc<RefCell<Vec<&'static str>>>,
}

impl PipelineHooks for StageHooks {
    fn inspect_after_parse(
        &mut self,
        program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        let shape = program_shape(program);
        assert!(shape.has_typescript);
        assert_eq!(shape.render_ctxt, Some(SyntaxContext::empty()));
        self.calls.borrow_mut().push("inspect_after_parse");
        Ok(())
    }

    fn mutate_after_parse(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        self.calls.borrow_mut().push("mutate_after_parse");
        Ok(())
    }

    fn inspect_after_resolve(
        &mut self,
        program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        let shape = program_shape(program);
        assert!(shape.has_typescript);
        assert_ne!(shape.render_ctxt, Some(SyntaxContext::empty()));
        self.calls.borrow_mut().push("inspect_after_resolve");
        Ok(())
    }

    fn mutate_after_resolve(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        self.calls.borrow_mut().push("mutate_after_resolve");
        Ok(())
    }

    fn inspect_after_typescript(
        &mut self,
        program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        let shape = program_shape(program);
        assert!(!shape.has_typescript);
        assert!(shape.has_jsx);
        self.calls.borrow_mut().push("inspect_after_typescript");
        Ok(())
    }

    fn mutate_after_typescript(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        self.calls.borrow_mut().push("mutate_after_typescript");
        Ok(())
    }
}

struct FailingHooks {
    mutate_resolve_called: Rc<Cell<bool>>,
    typescript_hook_called: Rc<Cell<bool>>,
}

impl PipelineHooks for FailingHooks {
    fn inspect_after_resolve(
        &mut self,
        _program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        bail!("inspect_after_resolve failed")
    }

    fn mutate_after_resolve(
        &mut self,
        _program: &mut Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        self.mutate_resolve_called.set(true);
        Ok(())
    }

    fn inspect_after_typescript(
        &mut self,
        _program: &Program,
        _context: &PipelineContext<'_>,
    ) -> Result<(), Error> {
        self.typescript_hook_called.set(true);
        Ok(())
    }
}

#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn compile_input_source_and_program_are_equivalent(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let options = pipeline_options();
        let comments = SingleThreadedComments::default();
        let program = compiler
            .parse_js(
                source_file.clone(),
                &handler,
                EsVersion::Es5,
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    ..Default::default()
                }),
                IsModule::Unknown,
                Some(&comments),
            )
            .expect("failed to parse fixture");

        let source_output = compiler
            .compile(
                &handler,
                CompileInput::source(source_file.clone()),
                &options,
            )
            .codegen()
            .expect("failed to compile source input");
        let program_output = compiler
            .compile(
                &handler,
                CompileInput::program(source_file, program).with_comments(comments),
                &options,
            )
            .codegen()
            .expect("failed to compile program input");

        assert_eq!(source_output.code, program_output.code);
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn ast_terminal_returns_program_and_comments(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let transformed = compiler
            .compile(
                &handler,
                CompileInput::source(source_file.clone()),
                &pipeline_options(),
            )
            .transform()
            .expect("failed to transform fixture");

        let shape = program_shape(transformed.program());
        assert!(!shape.has_typescript);
        assert!(!shape.has_jsx);
        let (leading, trailing) = transformed.comments().borrow_all();
        assert!(!leading.is_empty() || !trailing.is_empty());

        let program = compiler
            .compile(
                &handler,
                CompileInput::source(source_file),
                &pipeline_options(),
            )
            .into_program()
            .expect("failed to return the transformed program");
        assert!(!program_shape(&program).has_typescript);
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/rust-api/pipeline/helpers/input.js")]
fn ast_terminal_returns_helper_requirements(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let unresolved_mark = Mark::new();
        let options = Options {
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es5),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            skip_helper_injection: true,
            unresolved_mark: Some(unresolved_mark),
            ..Default::default()
        };

        let transformed = compiler
            .compile(&handler, CompileInput::source(source_file), &options)
            .transform()
            .expect("failed to transform fixture");
        let (mut program, _comments, helper_data) = transformed.into_parts();

        assert!(!has_class_call_check_declaration(&program));
        HELPERS.set(&Helpers::from_data(helper_data), || {
            program.visit_mut_with(&mut inject_helpers(unresolved_mark));
        });
        assert!(has_class_call_check_declaration(&program));
        Ok(())
    })
    .unwrap();
}

#[test]
fn ast_terminal_skips_input_source_map_loading() {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.new_source_file(FileName::Anon.into(), "const value = 1;");
        let options = Options {
            config: Config {
                input_source_map: Some(InputSourceMap::Str("not a source map".into())),
                source_maps: Some(SourceMapsConfig::Bool(true)),
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        };

        compiler
            .compile(
                &handler,
                CompileInput::source(source_file.clone()),
                &options,
            )
            .transform()
            .expect("AST terminal should not load the input source map");
        compiler
            .compile(&handler, CompileInput::source(source_file), &options)
            .codegen()
            .expect_err("codegen terminal should load the input source map");
        Ok(())
    })
    .unwrap();
}

#[test]
fn ast_terminal_skips_isolated_dts_preparation() {
    testing::run_test2(false, |cm, _handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.new_source_file(FileName::Anon.into(), "const value = 1;");
        let options = Options {
            config: Config {
                jsc: JscConfig {
                    experimental: JscExperimental {
                        emit_isolated_dts: true.into(),
                        ..Default::default()
                    },
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        };
        let diagnostics = DiagnosticBuffer::default();
        let handler = Handler::with_emitter_writer(Box::new(diagnostics.clone()), Some(cm.clone()));

        compiler
            .compile(
                &handler,
                CompileInput::source(source_file.clone()),
                &options,
            )
            .transform()
            .expect("AST terminal should skip isolated-DTS preparation");
        assert!(diagnostics.contents().is_empty());

        compiler
            .compile(&handler, CompileInput::source(source_file), &options)
            .codegen()
            .expect("codegen terminal should succeed");
        assert!(diagnostics
            .contents()
            .contains("emitIsolatedDts is enabled but the syntax is not TypeScript"));
        Ok(())
    })
    .unwrap();
}

#[test]
fn compile_request_is_lazy() {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.new_source_file(FileName::Anon.into(), "const = ;");
        let options = Options {
            swcrc: false,
            ..Default::default()
        };
        let request = compiler.compile(&handler, CompileInput::source(source_file), &options);

        assert_eq!(handler.err_count(), 0);
        assert!(request.transform().is_err());
        assert_eq!(handler.err_count(), 1);
        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/rust-api/pipeline/flow/input.js")]
fn flow_type_only_source_preserves_script_semantics(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let output = compiler
            .compile(
                &handler,
                CompileInput::source(source_file),
                &flow_pipeline_options(IsModule::Unknown),
            )
            .codegen()
            .expect("failed to compile Flow fixture");

        assert!(output.code.contains("unused"));
        assert!(!output.code.contains("import type"));
        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/rust-api/pipeline/flow-module-program/input.js")]
fn preparsed_program_variant_is_authoritative(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let comments = SingleThreadedComments::default();
        let program = compiler
            .parse_js(
                source_file.clone(),
                &handler,
                EsVersion::default(),
                Syntax::Flow(FlowSyntax::default()),
                IsModule::Unknown,
                Some(&comments),
            )
            .expect("failed to parse Flow fixture");
        assert!(matches!(program, Program::Module(..)));

        let output = compiler
            .compile(
                &handler,
                CompileInput::program(source_file, program).with_comments(comments),
                &flow_pipeline_options(IsModule::Bool(false)),
            )
            .codegen()
            .expect("a supplied Program should be authoritative");

        assert!(output.code.contains("await load"));
        assert_eq!(handler.err_count(), 0);
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn pipeline_hooks_run_at_public_boundaries(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let calls = Rc::new(RefCell::new(Vec::new()));
        let options = pipeline_options();
        let request = compiler
            .compile(&handler, CompileInput::source(source_file), &options)
            .with_hooks(StageHooks {
                calls: calls.clone(),
            });

        assert!(calls.borrow().is_empty());
        request.codegen().expect("failed to compile with hooks");
        assert_eq!(
            calls.borrow().as_slice(),
            [
                "inspect_after_parse",
                "mutate_after_parse",
                "inspect_after_resolve",
                "mutate_after_resolve",
                "inspect_after_typescript",
                "mutate_after_typescript",
            ]
        );
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/rust-api/pipeline/stages/input.tsx")]
fn inspect_hook_errors_skip_mutation_and_later_hooks(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let compiler = Compiler::new(cm.clone());
        let source_file = cm.load_file(&input).expect("failed to load fixture");
        let mutate_resolve_called = Rc::new(Cell::new(false));
        let typescript_hook_called = Rc::new(Cell::new(false));
        let error = compiler
            .compile(
                &handler,
                CompileInput::source(source_file),
                &pipeline_options(),
            )
            .with_hooks(FailingHooks {
                mutate_resolve_called: mutate_resolve_called.clone(),
                typescript_hook_called: typescript_hook_called.clone(),
            })
            .codegen()
            .expect_err("inspect hook should fail");

        assert_eq!(error.to_string(), "inspect_after_resolve failed");
        assert!(!mutate_resolve_called.get());
        assert!(!typescript_hook_called.get());
        Ok(())
    })
    .unwrap();
}
