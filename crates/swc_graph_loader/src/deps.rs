use swc_atoms::JsWord;

pub trait DepAnalyzer<M> {
    /// Analyze dependencies of the given module.
    ///
    /// It's allowed to return same value multiple time.
    fn analyze_deps(&self, module: &M) -> Vec<JsWord>;
}
