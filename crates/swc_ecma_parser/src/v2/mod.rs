use crate::diagnostics::Diagnostic;

mod context;
pub mod lexer;
mod modifiers;

pub type Result<T> = std::result::Result<T, Diagnostic>;

pub struct Parser {}
