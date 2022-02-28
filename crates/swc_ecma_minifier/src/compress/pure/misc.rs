use std::num::FpCategory;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

use super::Pure;
use crate::{compress::util::is_pure_undefined, mode::Mode};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn remove_invalid(&mut self, e: &mut Expr) {
        if let Expr::Bin(BinExpr { left, right, .. }) = e {
            self.remove_invalid(left);
            self.remove_invalid(right);

            if left.is_invalid() {
                *e = *right.take();
                self.remove_invalid(e);
            } else if right.is_invalid() {
                *e = *left.take();
                self.remove_invalid(e);
            }
        }
    }

    pub(super) fn drop_undefined_from_return_arg(&mut self, s: &mut ReturnStmt) {
        if let Some(e) = s.arg.as_deref() {
            if is_pure_undefined(e) {
                self.changed = true;
                tracing::debug!("Dropped `undefined` from `return undefined`");
                s.arg.take();
            }
        }
    }

    pub(super) fn remove_useless_return(&mut self, stmts: &mut Vec<Stmt>) {
        if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts.last() {
            self.changed = true;
            tracing::debug!("misc: Removing useless return");
            stmts.pop();
        }
    }

    /// Removes last return statement. This should be callled only if the return
    /// value of function is ignored.
    ///
    /// Returns true if something is modified.
    fn drop_return_value(&mut self, stmts: &mut Vec<Stmt>) -> bool {
        for s in stmts.iter_mut() {
            if let Stmt::Return(ReturnStmt {
                arg: arg @ Some(..),
                ..
            }) = s
            {
                self.ignore_return_value(
                    arg.as_deref_mut().unwrap(),
                    DropOpts {
                        drop_zero: true,
                        drop_str_lit: true,
                    },
                );

                if let Some(Expr::Invalid(..)) = arg.as_deref() {
                    self.changed = true;
                    *arg = None;
                }
            }
        }

        if let Some(last) = stmts.last_mut() {
            self.drop_return_value_of_stmt(last)
        } else {
            false
        }
    }

    /// Returns true if something is modified.
    fn drop_return_value_of_stmt(&mut self, s: &mut Stmt) -> bool {
        match s {
            Stmt::Block(s) => self.drop_return_value(&mut s.stmts),
            Stmt::Return(ret) => {
                self.changed = true;
                if cfg!(feature = "debug") {
                    tracing::trace!("Dropping `return` token");
                }

                let span = ret.span;
                match ret.arg.take() {
                    Some(arg) => {
                        *s = Stmt::Expr(ExprStmt { span, expr: arg });
                    }
                    None => {
                        *s = Stmt::Empty(EmptyStmt { span });
                    }
                }

                true
            }

            Stmt::Labeled(s) => self.drop_return_value_of_stmt(&mut s.body),
            Stmt::If(s) => {
                let c = self.drop_return_value_of_stmt(&mut s.cons);
                let a = s
                    .alt
                    .as_deref_mut()
                    .map(|s| self.drop_return_value_of_stmt(s))
                    .unwrap_or_default();

                c || a
            }

            Stmt::Try(s) => {
                let a = if s.finalizer.is_none() {
                    self.drop_return_value(&mut s.block.stmts)
                } else {
                    false
                };

                let b = s
                    .finalizer
                    .as_mut()
                    .map(|s| self.drop_return_value(&mut s.stmts))
                    .unwrap_or_default();

                a || b
            }

            _ => false,
        }
    }

    pub(super) fn ignore_return_value(&mut self, e: &mut Expr, opts: DropOpts) {
        if self.options.unused {
            if let Expr::Lit(Lit::Num(n)) = e {
                // Skip 0
                if n.value != 0.0 && n.value.classify() == FpCategory::Normal {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }
        }

        if self.options.unused || self.options.side_effects {
            match e {
                Expr::Lit(Lit::Num(n)) => {
                    if n.value == 0.0 && opts.drop_zero {
                        self.changed = true;
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }

                Expr::Ident(i) => {
                    if let Some(bindings) = self.bindings.as_deref() {
                        if bindings.contains(&i.to_id()) {
                            self.changed = true;
                            *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                            return;
                        }
                    }
                }

                Expr::Lit(Lit::Null(..) | Lit::BigInt(..) | Lit::Bool(..) | Lit::Regex(..)) => {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }

                Expr::Bin(
                    bin @ BinExpr {
                        op:
                            op!(bin, "+")
                            | op!(bin, "-")
                            | op!("*")
                            | op!("/")
                            | op!("%")
                            | op!("**")
                            | op!("^")
                            | op!("&")
                            | op!("|")
                            | op!(">>")
                            | op!("<<")
                            | op!(">>>")
                            | op!("===")
                            | op!("!==")
                            | op!("==")
                            | op!("!=")
                            | op!("<")
                            | op!("<=")
                            | op!(">")
                            | op!(">="),
                        ..
                    },
                ) => {
                    self.ignore_return_value(
                        &mut bin.left,
                        DropOpts {
                            drop_zero: true,
                            drop_str_lit: true,
                        },
                    );
                    self.ignore_return_value(
                        &mut bin.right,
                        DropOpts {
                            drop_zero: true,
                            drop_str_lit: true,
                        },
                    );

                    if bin.left.is_invalid() && bin.right.is_invalid() {
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    } else if bin.right.is_invalid() {
                        *e = *bin.left.take();
                        return;
                    } else if bin.left.is_invalid() {
                        *e = *bin.right.take();
                        return;
                    }
                }

                Expr::Unary(UnaryExpr {
                    op: op!("void") | op!("typeof") | op!(unary, "+") | op!(unary, "-"),
                    arg,
                    ..
                }) => {
                    self.ignore_return_value(
                        &mut **arg,
                        DropOpts {
                            drop_str_lit: true,
                            drop_zero: true,
                        },
                    );

                    if arg.is_invalid() {
                        *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        return;
                    }
                }

                Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) => {
                    // Convert `a = a` to `a`.
                    if let Some(l) = assign.left.as_ident() {
                        if let Expr::Ident(r) = &*assign.right {
                            if l.to_id() == r.to_id() {
                                self.changed = true;
                                *e = *assign.right.take();
                            }
                        }
                    }
                }

                _ => {}
            }
        }

        match e {
            Expr::Lit(Lit::Str(s)) => {
                if opts.drop_str_lit
                    || (s.value.starts_with("@swc/helpers")
                        || s.value.starts_with("@babel/helpers"))
                {
                    self.changed = true;
                    *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }

            Expr::Seq(e) => {
                self.drop_useless_ident_ref_in_seq(e);

                if let Some(last) = e.exprs.last_mut() {
                    // Non-last elements are already processed.
                    self.ignore_return_value(&mut **last, opts);
                }

                let len = e.exprs.len();
                e.exprs.retain(|e| !e.is_invalid());
                if e.exprs.len() != len {
                    self.changed = true;
                }
                return;
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match &mut **callee {
                Expr::Fn(callee) => {
                    if callee.ident.is_none() {
                        if let Some(body) = &mut callee.function.body {
                            if self.options.side_effects {
                                self.drop_return_value(&mut body.stmts);
                            }
                        }
                    }
                }

                _ => {
                    unreachable!()
                }
            },

            _ => {}
        }

        // Remove pure member expressions.
        if let Expr::Member(MemberExpr { obj, prop, .. }) = e {
            if let Expr::Ident(obj) = &**obj {
                if obj.span.ctxt.outer() == self.marks.top_level_mark {
                    if let Some(bindings) = self.bindings.as_deref() {
                        if !bindings.contains(&obj.to_id()) {
                            if is_pure_member_access(obj, prop) {
                                self.changed = true;
                                *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                            }
                        }
                    }
                }
            }
        }
    }
}

#[derive(Debug, Default, Clone, Copy)]
pub(super) struct DropOpts {
    pub drop_zero: bool,
    pub drop_str_lit: bool,
}

/// `obj` should have top level syntax context.
fn is_pure_member_access(obj: &Ident, prop: &MemberProp) -> bool {
    macro_rules! check {
        (
            $obj:ident.
            $prop:ident
        ) => {{
            if &*obj.sym == stringify!($obj) {
                if let MemberProp::Ident(prop) = prop {
                    if &*prop.sym == stringify!($prop) {
                        return true;
                    }
                }
            }
        }};
    }

    macro_rules! pure {
        (
            $(
                $(
                  $i:ident
                ).*
            ),*
        ) => {
            $(
                check!($($i).*);
            )*
        };
    }

    pure!(
        Array.isArray,
        ArrayBuffer.isView,
        Boolean.toSource,
        Date.parse,
        Date.UTC,
        Date.now,
        Error.captureStackTrace,
        Error.stackTraceLimit,
        Function.bind,
        Function.call,
        Function.length,
        console.log,
        Error.name,
        Math.random,
        Number.isNaN,
        Object.defineProperty,
        String.fromCharCode
    );

    false
}
