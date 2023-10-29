use std::path::Path;

use serde::Deserialize;
use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::parse_options;

/// These tests use `options.json`.
///
///
/// Note: You should **not** use [resolver] by yourself.

pub struct BabelLikeFixtureTest<'a> {
    pub input: &'a Path,
    pub output: &'a Path,

    pub syntax: Syntax,
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path, output: &'a Path) -> Self {
        Self {
            input,
            output,
            syntax: Default::default(),
        }
    }

    pub fn syntax(mut self, syntax: Syntax) -> Self {
        self.syntax = syntax;
        self
    }

    pub fn run(self) {
        let options = parse_options::<BabelOptions>(self.input.parent().unwrap());

        let comments = SingleThreadedComments::default();
        let mut builder = BabelPassBuilder {
            assumptions: options.assumptions,
            unresolved_mark: Mark::new(),
            top_level_mark: Mark::new(),
            comments,
        };
    }
}

#[derive(Deserialize)]
pub struct BabelOptions {
    #[serde(default)]
    pub assumptions: Assumptions,
}

#[derive(Clone)]
pub struct BabelPassBuilder {
    pub assumptions: Assumptions,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    /// [SingleThreadedComments] is cheap to clone.
    pub comments: SingleThreadedComments,
}
