#[derive(Debug, Default, Clone, Copy)]
pub struct Config {
    pub omit_trailing_semi: bool,
    pub sourcemap: Option<SourceMapConfig>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Ord, PartialOrd, Hash)]
pub enum SourceMapConfig {
    File,
    Inline,
}

impl Config {
    pub fn is_sourcemap_enabled(&self) -> bool {
        self.sourcemap.is_some()
    }
}
