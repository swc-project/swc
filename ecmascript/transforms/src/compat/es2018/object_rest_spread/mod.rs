use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::{
    iter, mem,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Mark, Spanned, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(helpers: Arc<Helpers>) -> impl Fold<Module> {
    chain!(
        ObjectRest {
            helpers: helpers.clone(),
        },
        ObjectSpread { helpers }
    )
}

struct ObjectRest {
    helpers: Arc<Helpers>,
}

struct RestFolder {
    helpers: Arc<Helpers>,
    /// Injected before the original statement.
    vars: Vec<VarDeclarator>,
    /// Variables which should ceclaraed using `var`
    mutable_vars: Vec<VarDeclarator>,
    /// Assignment expressions.
    exprs: Vec<Box<Expr>>,
}

macro_rules! impl_for_for_stmt {
    ($T:tt) => {
        impl Fold<$T> for RestFolder {
            fn fold(&mut self, mut for_stmt: $T) -> $T {
                if !contains_rest(&for_stmt) {
                    return for_stmt;
                }

                let left = match for_stmt.left {
                    VarDeclOrPat::VarDecl(var_decl) => {
                        let ref_ident = {
                            let mark = Mark::fresh(Mark::root());
                            quote_ident!(DUMMY_SP.apply_mark(mark), "_ref")
                        };
                        let left = VarDeclOrPat::VarDecl(VarDecl {
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ref_ident.clone()),
                                init: None,
                            }],
                            ..var_decl
                        });
                        // Unpack variables
                        let mut decls = var_decl
                            .decls
                            .into_iter()
                            .map(|decl| VarDeclarator {
                                init: Some(box Expr::Ident(ref_ident.clone())),
                                ..decl
                            })
                            .collect::<Vec<_>>()
                            .fold_with(self);

                        // **prepend** decls to self.vars
                        decls.append(&mut self.vars);
                        mem::swap(&mut self.vars, &mut decls);
                        left
                    }
                    VarDeclOrPat::Pat(pat) => {
                        let var_ident =
                            quote_ident!(DUMMY_SP.apply_mark(Mark::fresh(Mark::root())), "_ref");
                        let index = self.vars.len();
                        let pat =
                            self.fold_rest(pat, box Expr::Ident(var_ident.clone()), false, true);

                        // initialize (or destructure)
                        match pat {
                            Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                            _ => {
                                // insert at index to create
                                // `var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);`
                                // instead of
                                // var b = _objectWithoutProperties(_ref, ['a']), { a } = _ref;

                                println!("Var(0): folded pat = var_ident",);
                                self.vars.insert(
                                    index,
                                    VarDeclarator {
                                        span: DUMMY_SP,
                                        name: pat,
                                        init: Some(box Expr::Ident(var_ident.clone())),
                                    },
                                );
                            }
                        }

                        // `var _ref` in `for (var _ref in foo)`
                        VarDeclOrPat::VarDecl(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(var_ident.clone()),
                                init: None,
                            }],
                        })
                    }
                };
                for_stmt.left = left;

                let stmt = Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars, vec![]),
                }));

                for_stmt.body = box Stmt::Block(match *for_stmt.body {
                    Stmt::Block(BlockStmt { span, stmts }) => BlockStmt {
                        span,
                        stmts: iter::once(stmt).chain(stmts).collect(),
                    },
                    body => BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![stmt, body],
                    },
                });

                for_stmt
            }
        }
    };
}
impl_for_for_stmt!(ForInStmt);
impl_for_for_stmt!(ForOfStmt);

impl Fold<Vec<VarDeclarator>> for RestFolder {
    fn fold(&mut self, decls: Vec<VarDeclarator>) -> Vec<VarDeclarator> {
        // fast path
        if !contains_rest(&decls) {
            return decls;
        }

        for decl in decls {
            // fast path
            if !contains_rest(&decl) {
                self.vars.push(decl);
                continue;
            }

            let decl = decl.fold_children(self);

            let mut var_ident = match decl.init {
                Some(box Expr::Ident(ref ident)) => ident.clone(),
                _ => quote_ident!("_ref"),
            };
            var_ident.span = var_ident.span.apply_mark(Mark::fresh(Mark::root()));

            let has_init = decl.init.is_some();
            if let Some(init) = decl.init {
                match *init {
                    // skip `z = z`
                    Expr::Ident(..) => {}
                    _ => {
                        println!("Var: var_ident = init",);
                        self.push_var_if_not_empty(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(var_ident.clone()),
                            init: Some(init),
                        });
                    }
                }
            }

            let index = self.vars.len();
            let pat = self.fold_rest(decl.name, box Expr::Ident(var_ident.clone()), false, true);
            match pat {
                // skip `{} = z`
                Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                _ => {
                    // insert at index to create
                    // `var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);`
                    // instead of
                    // `var b = _objectWithoutProperties(_ref, ['a']), { a } = _ref;`
                    self.insert_var_if_not_empty(
                        index,
                        VarDeclarator {
                            name: pat,
                            // preserve
                            init: if has_init {
                                Some(box Expr::Ident(var_ident.clone()))
                            } else {
                                None
                            },
                            ..decl
                        },
                    )
                }
            }
        }

        mem::replace(&mut self.vars, vec![])
    }
}

/// Handles assign expression
impl Fold<Expr> for RestFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        // fast path
        if !contains_rest(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(box pat),
                op: op!("="),
                right,
            }) => {
                let mut var_ident = match *right {
                    Expr::Ident(ref ident) => quote_ident!(format!("_{}", ident.sym)),
                    _ => quote_ident!("_tmp"),
                };
                var_ident.span = var_ident.span.apply_mark(Mark::fresh(Mark::root()));

                println!("Var: var_ident = None");
                self.mutable_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_ident.clone()),
                    init: None,
                });
                println!("Expr: var_ident = right");
                self.exprs.push(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(box Pat::Ident(var_ident.clone())),
                    op: op!("="),
                    right,
                }));
                let pat = self.fold_rest(pat, box Expr::Ident(var_ident.clone()), true, true);

                match pat {
                    Pat::Object(ObjectPat { ref props, .. }) if props.is_empty() => {}
                    _ => self.exprs.push(box Expr::Assign(AssignExpr {
                        span,
                        left: PatOrExpr::Pat(box pat),
                        op: op!("="),
                        right: box var_ident.clone().into(),
                    })),
                }
                self.exprs.push(box var_ident.clone().into());
                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: mem::replace(&mut self.exprs, vec![]),
                })
            }
            _ => expr,
        }
    }
}

struct RestVisitor {
    found: bool,
}

impl Visit<RestPat> for RestVisitor {
    fn visit(&mut self, _: &RestPat) {
        self.found = true;
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

impl<T: StmtLike + VisitWith<RestVisitor>> Fold<Vec<T>> for ObjectRest
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        if !contains_rest(&stmts) {
            return stmts;
        }
        let stmts = stmts.fold_children(self);

        let mut buf = vec![];

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = RestFolder {
                        helpers: self.helpers.clone(),
                        vars: vec![],
                        mutable_vars: vec![],
                        exprs: vec![],
                    };
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.mutable_vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.mutable_vars,
                        }))));
                    }

                    if !folder.vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.vars,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));

                    buf.extend(folder.exprs.into_iter().map(Stmt::Expr).map(T::from_stmt));
                }
            }
        }

        buf
    }
}

impl Fold<ArrowExpr> for RestFolder {
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        let body_span = f.body.span();
        let (params, stmts) = self.fold_fn_like(
            f.params,
            match f.body {
                BlockStmtOrExpr::BlockStmt(block) => block.stmts,
                BlockStmtOrExpr::Expr(expr) => vec![Stmt::Expr(expr)],
            },
        );
        ArrowExpr {
            params,
            body: BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: body_span,
                stmts,
            }),
            ..f
        }
    }
}

impl Fold<Function> for RestFolder {
    fn fold(&mut self, f: Function) -> Function {
        let (params, stmts) = self.fold_fn_like(f.params, f.body.stmts);
        Function {
            params,
            body: BlockStmt { stmts, ..f.body },
            ..f
        }
    }
}

impl Fold<CatchClause> for RestFolder {
    fn fold(&mut self, mut c: CatchClause) -> CatchClause {
        if !contains_rest(&c.param) {
            // fast path
            return c;
        }

        let pat = match c.param {
            Some(pat) => pat,
            _ => return c,
        };

        let mark = Mark::fresh(Mark::root());
        let var_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_err");
        let param = self.fold_rest(pat, box Expr::Ident(var_ident.clone()), false, true);
        // initialize (or destructure)
        self.push_var_if_not_empty(VarDeclarator {
            span: DUMMY_SP,
            name: param,
            init: Some(box Expr::Ident(var_ident.clone())),
        });
        c.body.stmts = iter::once(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Let,
            decls: mem::replace(&mut self.vars, vec![]),
        })))
        .chain(c.body.stmts)
        .collect();

        CatchClause {
            // catch (_err) {}
            param: Some(Pat::Ident(var_ident)),
            ..c
        }
    }
}

impl RestFolder {
    fn insert_var_if_not_empty(&mut self, idx: usize, decl: VarDeclarator) {
        match decl.name {
            Pat::Object(ObjectPat { ref props, .. }) => {
                if props.len() == 0 {
                    return;
                }
            }
            _ => {}
        }
        self.vars.insert(idx, decl)
    }

    fn push_var_if_not_empty(&mut self, decl: VarDeclarator) {
        match decl.name {
            Pat::Object(ObjectPat { ref props, .. }) => {
                if props.len() == 0 {
                    return;
                }
            }
            _ => {}
        }
        self.vars.push(decl)
    }

    fn fold_fn_like(&mut self, params: Vec<Pat>, body: Vec<Stmt>) -> (Vec<Pat>, Vec<Stmt>) {
        if !contains_rest(&params) {
            // fast-path
            return (params, body);
        }

        let params = params
            .into_iter()
            .map(|param| {
                let mark = Mark::fresh(Mark::root());
                let var_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_param");
                let mut index = self.vars.len();
                let param = self.fold_rest(param, box Expr::Ident(var_ident.clone()), false, false);
                match param {
                    Pat::Rest(..) | Pat::Ident(..) => param,
                    Pat::Assign(AssignPat {
                        left: box Pat::Ident(..),
                        ..
                    })
                    | Pat::Assign(AssignPat {
                        left: box Pat::Rest(..),
                        ..
                    })
                    | Pat::Assign(AssignPat {
                        left: box Pat::Array(..),
                        ..
                    }) => param,
                    Pat::Array(ArrayPat { span, elems }) => {
                        let elems = elems
                            .into_iter()
                            .map(|elem| match elem {
                                Some(param @ Pat::Object(..)) => {
                                    println!("Var(i): param = var_ident");
                                    self.insert_var_if_not_empty(
                                        index,
                                        VarDeclarator {
                                            span: DUMMY_SP,
                                            name: param,
                                            init: Some(box Expr::Ident(var_ident.clone())),
                                        },
                                    );
                                    index += 1;
                                    Some(Pat::Ident(var_ident.clone()))
                                }
                                _ => elem,
                            })
                            .collect();

                        Pat::Array(ArrayPat { span, elems })
                    }
                    Pat::Assign(AssignPat { span, left, right }) => {
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span,
                                name: *left,
                                init: Some(box Expr::Ident(var_ident.clone())),
                            },
                        );
                        Pat::Assign(AssignPat {
                            span,
                            left: box Pat::Ident(var_ident.clone()),
                            right,
                        })
                    }
                    _ => {
                        // initialize snd destructure
                        self.insert_var_if_not_empty(
                            index,
                            VarDeclarator {
                                span: DUMMY_SP,
                                name: param,
                                init: Some(box Expr::Ident(var_ident.clone())),
                            },
                        );
                        Pat::Ident(var_ident.clone())
                    }
                }
            })
            .collect();

        (
            params,
            if self.vars.is_empty() {
                None
            } else {
                Some(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars, vec![]),
                })))
            }
            .into_iter()
            .chain(body)
            .collect(),
        )
    }

    fn fold_rest(
        &mut self,
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

        let ObjectPat { span, props } = match pat {
            Pat::Object(pat) => pat,
            Pat::Assign(AssignPat { span, left, right }) => {
                let left =
                    box self.fold_rest(*left, obj, use_expr_for_assign, use_member_for_array);
                return Pat::Assign(AssignPat { span, left, right });
            }
            Pat::Array(ArrayPat { span, elems }) => {
                let elems = elems
                    .into_iter()
                    .enumerate()
                    .map(|(i, elem)| match elem {
                        Some(elem) => Some(self.fold_rest(
                            elem,
                            if use_member_for_array {
                                box Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: obj.clone().as_obj(),
                                    computed: true,
                                    prop: box Expr::Lit(Lit::Num(Number {
                                        span: DUMMY_SP,
                                        value: i as _,
                                    })),
                                })
                            } else {
                                obj.clone()
                            },
                            use_expr_for_assign,
                            use_member_for_array,
                        )),
                        None => None,
                    })
                    .collect();

                return Pat::Array(ArrayPat { span, elems });
            }
            _ => return pat,
        };

        let mut props: Vec<ObjectPatProp> = props
            .into_iter()
            .map(|prop| match prop {
                ObjectPatProp::Rest(RestPat { arg, dot3_token }) => {
                    let pat = self.fold_rest(
                        *arg,
                        // TODO: fix this. this is wrong
                        obj.clone(),
                        use_expr_for_assign,
                        use_member_for_array,
                    );
                    ObjectPatProp::Rest(RestPat {
                        dot3_token,
                        arg: box pat,
                    })
                }
                ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
                    let value = box self.fold_rest(
                        *value,
                        box MemberExpr {
                            span: DUMMY_SP,
                            obj: obj.clone().as_obj(),
                            computed: match key {
                                PropName::Computed(..) => true,
                                PropName::Num(..) => true,
                                _ => false,
                            },
                            prop: match key {
                                PropName::Ident(ref ident) => box Expr::Ident(ident.clone()),
                                PropName::Str(Str {
                                    ref value, span, ..
                                }) => box Expr::Ident(quote_ident!(span, value.clone())),
                                PropName::Num(Number { span, value }) => {
                                    box Expr::Lit(Lit::Str(Str {
                                        span,
                                        value: format!("{}", value).into(),
                                        has_escape: false,
                                    }))
                                }
                                PropName::Computed(ref expr) => expr.clone(),
                            },
                        }
                        .into(),
                        use_expr_for_assign,
                        use_member_for_array,
                    );
                    ObjectPatProp::KeyValue(KeyValuePatProp { key, value })
                }
                _ => prop,
            })
            .collect();

        match props.last() {
            Some(ObjectPatProp::Rest(..)) => {}
            _ => {
                return Pat::Object(ObjectPat { span, props });
            }
        }
        let last = match props.pop() {
            Some(ObjectPatProp::Rest(rest)) => rest,
            _ => unreachable!(),
        };

        let excluded_props = excluded_props(&props);

        if use_expr_for_assign {
            println!("Expr: last.arg = objectWithoutProperties()",);
            self.exprs.push(box Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(last.arg),
                op: op!("="),
                right: box object_without_properties(&self.helpers, obj.clone(), excluded_props),
            }));
        } else {
            println!("Var: rest = objectWithoutProperties()",);
            self.push_var_if_not_empty(VarDeclarator {
                span: DUMMY_SP,
                name: *last.arg,
                init: Some(box object_without_properties(
                    &self.helpers,
                    obj.clone(),
                    excluded_props,
                )),
            });
        }

        Pat::Object(ObjectPat { props, span })
    }
}

fn object_without_properties(
    helpers: &Helpers,
    obj: Box<Expr>,
    excluded_props: Vec<Option<ExprOrSpread>>,
) -> Expr {
    if excluded_props.is_empty() {
        helpers.extends.store(true, Ordering::Relaxed);

        return Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: quote_ident!("_extends").as_callee(),
            args: vec![
                ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                }
                .as_arg(),
                obj.as_arg(),
            ],
        });
    }

    helpers
        .object_without_properties
        .store(true, Ordering::Relaxed);

    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("_objectWithoutProperties").as_callee(),
        args: vec![
            obj.as_arg(),
            ArrayLit {
                span: DUMMY_SP,
                elems: excluded_props,
            }
            .as_arg(),
        ],
    })
}

fn excluded_props(props: &[ObjectPatProp]) -> Vec<Option<ExprOrSpread>> {
    props
        .iter()
        .map(|prop| match prop {
            ObjectPatProp::KeyValue(KeyValuePatProp { key, .. }) => match key {
                PropName::Ident(ident) => Lit::Str(Str {
                    span: ident.span,
                    value: ident.sym.clone(),
                    has_escape: false,
                })
                .as_arg(),
                PropName::Str(s) => Lit::Str(s.clone()).as_arg(),
                PropName::Num(Number { span, value }) => Lit::Str(Str {
                    span: *span,
                    value: format!("{}", value).into(),
                    has_escape: false,
                })
                .as_arg(),
                PropName::Computed(expr) => expr.clone().as_arg(),
            },
            ObjectPatProp::Assign(AssignPatProp { key, .. }) => Lit::Str(Str {
                span: key.span,
                value: key.sym.clone(),
                has_escape: false,
            })
            .as_arg(),
            ObjectPatProp::Rest(..) => unreachable!("invalid syntax (multiple rest element)"),
        })
        .map(Some)
        .collect()
}

struct ObjectSpread {
    helpers: Arc<Helpers>,
}

impl Fold<Expr> for ObjectSpread {
    fn fold(&mut self, expr: Expr) -> Expr {
        // fast-path
        if !contains_spread(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Object(ObjectLit { span, props }) => {
                let has_spread = props.iter().any(|p| match p {
                    PropOrSpread::Spread(..) => true,
                    _ => false,
                });
                if !has_spread {
                    return Expr::Object(ObjectLit { span, props });
                }

                let mut first = true;

                // { foo, ...x } => ({ foo }, x)
                let args = {
                    let mut buf = vec![];
                    let mut obj = ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    };
                    for prop in props {
                        match prop {
                            PropOrSpread::Prop(..) => obj.props.push(prop),
                            PropOrSpread::Spread(SpreadElement {
                                dot3_token: _,
                                expr,
                            }) => {
                                // Push object if it's not empty
                                if first || !obj.props.is_empty() {
                                    let obj = mem::replace(
                                        &mut obj,
                                        ObjectLit {
                                            span: DUMMY_SP,
                                            props: vec![],
                                        },
                                    );
                                    buf.push(obj.as_arg());
                                    first = false;
                                }

                                buf.push(expr.as_arg());
                            }
                        }
                    }

                    if !obj.props.is_empty() {
                        buf.push(obj.as_arg());
                    }

                    buf
                };

                self.helpers.define_property.store(true, Ordering::Relaxed);
                self.helpers.object_spread.store(true, Ordering::Relaxed);
                Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!("_objectSpread").as_callee(),
                    args,
                })
            }
            _ => expr,
        }
    }
}

fn contains_spread(expr: &Expr) -> bool {
    struct Visitor {
        found: bool,
    }

    impl Visit<SpreadElement> for Visitor {
        fn visit(&mut self, _: &SpreadElement) {
            self.found = true;
        }
    }

    let mut v = Visitor { found: false };
    expr.visit_with(&mut v);
    v.found
}
