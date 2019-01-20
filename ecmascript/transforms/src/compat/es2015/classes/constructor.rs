use super::get_prototype_of;
use crate::{helpers::Helpers, util::ExprFactory};
use ast::*;
use std::iter;
use swc_common::{Fold, FoldWith, Mark, Visit, VisitWith, DUMMY_SP};

pub(super) struct SuperCallFinder {
    mode: Option<SuperFoldingMode>,
}

impl SuperCallFinder {
    ///
    /// - `None`: if no `super()` is found
    /// - `Some(Var)`: `var _this = ...`
    /// - `Some(Assign)`: `_this = ...`
    pub fn find<N>(node: &N) -> Option<SuperFoldingMode>
    where
        N: VisitWith<Self>,
    {
        let mut v = SuperCallFinder { mode: None };
        node.visit_with(&mut v);
        v.mode
    }
}

impl Visit<MemberExpr> for SuperCallFinder {
    fn visit(&mut self, e: &MemberExpr) {
        e.visit_children(self);

        match e.obj {
            ExprOrSuper::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => {
                // super().foo
                self.mode = Some(SuperFoldingMode::Assign)
            }
            _ => {}
        }
    }
}

impl Visit<CallExpr> for SuperCallFinder {
    fn visit(&mut self, e: &CallExpr) {
        match e.callee {
            ExprOrSuper::Super(..) => match self.mode {
                None => self.mode = Some(SuperFoldingMode::Var),
                // Multiple `super()` detected
                Some(SuperFoldingMode::Var) => self.mode = Some(SuperFoldingMode::Assign),
                _ => {}
            },

            _ => e.visit_children(self),
        }
    }
}

pub(super) fn constructor_fn(c: Constructor) -> Function {
    Function {
        span: DUMMY_SP,
        decorators: Default::default(),
        params: c
            .params
            .into_iter()
            .map(|pat| match pat {
                PatOrTsParamProp::Pat(p) => p,
                _ => unimplemented!("TsParamProp in constructor"),
            })
            .collect(),
        body: c.body,
        is_async: false,
        is_generator: false,

        type_params: Default::default(),
        return_type: Default::default(),
    }
}

/// # In
///
/// ```js
/// super();
/// ```
///
/// # Out
/// ```js
/// _this = possi;
/// ```
pub(super) struct ConstructorFolder<'a> {
    pub helpers: &'a Helpers,
    pub class_name: &'a Ident,
    pub mode: SuperFoldingMode,
    /// Mark for `_this`
    pub mark: Mark,
}
#[derive(Clone, Copy)]
pub(super) enum SuperFoldingMode {
    /// `_this = ...`
    Assign,
    /// `var _this = ...`
    Var,
}

impl<'a> Fold<Stmt> for ConstructorFolder<'a> {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        match self.mode {
            SuperFoldingMode::Var => {}
            _ => return stmt.fold_children(self),
        }

        match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                args,
                ..
            })) => {
                let init = Some(box make_possible_return_value(
                    self.helpers,
                    self.class_name,
                    Some(args),
                ));

                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this")),
                        init,
                        definite: false,
                    }],
                }))
            }
            _ => stmt,
        }
    }
}

impl<'a> Fold<Expr> for ConstructorFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        match self.mode {
            SuperFoldingMode::Assign => {}
            _ => return expr,
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                args,
                ..
            }) => {
                let right =
                    box make_possible_return_value(self.helpers, self.class_name, Some(args));
                Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(box Pat::Ident(quote_ident!(
                        DUMMY_SP.apply_mark(self.mark),
                        "_this"
                    ))),
                    op: op!("="),
                    right,
                })
            }
            _ => return expr,
        }
    }
}

pub(super) fn make_possible_return_value(
    helpers: &Helpers,
    class_name: &Ident,
    args: Option<Vec<ExprOrSpread>>,
) -> Expr {
    // possible return value from super() call
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("_possibleConstructorReturn").as_callee(),
        args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), {
            let apply = box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: MemberExpr {
                    span: DUMMY_SP,
                    obj: ExprOrSuper::Expr(box get_prototype_of(
                        helpers,
                        &Expr::Ident(class_name.clone()),
                    )),
                    computed: false,
                    prop: box Expr::Ident(if args.is_some() {
                        quote_ident!("call")
                    } else {
                        quote_ident!("apply")
                    }),
                }
                .as_callee(),
                // super(foo, bar) => possibleReturnCheck(this, foo, bar)
                args: match args {
                    Some(args) => iter::once(ThisExpr { span: DUMMY_SP }.as_arg())
                        .chain(args)
                        .collect(),
                    None => vec![
                        ThisExpr { span: DUMMY_SP }.as_arg(),
                        quote_ident!("arguments").as_arg(),
                    ],
                },

                type_args: Default::default(),
            });

            apply.as_arg()
        }],
        type_args: Default::default(),
    })
}
