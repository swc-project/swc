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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum FormalParamKind {
    /// <https://tc39.es/ecma262/#prod-FormalParameters>
    FormalParam,
    /// <https://tc39.es/ecma262/#prod-UniqueFormalParameters>
    UniqueFormalParames,
    /// <https://tc39.es/ecma262/#prod-ArrowFormalParameters>
    ArrowFormalParams,
    /// Part of TypeScript type signatures
    Signature,
}
