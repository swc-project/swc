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
    TsAbstractMethodDefinition,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PropertyDefinitionType {
    PropertyDefinition,
    TsAbstractPropertyDefinition,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AccessorPropertyType {
    AccessorProperty,
    TSAbstractAccessorProperty,
}
