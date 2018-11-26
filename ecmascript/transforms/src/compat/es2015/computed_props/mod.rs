use ast::*;
use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Mark, Spanned, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-computed-properties`
///
/// # Example
/// ## In
///
/// ```js
/// var obj = {
///   ["x" + foo]: "heh",
///   ["y" + bar]: "noo",
///   foo: "foo",
///   bar: "bar"
/// };
/// ```
///
/// ## Out
///
/// ```js
/// var _obj;
///
/// var obj = (
///   _obj = {},
///   _defineProperty(_obj, "x" + foo, "heh"),
///   _defineProperty(_obj, "y" + bar, "noo"),
///   _defineProperty(_obj, "foo", "foo"),
///   _defineProperty(_obj, "bar", "bar"),
///   _obj
/// );
/// ```
pub fn computed_properties(helpers: Arc<Helpers>) -> impl Fold<Module> {
    ComputedProps { helpers }
}

#[derive(Default)]
struct ComputedProps {
    helpers: Arc<Helpers>,
}

#[derive(Debug, Default)]
struct ObjectLitFolder {
    vars: Vec<VarDeclarator>,
}

impl Fold<Expr> for ObjectLitFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Object(ObjectLit { props, span }) => {
                if !is_complex(&props) {
                    return Expr::Object(ObjectLit { span, props });
                }

                let mark = Mark::fresh(Mark::root());
                let obj_ident = quote_ident!(span.apply_mark(mark), "_obj");

                let mut exprs = Vec::with_capacity(props.len() + 2);

                exprs.push(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(box Pat::Ident(obj_ident.clone())),
                    op: op!("="),
                    right: box Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    }),
                }));

                let props_cnt = props.len();

                for prop in props {
                    let span = prop.span();

                    let (key, value) = match prop {
                        PropOrSpread::Prop(box prop) => match prop {
                            Prop::Shorthand(ident) => (
                                Expr::Lit(Lit::Str(Str {
                                    span: ident.span,
                                    value: ident.sym.clone(),
                                    has_escape: false,
                                })),
                                Expr::Ident(ident),
                            ),
                            Prop::KeyValue(KeyValueProp { key, value }) => {
                                (prop_name_to_expr(key), *value)
                            }
                            Prop::Assign(..) => {
                                unreachable!("assign property in object literal is invalid")
                            }
                            Prop::Getter(GetterProp { key, body, .. }) => {
                                unimplemented!("getter property")
                            }
                            Prop::Setter(SetterProp { key, body, .. }) => {
                                unimplemented!("setter property")
                            }
                            Prop::Method(MethodProp { key, function }) => (
                                prop_name_to_expr(key),
                                Expr::Fn(FnExpr {
                                    ident: None,
                                    function,
                                }),
                            ),
                        },
                        PropOrSpread::Spread(..) => unimplemented!("computed spread property"),
                    };

                    if props_cnt == 1 {
                        return Expr::Call(CallExpr {
                            span,
                            callee: quote_ident!("_defineProperty").as_callee(),
                            args: vec![
                                ObjectLit {
                                    span,
                                    props: vec![],
                                }
                                .as_arg(),
                                key.as_arg(),
                                value.as_arg(),
                            ],
                        });;
                    }
                    exprs.push(box Expr::Call(CallExpr {
                        span,
                        callee: quote_ident!("_defineProperty").as_callee(),
                        args: vec![obj_ident.clone().as_arg(), key.as_arg(), value.as_arg()],
                    }));
                }

                exprs.push(box Expr::Ident(obj_ident.clone()));

                self.vars.push(VarDeclarator {
                    span,
                    name: Pat::Ident(obj_ident),
                    init: None,
                });

                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                })
            }
            _ => expr,
        }
    }
}

fn is_complex(props: &[PropOrSpread]) -> bool {
    #[derive(Default)]
    struct Visitor {
        found: bool,
    }

    impl Visit<PropName> for Visitor {
        fn visit(&mut self, pn: &PropName) {
            match *pn {
                PropName::Computed(..) => self.found = true,
                _ => {}
            }
        }
    }

    let mut visitor = Visitor::default();
    props.visit_children(&mut visitor);
    visitor.found
}

impl<T: StmtLike> Fold<Vec<T>> for ComputedProps
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = ObjectLitFolder::default();
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        self.helpers.define_property.store(true, Ordering::SeqCst);
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}

fn prop_name_to_expr(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Lit(Lit::Str(Str {
            value: i.sym,
            span: i.span,
            has_escape: false,
        })),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::Computed(expr) => *expr,
    }
}
