use crate::Config;
use swc_atoms::JsWord;

/// The context for [Diff]. This contains config and path.
#[derive(Debug)]
pub struct Ctxt {
    pub(crate) path: Vec<PathComponent>,
    pub(crate) config: Config,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum PathComponent {
    Prop { key: JsWord },
    VecElem { index: usize },
}
