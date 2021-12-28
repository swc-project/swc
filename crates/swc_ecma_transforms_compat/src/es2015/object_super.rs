use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory, StmtLike, UsageFinder};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

struct ObjectSuper {
    extra_var: Vec<Ident>,
}
pub fn object_super() -> impl Fold + VisitMut {
    as_folder(ObjectSuper {
        extra_var: Vec::new(),
    })
}
// struct AddVarDecl;
// impl VisitMut for AddVarDecl{
//     noop_visit_mut_type!();
//     fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
//         self.visit_mut_stmt_like(n);
//     }

//     fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
//         self.visit_mut_stmt_like(n);
//     }
// }
// impl AddVarDecl{
//     fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
//     where
//         T: StmtLike + VisitMutWith<ObjectSuper>,
//         Vec<T>: VisitMutWith<Self>,
//     {

//     }
// }
impl VisitMut for ObjectSuper {
    noop_visit_mut_type!();
    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);
        if self.extra_var.len() != 0 {
            n.insert(
                0,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .extra_var
                        .take()
                        .into_iter()
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(v.into()),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                }))),
            );
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        n.visit_mut_children_with(self);
        if self.extra_var.len() != 0 {
            n.insert(
                0,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .extra_var
                        .take()
                        .into_iter()
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(v.into()),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                })),
            );
        }
    }
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);
        if let Expr::Object(ObjectLit { span, props }) = expr {
            let obj_ref = private_ident!("_obj");
            let mut replacer = SuperReplacer {
                obj: &obj_ref,
                processed: false,
            };
            for prop_or_spread in props.iter_mut() {
                if let PropOrSpread::Prop(ref mut prop) = prop_or_spread {
                    match &mut **prop {
                        Prop::Method(_) => {}
                        _ => {
                            prop.visit_mut_with(&mut replacer);
                        }
                    }
                }
            }
            if replacer.processed {
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: PatOrExpr::Expr(Box::new(Expr::Ident(obj_ref.clone()))),
                    right: Box::new(expr.take()),
                });
                self.extra_var.push(obj_ref)
            }
        }
    }
}

struct SuperReplacer<'a> {
    obj: &'a Ident,
    processed: bool,
}
impl SuperReplacer<'_> {
    fn get_proto(&self) -> ExprOrSpread {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(get_prototype_of, "getPrototypeOf"),
            args: vec![self.obj.clone().as_arg()],
            type_args: Default::default(),
        })
        .as_arg()
    }
}
impl VisitMut for SuperReplacer<'_> {
    noop_visit_mut_type!();
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Super(..),
                prop,
                computed,
                ..
            }) => {
                *expr = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(set, "get"),
                    args: vec![
                        self.get_proto(),
                        if *computed {
                            prop.take().as_arg()
                        } else {
                            match *prop.take() {
                                Expr::Ident(Ident { sym, span, .. }) => Expr::Lit(Lit::Str(Str {
                                    span,
                                    value: sym,
                                    has_escape: false,
                                    kind: Default::default(),
                                }))
                                .as_arg(),
                                _ => unreachable!(),
                            }
                        },
                        Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                    ],
                    type_args: Default::default(),
                });
                self.processed = true;
            }
            Expr::Assign(AssignExpr {
                span,
                op: op!("="),
                left,
                right,
            }) => {
                let left = left.take().normalize_expr();
                match left {
                    PatOrExpr::Expr(mut left_expr) => match *left_expr {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Super(..),
                            prop,
                            computed,
                            ..
                        }) => {
                            *expr = Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(set, "set"),
                                args: vec![
                                    self.get_proto(),
                                    if computed {
                                        prop.as_arg()
                                    } else {
                                        match *prop {
                                            Expr::Ident(Ident { sym, span, .. }) => {
                                                Expr::Lit(Lit::Str(Str {
                                                    span,
                                                    value: sym,
                                                    has_escape: false,
                                                    kind: Default::default(),
                                                }))
                                                .as_arg()
                                            }
                                            _ => unreachable!(),
                                        }
                                    },
                                    right.take().as_arg(),
                                    Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                                    Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    }))
                                    .as_arg(),
                                ],
                                type_args: Default::default(),
                            });
                            self.processed = true;
                        }
                        _ => {
                            *expr = Expr::Assign(AssignExpr {
                                span: *span,
                                left: PatOrExpr::Expr(left_expr),
                                op: op!("="),
                                right: right.take(),
                            });
                        }
                    },
                    _ => {
                        *expr = Expr::Assign(AssignExpr {
                            span: *span,
                            left,
                            op: op!("="),
                            right: right.take(),
                        });
                    }
                }
            }
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }
    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        // super.y(1,2,3) to
        // _get(_getPrototypeOf(_obj), "y", this).call(this,1,2,3)
        let tmp = self.processed;
        self.processed = false;
        expr.visit_mut_children_with(self);
        if !self.processed {
            self.processed = tmp;
            return;
        }
        expr.callee = expr
            .callee
            .take()
            .expect_expr()
            .make_member(quote_ident!("call"))
            .as_callee();
        expr.args
            .insert(0, Expr::This(ThisExpr { span: DUMMY_SP }).as_arg());
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::es2015::{function_name, shorthand_property::shorthand};
    use swc_common::{chain, Mark};
    use swc_ecma_transforms_base::resolver::resolver_with_mark;
    use swc_ecma_transforms_testing::test;
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        get,
        "let obj = {
            a(){
                let c = super.x;
            }
        }",
        r#"
        var _obj;
        let obj = _obj = {
            a: function a() {
                let c = _get(_getPrototypeOf(_obj), "x", this);
            }
        };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        call,
        "let obj = {
            a(){
                super.y(1,2,3);
            }
        }",
        r#"var _obj;
        let obj = _obj = {
            a: function a() {
                _get(_getPrototypeOf(_obj), "y", this).call(this,1,2,3);
            }
        };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        set,
        "let obj = {
            a(){
                super.x = 1;
            }
        }",
        r#"
        var _obj;
        let obj = _obj = {
            a: function a() {
                _set(_getPrototypeOf(_obj), "x", 1, this, true);
            }
        };"#
    );
}
