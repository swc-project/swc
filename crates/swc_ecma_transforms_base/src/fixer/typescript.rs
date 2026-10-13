use swc_common::util::take::Take;
use swc_ecma_ast::*;

use super::Fixer;

impl Fixer<'_> {
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

    /// Postfix casts bind less tightly than prefix and update operators. Group
    /// their operands so the cast cannot move outside its enclosing operator.
    pub(super) fn wrap_ts_cast_operand(&mut self, expr: &mut Expr) {
        if matches!(
            expr,
            Expr::TsAs(..) | Expr::TsSatisfies(..) | Expr::TsConstAssertion(..)
        ) {
            self.wrap(expr);
        }
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
