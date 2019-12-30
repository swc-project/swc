use crate::util::ExprFactory;
use ast::*;
use swc_common::{Fold, FoldWith, DUMMY_SP};

#[derive(Debug)]
pub(super) struct CaseHandler<'a> {
    pub ctx: &'a Ident,
    pub idx: &'a mut u32,
    pub temp_idx: &'a mut u32,
    pub stmts: &'a mut Vec<Stmt>,
}

impl Fold<Stmt> for CaseHandler<'_> {
    fn fold(&mut self, s: Stmt) -> Stmt {
        let s: Stmt = s.fold_children(self);

        match s {
            Stmt::Return(ret) => {
                return ReturnStmt {
                    arg: Some(
                        box CallExpr {
                            span: DUMMY_SP,
                            callee: self.ctx.clone().member(quote_ident!("abrupt")).as_callee(),
                            args: {
                                let ret_arg = Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "return".into(),
                                    has_escape: false,
                                })
                                .as_arg();

                                if let Some(arg) = ret.arg {
                                    vec![ret_arg, arg.as_arg()]
                                } else {
                                    vec![ret_arg]
                                }
                            },
                            type_args: Default::default(),
                        }
                        .into(),
                    ),
                    ..ret
                }
                .into()
            }
            _ => {}
        }

        s
    }
}

impl Fold<Function> for CaseHandler<'_> {
    #[inline(always)]
    fn fold(&mut self, f: Function) -> Function {
        f
    }
}

impl Fold<ArrowExpr> for CaseHandler<'_> {
    #[inline(always)]
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        f
    }
}
