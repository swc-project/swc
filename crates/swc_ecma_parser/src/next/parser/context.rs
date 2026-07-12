//! Grammar production context.

bitflags::bitflags! {
    /// Flags parameterizing recursive-descent productions.
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    pub(crate) struct Context: u16 {
        /// Relational expressions may contain the `in` operator.
        const IN = 1 << 0;
        /// Parse `yield` as an expression keyword.
        const YIELD = 1 << 1;
        /// Parse `await` as an expression keyword.
        const AWAIT = 1 << 2;
        /// Return statements are allowed.
        const RETURN = 1 << 3;
        /// The current production is a decorator.
        const DECORATOR = 1 << 4;
        /// Conditional types are disabled in the current TypeScript production.
        const DISALLOW_CONDITIONAL_TYPES = 1 << 5;
        /// The current declaration is ambient.
        const AMBIENT = 1 << 6;
        /// The current production is at program top level.
        const TOP_LEVEL = 1 << 7;
        /// `new.target` is allowed.
        const NEW_TARGET = 1 << 8;
        /// Strict mode is active.
        const STRICT = 1 << 9;
        /// The source is parsed as a module.
        const MODULE = 1 << 10;
        /// An unlabeled `break` statement is allowed.
        const BREAK = 1 << 11;
        /// An unlabeled `continue` statement is allowed.
        const CONTINUE = 1 << 12;
        /// TypeScript grammar productions are enabled.
        const TYPESCRIPT = 1 << 13;
        /// TypeScript JSX grammar productions are enabled.
        const TSX = 1 << 14;
    }
}

impl Default for Context {
    fn default() -> Self {
        Self::IN | Self::TOP_LEVEL
    }
}
