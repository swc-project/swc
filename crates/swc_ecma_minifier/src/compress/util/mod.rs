use crate::{debug::dump, util::ModuleItemExt};
use std::f64;
use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::fixer;
use swc_ecma_utils::{ExprExt, Id, UsageFinder, Value};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, FoldWith, VisitMut, VisitMutWith, VisitWith};
use unicode_xid::UnicodeXID;

#[cfg(test)]
mod tests;

/// Creates `!e` where e is the expression passed as an argument.
///
/// Returns true if this modified ast.
///
/// # Note
///
/// This method returns `!e` if `!!e` is given as a argument.
///
/// TODO: Handle special cases like !1 or !0
pub(super) fn negate(e: &mut Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) {
    negate_inner(e, in_bool_ctx, is_ret_val_ignored);
}

fn negate_inner(e: &mut Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) -> bool {
    let start_str = dump(&*e, false);

    match e {
        Expr::Bin(bin @ BinExpr { op: op!("=="), .. })
        | Expr::Bin(bin @ BinExpr { op: op!("!="), .. })
        | Expr::Bin(bin @ BinExpr { op: op!("==="), .. })
        | Expr::Bin(bin @ BinExpr { op: op!("!=="), .. }) => {
            bin.op = match bin.op {
                op!("==") => {
                    op!("!=")
                }
                op!("!=") => {
                    op!("==")
                }
                op!("===") => {
                    op!("!==")
                }
                op!("!==") => {
                    op!("===")
                }
                _ => {
                    unreachable!()
                }
            };
            tracing::debug!("negate: binary");
            return true;
        }

        Expr::Bin(BinExpr {
            left,
            right,
            op: op @ op!("&&"),
            ..
        }) if is_ok_to_negate_rhs(right) => {
            tracing::debug!("negate: a && b => !a || !b");

            let a = negate_inner(&mut **left, in_bool_ctx, false);
            let b = negate_inner(&mut **right, in_bool_ctx, is_ret_val_ignored);
            *op = op!("||");
            return a || b;
        }

        Expr::Bin(BinExpr {
            left,
            right,
            op: op @ op!("||"),
            ..
        }) if is_ok_to_negate_rhs(right) => {
            tracing::debug!("negate: a || b => !a && !b");

            let a = negate_inner(&mut **left, in_bool_ctx, false);
            let b = negate_inner(&mut **right, in_bool_ctx, is_ret_val_ignored);
            *op = op!("&&");
            return a || b;
        }

        Expr::Cond(CondExpr { cons, alt, .. })
            if is_ok_to_negate_for_cond(cons) && is_ok_to_negate_for_cond(alt) =>
        {
            tracing::debug!("negate: cond");

            let a = negate_inner(&mut **cons, in_bool_ctx, false);
            let b = negate_inner(&mut **alt, in_bool_ctx, is_ret_val_ignored);
            return a || b;
        }

        Expr::Seq(SeqExpr { exprs, .. }) => {
            if let Some(last) = exprs.last_mut() {
                tracing::debug!("negate: seq");

                return negate_inner(&mut **last, in_bool_ctx, is_ret_val_ignored);
            }
        }

        _ => {}
    }

    let mut arg = Box::new(e.take());

    if let Expr::Unary(UnaryExpr {
        op: op!("!"), arg, ..
    }) = &mut *arg
    {
        match &mut **arg {
            Expr::Unary(UnaryExpr { op: op!("!"), .. }) => {
                tracing::debug!("negate: !!bool => !bool");
                *e = *arg.take();
                return true;
            }
            Expr::Bin(BinExpr { op: op!("in"), .. })
            | Expr::Bin(BinExpr {
                op: op!("instanceof"),
                ..
            }) => {
                tracing::debug!("negate: !bool => bool");
                *e = *arg.take();
                return true;
            }
            _ => {
                if in_bool_ctx {
                    tracing::debug!("negate: !expr => expr (in bool context)");
                    *e = *arg.take();
                    return true;
                }

                if is_ret_val_ignored {
                    tracing::debug!("negate: !expr => expr (return value ignored)");
                    *e = *arg.take();
                    return true;
                }
            }
        }
    }

    if is_ret_val_ignored {
        tracing::debug!("negate: noop because it's ignored");
        *e = *arg;

        false
    } else {
        tracing::debug!("negate: e => !e");

        *e = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: op!("!"),
            arg,
        });

        if cfg!(feature = "debug") {
            tracing::trace!("[Change] Negated `{}` as `{}`", start_str, dump(&*e, false));
        }

        true
    }
}

pub(crate) fn is_ok_to_negate_for_cond(e: &Expr) -> bool {
    !matches!(e, Expr::Update(..))
}

pub(crate) fn is_ok_to_negate_rhs(rhs: &Expr) -> bool {
    match rhs {
        Expr::Member(..) => true,
        Expr::Bin(BinExpr {
            op: op!("===") | op!("!==") | op!("==") | op!("!="),
            ..
        }) => true,

        Expr::Call(..) | Expr::New(..) => false,

        Expr::Update(..) => false,

        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||"),
            left,
            right,
            ..
        }) => is_ok_to_negate_rhs(left) && is_ok_to_negate_rhs(right),

        Expr::Bin(BinExpr { left, right, .. }) => {
            is_ok_to_negate_rhs(left) && is_ok_to_negate_rhs(right)
        }

        Expr::Assign(e) => is_ok_to_negate_rhs(&e.right),

        Expr::Unary(UnaryExpr {
            op: op!("!") | op!("delete"),
            ..
        }) => true,

        Expr::Seq(e) => {
            if let Some(last) = e.exprs.last() {
                is_ok_to_negate_rhs(last)
            } else {
                true
            }
        }

        Expr::Cond(e) => is_ok_to_negate_rhs(&e.cons) && is_ok_to_negate_rhs(&e.alt),

        _ => {
            if !rhs.may_have_side_effects() {
                return true;
            }

            if cfg!(feature = "debug") {
                tracing::warn!(
                    "unimplemented: is_ok_to_negate_rhs: `{}`",
                    dump(&*rhs, false)
                );
            }

            false
        }
    }
}

/// A negative value means that it's efficient to negate the expression.
#[cfg_attr(feature = "debug", tracing::instrument(skip(e)))]
pub(crate) fn negate_cost(e: &Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) -> isize {
    #[cfg_attr(test, tracing::instrument(skip(e)))]
    fn cost(
        e: &Expr,
        in_bool_ctx: bool,
        bin_op: Option<BinaryOp>,
        is_ret_val_ignored: bool,
    ) -> isize {
        let cost = (|| {
            match e {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    // TODO: Check if this argument is actually start of line.
                    if let Expr::Call(CallExpr {
                        callee: Callee::Expr(callee),
                        ..
                    }) = &**arg
                    {
                        if let Expr::Fn(..) = &**callee {
                            return 0;
                        }
                    }

                    match &**arg {
                        Expr::Bin(BinExpr {
                            op: op!("&&") | op!("||"),
                            ..
                        }) => {}
                        _ => {
                            if in_bool_ctx {
                                let c = -cost(arg, true, None, is_ret_val_ignored);
                                return c.min(-1);
                            }
                        }
                    }

                    match &**arg {
                        Expr::Unary(UnaryExpr { op: op!("!"), .. }) => -1,

                        _ => {
                            if in_bool_ctx {
                                -1
                            } else {
                                1
                            }
                        }
                    }
                }
                Expr::Bin(BinExpr {
                    op: op!("===") | op!("!==") | op!("==") | op!("!="),
                    ..
                }) => 0,

                Expr::Bin(BinExpr {
                    op: op @ op!("||") | op @ op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    let l_cost = cost(left, in_bool_ctx, Some(*op), false);

                    if !is_ret_val_ignored && !is_ok_to_negate_rhs(right) {
                        return l_cost + 3;
                    }
                    l_cost + cost(right, in_bool_ctx, Some(*op), is_ret_val_ignored)
                }

                Expr::Cond(CondExpr { cons, alt, .. })
                    if is_ok_to_negate_for_cond(cons) && is_ok_to_negate_for_cond(alt) =>
                {
                    cost(cons, in_bool_ctx, bin_op, is_ret_val_ignored)
                        + cost(alt, in_bool_ctx, bin_op, is_ret_val_ignored)
                }

                Expr::Cond(..)
                | Expr::Update(..)
                | Expr::Bin(BinExpr {
                    op: op!("in") | op!("instanceof"),
                    ..
                }) => 3,

                Expr::Assign(..) => {
                    if is_ret_val_ignored {
                        0
                    } else {
                        3
                    }
                }

                Expr::Seq(e) => {
                    if let Some(last) = e.exprs.last() {
                        return cost(last, in_bool_ctx, bin_op, is_ret_val_ignored);
                    }

                    if is_ret_val_ignored {
                        0
                    } else {
                        1
                    }
                }

                _ => {
                    if is_ret_val_ignored {
                        0
                    } else {
                        1
                    }
                }
            }
        })();

        // Print more info while testing negate_cost
        if cfg!(test) {
            tracing::debug!(
                "negation cost of `{}` = {}",
                dump(&e.clone().fold_with(&mut as_folder(fixer(None))), true),
                cost,
            );
        }

        cost
    }

    let cost = cost(e, in_bool_ctx, None, is_ret_val_ignored);

    if cfg!(feature = "debug") {
        tracing::trace!(
            "negation cost of `{}` = {}\nin_book_ctx={:?}\nis_ret_val_ignored={:?}",
            dump(&e.clone().fold_with(&mut as_folder(fixer(None))), false),
            cost,
            in_bool_ctx,
            is_ret_val_ignored
        );
    }

    cost
}

pub(crate) fn is_pure_undefined(e: &Expr) -> bool {
    match e {
        Expr::Ident(Ident {
            sym: js_word!("undefined"),
            ..
        }) => true,

        Expr::Unary(UnaryExpr {
            op: UnaryOp::Void,
            arg,
            ..
        }) if !arg.may_have_side_effects() => true,

        _ => false,
    }
}

pub(crate) fn is_valid_identifier(s: &str, ascii_only: bool) -> bool {
    if ascii_only {
        if s.chars().any(|c| !c.is_ascii()) {
            return false;
        }
    }

    s.starts_with(|c: char| c.is_xid_start())
        && s.chars().all(|c: char| c.is_xid_continue())
        && !s.contains('𝒶')
        && !s.is_reserved()
}

pub(crate) fn is_directive(e: &Stmt) -> bool {
    match e {
        Stmt::Expr(s) => match &*s.expr {
            Expr::Lit(Lit::Str(Str { value, .. })) => value.starts_with("use "),
            _ => false,
        },
        _ => false,
    }
}

pub(crate) fn is_pure_undefined_or_null(e: &Expr) -> bool {
    is_pure_undefined(e) || matches!(e, Expr::Lit(Lit::Null(..)))
}

/// This method does **not** modifies `e`.
///
/// This method is used to test if a whole call can be replaced, while
/// preserving standalone constants.
pub(crate) fn eval_as_number(e: &Expr) -> Option<f64> {
    match e {
        Expr::Bin(BinExpr {
            op: op!(bin, "-"),
            left,
            right,
            ..
        }) => {
            let l = eval_as_number(left)?;
            let r = eval_as_number(right)?;

            return Some(l - r);
        }

        Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) => {
            for arg in &*args {
                if arg.spread.is_some() || arg.expr.may_have_side_effects() {
                    return None;
                }
            }

            if let Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                ..
            }) = &**callee
            {
                match &**obj {
                    Expr::Ident(obj) if &*obj.sym == "Math" => match &*prop.sym {
                        "cos" => {
                            let v = eval_as_number(&args.first()?.expr)?;

                            return Some(v.cos());
                        }
                        "sin" => {
                            let v = eval_as_number(&args.first()?.expr)?;

                            return Some(v.sin());
                        }

                        "max" => {
                            let mut numbers = vec![];
                            for arg in args {
                                let v = eval_as_number(&arg.expr)?;
                                if v.is_infinite() || v.is_nan() {
                                    return None;
                                }
                                numbers.push(v);
                            }

                            return Some(
                                numbers
                                    .into_iter()
                                    .max_by(|a, b| a.partial_cmp(b).unwrap())
                                    .unwrap_or(f64::NEG_INFINITY),
                            );
                        }

                        "min" => {
                            let mut numbers = vec![];
                            for arg in args {
                                let v = eval_as_number(&arg.expr)?;
                                if v.is_infinite() || v.is_nan() {
                                    return None;
                                }
                                numbers.push(v);
                            }

                            return Some(
                                numbers
                                    .into_iter()
                                    .min_by(|a, b| a.partial_cmp(b).unwrap())
                                    .unwrap_or(f64::INFINITY),
                            );
                        }

                        "pow" => {
                            if args.len() != 2 {
                                return None;
                            }
                            let first = eval_as_number(&args[0].expr)?;
                            let second = eval_as_number(&args[1].expr)?;

                            return Some(first.powf(second));
                        }

                        _ => {}
                    },
                    _ => {}
                }
            }
        }

        Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(prop),
            ..
        }) => match &**obj {
            Expr::Ident(obj) if &*obj.sym == "Math" => match &*prop.sym {
                "PI" => return Some(f64::consts::PI),
                "E" => return Some(f64::consts::E),
                "LN10" => return Some(f64::consts::LN_10),
                _ => {}
            },
            _ => {}
        },

        _ => {
            if let Value::Known(v) = e.as_number() {
                return Some(v);
            }
        }
    }

    None
}

pub(crate) fn always_terminates(s: &Stmt) -> bool {
    match s {
        Stmt::Return(..) | Stmt::Throw(..) | Stmt::Break(..) | Stmt::Continue(..) => true,
        Stmt::If(IfStmt { cons, alt, .. }) => {
            always_terminates(cons) && alt.as_deref().map(always_terminates).unwrap_or(false)
        }
        Stmt::Block(s) => s.stmts.iter().any(always_terminates),

        _ => false,
    }
}

pub(crate) fn is_ident_used_by<N>(id: Id, node: &N) -> bool
where
    N: for<'aa> VisitWith<UsageFinder<'aa>>,
{
    UsageFinder::find(&Ident::new(id.0, DUMMY_SP.with_ctxt(id.1)), node)
}

pub struct ExprReplacer<F>
where
    F: FnMut(&mut Expr),
{
    op: F,
}

impl<F> VisitMut for ExprReplacer<F>
where
    F: FnMut(&mut Expr),
{
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        (self.op)(e);
    }
}

pub fn replace_expr<N, F>(node: &mut N, op: F)
where
    N: VisitMutWith<ExprReplacer<F>>,
    F: FnMut(&mut Expr),
{
    node.visit_mut_with(&mut ExprReplacer { op })
}

pub(super) fn is_fine_for_if_cons(s: &Stmt) -> bool {
    match s {
        Stmt::Decl(Decl::Fn(FnDecl {
            ident:
                Ident {
                    sym: js_word!("undefined"),
                    ..
                },
            ..
        })) => false,

        Stmt::Decl(
            Decl::Var(VarDecl {
                kind: VarDeclKind::Var,
                ..
            })
            | Decl::Fn(..),
        ) => true,
        Stmt::Decl(..) => false,
        _ => true,
    }
}

pub(super) fn drop_invalid_stmts<T>(stmts: &mut Vec<T>)
where
    T: ModuleItemExt,
{
    stmts.retain(|s| match s.as_module_decl() {
        Ok(s) => match s {
            ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(v), ..
            }) => !v.decls.is_empty(),
            _ => true,
        },
        Err(s) => match s {
            Stmt::Empty(..) => false,
            Stmt::Decl(Decl::Var(v)) => !v.decls.is_empty(),
            _ => true,
        },
    });
}

#[derive(Debug, Default)]
pub(super) struct UnreachableHandler {
    vars: Vec<Ident>,
    in_var_name: bool,
    in_hoisted_var: bool,
}

impl UnreachableHandler {
    /// Assumes `s` is not reachable, and preserves variable declarations and
    /// function declarations in `s`.
    ///
    /// Returns true if statement is changed.
    pub fn preserve_vars(s: &mut Stmt) -> bool {
        if s.is_empty() {
            return false;
        }
        if let Stmt::Decl(Decl::Var(v)) = s {
            let mut changed = false;
            for decl in &mut v.decls {
                if decl.init.is_some() {
                    decl.init = None;
                    changed = true;
                }
            }

            return changed;
        }

        let mut v = Self::default();
        s.visit_mut_with(&mut v);
        if v.vars.is_empty() {
            *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
        } else {
            *s = Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: v
                    .vars
                    .into_iter()
                    .map(BindingIdent::from)
                    .map(Pat::Ident)
                    .map(|name| VarDeclarator {
                        span: DUMMY_SP,
                        name,
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))
        }

        true
    }
}

impl VisitMut for UnreachableHandler {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.vars.push(n.ident.clone());

        n.function.visit_mut_with(self);
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        if self.in_var_name && self.in_hoisted_var {
            if let Pat::Ident(i) = n {
                self.vars.push(i.id.clone());
            }
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        self.in_hoisted_var = n.kind == VarDeclKind::Var;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        self.in_var_name = true;
        n.name.visit_mut_with(self);
        self.in_var_name = false;
        n.init.visit_mut_with(self);
    }
}
