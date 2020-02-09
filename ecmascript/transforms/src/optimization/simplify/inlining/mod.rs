use self::scope::Scope;
use crate::{
    pass::RepeatedJsPass,
    scope::{IdentType, ScopeKind},
};
use std::borrow::Cow;
use swc_common::{
    pass::{CompilerPass, Repeated},
    Fold, FoldWith, Mark, Visit, VisitWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

mod operator;
mod scope;

#[derive(Debug)]
pub struct Config {
    /// Should not be `Mark::root()`.
    pub inline_barrier: Mark,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            inline_barrier: Mark::fresh(Mark::root()),
        }
    }
}

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
///
///
/// # TODOs
///
///  - Handling of `void 0`
pub fn inlining(config: Config) -> impl RepeatedJsPass + 'static {
    assert_ne!(
        config.inline_barrier,
        Mark::root(),
        "inlining pass cannot work with Mark::root()"
    );

    Inlining {
        inline_barrier: config.inline_barrier,
        is_first_run: true,
        changed: false,
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
        ident_type: IdentType::Ref,
    }
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
    is_first_run: bool,
    changed: bool,
    scope: Scope<'a>,
    var_decl_kind: VarDeclKind,
    ident_type: IdentType,
    inline_barrier: Mark,
}

impl Inlining<'_> {
    fn with_child<F, T>(&mut self, kind: ScopeKind, op: F) -> T
    where
        F: for<'any> FnOnce(&mut Inlining<'any>) -> T,
    {
        let mut child = Inlining {
            is_first_run: self.is_first_run,
            changed: false,
            scope: Scope {
                parent: Some(&self.scope),
                kind,
                bindings: Default::default(),
                constants: Default::default(),
            },
            var_decl_kind: VarDeclKind::Var,
            ident_type: self.ident_type,
            inline_barrier: self.inline_barrier,
        };

        let node = op(&mut child);

        self.changed |= child.changed;

        node
    }

    fn fold_with_child<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: 'static + for<'any> FoldWith<Inlining<'any>>,
    {
        self.with_child(kind, |child| node.fold_children(child))
    }
}

impl Fold<VarDecl> for Inlining<'_> {
    fn fold(&mut self, decl: VarDecl) -> VarDecl {
        self.var_decl_kind = decl.kind;

        decl.fold_children(self)
    }
}

impl Fold<VarDeclarator> for Inlining<'_> {
    fn fold(&mut self, mut node: VarDeclarator) -> VarDeclarator {
        match node.name {
            Pat::Ident(ref name) => match &node.init {
                None => {
                    self.declare(name.to_id(), None);

                    return node;
                }
                Some(box e @ Expr::Lit(..)) | Some(box e @ Expr::Ident(..)) => {
                    if self.var_decl_kind == VarDeclKind::Const {
                        if self.is_first_run {
                            self.scope.constants.insert(name.to_id(), e.clone());
                        }
                    } else {
                        let e = e.clone().fold_with(self);

                        println!("({}): Inserting {:?}", self.scope.depth(), name.to_id());

                        self.declare(name.to_id(), Some(e.clone()));
                        node.init = Some(box e);
                    }
                    return node;
                }
                _ => {}
            },
            _ => {}
        }

        node.fold_children(self)
    }
}

impl Fold<BlockStmt> for Inlining<'_> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        self.fold_with_child(ScopeKind::Block, node)
    }
}

impl Fold<Function> for Inlining<'_> {
    fn fold(&mut self, node: Function) -> Function {
        self.with_child(ScopeKind::Fn, move |child| {
            let mut node = node;

            node.params = node.params.fold_with(child);
            node.body = match node.body {
                None => None,
                Some(v) => Some(v.fold_children(child)),
            };

            node
        })
    }
}

impl Fold<FnDecl> for Inlining<'_> {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        self.declare(node.ident.to_id(), None);

        FnDecl {
            function: node.function.fold_with(self),
            ..node
        }
    }
}

impl Fold<FnExpr> for Inlining<'_> {
    fn fold(&mut self, node: FnExpr) -> FnExpr {
        if let Some(ref ident) = node.ident {
            self.scope.add_write(&ident.to_id(), true);
        }

        FnExpr {
            function: node.function.fold_with(self),
            ..node
        }
    }
}

impl Fold<IfStmt> for Inlining<'_> {
    fn fold(&mut self, mut node: IfStmt) -> IfStmt {
        node.test = node.test.fold_with(self);

        node.cons = self.fold_with_child(ScopeKind::Block, node.cons);
        node.alt = self.fold_with_child(ScopeKind::Block, node.alt);

        node
    }
}

impl Fold<SwitchCase> for Inlining<'_> {
    fn fold(&mut self, node: SwitchCase) -> SwitchCase {
        self.fold_with_child(ScopeKind::Block, node)
    }
}

impl Fold<CatchClause> for Inlining<'_> {
    fn fold(&mut self, node: CatchClause) -> CatchClause {
        self.fold_with_child(ScopeKind::Block, node)
    }
}

impl Fold<AssignExpr> for Inlining<'_> {
    fn fold(&mut self, e: AssignExpr) -> AssignExpr {
        let e: AssignExpr = AssignExpr {
            left: match e.left {
                PatOrExpr::Pat(p) => PatOrExpr::Pat(p.fold_with(self)),
                PatOrExpr::Expr(e) => PatOrExpr::Expr(e),
            },
            right: e.right.fold_with(self),
            ..e
        };

        match e.op {
            op!("=") => {}
            _ => {
                //
                match e.left {
                    PatOrExpr::Pat(box Pat::Ident(ref i))
                    | PatOrExpr::Expr(box Expr::Ident(ref i)) => {
                        if let Some(var) = self.scope.find_binding_by_value(&i.to_id()) {
                            var.prevent_inline.set(true)
                        }
                    }
                    _ => {}
                }
            }
        }

        match *e.right {
            Expr::Lit(..) | Expr::Ident(..) => {
                //
                match e.left {
                    PatOrExpr::Pat(box Pat::Ident(ref i))
                    | PatOrExpr::Expr(box Expr::Ident(ref i)) => {
                        let id = i.to_id();
                        self.scope.add_write(&id, false);

                        if let Some(var) = self.scope.find_binding(&id) {
                            if !var.prevent_inline.get() {
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
}

impl Fold<MemberExpr> for Inlining<'_> {
    fn fold(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}

impl Fold<Expr> for Inlining<'_> {
    fn fold(&mut self, node: Expr) -> Expr {
        //        match node {
        //            // Codes like
        //            //
        //            //      var y;
        //            //      y = x;
        //            //      use(y)
        //            //
        //            // should be transformed to
        //            //
        //            //      var y;
        //            //      x;
        //            //      use(x)
        //            Expr::Assign(e) => {
        //                match e.left {
        //                    PatOrExpr::Pat(box Pat::Ident(ref i))
        //                    | PatOrExpr::Expr(box Expr::Ident(ref i)) => {
        //                        //
        //                        if match *e.right {
        //                            Expr::Ident(..) => true,
        //
        //                            _ => {}
        //                        } {
        //                            if let Some(var) =
        // self.scope.bindings.get(&i.to_id()) {
        // if var.is_undefined.get() {
        // *var.value.borrow_mut() = Some(*e.right.clone());
        // var.is_undefined.set(false);
        // return *e.right.fold_with(self);                                }
        //                            }
        //                        }
        //                    }
        //                    _ => {}
        //                }
        //
        //                return Expr::Assign(e.fold_with(self));
        //            }
        //
        //            _ => {}
        //        }

        let node: Expr = node.fold_children(self);

        match node {
            Expr::Ident(ref i) => {
                let id = i.to_id();
                println!("Trying to inline: {:?}", id);

                if self.is_first_run {
                    if let Some(expr) = self.scope.find_constants(&id) {
                        println!("Inlining constant");
                        self.changed = true;
                        return expr.clone().fold_with(self);
                    }
                }

                let expr = if let Some(var) = self.scope.find_binding(&id) {
                    println!("VarInfo: {:?}", var);
                    if !var.prevent_inline.get() {
                        let expr = var.value.borrow();

                        if let Some(expr) = &*expr {
                            dbg!();
                            self.changed = true;
                            Some(expr.clone())
                        } else {
                            println!("Not a cheap expression");
                            None
                        }
                    } else {
                        println!("Inlining is prevented");
                        None
                    }
                } else {
                    println!("No binding found");
                    None
                };

                if let Some(expr) = expr {
                    return match expr {
                        Expr::Ident(ref new_i)
                            if i.sym == new_i.sym && i.span.ctxt() == new_i.span.ctxt() =>
                        {
                            expr
                        }
                        _ => expr.fold_with(self),
                    };
                }

                self.scope.add_read(&i.to_id())
            }

            _ => {}
        }

        node
    }
}

impl Fold<UpdateExpr> for Inlining<'_> {
    fn fold(&mut self, node: UpdateExpr) -> UpdateExpr {
        node
    }
}

impl Fold<Pat> for Inlining<'_> {
    fn fold(&mut self, node: Pat) -> Pat {
        let node: Pat = node.fold_children(self);

        match node {
            Pat::Ident(ref i) => {
                if let Some(var) = self.scope.find_binding_by_value(&i.to_id()) {
                    var.prevent_inline.set(true);
                } else {
                    self.scope.add_write(&i.to_id(), false);
                }
            }

            _ => {}
        }

        node
    }
}

impl Fold<ForStmt> for Inlining<'_> {
    fn fold(&mut self, mut node: ForStmt) -> ForStmt {
        node.init = node.init.fold_with(self);

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

        node.test = node.test.fold_with(self);
        node.update = node.update.fold_with(self);
        node.body = self.fold_with_child(ScopeKind::Block, node.body);

        node
    }
}

#[derive(Debug)]
struct IdentListVisitor<'a, 'b> {
    scope: &'a mut Scope<'b>,
}

impl Visit<Ident> for IdentListVisitor<'_, '_> {
    fn visit(&mut self, node: &Ident) {
        self.scope.add_write(&node.to_id(), true);
    }
}
