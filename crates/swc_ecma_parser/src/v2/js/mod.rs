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
    TSDeclaration,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum VariableDeclarationParent {
    For,
    Statement,
    Clause,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct VariableDeclarationContext {
    pub parent: VariableDeclarationParent,
}

impl VariableDeclarationContext {
    pub(crate) fn new(parent: VariableDeclarationParent) -> Self {
        Self { parent }
    }
}
