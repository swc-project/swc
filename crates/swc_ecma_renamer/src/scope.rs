#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}

impl Default for ScopeKind {
    fn default() -> Self {
        ScopeKind::Fn
    }
}
