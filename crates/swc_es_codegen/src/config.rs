/// Code generation configuration.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub struct Config {
    /// Emits compact output when set to `true`.
    pub minify: bool,
}
