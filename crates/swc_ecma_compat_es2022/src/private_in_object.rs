use std::{
    borrow::Cow,
    mem::{replace, take},
};

use swc_atoms::JsWord;
use swc_common::{
    collections::AHashSet, pass::CompilerPass, util::take::Take, Mark, Spanned, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    default_constructor_with_span, prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl Pass {
    visit_mut_pass(PrivateInObject::default())
}

#[derive(Debug)]
enum Mode {
    ClassExpr {
        vars: Vec<VarDeclarator>,
        init_exprs: Vec<Box<Expr>>,
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
                            left: n.into(),
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
struct PrivateInObject {
    vars: Vec<VarDeclarator>,
    prepend_exprs: Vec<Box<Expr>>,

    injected_vars: AHashSet<Id>,
    cls: ClassData,
}

#[derive(Default)]
struct ClassData {
    ident: Option<Ident>,

    vars: Mode,

    /// [Mark] for the current class.
    ///
    /// This is modified by the class visitor.
    mark: Mark,

    privates: AHashSet<JsWord>,

    /// Name of private methods.
    methods: Vec<JsWord>,

    /// Name of private statics.
    statics: Vec<JsWord>,

    constructor_exprs: Vec<Box<Expr>>,

    names_used_for_brand_checks: AHashSet<JsWord>,
}

impl CompilerPass for PrivateInObject {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl PrivateInObject {
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
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, n: &mut Class) {
        {
            n.visit_children_with(&mut ClassAnalyzer {
                brand_check_names: &mut self.cls.names_used_for_brand_checks,
                ignore_class: true,
            })
        }

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

        n.visit_mut_children_with(self);

        if !self.cls.constructor_exprs.is_empty() {
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
                                expr,
                            }
                            .into(),
                        );
                    }
                }
            }
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old_cls = take(&mut self.cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident = Some(n.ident.clone());
        self.cls.vars = Mode::ClassDecl {
            vars: Default::default(),
        };

        n.visit_mut_children_with(self);

        match &mut self.cls.vars {
            Mode::ClassDecl { vars } => {
                self.vars.extend(take(vars));
            }
            _ => {
                unreachable!()
            }
        }

        self.cls = old_cls;
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let old_cls = take(&mut self.cls);

        self.cls.mark = Mark::fresh(Mark::root());
        self.cls.ident.clone_from(&n.ident);
        self.cls.vars = Mode::ClassExpr {
            vars: Default::default(),
            init_exprs: Default::default(),
        };

        n.visit_mut_children_with(self);

        match &mut self.cls.vars {
            Mode::ClassExpr { vars, init_exprs } => {
                self.vars.extend(take(vars));
                self.prepend_exprs.extend(take(init_exprs));
            }
            _ => {
                unreachable!()
            }
        }

        self.cls = old_cls;
    }

    fn visit_mut_assign_pat(&mut self, p: &mut AssignPat) {
        p.left.visit_mut_with(self);

        {
            let mut buf = AHashSet::default();
            let mut v = ClassAnalyzer {
                brand_check_names: &mut buf,
                ignore_class: false,
            };
            p.right.visit_with(&mut v);

            if buf.is_empty() {
                p.right.visit_mut_with(self);
            } else {
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
                bs.visit_mut_with(self);

                p.right = CallExpr {
                    span: DUMMY_SP,
                    callee: ArrowExpr {
                        span: DUMMY_SP,
                        params: Default::default(),
                        body: Box::new(BlockStmtOrExpr::BlockStmt(bs)),
                        is_async: false,
                        is_generator: false,
                        ..Default::default()
                    }
                    .as_callee(),
                    args: Default::default(),
                    ..Default::default()
                }
                .into();
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let prev_prepend_exprs = take(&mut self.prepend_exprs);

        e.visit_mut_children_with(self);

        let mut prepend_exprs = replace(&mut self.prepend_exprs, prev_prepend_exprs);

        if !prepend_exprs.is_empty() {
            match e {
                Expr::Seq(e) => {
                    e.exprs = prepend_exprs.into_iter().chain(e.exprs.take()).collect();
                }
                _ => {
                    prepend_exprs.push(Box::new(e.take()));
                    *e = SeqExpr {
                        span: DUMMY_SP,
                        exprs: prepend_exprs,
                    }
                    .into();
                }
            }
            return;
        }

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
                                ..Default::default()
                            }
                            .into(),
                        ),
                    );

                    if is_method {
                        self.cls.constructor_exprs.push(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: var_name
                                    .clone()
                                    .make_member(quote_ident!("add"))
                                    .as_callee(),
                                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                                ..Default::default()
                            }
                            .into(),
                        );
                    }
                }

                *e = CallExpr {
                    span: *span,
                    callee: var_name.make_member(quote_ident!("has")).as_callee(),
                    args: vec![right.take().as_arg()],
                    ..Default::default()
                }
                .into();
            }

            _ => {}
        }
    }

    fn visit_mut_module_items(&mut self, ns: &mut Vec<ModuleItem>) {
        ns.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                ns,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: take(&mut self.vars),
                    ..Default::default()
                }
                .into(),
            );
        }
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        n.visit_mut_children_with(self);

        if self.cls.names_used_for_brand_checks.contains(&n.key.name) {
            let var_name = self.var_name_for_brand_check(&n.key);

            match &mut n.value {
                Some(init) => {
                    let init_span = init.span();

                    let tmp = private_ident!("_tmp");

                    self.cls.vars.push_var(tmp.clone(), None);

                    let assign = AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: tmp.clone().into(),
                        right: init.take(),
                    }
                    .into();

                    let add_to_checker = CallExpr {
                        span: DUMMY_SP,
                        callee: var_name.make_member(quote_ident!("add")).as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                        ..Default::default()
                    }
                    .into();

                    *init = SeqExpr {
                        span: init_span,
                        exprs: vec![assign, add_to_checker, Box::new(tmp.into())],
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
                                    args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                                    ..Default::default()
                                }
                                .into(),
                            ),
                        }
                        .into(),
                    )
                }
            }
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(_) = n {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        s.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                s,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: take(&mut self.vars),
                    ..Default::default()
                }
                .into(),
            );
        }
    }
}

struct ClassAnalyzer<'a> {
    brand_check_names: &'a mut AHashSet<JsWord>,
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
