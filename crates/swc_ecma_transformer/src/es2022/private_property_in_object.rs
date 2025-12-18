//! ES2022: Private Property in Object
//!
//! This module transforms `#private in object` expressions into WeakSet-based
//! brand checks.
//!
//! ## Example
//!
//! Input:
//! ```js
//! class Foo {
//!     #foo() {}
//!     test(other) {
//!         return #foo in other;
//!     }
//! }
//! ```
//!
//! Output:
//! ```js
//! var _brand_check_foo = new WeakSet();
//! class Foo {
//!     constructor() {
//!         _brand_check_foo.add(this);
//!     }
//!     #foo() {}
//!     test(other) {
//!         return _brand_check_foo.has(other);
//!     }
//! }
//! ```
//!
//! ## References
//! * TC39 proposal: <https://github.com/tc39/proposal-private-fields-in-in>

use std::mem::take;

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{default_constructor_with_span, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    PrivatePropertyInObjectPass::default()
}

#[derive(Debug)]
enum Mode {
    ClassExpr {
        vars: Vec<VarDeclarator>,
        init_exprs: Vec<Expr>,
    },
    ClassDecl {
        vars: Vec<VarDeclarator>,
    },
}

impl Default for Mode {
    fn default() -> Self {
        Self::ClassDecl {
            vars: Default::default(),
        }
    }
}

impl Mode {
    fn push_var(&mut self, n: Ident, init: Option<Box<Expr>>) {
        match self {
            Mode::ClassExpr { vars, init_exprs } => {
                vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: n.clone().into(),
                    init: None,
                    definite: Default::default(),
                });
                if let Some(init) = init {
                    init_exprs.push(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                                id: n,
                                type_ann: None,
                            })),
                            right: init,
                        }
                        .into(),
                    );
                }
            }
            Mode::ClassDecl { vars } => {
                vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: n.into(),
                    init,
                    definite: Default::default(),
                });
            }
        }
    }
}

#[derive(Default)]
struct PrivatePropertyInObjectPass {
    vars: Vec<VarDeclarator>,
    prepend_exprs: Vec<Expr>,
    prepend_exprs_stack: Vec<Vec<Expr>>,

    injected_vars: FxHashSet<Id>,
    cls: ClassData,
    cls_stack: Vec<ClassData>,
}

#[derive(Default)]
struct ClassData {
    ident: Option<Ident>,

    vars: Mode,

    /// [Mark] for the current class.
    ///
    /// This is modified by the class visitor.
    mark: Mark,

    privates: FxHashSet<Atom>,

    /// Name of private methods.
    methods: Vec<Atom>,

    /// Name of private statics.
    statics: Vec<Atom>,

    constructor_exprs: Vec<Expr>,

    names_used_for_brand_checks: FxHashSet<Atom>,
}

impl PrivatePropertyInObjectPass {
    fn var_name_for_brand_check(&self, n: &PrivateName) -> Ident {
        let is_static = self.cls.statics.contains(&n.name);

        let span = n.span;
        let ctxt = SyntaxContext::empty().apply_mark(self.cls.mark);

        if !is_static && self.cls.methods.contains(&n.name) {
            if let Some(cls_name) = &self.cls.ident {
                return Ident::new(format!("_brand_check_{}", cls_name.sym).into(), span, ctxt);
            }
        }

        Ident::new(format!("_brand_check_{}", n.name).into(), span, ctxt)
    }

    fn analyze_class(&mut self, n: &Class) {
        n.visit_children_with(&mut ClassAnalyzer {
            brand_check_names: &mut self.cls.names_used_for_brand_checks,
            ignore_class: true,
        });

        for m in &n.body {
            match m {
                ClassMember::PrivateMethod(m) => {
                    self.cls.privates.insert(m.key.name.clone());
                    self.cls.methods.push(m.key.name.clone());

                    if m.is_static {
                        self.cls.statics.push(m.key.name.clone());
                    }
                }
                ClassMember::PrivateProp(m) => {
                    self.cls.privates.insert(m.key.name.clone());

                    if m.is_static {
                        self.cls.statics.push(m.key.name.clone());
                    }
                }
                _ => {}
            }
        }
    }

    fn inject_constructor_exprs(&mut self, n: &mut Class) {
        if self.cls.constructor_exprs.is_empty() {
            return;
        }

        let has_constructor = n
            .body
            .iter()
            .any(|m| matches!(m, ClassMember::Constructor(_)));

        if !has_constructor {
            let has_super = n.super_class.is_some();
            n.body
                .push(ClassMember::Constructor(default_constructor_with_span(
                    has_super, n.span,
                )));
        }

        for m in &mut n.body {
            if let ClassMember::Constructor(Constructor {
                body: Some(body), ..
            }) = m
            {
                for expr in take(&mut self.cls.constructor_exprs) {
                    body.stmts.push(
                        ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(expr),
                        }
                        .into(),
                    );
                }
            }
        }
    }
}

impl VisitMutHook<TraverseCtx> for PrivatePropertyInObjectPass {
    fn enter_class_decl(&mut self, n: &mut ClassDecl, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident = Some(n.ident.clone());
        self.cls.vars = Mode::ClassDecl {
            vars: Default::default(),
        };

        self.analyze_class(&n.class);
    }

    fn exit_class_decl(&mut self, _n: &mut ClassDecl, _ctx: &mut TraverseCtx) {
        match &mut self.cls.vars {
            Mode::ClassDecl { vars } => {
                self.vars.extend(take(vars));
            }
            _ => {
                unreachable!()
            }
        }

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn enter_class_expr(&mut self, n: &mut ClassExpr, _ctx: &mut TraverseCtx) {
        let old_cls = take(&mut self.cls);
        self.cls_stack.push(old_cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident.clone_from(&n.ident);
        self.cls.vars = Mode::ClassExpr {
            vars: Default::default(),
            init_exprs: Default::default(),
        };

        self.analyze_class(&n.class);
    }

    fn exit_class_expr(&mut self, _n: &mut ClassExpr, _ctx: &mut TraverseCtx) {
        match &mut self.cls.vars {
            Mode::ClassExpr { vars, init_exprs } => {
                self.vars.extend(take(vars));
                self.prepend_exprs.extend(take(init_exprs));
            }
            _ => {
                unreachable!()
            }
        }

        self.cls = self.cls_stack.pop().unwrap();
    }

    fn exit_class(&mut self, n: &mut Class, _ctx: &mut TraverseCtx) {
        self.inject_constructor_exprs(n);
    }

    fn enter_assign_pat(&mut self, p: &mut AssignPat, _ctx: &mut TraverseCtx) {
        // Check if the right side has any private-in expressions
        let mut buf = FxHashSet::default();
        let mut v = ClassAnalyzer {
            brand_check_names: &mut buf,
            ignore_class: false,
        };
        p.right.visit_with(&mut v);

        if !buf.is_empty() {
            // Wrap the right side in an IIFE to handle nested classes
            let mut bs = BlockStmt {
                span: DUMMY_SP,
                stmts: Vec::new(),
                ..Default::default()
            };
            bs.stmts.push(
                ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(p.right.take()),
                }
                .into(),
            );

            p.right = CallExpr {
                span: DUMMY_SP,
                callee: ArrowExpr {
                    span: DUMMY_SP,
                    params: Default::default(),
                    body: Box::new(BlockStmtOrExpr::BlockStmt(bs)),
                    is_async: false,
                    is_generator: false,
                    type_params: Default::default(),
                    return_type: Default::default(),
                    ctxt: Default::default(),
                }
                .as_callee(),
                args: Default::default(),
                type_args: Default::default(),
                ctxt: Default::default(),
            }
            .into();
        }
    }

    fn enter_expr(&mut self, _e: &mut Expr, _ctx: &mut TraverseCtx) {
        // Save the current prepend_exprs before visiting children
        self.prepend_exprs_stack.push(take(&mut self.prepend_exprs));
    }

    fn exit_expr(&mut self, e: &mut Expr, _ctx: &mut TraverseCtx) {
        // Get accumulated prepend_exprs from children
        let mut prepend_exprs = take(&mut self.prepend_exprs);

        // Restore parent's prepend_exprs
        self.prepend_exprs = self.prepend_exprs_stack.pop().unwrap();

        // If we have expressions to prepend, wrap in SeqExpr
        if !prepend_exprs.is_empty() {
            match e {
                Expr::Seq(seq) => {
                    seq.exprs = prepend_exprs
                        .into_iter()
                        .map(Box::new)
                        .chain(seq.exprs.take())
                        .collect();
                }
                _ => {
                    prepend_exprs.push(e.take());
                    *e = SeqExpr {
                        span: DUMMY_SP,
                        exprs: prepend_exprs.into_iter().map(Box::new).collect(),
                    }
                    .into();
                }
            }
            return;
        }

        // Transform `#private in object` to `WeakSet.has(object)`
        match e {
            Expr::Bin(BinExpr {
                span,
                op: op!("in"),
                left,
                right,
            }) if left.is_private_name() => {
                let left = left.take().expect_private_name();

                let is_static = self.cls.statics.contains(&left.name);
                let is_method = self.cls.methods.contains(&left.name);

                // Optimize: static methods can use simple === comparison
                if let Some(cls_ident) = self.cls.ident.clone() {
                    if is_static && is_method {
                        *e = BinExpr {
                            span: *span,
                            op: op!("==="),
                            left: cls_ident.into(),
                            right: right.take(),
                        }
                        .into();
                        return;
                    }
                }

                let var_name = self.var_name_for_brand_check(&left);

                // Create WeakSet if not already created
                if self.cls.privates.contains(&left.name)
                    && self.injected_vars.insert(var_name.to_id())
                {
                    self.cls.vars.push_var(
                        var_name.clone(),
                        Some(
                            NewExpr {
                                span: DUMMY_SP,
                                callee: Box::new(quote_ident!("WeakSet").into()),
                                args: Some(Default::default()),
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        ),
                    );

                    // For methods, add initialization in constructor
                    if is_method {
                        self.cls.constructor_exprs.push(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: var_name
                                    .clone()
                                    .make_member(quote_ident!("add"))
                                    .as_callee(),
                                args: vec![ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                }],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        );
                    }
                }

                // Transform to WeakSet.has() call
                *e = CallExpr {
                    span: *span,
                    callee: var_name.make_member(quote_ident!("has")).as_callee(),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: right.take(),
                    }],
                    type_args: Default::default(),
                    ctxt: Default::default(),
                }
                .into();
            }

            _ => {}
        }
    }

    fn exit_private_prop(&mut self, n: &mut PrivateProp, _ctx: &mut TraverseCtx) {
        if !self.cls.names_used_for_brand_checks.contains(&n.key.name) {
            return;
        }

        let var_name = self.var_name_for_brand_check(&n.key);

        match &mut n.value {
            Some(init) => {
                let init_span = init.span();

                let tmp = private_ident!("_tmp");

                self.cls.vars.push_var(tmp.clone(), None);

                let assign = AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: tmp.clone(),
                        type_ann: None,
                    })),
                    right: init.take(),
                }
                .into();

                let add_to_checker = CallExpr {
                    span: DUMMY_SP,
                    callee: var_name.make_member(quote_ident!("add")).as_callee(),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                    }],
                    type_args: Default::default(),
                    ctxt: Default::default(),
                }
                .into();

                *init = SeqExpr {
                    span: init_span,
                    exprs: vec![
                        Box::new(assign),
                        Box::new(add_to_checker),
                        Box::new(tmp.into()),
                    ],
                }
                .into();
            }
            None => {
                n.value = Some(
                    UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("void"),
                        arg: Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: var_name.make_member(quote_ident!("add")).as_callee(),
                                args: vec![ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                }],
                                type_args: Default::default(),
                                ctxt: Default::default(),
                            }
                            .into(),
                        ),
                    }
                    .into(),
                )
            }
        }
    }

    fn exit_stmts(&mut self, s: &mut Vec<Stmt>, _ctx: &mut TraverseCtx) {
        if self.vars.is_empty() {
            return;
        }

        s.insert(
            0,
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: take(&mut self.vars),
                ctxt: Default::default(),
            }
            .into(),
        );
    }

    fn exit_module_items(&mut self, items: &mut Vec<ModuleItem>, _ctx: &mut TraverseCtx) {
        if self.vars.is_empty() {
            return;
        }

        items.insert(
            0,
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: take(&mut self.vars),
                ctxt: Default::default(),
            }
            .into(),
        );
    }
}

struct ClassAnalyzer<'a> {
    brand_check_names: &'a mut FxHashSet<Atom>,
    ignore_class: bool,
}

impl Visit for ClassAnalyzer<'_> {
    noop_visit_type!(fail);

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        n.visit_children_with(self);

        if n.op == op!("in") {
            if let Expr::PrivateName(left) = &*n.left {
                self.brand_check_names.insert(left.name.clone());
            }
        }
    }

    /// Noop
    fn visit_class(&mut self, n: &Class) {
        if self.ignore_class {
            return;
        }

        n.visit_children_with(self);
    }
}
