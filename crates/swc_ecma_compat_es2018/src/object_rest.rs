use std::{
    iter,
    mem::{self, replace},
};

use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_compat_common::impl_visit_mut_fn;
use swc_ecma_transforms_base::{helper, helper_expr, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, find_pat_ids, is_literal, private_ident, quote_ident,
    var::VarCollector, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

use super::object_rest_spread::Config;

#[derive(Default)]
pub(super) struct ObjectRest {
    /// Injected before the original statement.
    pub vars: Vec<VarDeclarator>,
    /// Variables which should be declared using `var`
    pub mutable_vars: Vec<VarDeclarator>,
    /// Assignment expressions.
    pub exprs: Vec<Box<Expr>>,
    pub config: Config,
}

macro_rules! impl_for_for_stmt {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, for_stmt: &mut $T) {
            if !contains_rest(for_stmt) {
                return;
            }

            let mut stmt = None;

            let left = match &mut for_stmt.left {
                ForHead::VarDecl(var_decl) => {
                    let ref_ident = private_ident!("_ref");

                    // Unpack variables
                    let mut decls = var_decl
                        .decls
                        .take()
                        .into_iter()
                        .map(|decl| VarDeclarator {
                            name: decl.name,
                            init: Some(Box::new(Expr::Ident(ref_ident.clone()))),
                            ..decl
                        })
                        .collect::<Vec<_>>();

                    // **prepend** decls to self.vars
                    decls.append(&mut self.vars.take());

                    stmt = Some(Stmt::Decl(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Let,
                            decls,
                            ..Default::default()
                        }
                        .into(),
                    ));

                    VarDecl {
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ref_ident.into(),
                            init: None,
                            definite: false,
                        }],
                        ..*var_decl.take()
                    }
                    .into()
                }
                ForHead::Pat(pat) => {
                    let var_ident = private_ident!("_ref");
                    let index = self.vars.len();
                    let pat = pat.take();

                    // initialize (or destructure)
                    match &*pat {
                        Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                        Pat::Object(ObjectPat { .. }) => {
                            stmt = Some(Stmt::Expr(ExprStmt {
                                span: DUMMY_SP,
                                expr: Box::new(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: pat.try_into().unwrap(),
                                        right: Box::new(Expr::Ident(var_ident.clone())),
                                    }
                                    .into(),
                                ),
                            }));
                        }
                        _ => {
                            // insert at index to create
                            // `var { a } = _ref, b = _object_without_properties(_ref, ['a']);`
                            // instead of
                            // var b = _object_without_properties(_ref, ['a']), { a } = _ref;

                            // println!("Var(0): folded pat = var_ident",);
                            self.vars.insert(
                                index,
                                VarDeclarator {
                                    span: DUMMY_SP,
                                    name: *pat,
                                    init: Some(Box::new(Expr::Ident(var_ident.clone()))),
                                    definite: false,
                                },
                            );
                        }
                    }

                    // `var _ref` in `for (var _ref in foo)`
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: var_ident.into(),
                            init: None,
                            definite: false,
                        }],
                        ..Default::default()
                    }
                    .into()
                }

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            };
            for_stmt.left = left;

            for_stmt.body = Box::new(Stmt::Block(match &mut *for_stmt.body {
                Stmt::Block(BlockStmt { span, stmts, ctxt }) => BlockStmt {
                    span: *span,
                    stmts: stmt.into_iter().chain(stmts.take()).collect(),
                    ctxt: *ctxt,
                },
                body => BlockStmt {
                    span: DUMMY_SP,
                    stmts: stmt.into_iter().chain(iter::once(body.take())).collect(),
                    ..Default::default()
                },
            }));

            for_stmt.body.visit_mut_with(self);
        }
    };
}

#[derive(Default)]
struct RestVisitor {
    found: bool,
}

#[swc_trace]
impl Visit for RestVisitor {
    noop_visit_type!(fail);

    fn visit_object_pat_prop(&mut self, prop: &ObjectPatProp) {
        match *prop {
            ObjectPatProp::Rest(..) => self.found = true,
            _ => prop.visit_children_with(self),
        }
    }
}

impl Check for RestVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}

fn contains_rest<N>(node: &N) -> bool
where
    N: VisitWith<RestVisitor>,
{
    let mut v = RestVisitor { found: false };
    node.visit_with(&mut v);
    v.found
}

#[swc_trace]
#[fast_path(RestVisitor)]
impl VisitMut for ObjectRest {
    noop_visit_mut_type!(fail);

    impl_for_for_stmt!(visit_mut_for_in_stmt, ForInStmt);

    impl_for_for_stmt!(visit_mut_for_of_stmt, ForOfStmt);

    impl_visit_mut_fn!();

    /// Handles assign expression
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // fast path
        if !contains_rest(expr) {
            return;
        }

        expr.visit_mut_children_with(self);

        if let Expr::Assign(AssignExpr {
            span,
            left: AssignTarget::Pat(pat),
            op: op!("="),
            right,
        }) = expr
        {
            let mut var_ident = alias_ident_for(right, "_tmp");
            var_ident.ctxt = var_ident.ctxt.apply_mark(Mark::new());

            // println!("Var: var_ident = None");
            self.mutable_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: var_ident.clone().into(),
                init: None,
                definite: false,
            });
            // println!("Expr: var_ident = right");
            self.exprs.push(
                AssignExpr {
                    span: DUMMY_SP,
                    left: var_ident.clone().into(),
                    op: op!("="),
                    right: right.take(),
                }
                .into(),
            );
            let pat = self.fold_rest(
                &mut 0,
                pat.take().into(),
                var_ident.clone().into(),
                true,
                true,
            );

            match pat {
                Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                _ => self.exprs.push(
                    AssignExpr {
                        span: *span,
                        left: pat.try_into().unwrap(),
                        op: op!("="),
                        right: Box::new(var_ident.clone().into()),
                    }
                    .into(),
                ),
            }
            self.exprs.push(Box::new(var_ident.into()));
            *expr = SeqExpr {
                span: DUMMY_SP,
                exprs: mem::take(&mut self.exprs),
            }
            .into();
        };
    }

    /// export var { b, ...c } = asdf2;
    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        if !contains_rest(decl) {
            // fast path
            return;
        }

        match decl {
            ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Var(var_decl),
                ..
            }) if var_decl.decls.iter().any(|v| v.name.is_object()) => {
                let specifiers = {
                    let mut found: Vec<Ident> = Vec::new();
                    let mut finder = VarCollector { to: &mut found };
                    var_decl.visit_with(&mut finder);
                    found
                        .into_iter()
                        .map(|ident| ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig: ident.into(),
                            exported: None,
                            is_type_only: false,
                        })
                        .map(ExportSpecifier::Named)
                        .collect()
                };

                let export = NamedExport {
                    span: *span,
                    specifiers,
                    src: None,
                    type_only: false,
                    with: None,
                };

                var_decl.visit_mut_with(self);
                self.vars.append(&mut var_decl.decls);

                *decl = export.into();
            }
            _ => {
                decl.visit_mut_children_with(self);
            }
        };
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_var_declarators(&mut self, decls: &mut Vec<VarDeclarator>) {
        // fast path
        if !contains_rest(decls) {
            return;
        }

        for mut decl in decls.drain(..) {
            // fast path
            if !contains_rest(&decl) {
                // println!("Var: no rest",);
                self.vars.push(decl);
                continue;
            }

            decl.visit_mut_children_with(self);

            //            if !contains_rest(&decl.name) {
            //                // println!("Var: no rest",);
            //                self.vars.push(decl);
            //                continue;
            //            }

            let (var_ident, _) = match decl.name {
                Pat::Ident(ref i) => (Ident::from(i), false),

                _ => match decl.init {
                    Some(ref e) => alias_if_required(e, "ref"),
                    _ => (private_ident!("_ref"), true),
                },
            };

            let has_init = decl.init.is_some();
            if let Some(init) = decl.init {
                match decl.name {
                    // Optimize { ...props } = this.props
                    Pat::Object(ObjectPat { props, .. })
                        if props.len() == 1 && matches!(props[0], ObjectPatProp::Rest(..)) =>
                    {
                        let prop = match props.into_iter().next().unwrap() {
                            ObjectPatProp::Rest(r) => r,
                            _ => unreachable!(),
                        };

                        self.vars.push(VarDeclarator {
                            span: prop.span(),
                            name: *prop.arg,
                            init: Some(
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: helper!(extends),
                                    args: vec![
                                        ObjectLit {
                                            span: DUMMY_SP,
                                            props: Vec::new(),
                                        }
                                        .as_arg(),
                                        helper_expr!(object_destructuring_empty)
                                            .as_call(DUMMY_SP, vec![init.as_arg()])
                                            .as_arg(),
                                    ],
                                    ..Default::default()
                                }
                                .into(),
                            ),
                            definite: false,
                        });
                        continue;
                    }
                    _ => {}
                }

                match *init {
                    // skip `z = z`
                    Expr::Ident(..) => {}
                    _ => {
                        // println!("Var: var_ident = init",);
                        self.push_var_if_not_empty(VarDeclarator {
                            span: DUMMY_SP,
                            name: var_ident.clone().into(),
                            init: Some(init),
                            definite: false,
                        });
                    }
                }
            }

            let mut index = self.vars.len();
            let mut pat =
                self.fold_rest(&mut index, decl.name, var_ident.clone().into(), false, true);
            match pat {
                // skip `{} = z`
                Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}

                _ => {
                    // insert at index to create
                    // `var { a } = _ref, b = _object_without_properties(_ref, ['a']);`
                    // instead of
                    // `var b = _object_without_properties(_ref, ['a']), { a } = _ref;`
                    // println!("var: simplified pat = var_ident({:?})", var_ident);

                    pat.visit_mut_with(&mut PatSimplifier);

                    self.insert_var_if_not_empty(
                        index,
                        VarDeclarator {
                            name: pat,
                            // preserve
                            init: if has_init {
                                Some(var_ident.clone().into())
                            } else {
                                None
                            },
                            ..decl
                        },
                    )
                }
            }
        }

        *decls = mem::take(&mut self.vars);
    }
}

#[swc_trace]
impl ObjectRest {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitWith<RestVisitor> + VisitMutWith<ObjectRest>,
        Vec<T>: VisitMutWith<Self> + VisitWith<RestVisitor>,
    {
        if !contains_rest(stmts) {
            return;
        }

        let mut buf = Vec::with_capacity(stmts.len());

        for mut stmt in stmts.drain(..) {
            let mut folder = ObjectRest {
                config: self.config,
                ..Default::default()
            };
            stmt.visit_mut_with(&mut folder);

            // Add variable declaration
            // e.g. var ref
            if !folder.mutable_vars.is_empty() {
                buf.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: folder.mutable_vars,
                        ..Default::default()
                    }
                    .into(),
                ));
            }

            if !folder.vars.is_empty() {
                buf.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: folder.vars,
                        ..Default::default()
                    }
                    .into(),
                ));
            }

            buf.push(stmt);

            buf.extend(folder.exprs.into_iter().map(|v| v.into_stmt()).map(T::from));
        }

        *stmts = buf;
    }
}

impl ObjectRest {
    fn insert_var_if_not_empty(&mut self, idx: usize, mut decl: VarDeclarator) {
        if let Some(e1) = decl.init {
            if let Expr::Ident(ref i1) = *e1 {
                if let Pat::Ident(ref i2) = decl.name {
                    if i1.to_id() == i2.to_id() {
                        return;
                    }
                }
            }
            decl.init = Some(e1);
        }

        if let Pat::Object(..) | Pat::Array(..) = decl.name {
            let ids: Vec<Id> = find_pat_ids(&decl.name);
            if ids.is_empty() {
                return;
            }
        }
        self.vars.insert(idx, decl)
    }

    fn push_var_if_not_empty(&mut self, mut decl: VarDeclarator) {
        if let Some(e1) = decl.init {
            if let Expr::Ident(ref i1) = *e1 {
                if let Pat::Ident(ref i2) = decl.name {
                    if i1.sym == i2.sym && i1.ctxt == i2.ctxt {
                        return;
                    }
                }
            }
            decl.init = Some(e1);
        }

        if let Pat::Object(ObjectPat { ref props, .. }) = decl.name {
            if props.is_empty() {
                return;
            }
        }
        self.vars.push(decl)
    }

    fn visit_mut_fn_like(
        &mut self,
        params: &mut Vec<Param>,
        body: &mut BlockStmt,
    ) -> (Vec<Param>, BlockStmt) {
        if !contains_rest(params) {
            // fast-path
            return (params.take(), body.take());
        }

        let prev_state = replace(
            self,
            Self {
                config: self.config,
                ..Default::default()
            },
        );

        let params = params
            .drain(..)
            .map(|mut param| {
                let var_ident = private_ident!(param.span(), "_param");
                let mut index = self.vars.len();
                param.pat =
                    self.fold_rest(&mut index, param.pat, var_ident.clone().into(), false, true);

                match param.pat {
                    Pat::Rest(..) | Pat::Ident(..) => param,
                    Pat::Assign(AssignPat { ref left, .. })
                        if left.is_ident() || left.is_rest() || left.is_array() =>
                    {
                        param
                    }
                    Pat::Assign(n) => {
                        let AssignPat {
                            span, left, right, ..
                        } = n;
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span,
                                name: *left,
                                init: Some(var_ident.clone().into()),
                                definite: false,
                            },
                        );
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: AssignPat {
                                span,
                                left: var_ident.into(),
                                right,
                            }
                            .into(),
                        }
                    }
                    _ => {
                        // initialize snd destructure
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span: DUMMY_SP,
                                name: param.pat,
                                init: Some(var_ident.clone().into()),
                                definite: false,
                            },
                        );
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: var_ident.into(),
                        }
                    }
                }
            })
            .collect();

        let ret = (
            params,
            BlockStmt {
                stmts: if self.vars.is_empty() {
                    None
                } else {
                    Some(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: mem::take(&mut self.vars),
                            ..Default::default()
                        }
                        .into(),
                    )
                }
                .into_iter()
                .chain(body.stmts.take())
                .collect(),
                ..body.take()
            },
        );

        *self = prev_state;

        ret
    }

    fn fold_rest(
        &mut self,
        index: &mut usize,
        pat: Pat,
        obj: Box<Expr>,
        use_expr_for_assign: bool,
        use_member_for_array: bool,
    ) -> Pat {
        // TODO(kdy1): Optimize when all fields are statically known.
        //
        // const { a: { ...bar }, b: { ...baz }, ...foo } = obj;
        //
        // can be
        //
        // const bar = _extends({}, obj.a), baz = _extends({}, obj.b), foo =
        // _extends({}, obj);

        if pat.is_ident() {
            // panic!()
        }

        let ObjectPat {
            span,
            props,
            type_ann,
            ..
        } = match pat {
            Pat::Object(pat) => pat,
            Pat::Assign(n) => {
                let AssignPat {
                    span, left, right, ..
                } = n;
                let left = Box::new(self.fold_rest(
                    index,
                    *left,
                    obj,
                    use_expr_for_assign,
                    use_member_for_array,
                ));
                return AssignPat { span, left, right }.into();
            }
            Pat::Array(n) => {
                let ArrayPat { span, elems, .. } = n;
                let elems = elems
                    .into_iter()
                    .enumerate()
                    .map(|(i, elem)| {
                        elem.map(|elem| {
                            self.fold_rest(
                                index,
                                elem,
                                if use_member_for_array {
                                    obj.clone().computed_member(i as f64).into()
                                } else {
                                    obj.clone()
                                },
                                use_expr_for_assign,
                                use_member_for_array,
                            )
                        })
                    })
                    .collect();

                return ArrayPat { span, elems, ..n }.into();
            }
            _ => return pat,
        };

        let mut props: Vec<ObjectPatProp> = props
            .into_iter()
            .map(|prop| match prop {
                ObjectPatProp::Rest(n) => {
                    let RestPat {
                        arg, dot3_token, ..
                    } = n;

                    let pat = self.fold_rest(
                        index,
                        *arg,
                        // TODO: fix this. this is wrong
                        obj.clone(),
                        use_expr_for_assign,
                        true,
                    );
                    ObjectPatProp::Rest(RestPat {
                        dot3_token,
                        arg: Box::new(pat),
                        ..n
                    })
                }
                ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                    let (key, prop) = match key {
                        PropName::Ident(ref ident) => {
                            let ident = ident.clone();
                            (key, MemberProp::Ident(ident))
                        }
                        PropName::Str(Str {
                            ref value, span, ..
                        }) => {
                            let value = value.clone();
                            (key, MemberProp::Ident(IdentName::new(value, span)))
                        }
                        PropName::Num(Number { span, value, .. }) => (
                            key,
                            MemberProp::Computed(ComputedPropName {
                                span,
                                expr: Lit::Str(Str {
                                    span,
                                    raw: None,
                                    value: format!("{}", value).into(),
                                })
                                .into(),
                            }),
                        ),
                        PropName::BigInt(BigInt {
                            span, ref value, ..
                        }) => {
                            let value = value.clone();
                            (
                                key,
                                MemberProp::Computed(ComputedPropName {
                                    span,
                                    expr: Lit::Str(Str {
                                        span,
                                        raw: None,
                                        value: format!("{}", value).into(),
                                    })
                                    .into(),
                                }),
                            )
                        }
                        PropName::Computed(ref c) if is_literal(&c.expr) => {
                            let c = c.clone();
                            (key, MemberProp::Computed(c))
                        }
                        PropName::Computed(c) => {
                            let (ident, aliased) = alias_if_required(&c.expr, "key");
                            if aliased {
                                *index += 1;
                                self.vars.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: Some(c.expr),
                                    definite: false,
                                });
                            }

                            (
                                PropName::Computed(ComputedPropName {
                                    span: c.span,
                                    expr: ident.clone().into(),
                                }),
                                MemberProp::Computed(ComputedPropName {
                                    span: c.span,
                                    expr: ident.into(),
                                }),
                            )
                        }
                    };

                    let value = Box::new(
                        self.fold_rest(
                            index,
                            *value,
                            Box::new(
                                MemberExpr {
                                    span: DUMMY_SP,
                                    obj: obj.clone(),
                                    prop,
                                }
                                .into(),
                            ),
                            use_expr_for_assign,
                            true,
                        ),
                    );
                    ObjectPatProp::KeyValue(KeyValuePatProp { key, value })
                }
                _ => prop,
            })
            .collect();

        match props.last() {
            Some(ObjectPatProp::Rest(..)) => {}
            _ => {
                return ObjectPat {
                    span,
                    props,
                    optional: false,
                    type_ann,
                }
                .into();
            }
        }
        let last = match props.pop() {
            Some(ObjectPatProp::Rest(rest)) => rest,
            _ => unreachable!(),
        };

        let excluded_props = excluded_props(&props);

        if use_expr_for_assign {
            // println!("Expr: last.arg = objectWithoutProperties()",);
            self.exprs.push(
                AssignExpr {
                    span: DUMMY_SP,
                    left: last.arg.try_into().unwrap(),
                    op: op!("="),
                    right: Box::new(object_without_properties(
                        obj,
                        excluded_props,
                        self.config.no_symbol,
                    )),
                }
                .into(),
            );
        } else {
            // println!("Var: rest = objectWithoutProperties()",);
            self.push_var_if_not_empty(VarDeclarator {
                span: DUMMY_SP,
                name: *last.arg,
                init: Some(Box::new(object_without_properties(
                    obj,
                    excluded_props,
                    self.config.no_symbol,
                ))),
                definite: false,
            });
        }

        ObjectPat {
            props,
            span,
            type_ann,
            optional: false,
        }
        .into()
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn object_without_properties(
    obj: Box<Expr>,
    excluded_props: Vec<Option<ExprOrSpread>>,
    no_symbol: bool,
) -> Expr {
    if excluded_props.is_empty() {
        return CallExpr {
            span: DUMMY_SP,
            callee: helper!(extends),
            args: vec![
                ObjectLit {
                    span: DUMMY_SP,
                    props: Vec::new(),
                }
                .as_arg(),
                helper_expr!(object_destructuring_empty)
                    .as_call(DUMMY_SP, vec![obj.as_arg()])
                    .as_arg(),
            ],
            ..Default::default()
        }
        .into();
    }

    let excluded_props = excluded_props
        .into_iter()
        .map(|v| {
            v.map(|v| match *v.expr {
                Expr::Lit(Lit::Num(Number { span, value, .. })) => ExprOrSpread {
                    expr: Lit::Str(Str {
                        span,
                        raw: None,
                        value: value.to_string().into(),
                    })
                    .into(),
                    ..v
                },
                _ => v,
            })
        })
        .collect();

    CallExpr {
        span: DUMMY_SP,
        callee: if no_symbol {
            helper!(object_without_properties_loose)
        } else {
            helper!(object_without_properties)
        },
        args: vec![
            obj.as_arg(),
            if is_literal(&excluded_props) {
                ArrayLit {
                    span: DUMMY_SP,
                    elems: excluded_props,
                }
                .as_arg()
            } else {
                CallExpr {
                    span: DUMMY_SP,
                    callee: ArrayLit {
                        span: DUMMY_SP,
                        elems: excluded_props,
                    }
                    .make_member(quote_ident!("map"))
                    .as_callee(),
                    args: vec![helper_expr!(to_property_key).as_arg()],
                    ..Default::default()
                }
                .as_arg()
            },
        ],
        ..Default::default()
    }
    .into()
}

#[tracing::instrument(level = "info", skip_all)]
fn excluded_props(props: &[ObjectPatProp]) -> Vec<Option<ExprOrSpread>> {
    props
        .iter()
        .map(|prop| match prop {
            ObjectPatProp::KeyValue(KeyValuePatProp { key, .. }) => match key {
                PropName::Ident(ident) => Lit::Str(Str {
                    span: ident.span,
                    raw: None,
                    value: ident.sym.clone(),
                })
                .as_arg(),
                PropName::Str(s) => Lit::Str(s.clone()).as_arg(),
                PropName::Num(Number { span, value, .. }) => Lit::Str(Str {
                    span: *span,
                    raw: None,
                    value: format!("{}", value).into(),
                })
                .as_arg(),
                PropName::BigInt(BigInt { span, value, .. }) => Lit::Str(Str {
                    span: *span,
                    raw: None,
                    value: format!("{}", value).into(),
                })
                .as_arg(),
                PropName::Computed(c) => c.expr.clone().as_arg(),
            },
            ObjectPatProp::Assign(AssignPatProp { key, .. }) => Lit::Str(Str {
                span: key.span,
                raw: None,
                value: key.sym.clone(),
            })
            .as_arg(),
            ObjectPatProp::Rest(..) => unreachable!("invalid syntax (multiple rest element)"),
        })
        .map(Some)
        .collect()
}

/// e.g.
///
///  - `{ x4: {}  }` -> `{}`
struct PatSimplifier;

#[swc_trace]
impl VisitMut for PatSimplifier {
    noop_visit_mut_type!(fail);

    fn visit_mut_pat(&mut self, pat: &mut Pat) {
        pat.visit_mut_children_with(self);

        if let Pat::Object(o) = pat {
            o.props.retain(|prop| {
                if let ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) = prop {
                    match &**value {
                        Pat::Object(ObjectPat { props, .. }) if props.is_empty() => {
                            return false;
                        }
                        _ => {}
                    }
                }

                true
            });
        }
    }
}
