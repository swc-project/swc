use std::path::Path;

use serde::Deserialize;
use serde_json::Value;
use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_visit::Fold;

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
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path, output: &'a Path) -> Self {
        Self {
            input,
            output,
            syntax: Default::default(),
            factories: Default::default(),
        }
    }

    pub fn syntax(mut self, syntax: Syntax) -> Self {
        self.syntax = syntax;
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
        let options = parse_options::<BabelOptions>(self.input.parent().unwrap());

        let comments = SingleThreadedComments::default();
        let mut builder = BabelPassBuilder {
            assumptions: options.assumptions,
            unresolved_mark: Mark::new(),
            top_level_mark: Mark::new(),
            comments,
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

        pass = Box::new(chain!(pass, hygiene(), fixer()));

        // Run pass
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
