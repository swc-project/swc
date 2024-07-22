//! ECMAScript Grammar Contexts: `[In`] `[Yield]` `[Await]`
//!
//! Copied from [oxc](https://github.com/oxc-project/oxc/blob/21c7b090dd61e6944356d3de9164395c9f7c10fb/crates/oxc_parser/src/context.rs)

use bitflags::bitflags;

bitflags! {
    /// 5.1.5 Grammar Notation
    /// A production may be parameterized by a subscripted annotation of the form “[parameters]”,
    /// which may appear as a suffix to the nonterminal symbol defined by the production.
    /// “parameters” may be either a single name or a comma separated list of names.
    /// A parameterized production is shorthand for a set of productions defining all combinations of the parameter names,
    /// preceded by an underscore, appended to the parameterized nonterminal symbol.
    #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
    pub struct Context: u8 {
        /// [In] Flag, i.e. the [In] part in RelationalExpression[In, Yield, Await]
        /// Section 13.10 Relational Operators Note 2:
        /// The [In] grammar parameter is needed to avoid confusing the in operator
        /// in a relational expression with the in operator in a for statement.
        const In = 1 << 0;

        /// [Yield] Flag
        const Yield = 1 << 1;

        /// [Await] Flag
        /// Section 15.8 Async Function Definitions Note 1:
        /// await is parsed as an AwaitExpression when the [Await] parameter is present
        const Await = 1 << 2;

        /// [Return] Flag
        /// i.e. the [Return] in Statement[Yield, Await, Return]
        const Return = 1<< 3;

        /// If node was parsed as part of a decorator
        const Decorator = 1 << 4;

        /// Typescript should parse extends clause as conditional type instead of type constrains.
        /// Used in infer clause
        ///
        /// type X<U, T> = T extends infer U extends number ? U : T;
        /// The "infer U extends number" is type constrains.
        ///
        /// type X<U, T> = T extends (infer U extends number ? U : T) ? U : T;
        /// The "(infer U extends number ? U : T)" is conditional type.
        const DisallowConditionalTypes = 1 << 5;

        /// A declaration file, or inside something with the `declare` modifier.
        /// Declarations that don't define an implementation is "ambient":
        ///   * ambient variable declaration => `declare var $: any`
        ///   * ambient class declaration => `declare class C { foo(); } , etc..`
        const Ambient = 1 << 6;
    }
}

impl Default for Context {
    fn default() -> Self {
        Self::In
    }
}

impl Context {
    #[inline]
    pub(crate) fn has_in(self) -> bool {
        self.contains(Self::In)
    }

    #[inline]
    pub(crate) fn has_yield(self) -> bool {
        self.contains(Self::Yield)
    }

    #[inline]
    pub(crate) fn has_await(self) -> bool {
        self.contains(Self::Await)
    }

    #[inline]
    pub(crate) fn has_return(self) -> bool {
        self.contains(Self::Return)
    }

    #[inline]
    pub(crate) fn has_decorator(self) -> bool {
        self.contains(Self::Decorator)
    }

    #[inline]
    pub(crate) fn has_disallow_conditional_types(self) -> bool {
        self.contains(Self::DisallowConditionalTypes)
    }

    #[inline]
    pub(crate) fn has_ambient(self) -> bool {
        self.contains(Self::Ambient)
    }

    #[inline]
    pub(crate) fn union_await_if(self, include: bool) -> Self {
        self.union_if(Self::Await, include)
    }

    #[inline]
    pub(crate) fn union_ambient_if(self, include: bool) -> Self {
        self.union_if(Self::Ambient, include)
    }

    #[inline]
    pub(crate) fn union_yield_if(self, include: bool) -> Self {
        self.union_if(Self::Yield, include)
    }

    #[inline]
    fn union_if(self, other: Self, include: bool) -> Self {
        if include {
            self.union(other)
        } else {
            self
        }
    }

    #[inline]
    pub(crate) fn and_in(self, include: bool) -> Self {
        self.and(Self::In, include)
    }

    #[inline]
    pub(crate) fn and_yield(self, include: bool) -> Self {
        self.and(Self::Yield, include)
    }

    #[inline]
    pub(crate) fn and_await(self, include: bool) -> Self {
        self.and(Self::Await, include)
    }

    #[inline]
    pub(crate) fn and_return(self, include: bool) -> Self {
        self.and(Self::Return, include)
    }

    #[inline]
    pub(crate) fn and_decorator(self, include: bool) -> Self {
        self.and(Self::Decorator, include)
    }

    #[inline]
    pub(crate) fn and_ambient(self, include: bool) -> Self {
        self.and(Self::Ambient, include)
    }

    #[inline]
    fn and(self, flag: Self, set: bool) -> Self {
        if set {
            self | flag
        } else {
            self - flag
        }
    }
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum StatementContext {
    If,
    Label,
    Do,
    While,
    With,
    For,
    StatementList,
}

impl StatementContext {
    pub(crate) fn is_single_statement(self) -> bool {
        self != Self::StatementList
    }
}
