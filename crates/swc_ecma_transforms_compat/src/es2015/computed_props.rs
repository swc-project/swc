use serde::Deserialize;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

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
#[tracing::instrument(level = "info", skip_all)]
pub fn computed_properties(c: Config) -> impl Fold {
    as_folder(ComputedProps {
        c,
        ..Default::default()
    })
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub loose: bool,
}

#[derive(Default)]
struct ComputedProps {
    vars: Vec<VarDeclarator>,
    used_define_enum_props: bool,
    c: Config,
}

#[swc_trace]
impl VisitMut for ComputedProps {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Object(ObjectLit { props, span }) = expr {
            if !is_complex(props) {
                return;
            }

            let mark = Mark::fresh(Mark::root());
            let obj_ident = quote_ident!(span.apply_mark(mark), "_obj");

            let mut exprs = Vec::with_capacity(props.len() + 2);
            let mutator_map = quote_ident!(span.apply_mark(mark), "_mutatorMap");

            // Optimization
            let obj_props = {
                let idx = props.iter().position(is_complex).unwrap_or(0);

                props.drain(0..idx).collect()
            };

            let props_cnt = props.len();

            self.used_define_enum_props = props.iter().any(
                |pp| matches!(*pp, PropOrSpread::Prop(ref p) if p.is_getter() || p.is_setter()),
            );

            exprs.push(
                if !self.c.loose && props_cnt == 1 && !self.used_define_enum_props {
                    Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: obj_props,
                    }))
                } else {
                    Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(obj_ident.clone().into()),
                        op: op!("="),
                        right: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: obj_props,
                        })),
                    }))
                },
            );

            let mut single_cnt_prop = None;

            for prop in props.drain(..) {
                let span = prop.span();

                let ((key, is_compute), value) = match prop {
                    PropOrSpread::Prop(prop) => match *prop {
                        Prop::Shorthand(ident) => (
                            (
                                if self.c.loose {
                                    Expr::Ident(ident.clone())
                                } else {
                                    Expr::Lit(Lit::Str(Str {
                                        span: ident.span,
                                        raw: None,
                                        value: ident.sym.clone(),
                                    }))
                                },
                                false,
                            ),
                            Expr::Ident(ident),
                        ),
                        Prop::KeyValue(KeyValueProp { key, value }) => {
                            (prop_name_to_expr(key, self.c.loose), *value)
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
                                        params: vec![(*param).into()],
                                        decorators: Default::default(),
                                        type_params: Default::default(),
                                        return_type: Default::default(),
                                    },
                                ),
                                _ => unreachable!(),
                            };

                            // mutator[f]
                            let mutator_elem = mutator_map
                                .clone()
                                .computed_member(prop_name_to_expr(key, false).0);

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
                                    mutator_elem.make_member(quote_ident!(gs_prop_name.unwrap())),
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
                            prop_name_to_expr(key, self.c.loose),
                            Expr::Fn(FnExpr {
                                ident: None,
                                function,
                            }),
                        ),
                    },
                    PropOrSpread::Spread(..) => unimplemented!("computed spread property"),
                };

                if !self.c.loose && props_cnt == 1 {
                    single_cnt_prop = Some(Expr::Call(CallExpr {
                        span,
                        callee: helper!(define_property, "defineProperty"),
                        args: vec![exprs.pop().unwrap().as_arg(), key.as_arg(), value.as_arg()],
                        type_args: Default::default(),
                    }));
                    break;
                }
                exprs.push(if self.c.loose {
                    let left = if is_compute {
                        obj_ident.clone().computed_member(key)
                    } else {
                        obj_ident.clone().make_member(key.ident().unwrap())
                    };
                    Box::new(Expr::Assign(AssignExpr {
                        span,
                        op: op!("="),
                        left: PatOrExpr::Expr(Box::new(left)),
                        right: value.into(),
                    }))
                } else {
                    Box::new(Expr::Call(CallExpr {
                        span,
                        callee: helper!(define_property, "defineProperty"),
                        args: vec![obj_ident.clone().as_arg(), key.as_arg(), value.as_arg()],
                        type_args: Default::default(),
                    }))
                });
            }

            if let Some(single_expr) = single_cnt_prop {
                *expr = single_expr;
                return;
            }

            self.vars.push(VarDeclarator {
                span: *span,
                name: obj_ident.clone().into(),
                init: None,
                definite: false,
            });
            if self.used_define_enum_props {
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: mutator_map.clone().into(),
                    init: Some(Box::new(Expr::Object(ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    }))),
                    definite: false,
                });
                exprs.push(Box::new(Expr::Call(CallExpr {
                    span: *span,
                    callee: helper!(define_enumerable_properties, "defineEnumerableProperties"),
                    args: vec![obj_ident.clone().as_arg(), mutator_map.as_arg()],
                    type_args: Default::default(),
                })));
            }

            // Last value
            exprs.push(Box::new(Expr::Ident(obj_ident)));
            *expr = Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs,
            });
        };
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
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

    fn visit_prop_name(&mut self, pn: &PropName) {
        if let PropName::Computed(..) = *pn {
            self.found = true
        }
    }
}

#[swc_trace]
impl ComputedProps {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitWith<ShouldWork> + VisitMutWith<Self>,
        Vec<T>: VisitWith<ShouldWork>,
    {
        let mut stmts_updated = Vec::with_capacity(stmts.len());

        for mut stmt in stmts.drain(..) {
            if !contains_computed_expr(&stmt) {
                stmts_updated.push(stmt);
                continue;
            }

            let mut folder = Self {
                c: self.c,
                ..Default::default()
            };

            stmt.visit_mut_with(&mut folder);

            // Add variable declaration
            // e.g. var ref
            if !folder.vars.is_empty() {
                stmts_updated.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: folder.vars,
                    declare: false,
                }))));
            }

            stmts_updated.push(stmt);
        }

        *stmts = stmts_updated;
    }
}

fn prop_name_to_expr(p: PropName, loose: bool) -> (Expr, bool) {
    match p {
        PropName::Ident(i) => (
            if loose {
                Expr::Ident(i)
            } else {
                Expr::Lit(Lit::Str(Str {
                    raw: None,
                    value: i.sym,
                    span: i.span,
                }))
            },
            false,
        ),
        PropName::Str(s) => (Expr::Lit(Lit::Str(s)), true),
        PropName::Num(n) => (Expr::Lit(Lit::Num(n)), true),
        PropName::BigInt(b) => (Expr::Lit(Lit::BigInt(b)), true),
        PropName::Computed(c) => (*c.expr, true),
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

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_prop_name(&mut self, node: &PropName) {
        if let PropName::Computed(_) = *node {
            self.found = true
        }
    }
}
