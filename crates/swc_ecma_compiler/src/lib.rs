#![allow(clippy::vec_box)]

use std::mem::take;

use rustc_hash::FxHashSet;
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::assumptions::Assumptions;
use swc_ecma_utils::{
    default_constructor_with_span, prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use swc_trace_macro::swc_trace;

use crate::es2022::{
    private_in_object::{ClassAnalyzer, ClassData, Mode},
    static_blocks::generate_uid,
};
pub use crate::features::Features;

pub mod compat;
mod es2020;
mod es2021;
mod es2022;
mod features;

#[derive(Debug)]
pub struct Compiler {
    config: Config,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self { config }
    }
}

#[derive(Debug, Default)]
pub struct Config {
    pub assumptions: Assumptions,
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

    // ES2022: Private in object transformation state
    es2022_private_field_helper_vars: Vec<VarDeclarator>,
    es2022_private_field_init_exprs: Vec<Box<Expr>>,
    es2022_injected_weakset_vars: FxHashSet<Id>,
    es2022_current_class_data: ClassData,

    // ES2021: Logical assignments transformation state
    es2021_logical_assignment_vars: Vec<VarDeclarator>,

    // ES2020: Nullish coalescing transformation state
    es2020_nullish_coalescing_vars: Vec<VarDeclarator>,
}

impl<'a> CompilerImpl<'a> {
    fn new(config: &'a Config) -> Self {
        Self {
            config,
            es2022_private_field_helper_vars: Vec::new(),
            es2022_private_field_init_exprs: Vec::new(),
            es2022_injected_weakset_vars: FxHashSet::default(),
            es2022_current_class_data: ClassData::default(),
            es2021_logical_assignment_vars: Vec::new(),
            es2020_nullish_coalescing_vars: Vec::new(),
        }
    }

    /// ES2022: Transform static blocks to static private fields
    fn es2022_static_blocks_to_private_fields(&mut self, class: &mut Class) {
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

    /// ES2022: Analyze class private fields for 'private in object'
    /// transformation
    fn es2022_analyze_private_fields_for_in_operator(&mut self, class: &Class) {
        class.visit_children_with(&mut ClassAnalyzer {
            brand_check_names: &mut self.es2022_current_class_data.names_used_for_brand_checks,
            ignore_class: true,
        });

        for m in &class.body {
            match m {
                ClassMember::PrivateMethod(m) => {
                    self.es2022_current_class_data
                        .privates
                        .insert(m.key.name.clone());
                    self.es2022_current_class_data
                        .methods
                        .push(m.key.name.clone());

                    if m.is_static {
                        self.es2022_current_class_data
                            .statics
                            .push(m.key.name.clone());
                    }
                }

                ClassMember::PrivateProp(m) => {
                    self.es2022_current_class_data
                        .privates
                        .insert(m.key.name.clone());

                    if m.is_static {
                        self.es2022_current_class_data
                            .statics
                            .push(m.key.name.clone());
                    }
                }

                _ => {}
            }
        }
    }

    /// ES2022: Inject WeakSet initialization into constructor for private field
    /// brand checks
    fn es2022_inject_weakset_init_for_private_fields(&mut self, class: &mut Class) {
        if self.es2022_current_class_data.constructor_exprs.is_empty() {
            return;
        }

        let has_constructor = class
            .body
            .iter()
            .any(|m| matches!(m, ClassMember::Constructor(_)));

        if !has_constructor {
            let has_super = class.super_class.is_some();
            class
                .body
                .push(ClassMember::Constructor(default_constructor_with_span(
                    has_super, class.span,
                )));
        }

        for m in &mut class.body {
            if let ClassMember::Constructor(Constructor {
                body: Some(body), ..
            }) = m
            {
                for expr in take(&mut self.es2022_current_class_data.constructor_exprs) {
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

    /// ES2022: Transform 'private in object' expressions to WeakSet.has() calls
    fn es2022_transform_private_in_to_weakset_has(&mut self, e: &mut Expr) -> bool {
        if let Expr::Bin(BinExpr {
            span,
            op: op!("in"),
            left,
            right,
        }) = e
        {
            if left.is_private_name() {
                let left = left.take().expect_private_name();

                let is_static = self.es2022_current_class_data.statics.contains(&left.name);
                let is_method = self.es2022_current_class_data.methods.contains(&left.name);

                if let Some(cls_ident) = self.es2022_current_class_data.ident.clone() {
                    if is_static && is_method {
                        *e = BinExpr {
                            span: *span,
                            op: op!("==="),
                            left: cls_ident.into(),
                            right: right.take(),
                        }
                        .into();
                        return true;
                    }
                }

                let var_name =
                    self.var_name_for_brand_check(&left, &self.es2022_current_class_data);

                if self.es2022_current_class_data.privates.contains(&left.name)
                    && self.es2022_injected_weakset_vars.insert(var_name.to_id())
                {
                    self.es2022_current_class_data.vars.push_var(
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
                        self.es2022_current_class_data.constructor_exprs.push(
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
                    callee: var_name
                        .make_member(IdentName::new("has".into(), DUMMY_SP))
                        .as_callee(),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: right.take(),
                    }],
                    ..Default::default()
                }
                .into();
                return true;
            }
        }
        false
    }

    /// ES2022: Prepend private field helper variables to statements
    fn es2022_prepend_private_field_vars(&mut self, stmts: &mut Vec<Stmt>) {
        if self.es2022_private_field_helper_vars.is_empty() {
            return;
        }

        prepend_stmt(
            stmts,
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: take(&mut self.es2022_private_field_helper_vars),
                ..Default::default()
            }
            .into(),
        );
    }

    /// ES2022: Prepend private field helper variables to module items
    fn es2022_prepend_private_field_vars_module(&mut self, items: &mut Vec<ModuleItem>) {
        if self.es2022_private_field_helper_vars.is_empty() {
            return;
        }

        prepend_stmt(
            items,
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: take(&mut self.es2022_private_field_helper_vars),
                ..Default::default()
            }
            .into(),
        );
    }

    /// ES2022: Add WeakSet.add() calls to private properties for brand checking
    fn es2022_add_weakset_to_private_props(&mut self, n: &mut PrivateProp) {
        if !self
            .es2022_current_class_data
            .names_used_for_brand_checks
            .contains(&n.key.name)
        {
            return;
        }

        let var_name = self.var_name_for_brand_check(&n.key, &self.es2022_current_class_data);

        match &mut n.value {
            Some(init) => {
                let init_span = init.span();

                let tmp = private_ident!("_tmp");

                self.es2022_current_class_data
                    .vars
                    .push_var(tmp.clone(), None);

                let assign = AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: tmp.clone().into(),
                    right: init.take(),
                }
                .into();

                let add_to_checker = CallExpr {
                    span: DUMMY_SP,
                    callee: var_name
                        .make_member(IdentName::new("add".into(), DUMMY_SP))
                        .as_callee(),
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
                                callee: var_name
                                    .make_member(IdentName::new("add".into(), DUMMY_SP))
                                    .as_callee(),
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
}

impl<'a> VisitMut for CompilerImpl<'a> {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, class: &mut Class) {
        // Pre-processing transformations
        if self.config.includes.contains(Features::STATIC_BLOCKS) {
            self.es2022_static_blocks_to_private_fields(class);
        }

        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            self.es2022_analyze_private_fields_for_in_operator(class);
        }

        // Single recursive visit
        class.visit_mut_children_with(self);

        // Post-processing transformations
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            self.es2022_inject_weakset_init_for_private_fields(class);
        }
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        // Setup phase for private fields
        let old_cls = if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            let old = take(&mut self.es2022_current_class_data);
            self.es2022_current_class_data.mark = Mark::fresh(Mark::root());
            self.es2022_current_class_data.ident = Some(n.ident.clone());
            self.es2022_current_class_data.vars = Mode::ClassDecl {
                vars: Default::default(),
            };
            Some(old)
        } else {
            None
        };

        // Single recursive visit
        n.visit_mut_children_with(self);

        // Cleanup phase for private fields
        if let Some(old_cls) = old_cls {
            match &mut self.es2022_current_class_data.vars {
                Mode::ClassDecl { vars } => {
                    self.es2022_private_field_helper_vars.extend(take(vars));
                }
                _ => unreachable!(),
            }
            self.es2022_current_class_data = old_cls;
        }
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        // Setup phase for private fields
        let old_cls = if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            let old = take(&mut self.es2022_current_class_data);
            self.es2022_current_class_data.mark = Mark::fresh(Mark::root());
            self.es2022_current_class_data.ident.clone_from(&n.ident);
            self.es2022_current_class_data.vars = Mode::ClassExpr {
                vars: Default::default(),
                init_exprs: Default::default(),
            };
            Some(old)
        } else {
            None
        };

        // Single recursive visit
        n.visit_mut_children_with(self);

        // Cleanup phase for private fields
        if let Some(old_cls) = old_cls {
            match &mut self.es2022_current_class_data.vars {
                Mode::ClassExpr { vars, init_exprs } => {
                    self.es2022_private_field_helper_vars.extend(take(vars));
                    self.es2022_private_field_init_exprs
                        .extend(take(init_exprs));
                }
                _ => unreachable!(),
            }
            self.es2022_current_class_data = old_cls;
        }
    }

    /// Prevents #1123 for nullish coalescing
    fn visit_mut_block_stmt(&mut self, s: &mut BlockStmt) {
        // Setup phase: Save nullish coalescing vars
        let old_es2020_nullish_coalescing_vars =
            if self.config.includes.contains(Features::NULLISH_COALESCING) {
                Some(self.es2020_nullish_coalescing_vars.take())
            } else {
                None
            };

        // Single recursive visit
        s.visit_mut_children_with(self);

        // Cleanup phase: Restore nullish coalescing vars
        if let Some(old_vars) = old_es2020_nullish_coalescing_vars {
            self.es2020_nullish_coalescing_vars = old_vars;
        }
    }

    /// Prevents #1123 and #6328 for nullish coalescing
    fn visit_mut_switch_case(&mut self, s: &mut SwitchCase) {
        // Prevents #6328
        s.test.visit_mut_with(self);

        // Setup phase: Save nullish coalescing vars
        let old_es2020_nullish_coalescing_vars =
            if self.config.includes.contains(Features::NULLISH_COALESCING) {
                Some(self.es2020_nullish_coalescing_vars.take())
            } else {
                None
            };

        // Visit consequents
        s.cons.visit_mut_with(self);

        // Cleanup phase: Restore nullish coalescing vars
        if let Some(old_vars) = old_es2020_nullish_coalescing_vars {
            self.es2020_nullish_coalescing_vars = old_vars;
        }
    }

    fn visit_mut_assign_pat(&mut self, p: &mut AssignPat) {
        // Visit left side first
        p.left.visit_mut_with(self);

        // Handle private field brand checks
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            let mut buf = FxHashSet::default();
            let mut v = ClassAnalyzer {
                brand_check_names: &mut buf,
                ignore_class: false,
            };
            p.right.visit_with(&mut v);

            if !buf.is_empty() {
                let mut bs = BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(p.right.take()),
                    }
                    .into()],
                    ..Default::default()
                };
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
                return;
            }
        }

        p.right.visit_mut_with(self);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        // Phase 1: Setup for private field expressions
        let prev_prepend_exprs = if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            Some(take(&mut self.es2022_private_field_init_exprs))
        } else {
            None
        };

        // Phase 2: Single recursive visit - Visit children first
        e.visit_mut_children_with(self);

        // Phase 3: Post-processing transformations
        // Apply transformations after visiting children (this matches the original
        // order)
        let logical_transformed = self.config.includes.contains(Features::LOGICAL_ASSIGNMENTS)
            && self.transform_logical_assignment(e);

        let nullish_transformed = !logical_transformed
            && self.config.includes.contains(Features::NULLISH_COALESCING)
            && self.transform_nullish_coalescing(e);

        // Handle private field expressions
        if let Some(prev_prepend_exprs) = prev_prepend_exprs {
            let mut prepend_exprs = std::mem::replace(
                &mut self.es2022_private_field_init_exprs,
                prev_prepend_exprs,
            );

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
            } else if !logical_transformed && !nullish_transformed {
                // Transform private in expressions only if no other transformation occurred
                self.es2022_transform_private_in_to_weakset_has(e);
            }
        }
    }

    fn visit_mut_module_items(&mut self, ns: &mut Vec<ModuleItem>) {
        // Pre-processing: Export namespace transformation
        if self
            .config
            .includes
            .contains(Features::EXPORT_NAMESPACE_FROM)
        {
            self.transform_export_namespace_from(ns);
        }

        // Setup for variable hoisting
        let need_logical_var_hoisting =
            self.config.includes.contains(Features::LOGICAL_ASSIGNMENTS);
        let need_nullish_var_hoisting = self.config.includes.contains(Features::NULLISH_COALESCING);

        let saved_logical_vars = if need_logical_var_hoisting {
            self.es2021_logical_assignment_vars.take()
        } else {
            vec![]
        };

        let saved_nullish_vars = if need_nullish_var_hoisting {
            self.es2020_nullish_coalescing_vars.take()
        } else {
            vec![]
        };

        // Process statements with different hoisting strategies
        if need_nullish_var_hoisting {
            // Nullish coalescing: Insert vars before each statement that generates them
            let mut buf = Vec::with_capacity(ns.len() + 2);

            for mut item in ns.take() {
                item.visit_mut_with(self);

                // Insert nullish vars before the statement
                if !self.es2020_nullish_coalescing_vars.is_empty() {
                    buf.push(ModuleItem::Stmt(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: self.es2020_nullish_coalescing_vars.take(),
                            ..Default::default()
                        }
                        .into(),
                    ));
                }

                // Collect logical vars but don't insert yet
                buf.push(item);
            }

            *ns = buf;

            // Logical assignments: Hoist all vars to the top
            if need_logical_var_hoisting && !self.es2021_logical_assignment_vars.is_empty() {
                prepend_stmt(
                    ns,
                    ModuleItem::Stmt(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: self.es2021_logical_assignment_vars.take(),
                            ..Default::default()
                        }
                        .into(),
                    ),
                );
            }
        } else if need_logical_var_hoisting {
            // Only logical assignments: Hoist all vars to the top
            ns.visit_mut_children_with(self);

            if !self.es2021_logical_assignment_vars.is_empty() {
                prepend_stmt(
                    ns,
                    ModuleItem::Stmt(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: self.es2021_logical_assignment_vars.take(),
                            ..Default::default()
                        }
                        .into(),
                    ),
                );
            }
        } else {
            // Single recursive visit
            ns.visit_mut_children_with(self);
        }

        // Restore saved vars
        self.es2021_logical_assignment_vars = saved_logical_vars;
        self.es2020_nullish_coalescing_vars = saved_nullish_vars;

        // Post-processing: Private field variables
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT)
            && !self.es2022_private_field_helper_vars.is_empty()
        {
            self.es2022_prepend_private_field_vars_module(ns);
        }
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        // Single recursive visit
        n.visit_mut_children_with(self);

        // Post-processing: Add WeakSet for brand checks
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT) {
            self.es2022_add_weakset_to_private_props(n);
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(_) = n {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        // Setup for variable hoisting
        let need_logical_var_hoisting =
            self.config.includes.contains(Features::LOGICAL_ASSIGNMENTS);
        let need_nullish_var_hoisting = self.config.includes.contains(Features::NULLISH_COALESCING);

        let saved_logical_vars = if need_logical_var_hoisting {
            self.es2021_logical_assignment_vars.take()
        } else {
            vec![]
        };

        let saved_nullish_vars = if need_nullish_var_hoisting {
            self.es2020_nullish_coalescing_vars.take()
        } else {
            vec![]
        };

        // Process statements with different hoisting strategies
        if need_nullish_var_hoisting {
            // Nullish coalescing: Insert vars before each statement that generates them
            let mut buf = Vec::with_capacity(s.len() + 2);

            for mut stmt in s.take() {
                stmt.visit_mut_with(self);

                // Insert nullish vars before the statement
                if !self.es2020_nullish_coalescing_vars.is_empty() {
                    buf.push(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: self.es2020_nullish_coalescing_vars.take(),
                            ..Default::default()
                        }
                        .into(),
                    );
                }

                // Collect logical vars but don't insert yet
                buf.push(stmt);
            }

            *s = buf;

            // Logical assignments: Hoist all vars to the top
            if need_logical_var_hoisting && !self.es2021_logical_assignment_vars.is_empty() {
                prepend_stmt(
                    s,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.es2021_logical_assignment_vars.take(),
                        ..Default::default()
                    }
                    .into(),
                );
            }
        } else if need_logical_var_hoisting {
            // Only logical assignments: Hoist all vars to the top
            s.visit_mut_children_with(self);

            if !self.es2021_logical_assignment_vars.is_empty() {
                prepend_stmt(
                    s,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.es2021_logical_assignment_vars.take(),
                        ..Default::default()
                    }
                    .into(),
                );
            }
        } else {
            // Single recursive visit
            s.visit_mut_children_with(self);
        }

        // Restore saved vars
        self.es2021_logical_assignment_vars = saved_logical_vars;
        self.es2020_nullish_coalescing_vars = saved_nullish_vars;

        // Post-processing: Private field variables
        if self.config.includes.contains(Features::PRIVATE_IN_OBJECT)
            && !self.es2022_private_field_helper_vars.is_empty()
        {
            self.es2022_prepend_private_field_vars(s);
        }
    }

    fn visit_mut_block_stmt_or_expr(&mut self, n: &mut BlockStmtOrExpr) {
        if !self.config.includes.contains(Features::NULLISH_COALESCING) {
            n.visit_mut_children_with(self);
            return;
        }

        let vars = self.es2020_nullish_coalescing_vars.take();
        n.visit_mut_children_with(self);

        if !self.es2020_nullish_coalescing_vars.is_empty() {
            if let BlockStmtOrExpr::Expr(expr) = n {
                // expr
                // { var decl = init; return expr; }
                let stmts = vec![
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.es2020_nullish_coalescing_vars.take(),
                        declare: false,
                        ..Default::default()
                    }
                    .into(),
                    Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(expr.take()),
                    }),
                ];
                *n = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                    ..Default::default()
                });
            }
        }

        self.es2020_nullish_coalescing_vars = vars;
    }
}
