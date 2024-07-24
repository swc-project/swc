use crate::diagnostics::Diagnotic;

mod context;
pub mod lexer;
mod modifiers;

pub type Result<T> = std::result::Result<T, Diagnotic>;

pub struct Parser {}
