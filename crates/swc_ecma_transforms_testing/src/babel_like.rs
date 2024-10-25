use std::{fs::read_to_string, path::Path};

use ansi_term::Color;
use serde::Deserialize;
use serde_json::Value;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::{EsVersion, Pass, Program};
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_transforms_base::{
    assumptions::Assumptions,
    fixer::fixer,
    helpers::{inject_helpers, Helpers, HELPERS},
    hygiene::hygiene,
    resolver,
};
use testing::NormalizedOutput;

use crate::{exec_with_node_test_runner, parse_options, stdout_of};

pub type PassFactory<'a> =
    Box<dyn 'a + FnMut(&PassContext, &str, Option<Value>) -> Option<Box<dyn 'static + Pass>>>;

/// These tests use `options.json`.
///
///
/// Note: You should **not** use [resolver] by yourself.
pub struct BabelLikeFixtureTest<'a> {
    input: &'a Path,

    /// Default to [`Syntax::default`]
    syntax: Syntax,

    factories: Vec<Box<dyn 'a + FnOnce() -> PassFactory<'a>>>,

    source_map: bool,
    allow_error: bool,
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path) -> Self {
        Self {
            input,
            syntax: Default::default(),
            factories: Default::default(),
            source_map: false,
            allow_error: false,
        }
    }

    pub fn syntax(mut self, syntax: Syntax) -> Self {
        self.syntax = syntax;
        self
    }

    pub fn source_map(mut self) -> Self {
        self.source_map = true;
        self
    }

    pub fn allow_error(mut self) -> Self {
        self.source_map = true;
        self
    }

    /// This takes a closure which returns a [PassFactory]. This is because you
    /// may need to create [Mark], which requires [swc_common::GLOBALS] to be
    /// configured.
    pub fn add_factory(mut self, factory: impl 'a + FnOnce() -> PassFactory<'a>) -> Self {
        self.factories.push(Box::new(factory));
        self
    }

    fn run(self, output_path: Option<&Path>, compare_stdout: bool) {
        let err = testing::run_test(false, |cm, handler| {
            let mut factories = self.factories.into_iter().map(|f| f()).collect::<Vec<_>>();

            let options = parse_options::<BabelOptions>(self.input.parent().unwrap());

            let comments = SingleThreadedComments::default();
            let mut builder = PassContext {
                cm: cm.clone(),
                assumptions: options.assumptions,
                unresolved_mark: Mark::new(),
                top_level_mark: Mark::new(),
                comments: comments.clone(),
            };

            let mut pass: Box<dyn Pass> = Box::new(resolver(
                builder.unresolved_mark,
                builder.top_level_mark,
                self.syntax.typescript(),
            ));

            // Build pass using babel options

            //
            for plugin in options.plugins {
                let (name, options) = match plugin {
                    BabelPluginEntry::NameOnly(name) => (name, None),
                    BabelPluginEntry::WithConfig(name, options) => (name, Some(options)),
                };

                let mut done = false;
                for factory in &mut factories {
                    if let Some(built) = factory(&builder, &name, options.clone()) {
                        pass = Box::new((pass, built));
                        done = true;
                        break;
                    }
                }

                if !done {
                    panic!("Unknown plugin: {}", name);
                }
            }

            pass = Box::new((pass, hygiene(), fixer(Some(&comments))));

            // Run pass

            let src = read_to_string(self.input).expect("failed to read file");
            let src = if output_path.is_none() && !compare_stdout {
                format!(
                    "it('should work', async function () {{
                    {src}
                }})",
                )
            } else {
                src
            };
            let fm = cm.new_source_file(
                swc_common::FileName::Real(self.input.to_path_buf()).into(),
                src,
            );

            let mut errors = Vec::new();
            let input_program = parse_file_as_program(
                &fm,
                self.syntax,
                EsVersion::latest(),
                Some(&comments),
                &mut errors,
            );

            let errored = !errors.is_empty();

            for e in errors {
                e.into_diagnostic(handler).emit();
            }

            let input_program = match input_program {
                Ok(v) => v,
                Err(err) => {
                    err.into_diagnostic(handler).emit();
                    return Err(());
                }
            };

            if errored {
                return Err(());
            }

            let helpers = Helpers::new(output_path.is_some());
            let (code_without_helper, output_program) = HELPERS.set(&helpers, || {
                let mut p = input_program.apply(pass);

                let code_without_helper = builder.print(&p);

                if output_path.is_none() {
                    p.mutate(inject_helpers(builder.unresolved_mark))
                }

                (code_without_helper, p)
            });

            // Print output
            let code = builder.print(&output_program);

            println!(
                "\t>>>>> {} <<<<<\n{}\n\t>>>>> {} <<<<<\n{}",
                Color::Green.paint("Orig"),
                fm.src,
                Color::Green.paint("Code"),
                code_without_helper
            );

            if let Some(output_path) = output_path {
                // Fixture test

                if !self.allow_error && handler.has_errors() {
                    return Err(());
                }

                NormalizedOutput::from(code)
                    .compare_to_file(output_path)
                    .unwrap();
            } else if compare_stdout {
                // Execution test, but compare stdout

                let actual_stdout: String =
                    stdout_of(&code).expect("failed to execute transfomred code");
                let expected_stdout =
                    stdout_of(&fm.src).expect("failed to execute transfomred code");

                testing::assert_eq!(actual_stdout, expected_stdout);
            } else {
                // Execution test

                exec_with_node_test_runner(&format!("// {}\n{code}", self.input.display()))
                    .expect("failed to execute transfomred code");
            }

            Ok(())
        });

        if self.allow_error {
            match err {
                Ok(_) => {}
                Err(err) => {
                    err.compare_to_file(self.input.with_extension("stderr"))
                        .unwrap();
                }
            }
        }
    }

    /// Execute using node.js and mocha
    pub fn exec_with_test_runner(self) {
        self.run(None, false)
    }

    /// Execute using node.js
    pub fn compare_stdout(self) {
        self.run(None, true)
    }

    /// Run a fixture test
    pub fn fixture(self, output: &Path) {
        self.run(Some(output), false)
    }
}

#[derive(Debug, Deserialize)]
struct BabelOptions {
    #[serde(default)]
    assumptions: Assumptions,

    #[serde(default)]
    plugins: Vec<BabelPluginEntry>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase", untagged)]
enum BabelPluginEntry {
    NameOnly(String),
    WithConfig(String, Value),
}

#[derive(Clone)]
pub struct PassContext {
    pub cm: Lrc<SourceMap>,

    pub assumptions: Assumptions,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    /// [SingleThreadedComments] is cheap to clone.
    pub comments: SingleThreadedComments,
}

impl PassContext {
    fn print(&mut self, program: &Program) -> String {
        let mut buf = Vec::new();
        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: self.cm.clone(),
                wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    &mut buf,
                    None,
                )),
                comments: Some(&self.comments),
            };

            emitter.emit_program(program).unwrap();
        }

        let s = String::from_utf8_lossy(&buf);
        s.to_string()
    }
}
