use std::{error::Error, fmt};

/// AST node category used in codegen errors.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum NodeKind {
    /// Program root node.
    Program,
    /// Statement node.
    Stmt,
    /// Declaration node.
    Decl,
    /// Pattern node.
    Pat,
    /// Expression node.
    Expr,
    /// Module declaration node.
    ModuleDecl,
    /// Class node.
    Class,
    /// Class member node.
    ClassMember,
    /// Function node.
    Function,
    /// JSX element node.
    JSXElement,
    /// TypeScript type node.
    TsType,
}

/// Code generation error.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CodegenError {
    /// A typed id referenced a missing node in the AST store.
    MissingNode {
        /// Missing node kind.
        kind: NodeKind,
        /// Raw id value.
        raw_id: u64,
    },
    /// AST shape was internally inconsistent for emission.
    InvalidAst {
        /// Additional context.
        context: String,
    },
}

impl CodegenError {
    /// Creates an invalid-AST error.
    #[inline]
    pub fn invalid_ast(context: impl Into<String>) -> Self {
        Self::InvalidAst {
            context: context.into(),
        }
    }
}

impl fmt::Display for CodegenError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::MissingNode { kind, raw_id } => {
                write!(f, "missing {kind:?} node for raw id {raw_id}")
            }
            Self::InvalidAst { context } => write!(f, "invalid ast: {context}"),
        }
    }
}

impl Error for CodegenError {}
