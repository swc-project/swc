use std::borrow::Cow;

use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::scope::IdentType;
use swc_ecma_utils::{contains_this_expr, find_pat_ids};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, visit_obj_and_computed, Visit, VisitMut,
    VisitMutWith, VisitWith,
};
use tracing::{span, Level};

use self::scope::{Scope, ScopeKind, VarType};

mod scope;

#[derive(Debug, Default)]
pub struct Config {}

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
///
///
/// # TODOs
///
///  - Handling of `void 0`
///  - Properly handle binary expressions.
///  - Track variables access by a function
///
/// Currently all functions are treated as a black box, and all the pass gives
/// up inlining variables across a function call or a constructor call.
pub fn inlining(_: Config) -> impl 'static + Repeated + CompilerPass + Pass + VisitMut {
    visit_mut_pass(Inlining {
        phase: Phase::Analysis,
        is_first_run: true,
        changed: false,
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
        ident_type: IdentType::Ref,
        in_test: false,
        pat_mode: PatFoldingMode::VarDecl,
        pass: Default::default(),
    })
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Phase {
    Analysis,
    Inlining,
}

impl CompilerPass for Inlining<'_> {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("inlining")
    }
}

impl Repeated for Inlining<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
        self.is_first_run = false;
        self.pass += 1;
    }
}

struct Inlining<'a> {
    phase: Phase,
    is_first_run: bool,
    changed: bool,
    scope: Scope<'a>,
    var_decl_kind: VarDeclKind,
    ident_type: IdentType,
    in_test: bool,
    pat_mode: PatFoldingMode,
    pass: usize,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum PatFoldingMode {
    Assign,
    Param,
    CatchParam,
    VarDecl,
}

impl Inlining<'_> {
    fn visit_with_child<T>(&mut self, kind: ScopeKind, node: &mut T)
    where
        T: 'static + for<'any> VisitMutWith<Inlining<'any>>,
    {
        self.with_child(kind, |child| {
            node.visit_mut_children_with(child);
        });
    }
}

impl VisitMut for Inlining<'_> {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.visit_with_child(ScopeKind::Fn { named: false }, node)
    }

    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        tracing::trace!("{:?}; Fold<AssignExpr>", self.phase);
        self.pat_mode = PatFoldingMode::Assign;

        match e.op {
            op!("=") => {
                let mut v = WriteVisitor {
                    scope: &mut self.scope,
                };

                e.left.visit_with(&mut v);
                e.right.visit_with(&mut v);

                match &mut e.left {
                    AssignTarget::Simple(left) => {
                        //
                        if let SimpleAssignTarget::Member(ref left) = &*left {
                            tracing::trace!("Assign to member expression!");
                            let mut v = IdentListVisitor {
                                scope: &mut self.scope,
                            };

                            left.visit_with(&mut v);
                            e.right.visit_with(&mut v);
                        }
                    }
                    AssignTarget::Pat(p) => {
                        p.visit_mut_with(self);
                    }
                }
            }

            _ => {
                let mut v = IdentListVisitor {
                    scope: &mut self.scope,
                };

                e.left.visit_with(&mut v);
                e.right.visit_with(&mut v)
            }
        }

        e.right.visit_mut_with(self);

        if self.scope.is_inline_prevented(&e.right) {
            // Prevent inline for lhd
            let ids: Vec<Id> = find_pat_ids(&e.left);
            for id in ids {
                self.scope.prevent_inline(&id);
            }
            return;
        }

        //
        if let Some(i) = e.left.as_ident() {
            let id = i.to_id();
            self.scope.add_write(&id, false);

            if let Some(var) = self.scope.find_binding(&id) {
                if !var.is_inline_prevented() {
                    match *e.right {
                        Expr::Lit(..) | Expr::Ident(..) => {
                            *var.value.borrow_mut() = Some(*e.right.clone());
                        }

                        _ => {
                            *var.value.borrow_mut() = None;
                        }
                    }
                }
            }
        }
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.visit_with_child(ScopeKind::Block, node)
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.callee.visit_mut_with(self);

        if self.phase == Phase::Analysis {
            if let Callee::Expr(ref callee) = node.callee {
                self.scope.mark_this_sensitive(callee);
            }
        }

        // args should not be inlined
        node.args.visit_children_with(&mut WriteVisitor {
            scope: &mut self.scope,
        });

        node.args.visit_mut_with(self);

        self.scope.store_inline_barrier(self.phase);
    }

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        self.with_child(ScopeKind::Block, move |child| {
            child.pat_mode = PatFoldingMode::CatchParam;
            node.param.visit_mut_with(child);
            match child.phase {
                Phase::Analysis => {
                    let ids: Vec<Id> = find_pat_ids(&node.param);
                    for id in ids {
                        child.scope.prevent_inline(&id);
                    }
                }
                Phase::Inlining => {}
            }

            node.body.visit_mut_with(child);
        })
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        {
            node.test.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        node.test.visit_mut_with(self);
        self.visit_with_child(ScopeKind::Loop, &mut node.body);
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        node.visit_mut_children_with(self);

        // Codes like
        //
        //      var y;
        //      y = x;
        //      use(y)
        //
        //  should be transformed to
        //
        //      var y;
        //      x;
        //      use(x)
        //
        // We cannot know if this is possible while analysis phase
        if self.phase == Phase::Inlining {
            if let Expr::Assign(e @ AssignExpr { op: op!("="), .. }) = node {
                if let Some(i) = e.left.as_ident() {
                    if let Some(var) = self.scope.find_binding_from_current(&i.to_id()) {
                        if var.is_undefined.get()
                            && !var.is_inline_prevented()
                            && !self.scope.is_inline_prevented(&e.right)
                        {
                            *var.value.borrow_mut() = Some(*e.right.clone());
                            var.is_undefined.set(false);
                            *node = *e.right.take();
                            return;
                        }
                    }
                }

                return;
            }
        }

        if let Expr::Ident(ref i) = node {
            let id = i.to_id();
            if self.is_first_run {
                if let Some(expr) = self.scope.find_constant(&id) {
                    self.changed = true;
                    let mut expr = expr.clone();
                    expr.visit_mut_with(self);
                    *node = expr;
                    return;
                }
            }

            match self.phase {
                Phase::Analysis => {
                    if self.in_test {
                        if let Some(var) = self.scope.find_binding(&id) {
                            match &*var.value.borrow() {
                                Some(Expr::Ident(..)) | Some(Expr::Lit(..)) => {}
                                _ => {
                                    self.scope.prevent_inline(&id);
                                }
                            }
                        }
                    }
                    self.scope.add_read(&id);
                }
                Phase::Inlining => {
                    tracing::trace!("Trying to inline: {:?}", id);
                    let expr = if let Some(var) = self.scope.find_binding(&id) {
                        tracing::trace!("VarInfo: {:?}", var);
                        if !var.is_inline_prevented() {
                            let expr = var.value.borrow();

                            if let Some(expr) = &*expr {
                                tracing::debug!("Inlining: {:?}", id);

                                if *node != *expr {
                                    self.changed = true;
                                }

                                Some(expr.clone())
                            } else {
                                tracing::debug!("Inlining: {:?} as undefined", id);

                                if var.is_undefined.get() {
                                    *node = *Expr::undefined(i.span);
                                    return;
                                } else {
                                    tracing::trace!("Not a cheap expression");
                                    None
                                }
                            }
                        } else {
                            tracing::trace!("Inlining is prevented");
                            None
                        }
                    } else {
                        None
                    };

                    if let Some(expr) = expr {
                        *node = expr;
                    }
                }
            }
        }

        if let Expr::Bin(b) = node {
            match b.op {
                BinaryOp::LogicalAnd | BinaryOp::LogicalOr => {
                    self.visit_with_child(ScopeKind::Cond, &mut b.right);
                }
                _ => {}
            }
        }
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        if self.phase == Phase::Analysis {
            self.declare(
                node.ident.to_id(),
                None,
                true,
                VarType::Var(VarDeclKind::Var),
            );
        }

        self.with_child(ScopeKind::Fn { named: true }, |child| {
            child.pat_mode = PatFoldingMode::Param;
            node.function.params.visit_mut_with(child);
            match &mut node.function.body {
                None => {}
                Some(v) => {
                    v.visit_mut_children_with(child);
                }
            };
        });
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        if let Some(ref ident) = node.ident {
            self.scope.add_write(&ident.to_id(), true);
        }

        node.function.visit_mut_with(self)
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        self.pat_mode = PatFoldingMode::Param;
        node.left.visit_mut_with(self);

        {
            node.left.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        {
            node.right.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        node.right.visit_mut_with(self);
        self.visit_with_child(ScopeKind::Loop, &mut node.body);
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        self.pat_mode = PatFoldingMode::Param;
        node.left.visit_mut_with(self);

        {
            node.left.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }
        {
            node.right.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        node.right.visit_mut_with(self);
        self.visit_with_child(ScopeKind::Loop, &mut node.body);
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        {
            node.init.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }
        {
            node.test.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }
        {
            node.update.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        node.init.visit_mut_with(self);
        node.test.visit_mut_with(self);
        node.update.visit_mut_with(self);
        self.visit_with_child(ScopeKind::Loop, &mut node.body);

        if node.init.is_none() && node.test.is_none() && node.update.is_none() {
            self.scope.store_inline_barrier(self.phase);
        }
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        self.with_child(ScopeKind::Fn { named: false }, move |child| {
            child.pat_mode = PatFoldingMode::Param;
            node.params.visit_mut_with(child);
            match &mut node.body {
                None => None,
                Some(v) => {
                    v.visit_mut_children_with(child);
                    Some(())
                }
            };
        })
    }

    fn visit_mut_if_stmt(&mut self, stmt: &mut IfStmt) {
        let old_in_test = self.in_test;
        self.in_test = true;
        stmt.test.visit_mut_with(self);
        self.in_test = old_in_test;

        self.visit_with_child(ScopeKind::Cond, &mut stmt.cons);
        self.visit_with_child(ScopeKind::Cond, &mut stmt.alt);
    }

    fn visit_mut_program(&mut self, program: &mut Program) {
        let _tracing = span!(Level::ERROR, "inlining", pass = self.pass).entered();

        let old_phase = self.phase;

        self.phase = Phase::Analysis;
        program.visit_mut_children_with(self);

        tracing::trace!("Switching to Inlining phase");

        // Inline
        self.phase = Phase::Inlining;
        program.visit_mut_children_with(self);

        self.phase = old_phase;
    }

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        node.callee.visit_mut_with(self);
        if self.phase == Phase::Analysis {
            self.scope.mark_this_sensitive(&node.callee);
        }

        node.args.visit_mut_with(self);

        self.scope.store_inline_barrier(self.phase);
    }

    fn visit_mut_pat(&mut self, node: &mut Pat) {
        node.visit_mut_children_with(self);

        if let Pat::Ident(ref i) = node {
            match self.pat_mode {
                PatFoldingMode::Param => {
                    self.declare(
                        i.to_id(),
                        Some(Cow::Owned(Ident::from(i).into())),
                        false,
                        VarType::Param,
                    );
                }
                PatFoldingMode::CatchParam => {
                    self.declare(
                        i.to_id(),
                        Some(Cow::Owned(Ident::from(i).into())),
                        false,
                        VarType::Var(VarDeclKind::Var),
                    );
                }
                PatFoldingMode::VarDecl => {}
                PatFoldingMode::Assign => {
                    if self.scope.find_binding_from_current(&i.to_id()).is_some() {
                    } else {
                        self.scope.add_write(&i.to_id(), false);
                    }
                }
            }
        }
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        let old_phase = self.phase;

        match old_phase {
            Phase::Analysis => {
                items.visit_mut_children_with(self);
            }
            Phase::Inlining => {
                self.phase = Phase::Analysis;
                items.visit_mut_children_with(self);

                // Inline
                self.phase = Phase::Inlining;
                items.visit_mut_children_with(self);

                self.phase = old_phase
            }
        }
    }

    fn visit_mut_switch_case(&mut self, node: &mut SwitchCase) {
        self.visit_with_child(ScopeKind::Block, node)
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        node.block.visit_with(&mut IdentListVisitor {
            scope: &mut self.scope,
        });

        node.handler.visit_mut_with(self)
    }

    fn visit_mut_unary_expr(&mut self, node: &mut UnaryExpr) {
        if let op!("delete") = node.op {
            let mut v = IdentListVisitor {
                scope: &mut self.scope,
            };

            node.arg.visit_with(&mut v);
            return;
        }

        node.visit_mut_children_with(self)
    }

    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        let mut v = IdentListVisitor {
            scope: &mut self.scope,
        };

        node.arg.visit_with(&mut v);
    }

    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        self.var_decl_kind = decl.kind;

        decl.visit_mut_children_with(self)
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        let kind = VarType::Var(self.var_decl_kind);
        node.init.visit_mut_with(self);

        self.pat_mode = PatFoldingMode::VarDecl;

        match self.phase {
            Phase::Analysis => {
                if let Pat::Ident(ref name) = node.name {
                    //
                    match &node.init {
                        None => {
                            if self.var_decl_kind != VarDeclKind::Const {
                                self.declare(name.to_id(), None, true, kind);
                            }
                        }

                        // Constants
                        Some(e)
                            if (e.is_lit() || e.is_ident())
                                && self.var_decl_kind == VarDeclKind::Const =>
                        {
                            if self.is_first_run {
                                self.scope
                                    .constants
                                    .insert(name.to_id(), Some((**e).clone()));
                            }
                        }
                        Some(..) if self.var_decl_kind == VarDeclKind::Const => {
                            if self.is_first_run {
                                self.scope.constants.insert(name.to_id(), None);
                            }
                        }

                        // Bindings
                        Some(e) | Some(e) if e.is_lit() || e.is_ident() => {
                            self.declare(name.to_id(), Some(Cow::Borrowed(e)), false, kind);

                            if self.scope.is_inline_prevented(e) {
                                self.scope.prevent_inline(&name.to_id());
                            }
                        }
                        Some(ref e) => {
                            if self.var_decl_kind != VarDeclKind::Const {
                                self.declare(name.to_id(), Some(Cow::Borrowed(e)), false, kind);

                                if contains_this_expr(&node.init) {
                                    self.scope.prevent_inline(&name.to_id());
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            Phase::Inlining => {
                if let Pat::Ident(ref name) = node.name {
                    if self.var_decl_kind != VarDeclKind::Const {
                        let id = name.to_id();

                        tracing::trace!("Trying to optimize variable declaration: {:?}", id);

                        if self.scope.is_inline_prevented(&Ident::from(name).into())
                            || !self.scope.has_same_this(&id, node.init.as_deref())
                        {
                            tracing::trace!("Inline is prevented for {:?}", id);
                            return;
                        }

                        let mut init = node.init.take();
                        init.visit_mut_with(self);
                        tracing::trace!("\tInit: {:?}", init);

                        if let Some(init) = &init {
                            if let Expr::Ident(ri) = &**init {
                                self.declare(
                                    name.to_id(),
                                    Some(Cow::Owned(ri.clone().into())),
                                    false,
                                    kind,
                                );
                            }
                        }

                        if let Some(ref e) = init {
                            if self.scope.is_inline_prevented(e) {
                                tracing::trace!(
                                    "Inlining is not possible as inline of the initialization was \
                                     prevented"
                                );
                                node.init = init;
                                self.scope.prevent_inline(&name.to_id());
                                return;
                            }
                        }

                        let e = match init {
                            None => None,
                            Some(e) if e.is_lit() || e.is_ident() => Some(e),
                            Some(e) => {
                                let e = *e;
                                if self.scope.is_inline_prevented(&Ident::from(name).into()) {
                                    node.init = Some(Box::new(e));
                                    return;
                                }

                                if let Some(cnt) = self.scope.read_cnt(&name.to_id()) {
                                    if cnt == 1 {
                                        Some(Box::new(e))
                                    } else {
                                        node.init = Some(Box::new(e));
                                        return;
                                    }
                                } else {
                                    node.init = Some(Box::new(e));
                                    return;
                                }
                            }
                        };

                        // tracing::trace!("({}): Inserting {:?}", self.scope.depth(),
                        // name.to_id());

                        self.declare(name.to_id(), e.map(|e| Cow::Owned(*e)), false, kind);

                        return;
                    }
                }
            }
        }

        node.name.visit_mut_with(self);
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        {
            node.test.visit_with(&mut IdentListVisitor {
                scope: &mut self.scope,
            });
        }

        node.test.visit_mut_with(self);
        self.visit_with_child(ScopeKind::Loop, &mut node.body);
    }
}

#[derive(Debug)]
struct IdentListVisitor<'a, 'b> {
    scope: &'a mut Scope<'b>,
}

impl Visit for IdentListVisitor<'_, '_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, node: &Ident) {
        self.scope.add_write(&node.to_id(), true);
    }
}

/// Mark idents as `written`.
struct WriteVisitor<'a, 'b> {
    scope: &'a mut Scope<'b>,
}

impl Visit for WriteVisitor<'_, '_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, node: &Ident) {
        self.scope.add_write(&node.to_id(), false);
    }
}
