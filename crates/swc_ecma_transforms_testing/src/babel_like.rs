use std::path::Path;

use swc_common::{comments::SingleThreadedComments, Mark};

/// These tests use `options.json`.
///
///
/// Note: You should **not** use [resolver] by yourself.

pub struct BabelLikeFixtureTest<'a> {
    pub input: &'a Path,
    pub output: &'a Path,
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path, output: &'a Path) -> Self {
        Self { input, output }
    }

    pub fn run(self) {
        let comments = SingleThreadedComments::default();
        let mut builder = BabelPassBuilder {
            unresolved_mark: Mark::new(),
            top_level_mark: Mark::new(),
            comments,
        };
    }
}

#[derive(Clone)]
pub struct BabelPassBuilder {
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,

    /// [SingleThreadedComments] is cheap to clone.
    pub comments: SingleThreadedComments,
}
