use std::fmt;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::path::PathBuf;
use swc_common::input::SourceFileInput;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_ecma_ast::*;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_optimizer::optimize;
use swc_ecma_optimizer::OptimizerConfig;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::JscTarget;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Syntax;
use testing::assert_eq;
use testing::NormalizedOutput;

#[testing::fixture("dce/from-to/**/input.js")]
fn dce_from_to(path: PathBuf) {
    let output = path.with_file_name("output.js");
    run_test(
        path,
        Mode::Match(output),
        OptimizerConfig {
            dce: true,
            ..Default::default()
        },
    );
}

#[testing::fixture("dce/optimized-out/**/*.js")]
fn dce_optimzed_out(path: PathBuf) {
    run_test(
        path,
        Mode::OptimziedOut,
        OptimizerConfig {
            dce: true,
            ..Default::default()
        },
    );
}

#[testing::fixture("dce/noop/**/*.js")]
fn dce_noop(path: PathBuf) {
    run_test(
        path,
        Mode::Noop,
        OptimizerConfig {
            dce: true,
            ..Default::default()
        },
    );
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Mode {
    /// `from-to`
    Match(PathBuf),
    Noop,
    OptimziedOut,
}

fn run_test(input: PathBuf, mode: Mode, config: OptimizerConfig) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to read input file");

        eprintln!("---- Input ---- \n{}", fm.src);

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                dynamic_import: true,
                ..Default::default()
            }),
            JscTarget::Es2020,
            SourceFileInput::from(&*fm),
            // TODO: Test comments.
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let module = parser.parse_module();
        let mut module = match module {
            Ok(v) => v,
            Err(err) => {
                err.into_diagnostic(&handler).emit();
                return Err(());
            }
        };

        optimize(&mut module, config);

        let output = print(cm.clone(), &module);

        match mode {
            Mode::Match(output_path) => {
                NormalizedOutput::from(output)
                    .compare_to_file(output_path)
                    .unwrap();
            }
            Mode::Noop => assert_eq!(DebugUsingDisplay(&*output), DebugUsingDisplay(&**fm.src)),
            Mode::OptimziedOut => assert_eq!(DebugUsingDisplay(&*output), DebugUsingDisplay("")),
        }

        Ok(())
    })
    .unwrap();
}

fn print(cm: Lrc<SourceMap>, m: &Module) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify: false },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8_lossy(&buf).to_string()
}

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
