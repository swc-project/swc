use swc_ecma_ast::EsVersion;

#[derive(Debug, Clone, Copy)]
pub struct Config {
    /// The target runtime environment.
    ///
    /// This defaults to [EsVersion::latest] because it preserves input as much
    /// as possible.
    ///
    /// Note: This does not verifies if output is valid for the target runtime.
    /// e.g. `const foo = 1;` with [EsVersion::Es3] will emitted as `const foo =
    /// 1` without verification.
    /// This is because it's not a concern of the code generator.
    pub target: EsVersion,

    pub ascii_only: bool,

    pub minify: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            target: EsVersion::latest(),
            minify: false,
            ascii_only: false,
        }
    }
}
