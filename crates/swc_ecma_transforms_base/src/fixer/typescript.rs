use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMutWith;

use super::{Context, Fixer};

#[derive(Clone, Copy)]
pub(super) enum TsOperand {
    Postfix,
    NonNull,
    Update { prefix: bool },
}

impl TsOperand {
    pub(super) fn needs_parens(self, expr: &Expr) -> bool {
        match expr {
            // Update operands require a left-hand-side expression, including
            // when an assertion uses prefix syntax.
            Expr::TsAs(..)
            | Expr::TsSatisfies(..)
            | Expr::TsConstAssertion(..)
            | Expr::TsTypeAssertion(..) => true,
            // Prefix updates allow expression type arguments; postfix updates
            // and other postfix operations make their lookahead backtrack.
            Expr::TsInstantiation(..) => !matches!(self, Self::Update { prefix: true }),
            _ => false,
        }
    }
}

impl Fixer<'_> {
    /// Groups operands that bind less tightly than postfix casts.
    ///
    /// `as`, `satisfies`, and `as const` apply to the whole grouped operand.
    /// Parent operators separately protect exposed binary operands whose
    /// binding would change after erasing the cast.
    pub(super) fn wrap_ts_cast_input(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Bin(n) if n.op.precedence() < op!("in").precedence() => self.wrap(expr),
            Expr::Assign(..)
            | Expr::Cond(..)
            | Expr::Seq(..)
            | Expr::Arrow(..)
            | Expr::Yield(..) => self.wrap(expr),
            _ => {}
        }
    }

    /// Groups casts before type continuations or changes in binary binding.
    ///
    /// `&` and `|` extend the type, while `<` and `<<` can start type
    /// arguments. TypeScript also stops a cast's binary continuation when
    /// its operand would bind after the following operator if the cast were
    /// erased.
    pub(super) fn wrap_ts_cast_left(&mut self, op: BinaryOp, expr: &mut Expr) {
        if self.remove_only {
            return;
        }
        let needs_parens = match op {
            op!("&") | op!("|") => true,
            op!("<") | op!("<<") => match expr {
                Expr::TsAs(n) => can_continue_type_args(&n.type_ann, op),
                Expr::TsSatisfies(n) => can_continue_type_args(&n.type_ann, op),
                Expr::TsConstAssertion(..) => true,
                _ => false,
            },
            _ => false,
        };
        if needs_parens
            || (op.precedence() > op!("in").precedence()
                && ts_cast_operand_needs_grouping(expr, op))
        {
            self.wrap(expr);
        }
    }

    /// Groups instantiations before tokens rejected by TypeScript's expression
    /// type-argument lookahead. Existing precedence parentheses end the walk.
    /// Each scan starts at a binary's left operand and follows right tails;
    /// nested binaries inspect disjoint tails, keeping the total walk linear.
    pub(super) fn wrap_ts_instantiation_tail(&mut self, op: BinaryOp, mut expr: &mut Expr) {
        if self.remove_only
            || !matches!(
                op,
                op!("<")
                    | op!(">")
                    | op!(">=")
                    | op!(">>")
                    | op!(">>>")
                    | op!(bin, "+")
                    | op!(bin, "-")
            )
        {
            return;
        }

        loop {
            expr = match expr {
                Expr::TsInstantiation(..) => {
                    self.wrap(expr);
                    return;
                }
                Expr::Bin(n) => &mut n.right,
                Expr::Unary(n) => &mut n.arg,
                Expr::Update(n) if n.prefix => &mut n.arg,
                Expr::Await(n) => &mut n.arg,
                Expr::TsTypeAssertion(n) => &mut n.expr,
                _ => return,
            };
        }
    }

    /// TypeScript rejects expression type arguments before `/=`, `>>=`, and
    /// `>>>=`. Cast targets also need grouping to bind before any
    /// assignment.
    pub(super) fn wrap_ts_assign_target(&mut self, op: AssignOp, target: &mut AssignTarget) {
        if self.remove_only {
            return;
        }
        let AssignTarget::Simple(target) = target else {
            return;
        };

        let needs_parens = match target {
            SimpleAssignTarget::TsInstantiation(..) => {
                matches!(op, op!("/=") | op!(">>=") | op!(">>>="))
            }
            SimpleAssignTarget::TsAs(..)
            | SimpleAssignTarget::TsSatisfies(..)
            | SimpleAssignTarget::TsTypeAssertion(..) => true,
            _ => false,
        };
        if !needs_parens {
            return;
        }

        let expr = target.take().into();
        *target = SimpleAssignTarget::Paren(self.make_paren(expr));
    }

    /// Ends a conditional test's cast type before a consequent that would make
    /// TypeScript consume `?` as a postfix nullable type operator.
    pub(super) fn wrap_ts_conditional_test(&mut self, test: &mut Expr, consequent: &Expr) {
        if self.remove_only {
            return;
        }

        let Some(cast) = ts_cast_tail(test) else {
            return;
        };
        if can_start_ts_type(consequent) {
            return;
        }

        self.wrap(cast);
    }

    /// Postfix casts bind less tightly than prefix assertions. Group
    /// their operands so the cast cannot move outside its enclosing operator.
    pub(super) fn wrap_ts_cast_operand(&mut self, expr: &mut Expr) {
        if matches!(
            expr,
            Expr::TsAs(..) | Expr::TsSatisfies(..) | Expr::TsConstAssertion(..)
        ) {
            self.wrap(expr);
        }
    }

    /// Fixes a postfix or update operand, reusing required TS parentheses.
    /// Removing and rebuilding the innermost pair would free and allocate the
    /// same expression box. Keep the usual span bookkeeping so comments and
    /// repeated spans behave just as they do when a pair is rebuilt.
    pub(super) fn visit_mut_ts_operand(&mut self, expr: &mut Expr, kind: TsOperand) {
        if self.visit_mut_ts_paren_if_required(expr, kind) {
            return;
        }

        expr.visit_mut_with(self);
        if kind.needs_parens(expr) {
            self.wrap(expr);
        }
    }

    /// Returns whether an existing TS pair was retained and visited.
    pub(super) fn visit_mut_ts_paren_if_required(
        &mut self,
        expr: &mut Expr,
        kind: TsOperand,
    ) -> bool {
        if let Expr::Paren(paren) = expr {
            let inner = paren.expr.unwrap_parens();
            if !self.remove_only
                && (kind.needs_parens(inner)
                    || (matches!(kind, TsOperand::NonNull) && continues_optional_chain(inner)))
            {
                self.visit_mut_ts_paren(expr);
                return true;
            }
        }
        false
    }

    fn visit_mut_ts_paren(&mut self, expr: &mut Expr) {
        let ctx = self.ctx;
        if ctx == Context::Default {
            self.ctx = Context::FreeExpr;
        }
        while let Expr::Paren(paren) = expr {
            let inner_span = paren.expr.span();
            self.span_map.insert(inner_span, paren.span);
            if paren.expr.is_paren() {
                *expr = *paren.expr.take();
            } else {
                paren.expr.visit_mut_with(self);
                paren.span = self.restore_paren_span(paren.expr.span());
                break;
            }
        }
        self.ctx = ctx;
    }
}

/// Non-null assertions can continue an optional chain, but parentheses end it.
pub(super) fn continues_optional_chain(mut expr: &Expr) -> bool {
    while let Expr::TsNonNull(non_null) = expr {
        expr = &non_null.expr;
    }
    expr.is_opt_chain()
}

/// Checks the last binary operand exposed through a chain of postfix casts.
/// Parentheses end the walk, so already grouped operands need no extra pair.
fn ts_cast_operand_needs_grouping(mut expr: &Expr, op: BinaryOp) -> bool {
    loop {
        expr = match expr {
            Expr::TsAs(n) => &n.expr,
            Expr::TsSatisfies(n) => &n.expr,
            Expr::TsConstAssertion(n) => &n.expr,
            Expr::Bin(n) => {
                return n.op.precedence() < op.precedence() || (op == op!("**") && n.op == op);
            }
            _ => return false,
        };
    }
}

/// Checks whether the last emitted type can consume `<` or `<<` as type
/// arguments.
///
/// References and imports rescan either token. Only non-import `typeof` queries
/// require a standalone `<`; `typeof import(...)` keeps the import's behavior.
/// Existing type arguments and closing type delimiters prevent another list.
fn can_continue_type_args(mut ty: &TsType, op: BinaryOp) -> bool {
    loop {
        ty = match ty {
            TsType::TsTypeRef(n) => return n.type_params.is_none(),
            TsType::TsImportType(n) => return n.type_args.is_none(),
            TsType::TsTypeQuery(n) => {
                if n.type_args.is_some() {
                    return false;
                }
                return match &n.expr_name {
                    TsTypeQueryExpr::Import(n) => n.type_args.is_none(),
                    TsTypeQueryExpr::TsEntityName(..) => op == op!("<"),
                    #[cfg(swc_ast_unknown)]
                    _ => true,
                };
            }
            TsType::TsFnOrConstructorType(n) => match n {
                TsFnOrConstructorType::TsFnType(n) => &n.type_ann.type_ann,
                TsFnOrConstructorType::TsConstructorType(n) => &n.type_ann.type_ann,
                #[cfg(swc_ast_unknown)]
                _ => return true,
            },
            TsType::TsUnionOrIntersectionType(n) => {
                let types = match n {
                    TsUnionOrIntersectionType::TsUnionType(n) => &n.types,
                    TsUnionOrIntersectionType::TsIntersectionType(n) => &n.types,
                    #[cfg(swc_ast_unknown)]
                    _ => return true,
                };
                match types.last() {
                    Some(ty) => ty,
                    None => return false,
                }
            }
            TsType::TsConditionalType(n) => &n.false_type,
            TsType::TsTypeOperator(n) => &n.type_ann,
            TsType::TsRestType(n) => &n.type_ann,
            TsType::TsInferType(n) => match &n.type_param.constraint {
                Some(ty) => ty,
                None => return false,
            },
            TsType::TsTypePredicate(n) => match &n.type_ann {
                Some(ty) => &ty.type_ann,
                None => return false,
            },
            TsType::TsKeywordType(..)
            | TsType::TsThisType(..)
            | TsType::TsTypeLit(..)
            | TsType::TsArrayType(..)
            | TsType::TsTupleType(..)
            | TsType::TsOptionalType(..)
            | TsType::TsParenthesizedType(..)
            | TsType::TsIndexedAccessType(..)
            | TsType::TsMappedType(..)
            | TsType::TsLitType(..) => return false,
            #[cfg(swc_ast_unknown)]
            _ => return true,
        };
    }
}

/// Prefix operands already group postfix casts. Only ungrouped rightmost binary
/// operands can expose a trailing cast to the conditional lookahead.
fn ts_cast_tail(mut expr: &mut Expr) -> Option<&mut Expr> {
    while let Expr::Bin(n) = expr {
        expr = &mut n.right;
    }

    matches!(
        expr,
        Expr::TsAs(..) | Expr::TsSatisfies(..) | Expr::TsConstAssertion(..)
    )
    .then_some(expr)
}

/// Carries the first emitted expression or assignment target without turning a
/// borrowed target back into an owned expression.
enum TypeStart<'a> {
    Expr(&'a Expr),
    Target(&'a SimpleAssignTarget),
}

/// Mirrors the token lookahead used before TypeScript's postfix `T?` syntax.
/// Parentheses do not end this walk: TypeScript also looks inside them,
/// accepting parameter starts such as private names. A minus sign can start a
/// type only before a numeric or bigint literal.
fn can_start_ts_type(expr: &Expr) -> bool {
    let mut start = TypeStart::Expr(expr);
    let mut in_parens = false;
    loop {
        start = match start {
            TypeStart::Expr(expr) => match expr {
                Expr::Member(n) => TypeStart::Expr(&n.obj),
                Expr::Call(n) => match &n.callee {
                    Callee::Expr(expr) => TypeStart::Expr(expr),
                    Callee::Super(..) => return false,
                    _ => return true,
                },
                Expr::OptChain(n) => match &*n.base {
                    OptChainBase::Member(n) => TypeStart::Expr(&n.obj),
                    OptChainBase::Call(n) => TypeStart::Expr(&n.callee),
                    #[cfg(swc_ast_unknown)]
                    _ => return true,
                },
                Expr::TaggedTpl(n) => TypeStart::Expr(&n.tag),
                Expr::Bin(n) => TypeStart::Expr(&n.left),
                Expr::Cond(n) => TypeStart::Expr(&n.test),
                Expr::Seq(n) => match n.exprs.first() {
                    Some(expr) => TypeStart::Expr(expr),
                    None => return true,
                },
                Expr::Assign(n) => match &n.left {
                    AssignTarget::Simple(target) => TypeStart::Target(target),
                    _ => return true,
                },
                Expr::Update(n) if !n.prefix => TypeStart::Expr(&n.arg),
                Expr::TsAs(n) => TypeStart::Expr(&n.expr),
                Expr::TsSatisfies(n) => TypeStart::Expr(&n.expr),
                Expr::TsNonNull(n) => TypeStart::Expr(&n.expr),
                Expr::TsConstAssertion(n) => TypeStart::Expr(&n.expr),
                Expr::TsInstantiation(n) => TypeStart::Expr(&n.expr),
                Expr::Paren(n) => {
                    in_parens = true;
                    TypeStart::Expr(&n.expr)
                }
                Expr::PrivateName(..) => return in_parens,
                Expr::Lit(Lit::Regex(..))
                | Expr::Class(..)
                | Expr::SuperProp(..)
                | Expr::Update(..) => return false,
                Expr::Unary(n) => {
                    return match n.op {
                        op!("!") | op!("typeof") | op!("void") => true,
                        op!(unary, "-") => {
                            matches!(&*n.arg, Expr::Lit(Lit::Num(..) | Lit::BigInt(..)))
                        }
                        _ => false,
                    };
                }
                _ => return true,
            },
            TypeStart::Target(target) => match target {
                SimpleAssignTarget::Member(n) => TypeStart::Expr(&n.obj),
                SimpleAssignTarget::SuperProp(..) => return false,
                SimpleAssignTarget::Paren(n) => {
                    in_parens = true;
                    TypeStart::Expr(&n.expr)
                }
                SimpleAssignTarget::OptChain(n) => match &*n.base {
                    OptChainBase::Member(n) => TypeStart::Expr(&n.obj),
                    OptChainBase::Call(n) => TypeStart::Expr(&n.callee),
                    #[cfg(swc_ast_unknown)]
                    _ => return true,
                },
                SimpleAssignTarget::TsAs(n) => TypeStart::Expr(&n.expr),
                SimpleAssignTarget::TsSatisfies(n) => TypeStart::Expr(&n.expr),
                SimpleAssignTarget::TsNonNull(n) => TypeStart::Expr(&n.expr),
                SimpleAssignTarget::TsInstantiation(n) => TypeStart::Expr(&n.expr),
                _ => return true,
            },
        };
    }
}
