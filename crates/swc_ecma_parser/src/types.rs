#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]

pub enum MethodDefinitionKind {
    Constructor,
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ClassType {
    ClassDeclaration,
    ClassExpression,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum MethodDefinitionType {
    MethodDefinition,
    TSAbstractMethodDefinition,
}
