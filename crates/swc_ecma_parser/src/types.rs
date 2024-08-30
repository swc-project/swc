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
    TsAbstractAccessorProperty,
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

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum FunctionType {
    FunctionDeclaration,
    FunctionExpression,
    TsDeclareFunction,
    /// <https://github.com/typescript-eslint/typescript-eslint/pull/1289>
    TsEmptyBodyFunctionExpression,
}

#[repr(u8)]
pub enum Precedence {
    Lowest = 0,
    Comma = 1,
    Spread = 2,
    Yield = 3,
    Assign = 4,
    Conditional = 5,
    NullishCoalescing = 6,
    LogicalOr = 7,
    LogicalAnd = 8,
    BitwiseOr = 9,
    BitwiseXor = 10,
    BitwiseAnd = 11,
    Equals = 12,
    Compare = 13,
    Shift = 14,
    Add = 15,
    Multiply = 16,
    Exponentiation = 17,
    Prefix = 18,
    Postfix = 19,
    New = 20,
    Call = 21,
    Member = 22,
}
