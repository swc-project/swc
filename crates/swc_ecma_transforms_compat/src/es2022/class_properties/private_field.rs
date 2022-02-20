use std::iter;

use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Mark, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    alias_ident_for, alias_if_required, prepend, quote_ident, ExprFactory, HANDLER,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) struct Private {
    pub mark: Mark,
    pub class_name: Ident,
    pub ident: AHashMap<JsWord, PrivateKind>,
}

pub(super) struct PrivateRecord(Vec<Private>);

impl PrivateRecord {
    pub fn new() -> Self {
        PrivateRecord(Vec::new())
    }

    pub fn curr_class(&self) -> &Ident {
        &self.0.last().unwrap().class_name
    }

    pub fn curr_mark(&self) -> Mark {
        self.0.last().unwrap().mark
    }

    pub fn push(&mut self, p: Private) {
        self.0.push(p)
    }

    pub fn pop(&mut self) {
        self.0.pop();
    }

    pub fn get(&self, name: &Ident) -> (Mark, PrivateKind, &Ident) {
        for p in self.0.iter().rev() {
            if let Some(kind) = p.ident.get(&name.sym) {
                return (p.mark, *kind, &p.class_name);
            }
        }

        let error = format!("private name #{} is not defined.", name.sym);
        HANDLER.with(|handler| handler.struct_span_err(name.span, &error).emit());
        (Mark::root(), PrivateKind::default(), &self.0[0].class_name)
    }
}

#[derive(Copy, Clone, PartialEq, Default)]
pub(super) struct PrivateKind {
    pub is_static: bool,
    pub is_method: bool,
    pub has_getter: bool,
    pub has_setter: bool,
}

pub(super) struct BrandCheckHandler<'a> {
    /// Private names used for brand checks.
    pub names: &'a mut AHashSet<JsWord>,

    pub private: &'a PrivateRecord,
}

impl VisitMut for BrandCheckHandler<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                span,
                op: op!("in"),
                left,
                right,
            }) if left.is_private_name() => {
                let n = left.as_private_name().unwrap();
                if let Expr::Ident(right) = &**right {
                    let curr_class = self.private.curr_class();
                    if curr_class.sym == right.sym && curr_class.span.ctxt == right.span.ctxt {
                        *e = Expr::Bin(BinExpr {
                            span: *span,
                            op: op!("==="),
                            left: Box::new(Expr::Ident(curr_class.clone())),
                            right: Box::new(Expr::Ident(right.clone())),
                        });
                        return;
                    }
                }

                self.names.insert(n.id.sym.clone());

                let (mark, kind, class_name) = self.private.get(&n.id);

                if mark == Mark::root() {
                    return;
                }

                if kind.is_static {
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        op: op!("==="),
                        left: right.take(),
                        right: Box::new(Expr::Ident(class_name.clone())),
                    });
                    return;
                }

                let weak_coll_ident =
                    Ident::new(format!("_{}", n.id.sym).into(), n.id.span.apply_mark(mark));

                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: weak_coll_ident.make_member(quote_ident!("has")).as_callee(),
                    args: vec![right.take().as_arg()],
                    type_args: Default::default(),
                });
            }

            _ => {}
        }
    }
}

pub(super) struct PrivateAccessVisitor<'a> {
    pub vars: Vec<VarDeclarator>,
    pub private: &'a PrivateRecord,
    pub in_assign_pat: bool,
}

macro_rules! take_vars {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, f: &mut $T) {
            let old_var = self.vars.take();

            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            if !self.vars.is_empty() {
                prepend(
                    &mut f.body.as_mut().unwrap().stmts,
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.vars.take(),

                        declare: false,
                    })),
                )
            }

            self.vars = old_var;
        }
    };
}

// super.#sdsa is invalid
impl<'a> VisitMut for PrivateAccessVisitor<'a> {
    noop_visit_mut_type!();

    take_vars!(visit_mut_function, Function);

    take_vars!(visit_mut_constructor, Constructor);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Update(UpdateExpr {
                span,
                prefix,
                op,
                arg,
            }) if arg.is_member() => {
                let mut arg = arg.take().member().unwrap();
                arg.visit_mut_with(self);

                let n = match &arg.prop {
                    MemberProp::PrivateName(n) => n,
                    _ => {
                        *e = Expr::Update(UpdateExpr {
                            span: *span,
                            prefix: *prefix,
                            op: *op,
                            arg: Box::new(Expr::Member(arg)),
                        });
                        e.visit_mut_children_with(self);
                        return;
                    }
                };

                let obj = arg.obj.clone();

                let (mark, kind, class_name) = self.private.get(&n.id);
                if mark == Mark::root() {
                    return;
                }

                let ident = Ident::new(format!("_{}", n.id.sym).into(), n.id.span.apply_mark(mark));

                let var = alias_ident_for(&obj, "_ref");

                let this = if matches!(*obj, Expr::This(..)) {
                    ThisExpr { span: DUMMY_SP }.as_arg()
                } else if kind.is_static {
                    obj.as_arg()
                } else {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: var.clone().into(),
                        init: None,
                        definite: false,
                    });
                    AssignExpr {
                        span: obj.span(),
                        left: PatOrExpr::Pat(var.clone().into()),
                        op: op!("="),
                        right: obj,
                    }
                    .as_arg()
                };
                // Used iff !prefix
                let old_var = Ident {
                    // be more like babel
                    sym: (String::from("_this") + &ident.sym).into(),
                    span: ident.span.apply_mark(Mark::fresh(Mark::root())),
                    optional: false,
                };
                if !*prefix {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: old_var.clone().into(),
                        init: None,
                        definite: false,
                    });
                }

                let value = {
                    let arg = Box::new(self.visit_mut_private_get(&mut arg, Some(var)).0);
                    let left = Box::new(Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: op!(unary, "+"),
                        arg,
                    }));
                    let left = if *prefix {
                        left
                    } else {
                        Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(old_var.clone().into()),
                            op: op!("="),
                            right: left,
                        }))
                    };

                    BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: match op {
                            op!("++") => op!(bin, "+"),
                            op!("--") => op!(bin, "-"),
                        },
                        right: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                        }))),
                    }
                    .as_arg()
                };

                let expr = if kind.is_static {
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(
                            class_static_private_field_spec_set,
                            "classStaticPrivateFieldSpecSet"
                        ),
                        args: vec![this, class_name.clone().as_arg(), ident.as_arg(), value],

                        type_args: Default::default(),
                    })
                } else {
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(class_private_field_set, "classPrivateFieldSet"),
                        args: vec![this, ident.as_arg(), value],

                        type_args: Default::default(),
                    })
                };

                if *prefix {
                    *e = expr;
                } else {
                    *e = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![Box::new(expr), Box::new(Expr::Ident(old_var))],
                    });
                }
            }

            Expr::Assign(AssignExpr {
                span,
                left,
                op,
                right,
            }) if left.as_expr().is_some() && left.as_expr().unwrap().is_member() => {
                let mut left: MemberExpr = left.take().expr().unwrap().member().unwrap();
                left.visit_mut_with(self);
                right.visit_mut_with(self);

                let n = match &left.prop {
                    MemberProp::PrivateName(n) => n.clone(),
                    _ => {
                        *e = Expr::Assign(AssignExpr {
                            span: *span,
                            left: PatOrExpr::Expr(Box::new(Expr::Member(left))),
                            op: *op,
                            right: right.take(),
                        });

                        e.visit_mut_children_with(self);
                        return;
                    }
                };

                let obj = left.obj.clone();

                let (mark, kind, class_name) = self.private.get(&n.id);
                if mark == Mark::root() {
                    return;
                }

                let ident = Ident::new(format!("_{}", n.id.sym).into(), n.id.span.apply_mark(mark));

                let var = alias_ident_for(&obj, "_ref");

                let this = if matches!(*obj, Expr::This(..)) {
                    ThisExpr { span: DUMMY_SP }.as_arg()
                } else if *op == op!("=") {
                    obj.as_arg()
                } else {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: var.clone().into(),
                        init: None,
                        definite: false,
                    });
                    AssignExpr {
                        span: obj.span(),
                        left: PatOrExpr::Pat(var.clone().into()),
                        op: op!("="),
                        right: obj,
                    }
                    .as_arg()
                };

                let value = if *op == op!("=") {
                    right.take().as_arg()
                } else {
                    let left = Box::new(self.visit_mut_private_get(&mut left, Some(var)).0);

                    BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: op.to_update().unwrap(),
                        right: right.take(),
                    }
                    .as_arg()
                };

                if kind.is_static {
                    *e = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(
                            class_static_private_field_spec_set,
                            "classStaticPrivateFieldSpecSet"
                        ),
                        args: vec![this, class_name.clone().as_arg(), ident.as_arg(), value],

                        type_args: Default::default(),
                    });
                } else {
                    let set = helper!(class_private_field_set, "classPrivateFieldSet");

                    *e = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: set,
                        args: vec![this, ident.as_arg(), value],

                        type_args: Default::default(),
                    });
                }
            }

            Expr::Assign(AssignExpr {
                left: PatOrExpr::Pat(left),

                right,
                ..
            }) => {
                right.visit_mut_with(self);
                self.in_assign_pat = true;
                left.visit_mut_with(self);
                self.in_assign_pat = false;
            }

            // Actually this is a call and we should bind `this`.
            Expr::TaggedTpl(TaggedTpl {
                span,
                tag,
                tpl,
                type_params,
            }) if tag.is_member() => {
                let mut tag = tag.take().member().unwrap();
                tag.visit_mut_with(self);
                tpl.visit_mut_with(self);

                let (expr, this) = self.visit_mut_private_get(&mut tag, None);

                if let Some(this) = this {
                    *e = Expr::TaggedTpl(TaggedTpl {
                        span: *span,
                        tag: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: expr.make_member(quote_ident!("bind")).as_callee(),
                            args: vec![this.as_arg()],
                            type_args: Default::default(),
                        })),
                        tpl: tpl.take(),
                        type_params: type_params.take(),
                    });
                } else {
                    *e = Expr::TaggedTpl(TaggedTpl {
                        span: *span,
                        tag: Box::new(expr),
                        tpl: tpl.take(),
                        type_params: type_params.take(),
                    });
                }
            }

            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                type_args,
            }) if callee.is_member() => {
                let mut callee = callee.take().member().unwrap();
                callee.visit_mut_with(self);
                args.visit_mut_with(self);

                let (expr, this) = self.visit_mut_private_get(&mut callee, None);
                if let Some(this) = this {
                    *e = Expr::Call(CallExpr {
                        span: *span,
                        callee: expr.make_member(quote_ident!("call")).as_callee(),
                        args: iter::once(this.as_arg()).chain(args.take()).collect(),
                        type_args: type_args.take(),
                    });
                } else {
                    *e = Expr::Call(CallExpr {
                        span: *span,
                        callee: Callee::Expr(Box::new(expr)),
                        args: args.take(),
                        type_args: type_args.take(),
                    });
                }
            }

            Expr::OptChain(OptChainExpr {
                base: OptChainBase::Call(call),
                question_dot_token,
                span,
            }) if call.callee.is_member() => {
                let mut callee = call.callee.take().member().unwrap();
                callee.visit_mut_with(self);
                call.args.visit_mut_with(self);

                let (expr, this) = self.visit_mut_private_get(&mut callee, None);
                if let Some(this) = this {
                    let args = iter::once(this.as_arg()).chain(call.args.take()).collect();
                    *e = Expr::Call(CallExpr {
                        span: *span,
                        callee: Callee::Expr(Box::new(Expr::OptChain(OptChainExpr {
                            question_dot_token: *question_dot_token,
                            span: *span,
                            base: OptChainBase::Member(MemberExpr {
                                obj: Box::new(expr),
                                span: call.span,
                                prop: MemberProp::Ident(quote_ident!("call")),
                            }),
                        }))),
                        args,
                        type_args: call.type_args.take(),
                    });
                } else {
                    call.callee = Box::new(expr);
                }
            }

            Expr::Member(member_expr) => {
                member_expr.visit_mut_with(self);
                *e = self.visit_mut_private_get(member_expr, None).0;
            }
            _ => e.visit_mut_children_with(self),
        };
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        if let Pat::Expr(expr) = &p {
            if let Expr::Member(me) = &**expr {
                if let MemberProp::PrivateName(..) = &me.prop {
                    self.in_assign_pat = true;
                    p.visit_mut_children_with(self);
                    self.in_assign_pat = false;

                    return;
                }
            }
        }

        self.in_assign_pat = false;
        p.visit_mut_children_with(self);
    }
}

pub(super) fn visit_private_in_expr(
    expr: &mut Expr,
    private: &PrivateRecord,
) -> Vec<VarDeclarator> {
    let mut priv_visitor = PrivateAccessVisitor {
        private,
        vars: vec![],
        in_assign_pat: false,
    };

    expr.visit_mut_with(&mut priv_visitor);

    priv_visitor.vars
}

impl<'a> PrivateAccessVisitor<'a> {
    /// Returns `(expr, thisObject)`
    ///
    ///   - `obj_alias`: If alias is already declared, this method will use
    ///     `obj_alias` instead of declaring a new one.
    fn visit_mut_private_get(
        &mut self,
        e: &mut MemberExpr,
        obj_alias: Option<Ident>,
    ) -> (Expr, Option<Expr>) {
        let is_alias_initialized = obj_alias.is_some();

        let n = match &e.prop {
            MemberProp::PrivateName(n) => n,
            _ => return (e.take().into(), None),
        };

        let mut obj = e.obj.take();

        let (mark, kind, class_name) = self.private.get(&n.id);
        if mark == Mark::root() {
            return (Expr::dummy(), None);
        }

        let method_name = Ident::new(
            n.id.sym.clone(),
            n.id.span.with_ctxt(SyntaxContext::empty()).apply_mark(mark),
        );
        let ident = Ident::new(format!("_{}", n.id.sym).into(), n.id.span.apply_mark(mark));

        if kind.is_static {
            if kind.is_method {
                let h = helper!(
                    class_static_private_method_get,
                    "classStaticPrivateMethodGet"
                );

                return (
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: h,
                        args: vec![
                            obj.as_arg(),
                            class_name.clone().as_arg(),
                            method_name.as_arg(),
                        ],
                        type_args: Default::default(),
                    }),
                    Some(Expr::Ident(class_name.clone())),
                );
            }

            let get = helper!(
                class_static_private_field_spec_get,
                "classStaticPrivateFieldSpecGet"
            );

            (
                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: get,
                    args: vec![obj.as_arg(), class_name.clone().as_arg(), ident.as_arg()],
                    type_args: Default::default(),
                }),
                Some(Expr::Ident(class_name.clone())),
            )
        } else {
            if self.in_assign_pat {
                let set = helper!(
                    class_private_field_destructure,
                    "classPrivateFieldDestructureSet"
                );

                return match &*obj {
                    Expr::This(this) => (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![this.as_arg(), ident.as_arg()],

                            type_args: Default::default(),
                        }
                        .make_member(quote_ident!("value")),
                        Some(Expr::This(*this)),
                    ),
                    _ => unimplemented!("destructuring set for object except this"),
                };
            }

            let get = if kind.is_method {
                helper!(class_private_method_get, "classPrivateMethodGet")
            } else {
                helper!(class_private_field_get, "classPrivateFieldGet")
            };

            match &*obj {
                Expr::This(this) => (
                    if kind.is_method {
                        CallExpr {
                            span: DUMMY_SP,
                            callee: get,
                            args: vec![obj.clone().as_arg(), ident.as_arg(), method_name.as_arg()],
                            type_args: Default::default(),
                        }
                        .into()
                    } else {
                        CallExpr {
                            span: DUMMY_SP,
                            callee: get,
                            args: vec![this.as_arg(), ident.as_arg()],

                            type_args: Default::default(),
                        }
                        .into()
                    },
                    Some(Expr::This(*this)),
                ),
                _ => {
                    let mut aliased = false;
                    let var = obj_alias.unwrap_or_else(|| {
                        let (var, a) = alias_if_required(&obj, "_ref");
                        if a {
                            aliased = true;
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: var.clone().into(),
                                init: None,
                                definite: false,
                            });
                        }
                        var
                    });

                    let first_arg = if is_alias_initialized {
                        var.clone().as_arg()
                    } else if aliased {
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(var.clone().into()),
                            op: op!("="),
                            right: obj.take(),
                        }
                        .as_arg()
                    } else {
                        var.clone().as_arg()
                    };

                    let args = if kind.is_method {
                        vec![first_arg, ident.as_arg(), method_name.as_arg()]
                    } else {
                        vec![first_arg, ident.as_arg()]
                    };

                    (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: get,
                            args,
                            type_args: Default::default(),
                        }
                        .into(),
                        Some(Expr::Ident(var)),
                    )
                }
            }
        }
    }
}

/// only getter and setter in same scope could coexist
pub(super) fn dup_private_method(kind: &PrivateKind, method: &PrivateMethod) -> bool {
    if !kind.is_method || kind.is_static != method.is_static || method.kind == MethodKind::Method {
        return true;
    }

    !matches!(
        (method.kind, kind.has_getter, kind.has_setter),
        (MethodKind::Getter, false, true) | (MethodKind::Setter, true, false)
    )
}
