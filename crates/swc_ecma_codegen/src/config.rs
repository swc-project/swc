use swc_ecma_ast::EsVersion;

#[derive(Debug, Clone, Copy)]
pub struct Config {
    /// Returns javascript target which should be used while generating code.
    ///
    /// This defaults to [EsVersion::latest] because it preserves input as much
    /// as possible.
    pub target: EsVersion,

    pub minify: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            target: EsVersion::latest(),
            minify: false,
        }
    }
}
