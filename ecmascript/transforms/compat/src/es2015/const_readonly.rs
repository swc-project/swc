use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// # Example
///
/// # In
///
/// ```js
/// const a = 32;
/// a = 4
///
/// const b = [1, 2, 3];
/// b[0] = 5;
/// ```
///
/// ## Out
///
/// ```js
/// function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }
///
/// var a = 32;
/// 4, _readOnlyError("a#1");
///
/// var b = [1, 2, 3];
/// 5, _readOnlyError("b#1");
/// ```
pub fn check_constants() -> impl Fold + VisitMut {
    as_folder(Consts::default())
}

fn find_lhs_id(lhs: &PatOrExpr) -> Option<Ident> {
    fn find_lhs_id_from_expr(lhs: &Expr) -> Option<Ident> {
        match lhs {
            Expr::Member(m) => {
                let obj = match &m.obj {
                    ExprOrSuper::Super(_) => return None,
                    ExprOrSuper::Expr(obj) => &**obj,
                };
                match obj {
                    Expr::Ident(i) => Some(i.clone()),
                    Expr::Member(..) => find_lhs_id_from_expr(&obj),
                    _ => None,
                }
            }
            _ => None,
        }
    }

    match lhs {
        PatOrExpr::Expr(e) => find_lhs_id_from_expr(&e),
        PatOrExpr::Pat(pat) => match &**pat {
            Pat::Expr(e) => find_lhs_id_from_expr(&e),
            Pat::Ident(BindingIdent { id, type_ann: _ }) => Some(id.clone()),
            _ => None,
        },
    }
}

#[derive(Debug, Default)]
struct Consts {
    consts: Vec<VarDeclarator>,
}

impl VisitMut for Consts {
    noop_visit_mut_type!();

    // Handle const declaration not having a initializer
    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        decl.visit_mut_children_with(self);

        match decl.kind {
            VarDeclKind::Const => {
                for d in decl.decls.iter() {
                    self.consts.push(d.clone());
                }
            }
            _ => {}
        }
    }

    // TODO
    fn visit_mut_var_decl_or_expr(&mut self, decl: &mut VarDeclOrExpr) {
        decl.visit_mut_children_with(self);
        // println!("--> {:#?}", decl);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);
        // println!("--> {:#?}", e);

        match e {
            Expr::Assign(AssignExpr {
                span,
                op: _,
                left,
                right,
            }) => {
                match find_lhs_id(left) {
                    Some(ident) => {
                        let consts = self.consts.clone();
                        let const_idx = consts
                            .into_iter()
                            .find(|i| i.name.clone().expect_ident().id.sym == ident.sym);
                        match const_idx {
                            Some(..) => {
                                let mut exprs: Vec<Box<Expr>> = vec![];
                                let mut args = vec![];
                                args.push(ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: ident.to_string().into(),
                                        has_escape: false,
                                        kind: Default::default(),
                                    }))),
                                });
                                exprs.push(right.clone());
                                exprs.push(Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: helper!(*span, read_only_error, "readOnlyError"),
                                    args,
                                    type_args: Default::default(),
                                })));
                                *e = Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs,
                                });
                                ()
                            }
                            None => {}
                        };
                    }
                    None => {}
                };
            }
            _ => {}
        }
    }
}
