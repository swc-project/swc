use swc_ecma_ast::*;

/// Expression suffixes that can merge with a following operator.
pub(crate) enum TrailingToken {
    NonNull,
    TypeArgumentClose,
}

/// Follow the minified right edge, stopping at delimiters such as parentheses.
pub(crate) trait EndsWithTypeScriptToken {
    fn trailing_token(&self) -> Option<TrailingToken>;
}

impl EndsWithTypeScriptToken for Expr {
    fn trailing_token(&self) -> Option<TrailingToken> {
        let mut expr = self;
        loop {
            expr = match expr {
                Expr::TsNonNull(..) => return Some(TrailingToken::NonNull),
                Expr::TsInstantiation(..) => return Some(TrailingToken::TypeArgumentClose),
                Expr::Bin(n) => &n.right,
                Expr::Unary(n) => &n.arg,
                Expr::Update(n) if n.prefix => &n.arg,
                Expr::Await(n) => &n.arg,
                Expr::TsTypeAssertion(n) => &n.expr,
                // Only untyped constructors can omit an empty argument list.
                Expr::New(n) if matches!(n.args.as_deref(), None | Some([])) => {
                    if n.type_args.is_some() {
                        return n.args.is_none().then_some(TrailingToken::TypeArgumentClose);
                    }
                    &n.callee
                }
                _ => return None,
            };
        }
    }
}

impl EndsWithTypeScriptToken for AssignTarget {
    #[inline]
    fn trailing_token(&self) -> Option<TrailingToken> {
        match self {
            AssignTarget::Simple(SimpleAssignTarget::TsNonNull(..)) => Some(TrailingToken::NonNull),
            AssignTarget::Simple(SimpleAssignTarget::TsInstantiation(..)) => {
                Some(TrailingToken::TypeArgumentClose)
            }
            AssignTarget::Simple(SimpleAssignTarget::TsTypeAssertion(n)) => n.expr.trailing_token(),
            _ => None,
        }
    }
}

impl EndsWithTypeScriptToken for Pat {
    #[inline]
    fn trailing_token(&self) -> Option<TrailingToken> {
        match self {
            Pat::Expr(n) => n.trailing_token(),
            _ => None,
        }
    }
}

/// Follow the emitted left edge to a type assertion or JSX opener. Parentheses
/// and prefix operators provide their own token boundary.
pub(crate) fn starts_with_lt(mut expr: &Expr) -> bool {
    loop {
        expr = match expr {
            Expr::TsTypeAssertion(..) | Expr::JSXElement(..) | Expr::JSXFragment(..) => {
                return true;
            }
            Expr::Arrow(n) => return !n.is_async && n.type_params.is_some(),
            Expr::Bin(n) => &n.left,
            Expr::Cond(n) => &n.test,
            Expr::Seq(n) => match n.exprs.first() {
                Some(first) => first,
                None => return false,
            },
            Expr::Member(n) => &n.obj,
            Expr::Call(n) => match &n.callee {
                Callee::Expr(callee) => callee,
                _ => return false,
            },
            Expr::OptChain(n) => match &*n.base {
                OptChainBase::Member(n) => &n.obj,
                OptChainBase::Call(n) => &n.callee,
                #[cfg(swc_ast_unknown)]
                _ => return false,
            },
            Expr::TaggedTpl(n) => &n.tag,
            Expr::Update(n) if !n.prefix => &n.arg,
            Expr::TsNonNull(n) => &n.expr,
            Expr::TsAs(n) => &n.expr,
            Expr::TsSatisfies(n) => &n.expr,
            Expr::TsConstAssertion(n) => &n.expr,
            Expr::TsInstantiation(n) => &n.expr,
            _ => return false,
        };
    }
}

/// Follow the emitted left edge to a regular expression literal, which would
/// turn a preceding `/` operator into a `//` line comment. Parentheses and
/// prefix operators provide their own token boundary.
pub(crate) fn starts_with_regex(mut expr: &Expr) -> bool {
    loop {
        expr = match expr {
            Expr::Lit(Lit::Regex(..)) => return true,
            Expr::Bin(n) => &n.left,
            Expr::Cond(n) => &n.test,
            Expr::Seq(n) => match n.exprs.first() {
                Some(first) => first,
                None => return false,
            },
            Expr::Member(n) => &n.obj,
            Expr::Call(n) => match &n.callee {
                Callee::Expr(callee) => callee,
                _ => return false,
            },
            Expr::OptChain(n) => match &*n.base {
                OptChainBase::Member(n) => &n.obj,
                OptChainBase::Call(n) => &n.callee,
                #[cfg(swc_ast_unknown)]
                _ => return false,
            },
            Expr::TaggedTpl(n) => &n.tag,
            Expr::Update(n) if !n.prefix => &n.arg,
            Expr::TsNonNull(n) => &n.expr,
            Expr::TsAs(n) => &n.expr,
            Expr::TsSatisfies(n) => &n.expr,
            Expr::TsConstAssertion(n) => &n.expr,
            Expr::TsInstantiation(n) => &n.expr,
            _ => return false,
        };
    }
}

/// A generic function type starts with its type parameter opener. Follow only
/// types that emit their first constituent without an enclosing delimiter.
pub(crate) fn type_starts_with_lt(mut ty: &TsType) -> bool {
    loop {
        ty = match ty {
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(n)) => {
                return n.type_params.is_some();
            }
            TsType::TsArrayType(n) => &n.elem_type,
            TsType::TsOptionalType(n) => &n.type_ann,
            TsType::TsIndexedAccessType(n) => &n.obj_type,
            TsType::TsConditionalType(n) => &n.check_type,
            TsType::TsUnionOrIntersectionType(n) => {
                let types = match n {
                    TsUnionOrIntersectionType::TsUnionType(n) => &n.types,
                    TsUnionOrIntersectionType::TsIntersectionType(n) => &n.types,
                    #[cfg(swc_ast_unknown)]
                    _ => return false,
                };
                match types.first() {
                    Some(first) => first,
                    None => return false,
                }
            }
            _ => return false,
        };
    }
}
