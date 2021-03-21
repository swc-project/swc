use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn computed_properties() -> impl Fold {
    ComputedProps
}

struct ComputedProps;

#[derive(Default)]
struct ObjectLitFolder {
    vars: Vec<VarDeclarator>,
    used_define_enum_props: bool,
}

impl Fold for ObjectLitFolder {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Object(ObjectLit { mut props, span }) => {
                if !is_complex(&props) {
                    return Expr::Object(ObjectLit { span, props });
                }

                let mark = Mark::fresh(Mark::root());
                let obj_ident = quote_ident!(span.apply_mark(mark), "_obj");

                let mut exprs = Vec::with_capacity(props.len() + 2);
                let mutator_map = quote_ident!(span.apply_mark(mark), "_mutatorMap");

                // Optimization
                let obj_props = {
                    let idx = props.iter().position(|v| is_complex(v)).unwrap_or(0);

                    props.drain(0..idx).collect()
                };

                let props_cnt = props.len();

                exprs.push(if props_cnt == 1 {
                    Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: obj_props,
                    }))
                } else {
                    Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(obj_ident.clone().into()))),
                        op: op!("="),
                        right: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: obj_props,
                        })),
                    }))
                });

                for prop in props {
                    let span = prop.span();

                    let (key, value) = match prop {
                        PropOrSpread::Prop(prop) => match *prop {
                            Prop::Shorthand(ident) => (
                                Expr::Lit(Lit::Str(Str {
                                    span: ident.span,
                                    value: ident.sym.clone(),
                                    has_escape: false,
                                    kind: Default::default(),
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
                                    Prop::Getter(GetterProp {
                                        span,
                                        body,
                                        key,
                                        type_ann,
                                    }) => (
                                        key,
                                        Function {
                                            span,
                                            body,
                                            is_async: false,
                                            is_generator: false,
                                            params: vec![],
                                            decorators: Default::default(),
                                            type_params: Default::default(),
                                            return_type: type_ann,
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
                                            params: vec![Param {
                                                span: DUMMY_SP,
                                                decorators: Default::default(),
                                                pat: param,
                                            }],
                                            decorators: Default::default(),
                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                        },
                                    ),
                                    _ => unreachable!(),
                                };

                                // mutator[f]
                                let mutator_elem =
                                    mutator_map.clone().computed_member(prop_name_to_expr(key));

                                // mutator[f] = mutator[f] || {}
                                exprs.push(Box::new(Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(Box::new(mutator_elem.clone())),
                                    op: op!("="),
                                    right: Box::new(Expr::Bin(BinExpr {
                                        span,
                                        left: Box::new(mutator_elem.clone()),
                                        op: op!("||"),
                                        right: Box::new(Expr::Object(ObjectLit {
                                            span,
                                            props: vec![],
                                        })),
                                    })),
                                })));

                                // mutator[f].get = function(){}
                                exprs.push(Box::new(Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(Box::new(
                                        mutator_elem
                                            .make_member(quote_ident!(gs_prop_name.unwrap())),
                                    )),
                                    op: op!("="),
                                    right: Box::new(Expr::Fn(FnExpr {
                                        ident: None,
                                        function,
                                    })),
                                })));

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
                            callee: helper!(define_property, "defineProperty"),
                            args: vec![exprs.pop().unwrap().as_arg(), key.as_arg(), value.as_arg()],
                            type_args: Default::default(),
                        });
                    }
                    exprs.push(Box::new(Expr::Call(CallExpr {
                        span,
                        callee: helper!(define_property, "defineProperty"),
                        args: vec![obj_ident.clone().as_arg(), key.as_arg(), value.as_arg()],
                        type_args: Default::default(),
                    })));
                }

                self.vars.push(VarDeclarator {
                    span,
                    name: Pat::Ident(obj_ident.clone().into()),
                    init: None,
                    definite: false,
                });
                if self.used_define_enum_props {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(mutator_map.clone().into()),
                        init: Some(Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        }))),
                        definite: false,
                    });
                    exprs.push(Box::new(Expr::Call(CallExpr {
                        span,
                        callee: helper!(define_enumerable_properties, "defineEnumerableProperties"),
                        args: vec![obj_ident.clone().as_arg(), mutator_map.as_arg()],
                        type_args: Default::default(),
                    })));
                }

                // Last value
                exprs.push(Box::new(Expr::Ident(obj_ident)));
                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                })
            }

            _ => expr,
        }
    }
}

fn is_complex<T: VisitWith<ComplexVisitor>>(node: &T) -> bool {
    let mut visitor = ComplexVisitor::default();
    node.visit_children_with(&mut visitor);
    visitor.found
}

#[derive(Default)]
struct ComplexVisitor {
    found: bool,
}

impl Visit for ComplexVisitor {
    noop_visit_type!();

    fn visit_prop_name(&mut self, pn: &PropName, _: &dyn Node) {
        match *pn {
            PropName::Computed(..) => self.found = true,
            _ => {}
        }
    }
}

impl Fold for ComputedProps {
    noop_fold_type!();

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl ComputedProps {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + VisitWith<ShouldWork> + FoldWith<Self> + FoldWith<ObjectLitFolder>,
        Vec<T>: VisitWith<ShouldWork>,
    {
        // Fast path when there's no computed properties.
        if !contains_computed_expr(&stmts) {
            return stmts;
        }

        // let stmts = stmts.fold_children_with(self);
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            if !contains_computed_expr(&stmt) {
                buf.push(stmt);
                continue;
            }

            let mut folder = ObjectLitFolder::default();
            let stmt = stmt.fold_with(&mut folder);

            // Add variable declaration
            // e.g. var ref
            if !folder.vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: folder.vars,
                    declare: false,
                }))));
            }

            buf.push(stmt);
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
            kind: Default::default(),
        })),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b)),
        PropName::Computed(c) => *c.expr,
    }
}

fn contains_computed_expr<N>(node: &N) -> bool
where
    N: VisitWith<ShouldWork>,
{
    let mut v = ShouldWork { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_prop_name(&mut self, node: &PropName, _: &dyn Node) {
        match *node {
            PropName::Computed(_) => self.found = true,
            _ => {}
        }
    }
}
