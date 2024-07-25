#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]

pub enum MethodDefinitionKind {
    Constructor,
    Method,
    Get,
    Set,
}
