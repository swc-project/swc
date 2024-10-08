use std::iter;

use swc_atoms::JsWord;
use swc_common::{
    collections::AHashMap, errors::HANDLER, util::take::Take, Mark, Span, Spanned, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{alias_ident_for, alias_if_required, prepend_stmt, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

use super::Config;
use crate::optional_chaining_impl::optional_chaining_impl;

pub(super) struct Private {
    pub mark: Mark,
    pub class_name: Ident,
    pub ident: AHashMap<JsWord, PrivateKind>,
}

pub(super) struct PrivateRecord(Vec<Private>);

#[swc_trace]
impl PrivateRecord {
    pub fn new() -> Self {
        PrivateRecord(Vec::new())
    }

    pub fn curr_class(&self) -> &Ident {
        &self.0.last().unwrap().class_name
    }

    pub fn cur_mark(&self) -> Mark {
        self.0.last().unwrap().mark
    }

    pub fn push(&mut self, p: Private) {
        self.0.push(p)
    }

    pub fn pop(&mut self) {
        self.0.pop();
    }

    pub fn get(&self, span: Span, name: &JsWord) -> (Mark, PrivateKind, &Ident) {
        for p in self.0.iter().rev() {
            if let Some(kind) = p.ident.get(name) {
                return (p.mark, *kind, &p.class_name);
            }
        }

        let error = format!("private name #{} is not defined.", name);
        HANDLER.with(|handler| handler.struct_span_err(span, &error).emit());
        (Mark::root(), PrivateKind::default(), &self.0[0].class_name)
    }
}

#[derive(Copy, Clone, PartialEq, Default, Eq)]
pub(super) struct PrivateKind {
    pub is_static: bool,
    pub is_method: bool,
    pub has_getter: bool,
    pub has_setter: bool,
}

impl PrivateKind {
    fn is_readonly(&self) -> bool {
        self.is_method && !self.has_setter
    }

    fn is_writeonly(&self) -> bool {
        // a private method can still be read
        self.is_method && !self.has_getter && self.has_setter
    }

    fn is_method(&self) -> bool {
        self.is_method && !self.has_getter && !self.has_setter
    }
}

pub(super) struct BrandCheckHandler<'a> {
    pub private: &'a PrivateRecord,
}

#[swc_trace]
impl VisitMut for BrandCheckHandler<'_> {
    noop_visit_mut_type!(fail);

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
                    if curr_class.sym == right.sym && curr_class.ctxt == right.ctxt {
                        *e = BinExpr {
                            span: *span,
                            op: op!("==="),
                            left: curr_class.clone().into(),
                            right: right.clone().into(),
                        }
                        .into();
                        return;
                    }
                }

                let (mark, kind, class_name) = self.private.get(n.span, &n.name);

                if mark == Mark::root() {
                    return;
                }

                if kind.is_static {
                    *e = BinExpr {
                        span: *span,
                        op: op!("==="),
                        left: right.take(),
                        right: class_name.clone().into(),
                    }
                    .into();
                    return;
                }

                let weak_coll_ident = Ident::new(
                    format!("_{}", n.name).into(),
                    n.span,
                    SyntaxContext::empty().apply_mark(mark),
                );

                *e = CallExpr {
                    span: *span,
                    callee: weak_coll_ident.make_member(quote_ident!("has")).as_callee(),
                    args: vec![right.take().as_arg()],

                    ..Default::default()
                }
                .into();
            }

            _ => {}
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(super) enum PrivateAccessType {
    Get,
    DestructureSet,
    Update,
}

impl Default for PrivateAccessType {
    fn default() -> Self {
        Self::Get
    }
}

pub(super) struct PrivateAccessVisitor<'a> {
    pub vars: Vec<VarDeclarator>,
    pub private: &'a PrivateRecord,
    pub private_access_type: PrivateAccessType,
    pub c: Config,
    pub unresolved_mark: Mark,
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
                prepend_stmt(
                    &mut f.body.as_mut().unwrap().stmts,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.vars.take(),

                        ..Default::default()
                    }
                    .into(),
                )
            }

            self.vars = old_var;
        }
    };
}

// super.#sdsa is invalid
#[swc_trace]
impl VisitMut for PrivateAccessVisitor<'_> {
    noop_visit_mut_type!(fail);

    take_vars!(visit_mut_function, Function);

    take_vars!(visit_mut_constructor, Constructor);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if let Expr::OptChain(opt) = e {
            let is_private_access = match &*opt.base {
                OptChainBase::Member(MemberExpr {
                    prop: MemberProp::PrivateName(..),
                    ..
                }) => true,
                OptChainBase::Call(OptCall { callee, .. }) => matches!(
                    &**callee,
                    Expr::Member(MemberExpr {
                        prop: MemberProp::PrivateName(..),
                        ..
                    })
                ),
                _ => false,
            };

            if is_private_access {
                let mut v = optional_chaining_impl(
                    crate::optional_chaining_impl::Config {
                        no_document_all: self.c.no_document_all,
                        pure_getter: self.c.pure_getter,
                    },
                    self.unresolved_mark,
                );
                e.visit_mut_with(&mut v);
                assert!(!e.is_opt_chain(), "optional chaining should be removed");
                self.vars.extend(v.take_vars());
            }
        }

        if self.c.private_as_properties {
            if let Expr::Member(MemberExpr {
                span,
                obj,
                prop: MemberProp::PrivateName(n),
            }) = e
            {
                obj.visit_mut_children_with(self);
                let (mark, _, _) = self.private.get(n.span, &n.name);
                let ident = Ident::new(
                    format!("_{}", n.name).into(),
                    n.span,
                    SyntaxContext::empty().apply_mark(mark),
                );

                *e = CallExpr {
                    callee: helper!(class_private_field_loose_base),
                    span: *span,
                    args: vec![obj.take().as_arg(), ident.clone().as_arg()],
                    ..Default::default()
                }
                .computed_member(ident)
                .into();
            } else {
                e.visit_mut_children_with(self)
            }
            return;
        }

        match e {
            Expr::Update(UpdateExpr { arg, .. }) if arg.is_member() => {
                let old_access_type = self.private_access_type;

                self.private_access_type = PrivateAccessType::Update;
                arg.visit_mut_with(self);
                self.private_access_type = old_access_type;
            }

            Expr::Assign(AssignExpr {
                span,
                left,
                op,
                right,
            }) if left.as_simple().is_some() && left.as_simple().unwrap().is_member() => {
                let mut left: MemberExpr = left.take().expect_simple().expect_member();
                left.visit_mut_with(self);
                right.visit_mut_with(self);

                let n = match &left.prop {
                    MemberProp::PrivateName(n) => n.clone(),
                    _ => {
                        *e = AssignExpr {
                            span: *span,
                            left: left.into(),
                            op: *op,
                            right: right.take(),
                        }
                        .into();

                        return;
                    }
                };

                let obj = left.obj.clone();

                let (mark, kind, class_name) = self.private.get(n.span, &n.name);
                if mark == Mark::root() {
                    return;
                }

                let ident = Ident::new(
                    format!("_{}", n.name).into(),
                    n.span,
                    SyntaxContext::empty().apply_mark(mark),
                );

                let var = alias_ident_for(&obj, "_ref");

                let this = if matches!(*obj, Expr::This(..)) {
                    Box::new(ThisExpr { span: DUMMY_SP }.into())
                } else if *op == op!("=") {
                    obj
                } else {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: var.clone().into(),
                        init: None,
                        definite: false,
                    });
                    Box::new(
                        AssignExpr {
                            span: obj.span(),
                            left: var.clone().into(),
                            op: op!("="),
                            right: obj,
                        }
                        .into(),
                    )
                };

                let value = if *op == op!("=") {
                    right.take()
                } else {
                    let left = Box::new(self.visit_mut_private_get(&mut left, Some(var)).0);

                    Box::new(
                        BinExpr {
                            span: DUMMY_SP,
                            left,
                            op: op.to_update().unwrap(),
                            right: right.take(),
                        }
                        .into(),
                    )
                };

                if kind.is_static {
                    *e = CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(class_static_private_field_spec_set),
                        args: vec![
                            this.as_arg(),
                            class_name.clone().as_arg(),
                            ident.as_arg(),
                            value.as_arg(),
                        ],

                        ..Default::default()
                    }
                    .into();
                } else if kind.is_readonly() {
                    let err = CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(read_only_error),
                        args: vec![format!("#{}", n.name).as_arg()],
                        ..Default::default()
                    }
                    .into();
                    *e = SeqExpr {
                        span: *span,
                        exprs: vec![this, value, err],
                    }
                    .into();
                } else {
                    let set = helper!(class_private_field_set);

                    *e = CallExpr {
                        span: DUMMY_SP,
                        callee: set,
                        args: vec![this.as_arg(), ident.as_arg(), value.as_arg()],

                        ..Default::default()
                    }
                    .into();
                }
            }

            Expr::Assign(AssignExpr {
                left: AssignTarget::Pat(left),

                right,
                ..
            }) => {
                right.visit_mut_with(self);
                let old_access_type = self.private_access_type;

                self.private_access_type = PrivateAccessType::DestructureSet;
                left.visit_mut_with(self);
                self.private_access_type = old_access_type;
            }

            // Actually this is a call and we should bind `this`.
            Expr::TaggedTpl(TaggedTpl { span, tag, tpl, .. }) if tag.is_member() => {
                let mut tag = tag.take().member().unwrap();
                tag.visit_mut_with(self);
                tpl.visit_mut_with(self);

                let (expr, this) = self.visit_mut_private_get(&mut tag, None);

                if let Some(this) = this {
                    *e = TaggedTpl {
                        span: *span,
                        tag: CallExpr {
                            span: DUMMY_SP,
                            callee: expr.make_member(quote_ident!("bind")).as_callee(),
                            args: vec![this.as_arg()],
                            ..Default::default()
                        }
                        .into(),
                        tpl: tpl.take(),
                        ..Default::default()
                    }
                    .into();
                } else {
                    *e = TaggedTpl {
                        span: *span,
                        tag: Box::new(expr),
                        tpl: tpl.take(),
                        ..Default::default()
                    }
                    .into();
                }
            }

            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                ..
            }) if callee.is_member() => {
                let mut callee = callee.take().member().unwrap();
                callee.visit_mut_with(self);
                args.visit_mut_with(self);

                let (expr, this) = self.visit_mut_private_get(&mut callee, None);
                if let Some(this) = this {
                    *e = CallExpr {
                        span: *span,
                        callee: expr.make_member(quote_ident!("call")).as_callee(),
                        args: iter::once(this.as_arg()).chain(args.take()).collect(),
                        ..Default::default()
                    }
                    .into();
                } else {
                    *e = CallExpr {
                        span: *span,
                        callee: expr.as_callee(),
                        args: args.take(),
                        ..Default::default()
                    }
                    .into();
                }
            }

            Expr::Member(member_expr) => {
                member_expr.visit_mut_children_with(self);
                *e = self.visit_mut_private_get(member_expr, None).0;
            }

            _ => e.visit_mut_children_with(self),
        };
    }

    fn visit_mut_simple_assign_target(&mut self, e: &mut SimpleAssignTarget) {
        if let SimpleAssignTarget::OptChain(opt) = e {
            let is_private_access = match &*opt.base {
                OptChainBase::Member(MemberExpr {
                    prop: MemberProp::PrivateName(..),
                    ..
                }) => true,
                OptChainBase::Call(OptCall { callee, .. }) => matches!(
                    &**callee,
                    Expr::Member(MemberExpr {
                        prop: MemberProp::PrivateName(..),
                        ..
                    })
                ),
                _ => false,
            };

            if is_private_access {
                let mut v = optional_chaining_impl(
                    crate::optional_chaining_impl::Config {
                        no_document_all: self.c.no_document_all,
                        pure_getter: self.c.pure_getter,
                    },
                    self.unresolved_mark,
                );
                e.visit_mut_with(&mut v);
                assert!(!e.is_opt_chain(), "optional chaining should be removed");
                self.vars.extend(v.take_vars());
            }
        }

        if self.c.private_as_properties {
            if let SimpleAssignTarget::Member(MemberExpr {
                span,
                obj,
                prop: MemberProp::PrivateName(n),
            }) = e
            {
                obj.visit_mut_children_with(self);
                let (mark, _, _) = self.private.get(n.span, &n.name);
                let ident = Ident::new(
                    format!("_{}", n.name).into(),
                    n.span,
                    SyntaxContext::empty().apply_mark(mark),
                );

                *e = CallExpr {
                    callee: helper!(class_private_field_loose_base),
                    span: *span,
                    args: vec![obj.take().as_arg(), ident.clone().as_arg()],
                    ..Default::default()
                }
                .computed_member(ident)
                .into();
            } else {
                e.visit_mut_children_with(self)
            }
            return;
        }

        e.visit_mut_children_with(self)
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        if let Pat::Expr(expr) = &p {
            if let Expr::Member(me) = &**expr {
                if let MemberProp::PrivateName(..) = &me.prop {
                    let old_access_type = self.private_access_type;
                    self.private_access_type = PrivateAccessType::DestructureSet;
                    p.visit_mut_children_with(self);
                    self.private_access_type = old_access_type;

                    return;
                }
            }
        }

        self.private_access_type = Default::default();
        p.visit_mut_children_with(self);
    }
}

pub(super) fn visit_private_in_expr(
    expr: &mut Expr,
    private: &PrivateRecord,
    config: Config,
    unresolved_mark: Mark,
) -> Vec<VarDeclarator> {
    let mut priv_visitor = PrivateAccessVisitor {
        private,
        vars: Vec::new(),
        private_access_type: Default::default(),
        c: config,
        unresolved_mark,
    };

    expr.visit_mut_with(&mut priv_visitor);

    priv_visitor.vars
}

#[swc_trace]
impl PrivateAccessVisitor<'_> {
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

        let (mark, kind, class_name) = self.private.get(n.span, &n.name);
        if mark == Mark::root() {
            return (Expr::dummy(), None);
        }

        let method_name = Ident::new(
            if n.name.is_reserved_in_any() {
                format!("__{}", n.name).into()
            } else {
                n.name.clone()
            },
            n.span,
            SyntaxContext::empty().apply_mark(mark),
        );
        let ident = Ident::new(
            format!("_{}", n.name).into(),
            n.span,
            SyntaxContext::empty().apply_mark(mark),
        );

        if kind.is_static {
            match self.private_access_type {
                PrivateAccessType::DestructureSet => {
                    let set = helper!(class_static_private_field_destructure);

                    return (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![
                                obj.clone().as_arg(),
                                class_name.clone().as_arg(),
                                ident.as_arg(),
                            ],
                            ..Default::default()
                        }
                        .make_member(quote_ident!("value"))
                        .into(),
                        Some(*obj),
                    );
                }
                PrivateAccessType::Update => {
                    let set = helper!(class_static_private_field_update);

                    return (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![
                                obj.clone().as_arg(),
                                class_name.clone().as_arg(),
                                ident.as_arg(),
                            ],

                            ..Default::default()
                        }
                        .make_member(quote_ident!("value"))
                        .into(),
                        Some(*obj),
                    );
                }
                _ => {}
            }

            if kind.is_method() {
                let h = helper!(class_static_private_method_get);

                return (
                    CallExpr {
                        span: DUMMY_SP,
                        callee: h,
                        args: vec![
                            obj.as_arg(),
                            class_name.clone().as_arg(),
                            method_name.as_arg(),
                        ],
                        ..Default::default()
                    }
                    .into(),
                    Some(class_name.clone().into()),
                );
            }

            let get = helper!(class_static_private_field_spec_get);

            (
                CallExpr {
                    span: DUMMY_SP,
                    callee: get,
                    args: vec![obj.as_arg(), class_name.clone().as_arg(), ident.as_arg()],
                    ..Default::default()
                }
                .into(),
                Some(class_name.clone().into()),
            )
        } else {
            match self.private_access_type {
                PrivateAccessType::DestructureSet => {
                    let set = helper!(class_private_field_destructure);

                    (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![obj.clone().as_arg(), ident.as_arg()],

                            ..Default::default()
                        }
                        .make_member(quote_ident!("value"))
                        .into(),
                        Some(*obj),
                    )
                }
                PrivateAccessType::Update => {
                    let set = helper!(class_private_field_update);

                    (
                        CallExpr {
                            span: DUMMY_SP,
                            callee: set,
                            args: vec![obj.clone().as_arg(), ident.as_arg()],

                            ..Default::default()
                        }
                        .make_member(quote_ident!("value"))
                        .into(),
                        Some(*obj),
                    )
                }

                PrivateAccessType::Get if kind.is_writeonly() => {
                    let helper = helper!(write_only_error);
                    let expr = Box::new(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: helper,
                            args: vec![format!("#{}", n.name).as_arg()],
                            ..Default::default()
                        }
                        .into(),
                    );
                    (
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs: vec![obj.clone(), expr],
                        }
                        .into(),
                        Some(*obj),
                    )
                }

                PrivateAccessType::Get => {
                    let get = if self.c.private_as_properties {
                        helper!(class_private_field_loose_base)
                    } else if kind.is_method() {
                        helper!(class_private_method_get)
                    } else {
                        helper!(class_private_field_get)
                    };

                    match &*obj {
                        Expr::This(this) => (
                            if kind.is_method() && !self.c.private_as_properties {
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: get,
                                    args: vec![
                                        obj.clone().as_arg(),
                                        ident.as_arg(),
                                        method_name.as_arg(),
                                    ],
                                    ..Default::default()
                                }
                                .into()
                            } else {
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: get,
                                    args: vec![this.as_arg(), ident.as_arg()],
                                    ..Default::default()
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
                                    left: var.clone().into(),
                                    op: op!("="),
                                    right: obj.take(),
                                }
                                .as_arg()
                            } else {
                                var.clone().as_arg()
                            };

                            let args = if kind.is_method() {
                                vec![first_arg, ident.as_arg(), method_name.as_arg()]
                            } else {
                                vec![first_arg, ident.as_arg()]
                            };

                            (
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: get,
                                    args,
                                    ..Default::default()
                                }
                                .into(),
                                Some(var.into()),
                            )
                        }
                    }
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
