//! JavaScript Parsing Functions

#![allow(clippy::missing_errors_doc)]

mod grammar;

mod arrow;
mod binding;
mod class;
mod declaration;
mod expression;
mod function;
mod module;
mod object;
mod operator;
mod statement;

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum Tristate {
    True,
    False,
    Maybe,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum FunctionKind {
    Declaration,
    Expression,
    DefaultExport,
    TsDeclaration,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum VarDeclarationParent {
    For,
    Statement,
    Clause,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct VarDeclarationContext {
    pub parent: VarDeclarationParent,
}

impl VarDeclarationContext {
    pub(crate) fn new(parent: VarDeclarationParent) -> Self {
        Self { parent }
    }
}
