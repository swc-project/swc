/// Function-body grammar and lexical-scope behavior. Arrows cannot be
/// generators and inherit the enclosing non-arrow function scope.
#[derive(Clone, Copy)]
pub(super) enum FunctionKind {
    Function { is_async: bool, is_generator: bool },
    Arrow { is_async: bool },
}

impl FunctionKind {
    pub(super) fn is_async(self) -> bool {
        match self {
            Self::Function { is_async, .. } | Self::Arrow { is_async } => is_async,
        }
    }

    pub(super) fn is_generator(self) -> bool {
        matches!(
            self,
            Self::Function {
                is_generator: true,
                ..
            }
        )
    }

    pub(super) fn is_arrow(self) -> bool {
        matches!(self, Self::Arrow { .. })
    }
}

/// The grammar production accepted at a statement entry point.
/// Unlike `StatementContext`, this is local to the production, not inherited
/// control-flow permission. Import/export handling remains with the caller.
#[derive(Clone, Copy)]
pub(super) enum StatementGrammar {
    Statement,
    StatementListItem,
    ModuleItem,
}

impl StatementGrammar {
    pub(super) fn permits_declaration(self) -> bool {
        matches!(self, Self::StatementListItem | Self::ModuleItem)
    }
}

/// A block item's AST type selects its production before entering the body
/// loop. The loop does not carry a runtime grammar selector for every item.
pub(super) trait BlockBodyItem: From<swc_ecma_ast::Stmt> {
    const GRAMMAR: StatementGrammar;
}

impl BlockBodyItem for swc_ecma_ast::Stmt {
    const GRAMMAR: StatementGrammar = StatementGrammar::StatementListItem;
}

impl BlockBodyItem for swc_ecma_ast::ModuleItem {
    const GRAMMAR: StatementGrammar = StatementGrammar::ModuleItem;
}

bitflags::bitflags! {
    /// The active values of ECMAScript grammatical parameters.
    ///
    /// These flags model the specification's `[In]`, `[Yield]`, `[Await]`, and `[Return]`
    /// parameters. They belong to the parser rather than the lexer because
    /// productions derive and restore them independently of tokenization.
    #[derive(Debug, Clone, Copy, Default)]
    pub(super) struct GrammarContext: u8 {
        /// The grammar's `[In]` parameter.
        const In = 1 << 0;
        /// The grammar's `[Yield]` parameter.
        const Yield = 1 << 1;
        /// The grammar's `[Await]` parameter.
        const Await = 1 << 2;
        /// The grammar's `[Return]` parameter.
        const Return = 1 << 3;
    }
}

bitflags::bitflags! {
    /// State inherited across function, class, and program boundaries.
    #[derive(Debug, Clone, Copy, Default)]
    pub(super) struct BoundaryContext: u8 {
        const CanBeModule = 1 << 0;
        const TopLevel = 1 << 1;
        const InsideNonArrowFunctionScope = 1 << 2;
        const InParameters = 1 << 3;
        const InClass = 1 << 4;
        const InClassField = 1 << 5;
        const InStaticBlock = 1 << 6;
        const AllowDirectSuper = 1 << 7;
    }
}

/// The nearest syntactic region relevant to parser early errors.
///
/// Unlike grammatical parameters, this records where an expression occurs.
/// A nested function body replaces a parameter or class-initializer region;
/// ordinary expressions and statements inherit it.
#[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
pub(super) enum SyntaxContext {
    #[default]
    Program,
    Parameters,
    FunctionBody,
    /// A class initializer, static block, or TypeScript module body. These
    /// regions neither classify the program nor use function/parameter errors.
    Nested,
}

bitflags::bitflags! {
    /// State derived from the enclosing statement grammar.
    #[derive(Debug, Clone, Copy, Default)]
    pub(super) struct StatementContext: u8 {
        const IsContinueAllowed = 1 << 0;
        const IsBreakAllowed = 1 << 1;
        const IgnoreElseClause = 1 << 2;
        const AllowUsingDecl = 1 << 3;
    }
}

bitflags::bitflags! {
    /// Parser-only TypeScript, Flow, and cover-grammar state. Type-tokenization
    /// flags live exclusively in the lexical context.
    #[derive(Debug, Clone, Copy, Default)]
    pub(super) struct TypeContext: u8 {
        const InDeclare = 1 << 0;
        /// A typed arrow must leave a colon for the enclosing conditional
        /// consequent before its speculative parse can commit.
        const WillExpectColonForCond = 1 << 1;
        const DisallowConditionalTypes = 1 << 2;
        const TsModuleBlock = 1 << 3;
        const DisallowFlowAnonFnType = 1 << 4;
    }
}
