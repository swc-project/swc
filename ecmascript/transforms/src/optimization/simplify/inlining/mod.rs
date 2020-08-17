use self::scope::{Scope, ScopeKind, VarType};
use crate::{ext::PatOrExprExt, pass::RepeatedJsPass, scope::IdentType};
use std::borrow::Cow;
use swc_common::{
    pass::{CompilerPass, Repeated},
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_this_expr, find_ids, ident::IdentLike, undefined, Id};
use swc_ecma_visit::{Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn inlining(_: Config) -> impl RepeatedJsPass + 'static {
    Inlining {
        phase: Phase::Analysis,
        is_first_run: true,
        changed: false,
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
        ident_type: IdentType::Ref,
        pat_mode: PatFoldingMode::VarDecl,
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Phase {
    Analysis,
    Inlining,
}

impl CompilerPass for Inlining<'_> {
    fn name() -> Cow<'static, str> {
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
    }
}

struct Inlining<'a> {
    phase: Phase,
    is_first_run: bool,
    changed: bool,
    scope: Scope<'a>,
    var_decl_kind: VarDeclKind,
    ident_type: IdentType,
    pat_mode: PatFoldingMode,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum PatFoldingMode {
    Assign,
    Param,
    CatchParam,
    VarDecl,
}

impl Inlining<'_> {
    fn fold_with_child<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: 'static + for<'any> FoldWith<Inlining<'any>>,
    {
        self.with_child(kind, node, |child, node| node.fold_children_with(child))
    }
}

impl Fold for Inlining<'_> {
    noop_fold_type!();

    fn fold_arrow_expr(&mut self, node: ArrowExpr) -> ArrowExpr {
        self.fold_with_child(ScopeKind::Fn { named: false }, node)
    }

    fn fold_assign_expr(&mut self, e: AssignExpr) -> AssignExpr {
        log::trace!("{:?}; Fold<AssignExpr>", self.phase);
        self.pat_mode = PatFoldingMode::Assign;

        let e = AssignExpr {
            left: {
                match e.left.normalize_expr() {
                    PatOrExpr::Expr(left) => {
                        //
                        match *left {
                            Expr::Member(ref left) => {
                                log::trace!("Assign to member expression!");
                                let mut v = IdentListVisitor {
                                    scope: &mut self.scope,
                                };

                                left.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                                e.right.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                            }

                            _ => {}
                        }

                        PatOrExpr::Expr(left)
                    }
                    PatOrExpr::Pat(p) => PatOrExpr::Pat(p.fold_with(self)),
                }
            },
            right: e.right.fold_with(self),
            ..e
        };

        match e.op {
            op!("=") => {}
            _ => {
                let mut v = IdentListVisitor {
                    scope: &mut self.scope,
                };

                e.left.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                e.right.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v)
            }
        }

        if self.scope.is_inline_prevented(&e.right) {
            // Prevent inline for lhd
            let ids: Vec<Id> = find_ids(&e.left);
            for id in ids {
                self.scope.prevent_inline(&id);
            }
            return e;
        }

        match *e.right {
            Expr::Lit(..) | Expr::Ident(..) => {
                //
                match e.left.as_ident() {
                    Some(i) => {
                        let id = i.to_id();
                        self.scope.add_write(&id, false);

                        if let Some(var) = self.scope.find_binding(&id) {
                            if !var.is_inline_prevented() {
                                *var.value.borrow_mut() = Some(*e.right.clone());
                            }
                        }
                    }
                    _ => {}
                }
            }

            _ => {}
        }

        e
    }

    fn fold_bin_expr(&mut self, node: BinExpr) -> BinExpr {
        match node.op {
            op!("&&") | op!("||") => BinExpr {
                left: node.left.fold_with(self),
                ..node
            },
            _ => node.fold_children_with(self),
        }
    }

    fn fold_block_stmt(&mut self, node: BlockStmt) -> BlockStmt {
        self.fold_with_child(ScopeKind::Block, node)
    }

    fn fold_call_expr(&mut self, mut node: CallExpr) -> CallExpr {
        node.callee = node.callee.fold_with(self);

        if self.phase == Phase::Analysis {
            match node.callee {
                ExprOrSuper::Expr(ref callee) => {
                    self.scope.mark_this_sensitive(&callee);
                }

                _ => {}
            }
        }

        node.args = node.args.fold_with(self);

        self.scope.store_inline_barrier(self.phase);

        node
    }

    fn fold_catch_clause(&mut self, node: CatchClause) -> CatchClause {
        self.with_child(ScopeKind::Block, node, move |child, mut node| {
            child.pat_mode = PatFoldingMode::CatchParam;
            node.param = node.param.fold_with(child);
            match child.phase {
                Phase::Analysis => {
                    let ids: Vec<Id> = find_ids(&node.param);
                    for id in ids {
                        child.scope.prevent_inline(&id);
                    }
                }
                Phase::Inlining => {}
            }

            node.body = node.body.fold_with(child);

            node
        })
    }

    fn fold_do_while_stmt(&mut self, mut node: DoWhileStmt) -> DoWhileStmt {
        {
            node.test.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        node.test = node.test.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Loop, node.body);

        node
    }

    fn fold_expr(&mut self, node: Expr) -> Expr {
        let node: Expr = node.fold_children_with(self);

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
            match node {
                Expr::Assign(e @ AssignExpr { op: op!("="), .. }) => {
                    if let Some(i) = e.left.as_ident() {
                        if let Some(var) = self.scope.find_binding_from_current(&i.to_id()) {
                            if var.is_undefined.get() && !var.is_inline_prevented() {
                                if !self.scope.is_inline_prevented(&e.right) {
                                    *var.value.borrow_mut() = Some(*e.right.clone());
                                    var.is_undefined.set(false);
                                    return *e.right;
                                }
                            }
                        }
                    }

                    return Expr::Assign(e);
                }

                _ => {}
            }
        }

        match node {
            Expr::Ident(ref i) => {
                let id = i.to_id();
                if self.is_first_run {
                    if let Some(expr) = self.scope.find_constant(&id) {
                        self.changed = true;
                        return expr.clone().fold_with(self);
                    }
                }

                match self.phase {
                    Phase::Analysis => {
                        self.scope.add_read(&id);
                    }
                    Phase::Inlining => {
                        log::trace!("Trying to inline: {:?}", id);
                        let expr = if let Some(var) = self.scope.find_binding(&id) {
                            log::trace!("VarInfo: {:?}", var);
                            if !var.is_inline_prevented() {
                                let expr = var.value.borrow();

                                if let Some(expr) = &*expr {
                                    if node != *expr {
                                        self.changed = true;
                                    }

                                    Some(expr.clone())
                                } else {
                                    if var.is_undefined.get() {
                                        return *undefined(i.span);
                                    } else {
                                        log::trace!("Not a cheap expression");
                                        None
                                    }
                                }
                            } else {
                                log::trace!("Inlining is prevented");
                                None
                            }
                        } else {
                            None
                        };

                        if let Some(expr) = expr {
                            return expr;
                        }
                    }
                }
            }

            _ => {}
        }

        node
    }

    fn fold_fn_decl(&mut self, node: FnDecl) -> FnDecl {
        if self.phase == Phase::Analysis {
            self.declare(
                node.ident.to_id(),
                None,
                true,
                VarType::Var(VarDeclKind::Var),
            );
        }

        let function = node.function;

        let function = self.with_child(
            ScopeKind::Fn { named: true },
            function,
            |child, mut node| {
                child.pat_mode = PatFoldingMode::Param;
                node.params = node.params.fold_with(child);
                node.body = match node.body {
                    None => None,
                    Some(v) => Some(v.fold_children_with(child)),
                };

                node
            },
        );
        FnDecl { function, ..node }
    }

    fn fold_fn_expr(&mut self, node: FnExpr) -> FnExpr {
        if let Some(ref ident) = node.ident {
            self.scope.add_write(&ident.to_id(), true);
        }

        FnExpr {
            function: node.function.fold_with(self),
            ..node
        }
    }

    fn fold_for_in_stmt(&mut self, mut node: ForInStmt) -> ForInStmt {
        self.pat_mode = PatFoldingMode::Param;
        node.left = node.left.fold_with(self);

        {
            node.left.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        {
            node.right.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        node.right = node.right.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Loop, node.body);

        node
    }

    fn fold_for_of_stmt(&mut self, mut node: ForOfStmt) -> ForOfStmt {
        self.pat_mode = PatFoldingMode::Param;
        node.left = node.left.fold_with(self);

        {
            node.left.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }
        {
            node.right.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        node.right = node.right.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Loop, node.body);

        node
    }

    fn fold_for_stmt(&mut self, mut node: ForStmt) -> ForStmt {
        node.init = node.init.fold_with(self);

        {
            node.init.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }
        {
            node.test.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }
        {
            node.update.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        node.test = node.test.fold_with(self);
        node.update = node.update.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Loop, node.body);

        if node.init.is_none() && node.test.is_none() && node.update.is_none() {
            self.scope.store_inline_barrier(self.phase);
        }

        node
    }

    fn fold_function(&mut self, node: Function) -> Function {
        self.with_child(
            ScopeKind::Fn { named: false },
            node,
            move |child, mut node| {
                child.pat_mode = PatFoldingMode::Param;
                node.params = node.params.fold_with(child);
                node.body = match node.body {
                    None => None,
                    Some(v) => Some(v.fold_children_with(child)),
                };

                node
            },
        )
    }

    fn fold_if_stmt(&mut self, mut node: IfStmt) -> IfStmt {
        node.test = node.test.fold_with(self);

        node.cons = self.fold_with_child(ScopeKind::Cond, node.cons);
        node.alt = self.fold_with_child(ScopeKind::Cond, node.alt);

        node
    }

    fn fold_member_expr(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }

    fn fold_new_expr(&mut self, mut node: NewExpr) -> NewExpr {
        node.callee = node.callee.fold_with(self);
        if self.phase == Phase::Analysis {
            self.scope.mark_this_sensitive(&node.callee);
        }

        node.args = node.args.fold_with(self);

        self.scope.store_inline_barrier(self.phase);

        node
    }

    fn fold_pat(&mut self, node: Pat) -> Pat {
        let node: Pat = node.fold_children_with(self);

        match node {
            Pat::Ident(ref i) => match self.pat_mode {
                PatFoldingMode::Param => {
                    self.declare(
                        i.to_id(),
                        Some(Cow::Owned(Expr::Ident(i.clone()))),
                        false,
                        VarType::Param,
                    );
                }
                PatFoldingMode::CatchParam => {
                    self.declare(
                        i.to_id(),
                        Some(Cow::Owned(Expr::Ident(i.clone()))),
                        false,
                        VarType::Var(VarDeclKind::Var),
                    );
                }
                PatFoldingMode::VarDecl => {}
                PatFoldingMode::Assign => {
                    if let Some(..) = self.scope.find_binding_from_current(&i.to_id()) {
                    } else {
                        self.scope.add_write(&i.to_id(), false);
                    }
                }
            },

            _ => {}
        }

        node
    }

    fn fold_switch_case(&mut self, node: SwitchCase) -> SwitchCase {
        self.fold_with_child(ScopeKind::Block, node)
    }

    fn fold_try_stmt(&mut self, node: TryStmt) -> TryStmt {
        node.block.visit_with(
            &Invalid { span: DUMMY_SP } as _,
            &mut IdentListVisitor {
                scope: &mut self.scope,
            },
        );

        TryStmt {
            // TODO:
            //            block: node.block.fold_with(self),
            handler: node.handler.fold_with(self),
            ..node
        }
    }

    fn fold_unary_expr(&mut self, node: UnaryExpr) -> UnaryExpr {
        match node.op {
            op!("delete") => {
                let mut v = IdentListVisitor {
                    scope: &mut self.scope,
                };

                node.arg
                    .visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                return node;
            }

            _ => {}
        }

        node.fold_children_with(self)
    }

    fn fold_update_expr(&mut self, node: UpdateExpr) -> UpdateExpr {
        let mut v = IdentListVisitor {
            scope: &mut self.scope,
        };

        node.arg.visit_with(&node as _, &mut v);
        node
    }

    fn fold_var_decl(&mut self, decl: VarDecl) -> VarDecl {
        self.var_decl_kind = decl.kind;

        decl.fold_children_with(self)
    }

    fn fold_var_declarator(&mut self, mut node: VarDeclarator) -> VarDeclarator {
        let kind = VarType::Var(self.var_decl_kind);
        node.init = node.init.fold_with(self);

        self.pat_mode = PatFoldingMode::VarDecl;

        match self.phase {
            Phase::Analysis => match node.name {
                Pat::Ident(ref name) => {
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
                            self.declare(name.to_id(), Some(Cow::Borrowed(&e)), false, kind);

                            if self.scope.is_inline_prevented(&e) {
                                self.scope.prevent_inline(&name.to_id());
                            }
                        }
                        Some(ref e) => {
                            if self.var_decl_kind != VarDeclKind::Const {
                                self.declare(name.to_id(), Some(Cow::Borrowed(&e)), false, kind);

                                if contains_this_expr(&node.init) {
                                    self.scope.prevent_inline(&name.to_id());
                                    return node;
                                }
                            }
                        }
                    }
                }
                _ => {}
            },
            Phase::Inlining => {
                match node.name {
                    Pat::Ident(ref name) => {
                        if self.var_decl_kind != VarDeclKind::Const {
                            let id = name.to_id();

                            log::trace!("Trying to optimize variable declaration: {:?}", id);

                            if self.scope.is_inline_prevented(&Expr::Ident(name.clone()))
                                || !self
                                    .scope
                                    .has_same_this(&id, node.init.as_ref().map(|v| &**v))
                            {
                                log::trace!("Inline is prevented for {:?}", id);
                                return node;
                            }

                            let init = node.init.take().fold_with(self);
                            log::trace!("\tInit: {:?}", init);

                            if let Some(init) = &init {
                                if let Expr::Ident(ri) = &**init {
                                    self.declare(
                                        name.to_id(),
                                        Some(Cow::Owned(Expr::Ident(ri.clone()))),
                                        false,
                                        kind,
                                    );
                                }
                            }

                            match init {
                                Some(ref e) => {
                                    if self.scope.is_inline_prevented(&e) {
                                        log::trace!(
                                            "Inlining is not possible as inline of the \
                                             initialization was prevented"
                                        );
                                        node.init = init;
                                        self.scope.prevent_inline(&name.to_id());
                                        return node;
                                    }
                                }
                                _ => {}
                            }

                            let e = match init {
                                None => None,
                                Some(e) if e.is_lit() || e.is_ident() => Some(e),
                                Some(e) => {
                                    let e = *e;
                                    if self.scope.is_inline_prevented(&Expr::Ident(name.clone())) {
                                        node.init = Some(Box::new(e));
                                        return node;
                                    }

                                    if let Some(cnt) = self.scope.read_cnt(&name.to_id()) {
                                        if cnt == 1 {
                                            Some(Box::new(e))
                                        } else {
                                            node.init = Some(Box::new(e));
                                            return node;
                                        }
                                    } else {
                                        node.init = Some(Box::new(e));
                                        return node;
                                    }
                                }
                            };

                            // log::trace!("({}): Inserting {:?}", self.scope.depth(),
                            // name.to_id());

                            self.declare(name.to_id(), e.map(|e| Cow::Owned(*e)), false, kind);

                            return node;
                        }
                    }
                    _ => {}
                }
            }
        }

        node.name = node.name.fold_with(self);

        node
    }

    fn fold_while_stmt(&mut self, mut node: WhileStmt) -> WhileStmt {
        {
            node.test.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut IdentListVisitor {
                    scope: &mut self.scope,
                },
            );
        }

        node.test = node.test.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Loop, node.body);

        node
    }

    fn fold_module_items(&mut self, mut items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let old_phase = self.phase;

        self.phase = Phase::Analysis;
        items = items.fold_children_with(self);

        log::debug!("Switching to Inlining phase");

        // Inline
        self.phase = Phase::Inlining;
        items = items.fold_children_with(self);

        self.phase = old_phase;

        items
    }

    fn fold_stmts(&mut self, mut items: Vec<Stmt>) -> Vec<Stmt> {
        let old_phase = self.phase;

        match old_phase {
            Phase::Analysis => {
                items = items.fold_children_with(self);
            }
            Phase::Inlining => {
                self.phase = Phase::Analysis;
                items = items.fold_children_with(self);

                // Inline
                self.phase = Phase::Inlining;
                items = items.fold_children_with(self);

                self.phase = old_phase
            }
        }

        items
    }
}

#[derive(Debug)]
struct IdentListVisitor<'a, 'b> {
    scope: &'a mut Scope<'b>,
}

impl Visit for IdentListVisitor<'_, '_> {
    noop_visit_type!();

    fn visit_ident(&mut self, node: &Ident, _: &dyn Node) {
        self.scope.add_write(&node.to_id(), true);
    }

    fn visit_member_expr(&mut self, node: &MemberExpr, _: &dyn Node) {
        node.obj.visit_with(node as _, self);

        if node.computed {
            node.prop.visit_with(node as _, self);
        }
    }
}
