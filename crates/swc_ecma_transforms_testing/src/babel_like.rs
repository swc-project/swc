use std::path::Path;

use serde::Deserialize;
use serde_json::Value;
use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_transforms_base::{
    assumptions::Assumptions, fixer::fixer, hygiene::hygiene, resolver,
};
use swc_ecma_visit::{Fold, FoldWith};

use crate::parse_options;

/// These tests use `options.json`.
///
///
/// Note: You should **not** use [resolver] by yourself.

pub struct BabelLikeFixtureTest<'a> {
    input: &'a Path,

    /// Default to [`Syntax::default`]
    syntax: Syntax,

    factories: Vec<Box<dyn 'a + FnMut(String, Option<Value>) -> Option<Box<dyn 'a + Fold>>>>,

    source_map: bool,
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path, output: &'a Path) -> Self {
        Self {
            input,
            output,
            syntax: Default::default(),
            factories: Default::default(),
            source_map: false,
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

    pub fn add_factory(
        mut self,
        factory: impl 'a + FnMut(String, Option<Value>) -> Option<Box<dyn 'a + Fold>>,
    ) -> Self {
        self.factories.push(Box::new(factory));
        self
    }

    fn run(self) -> TestOutput {
        let output = testing::run_test(false, |cm, handler| {
            let options = parse_options::<BabelOptions>(self.input.parent().unwrap());

            let comments = SingleThreadedComments::default();
            let mut builder = BabelPassBuilder {
                assumptions: options.assumptions,
                unresolved_mark: Mark::new(),
                top_level_mark: Mark::new(),
                comments: comments.clone(),
            };

            let mut pass: Box<dyn 'a + Fold> = Box::new(resolver(
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
                for factory in &mut self.factories {
                    if let Some(built) = factory(name.clone(), options.clone()) {
                        pass = Box::new(chain!(pass, built));
                        done = true;
                        break;
                    }
                }

                if !done {
                    panic!("Unknown plugin: {}", name);
                }
            }

            pass = Box::new(chain!(pass, hygiene(), fixer(Some(&comments.clone()))));

            // Run pass

            let fm = cm.load_file(self.input).expect("failed to load file");

            let mut errors = vec![];
            let input_program = parse_file_as_program(
                &fm,
                self.syntax,
                EsVersion::latest(),
                Some(&comments),
                &mut errors,
            );

            let errored = !errors.is_empty();

            for e in errors {
                e.into_diagnostic(&handler).emit();
            }

            let input_program = match input_program {
                Ok(v) => v,
                Err(err) => {
                    err.into_diagnostic(&handler).emit();
                    panic!("failed to parse file");
                }
            };

            if errored {
                panic!("failed to parse file");
            }

            let output_program = input_program.fold_with(&mut *pass);

            Ok(())
        });

        TestOutput { code: () }
    }

    /// Execute ussing node.js
    pub fn execute(self) {}

    /// Run a fixture test
    pub fn fixture(self, output: &Path) {}
}

struct TestOutput {
    code: String,
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
pub struct BabelPassBuilder {
    pub assumptions: Assumptions,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    /// [SingleThreadedComments] is cheap to clone.
    pub comments: SingleThreadedComments,
}
