use std::mem::take;

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{default_constructor_with_span, prepend_stmt, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, Visit, VisitMut, VisitMutWith, VisitWith};

pub use crate::features::Features;
use crate::es2022::private_in_object::{ClassAnalyzer, ClassData, Mode};
use crate::es2022::static_blocks::generate_uid;

mod features;
pub mod es2022;

#[derive(Debug)]
pub struct Compiler {
    config: Config,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self { config }
    }
}

#[derive(Debug)]
pub struct Config {
    /// Always compile these syntaxes.
    pub includes: Features,
    /// Always preserve these syntaxes.
    pub excludes: Features,
}

impl Pass for Compiler {
    fn process(&mut self, program: &mut swc_ecma_ast::Program) {
        program.visit_mut_with(&mut CompilerImpl::new(&self.config));
    }
}

struct CompilerImpl<'a> {
    config: &'a Config,
    
    // State for private_in_object
    vars: Vec<VarDeclarator>,
    prepend_exprs: Vec<Box<Expr>>,
    injected_vars: FxHashSet<Id>,
    cls: ClassData,
}

impl<'a> CompilerImpl<'a> {
    fn new(config: &'a Config) -> Self {
        Self {
            config,
            vars: Vec::new(),
            prepend_exprs: Vec::new(),
            injected_vars: FxHashSet::default(),
            cls: ClassData::default(),
        }
    }
}

impl<'a> VisitMut for CompilerImpl<'a> {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, class: &mut Class) {
        // Static blocks transformation
        if self.config.includes.contains(Features::STATIC_BLOCKS) {
            class.visit_mut_children_with(self);

            let mut private_names = FxHashSet::default();
            for member in &class.body {
                if let ClassMember::PrivateProp(private_property) = member {
                    private_names.insert(private_property.key.name.clone());
                }
            }

            let mut count = 0;
            for member in class.body.iter_mut() {
                if let ClassMember::StaticBlock(static_block) = member {
                    if static_block.body.stmts.is_empty() {
                        *member = ClassMember::dummy();
                        continue;
                    }

                    let static_block_private_id = generate_uid(&private_names, &mut count);
                    *member = self
                        .transform_static_block(static_block.take(), static_block_private_id)
                        .into();
                };
            }
        }

        // Private in object transformation
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            {
                class.visit_children_with(&mut ClassAnalyzer {
                    brand_check_names: &mut self.cls.names_used_for_brand_checks,
                    ignore_class: true,
                })
            }

            for m in &class.body {
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

            class.visit_mut_children_with(self);

            if !self.cls.constructor_exprs.is_empty() {
                let has_constructor = class
                    .body
                    .iter()
                    .any(|m| matches!(m, ClassMember::Constructor(_)));

                if !has_constructor {
                    let has_super = class.super_class.is_some();
                    class.body
                        .push(ClassMember::Constructor(default_constructor_with_span(
                            has_super, class.span,
                        )));
                }

                for m in &mut class.body {
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
        } else {
            class.visit_mut_children_with(self);
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
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
        } else {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
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
        } else {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_assign_pat(&mut self, p: &mut AssignPat) {
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            p.left.visit_mut_with(self);

            {
                let mut buf = FxHashSet::default();
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
        } else {
            p.visit_mut_children_with(self);
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            let prev_prepend_exprs = take(&mut self.prepend_exprs);

            e.visit_mut_children_with(self);

            let mut prepend_exprs = std::mem::replace(&mut self.prepend_exprs, prev_prepend_exprs);

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

                    let var_name = self.var_name_for_brand_check(&left, &self.cls);

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
                                        .make_member(IdentName::new("add".into(), DUMMY_SP))
                                        .as_callee(),
                                    args: vec![ExprOrSpread {
                                spread: None,
                                expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                            }],
                                    ..Default::default()
                                }
                                .into(),
                            );
                        }
                    }

                    *e = CallExpr {
                        span: *span,
                        callee: var_name.make_member(IdentName::new("has".into(), DUMMY_SP)).as_callee(),
                        args: vec![ExprOrSpread {
                            spread: None,
                            expr: right.take(),
                        }],
                        ..Default::default()
                    }
                    .into();
                }

                _ => {}
            }
        } else {
            e.visit_mut_children_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, ns: &mut Vec<ModuleItem>) {
        ns.visit_mut_children_with(self);

        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) && !self.vars.is_empty() {
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
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            n.visit_mut_children_with(self);

            if self.cls.names_used_for_brand_checks.contains(&n.key.name) {
                let var_name = self.var_name_for_brand_check(&n.key, &self.cls);

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
                            callee: var_name.make_member(IdentName::new("add".into(), DUMMY_SP)).as_callee(),
                            args: vec![ExprOrSpread {
                                spread: None,
                                expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                            }],
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
                                        callee: var_name.make_member(IdentName::new("add".into(), DUMMY_SP)).as_callee(),
                                        args: vec![ExprOrSpread {
                                spread: None,
                                expr: Box::new(ThisExpr { span: DUMMY_SP }.into()),
                            }],
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
        } else {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(_) = n {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        s.visit_mut_children_with(self);

        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) && !self.vars.is_empty() {
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
