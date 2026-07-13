//! Grammar production context.

bitflags::bitflags! {
    /// Flags parameterizing recursive-descent productions.
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
    pub(crate) struct Context: u64 {
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
        /// The first parenthesized layer of an arrow return annotation must
        /// be parsed as a type rather than reinterpreted as a function type.
        const TS_ARROW_RETURN_TYPE = 1 << 15;
        /// Flow grammar productions are enabled.
        const FLOW = 1 << 16;
        /// Flow function-type parameters may omit binding names.
        const FLOW_FUNCTION_TYPE = 1 << 17;
        /// The current Flow parameter list belongs to an object type member,
        /// where a bare unbound identifier is a parameter name.
        const FLOW_OBJECT_SIGNATURE = 1 << 18;
        /// Explicit resource management declarations are allowed in the
        /// current statement list.
        const ALLOW_USING = 1 << 19;
        /// The immediately enclosing class has an `extends` clause.
        const CLASS_HAS_SUPER = 1 << 20;
        /// Expressions are being parsed as class fields or static blocks.
        const CLASS_MEMBER = 1 << 21;
        /// A cover initialized name may be reinterpreted by a surrounding
        /// assignment-pattern production.
        const COVER_PATTERN = 1 << 22;
        /// Reject TypeScript productions whose leading angle brackets are
        /// ambiguous with JSX syntax.
        const DISALLOW_AMBIGUOUS_JSX_LIKE = 1 << 23;
        /// The current production is parsing formal parameters.
        const PARAMETERS = 1 << 24;
        /// Flow enum syntax is enabled.
        const FLOW_ENUMS = 1 << 25;
        /// Flow component and hook syntax is enabled.
        const FLOW_COMPONENTS = 1 << 26;
        /// Flow pattern matching syntax is enabled.
        const FLOW_PATTERN_MATCHING = 1 << 27;
        /// Flow decorator syntax is enabled.
        const FLOW_DECORATORS = 1 << 28;
        /// A Flow type is being parsed inside a type-argument list.
        const FLOW_TYPE_ARGUMENT = 1 << 29;
        /// The current function-like production is async.
        const ASYNC = 1 << 30;
        /// A direct `super()` call is allowed in the current constructor body.
        const SUPER_CALL = 1 << 31;
        /// A Flow type predicate is being parsed in a function return position.
        const FLOW_RETURN_TYPE = 1 << 32;
    }
}

impl Default for Context {
    fn default() -> Self {
        Self::IN | Self::TOP_LEVEL
    }
}
