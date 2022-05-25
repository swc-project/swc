#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct JsExecOptions {
    /// Cache the result of the execution.
    ///
    /// If `true`, the result of the execution will be cached.
    /// Cache is not removed and it will be reused if the source code is
    /// identical.
    ///
    /// Note that this cache is stored in cargo target directory and will be
    /// removed by `cargo clean`.
    pub cache: bool,
}

/// Executes `js_code` and capture thw output.
pub fn exec_node_js(js_code: &str, opts: JsExecOptions) {}
