use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::sync::Arc;
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
///
/// TODO(kdy1): cache reference like (_f = f, mutatorMap[_f].get = function(){})
///     instead of (mutatorMap[f].get = function(){}
pub fn computed_properties(helpers: Arc<Helpers>) -> impl Pass + Clone {
    ComputedProps { helpers }
}

#[derive(Default, Clone)]
struct ComputedProps {
    helpers: Arc<Helpers>,
}

#[derive(Default)]
struct ObjectLitFolder {
    vars: Vec<VarDeclarator>,
    used_define_enum_props: bool,
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
                let mutator_map = quote_ident!(span.apply_mark(mark), "_mutatorMap");

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
                            prop @ Prop::Getter(GetterProp { .. })
                            | prop @ Prop::Setter(SetterProp { .. }) => {
                                self.used_define_enum_props = true;

                                // getter/setter property name
                                let gs_prop_name = match prop {
                                    Prop::Getter(..) => Some("get"),
                                    Prop::Setter(..) => Some("set"),
                                    _ => None,
                                };
                                let (key, function) = match prop {
                                    Prop::Getter(GetterProp { span, body, key }) => (
                                        key,
                                        Function {
                                            span,
                                            body,
                                            is_async: false,
                                            is_generator: false,
                                            params: vec![],
                                            decorators: Default::default(),
                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                        },
                                    ),
                                    Prop::Setter(SetterProp {
                                        span,
                                        body,
                                        param,
                                        key,
                                    }) => (
                                        key,
                                        Function {
                                            span,
                                            body,
                                            is_async: false,
                                            is_generator: false,
                                            params: vec![param],
                                            decorators: Default::default(),
                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                        },
                                    ),
                                    _ => unreachable!(),
                                };

                                // mutator[f]
                                let mutator_elem =
                                    mutator_map.clone().member(prop_name_to_expr(key));

                                // mutator[f] = mutator[f] || {}
                                exprs.push(box Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(box mutator_elem.clone()),
                                    op: op!("="),
                                    right: box Expr::Bin(BinExpr {
                                        span,
                                        left: box mutator_elem.clone(),
                                        op: op!("||"),
                                        right: box Expr::Object(ObjectLit {
                                            span,
                                            props: vec![],
                                        }),
                                    }),
                                }));

                                // mutator[f].get = function(){}
                                exprs.push(box Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(
                                        box mutator_elem
                                            .member(quote_ident!(gs_prop_name.unwrap())),
                                    ),
                                    op: op!("="),
                                    right: box Expr::Fn(FnExpr {
                                        ident: None,
                                        function,
                                    }),
                                }));

                                continue;
                                // unimplemented!("getter /setter property")
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
                            type_args: Default::default(),
                        });
                    }
                    exprs.push(box Expr::Call(CallExpr {
                        span,
                        callee: quote_ident!("_defineProperty").as_callee(),
                        args: vec![obj_ident.clone().as_arg(), key.as_arg(), value.as_arg()],
                        type_args: Default::default(),
                    }));
                }

                self.vars.push(VarDeclarator {
                    span,
                    name: Pat::Ident(obj_ident.clone()),
                    init: None,
                    definite: false,
                });
                if self.used_define_enum_props {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(mutator_map.clone()),
                        init: Some(box Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        })),
                        definite: false,
                    });
                    exprs.push(box Expr::Call(CallExpr {
                        span,
                        callee: quote_ident!("_defineEnumerableProperties").as_callee(),
                        args: vec![obj_ident.clone().as_arg(), mutator_map.as_arg()],
                        type_args: Default::default(),
                    }));
                }

                // Last value
                exprs.push(box Expr::Ident(obj_ident.clone()));
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

impl<T: StmtLike + VisitWith<ShouldWork>> Fold<Vec<T>> for ComputedProps
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        // Fast path when there's no computed properties.
        if !contains_computed_expr(&stmts) {
            return stmts;
        }

        let stmts = stmts.fold_children(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = ObjectLitFolder::default();
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.vars.is_empty() {
                        self.helpers.define_property();
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                            declare: false,
                        }))));
                    }
                    if folder.used_define_enum_props {
                        self.helpers.define_enumerable_properties();
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

fn contains_computed_expr<N>(node: &N) -> bool
where
    N: VisitWith<ShouldWork>,
{
    let mut v = ShouldWork { found: false };
    node.visit_with(&mut v);
    v.found
}

struct ShouldWork {
    found: bool,
}

impl Visit<PropName> for ShouldWork {
    fn visit(&mut self, node: &PropName) {
        match *node {
            PropName::Computed(_) => self.found = true,
            _ => {}
        }
    }
}
