use swc_atoms::JsWord;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct DiffResult {}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum PathComponent {
    ObjProp { key: JsWord },
    VecElem { index: usize },
}

pub trait Diff {
    /// This may remove common node from `self` and `other`.
    fn diff(&mut self, other: &mut Self) -> DiffResult;
}
