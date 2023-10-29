use std::path::Path;

/// These tests use `options.json`.

pub struct BabelLikeFixtureTest<'a> {
    pub input: &'a Path,
    pub output: &'a Path,
}

impl<'a> BabelLikeFixtureTest<'a> {
    pub fn new(input: &'a Path, output: &'a Path) -> Self {
        Self { input, output }
    }

    pub fn run(self) {}
}
