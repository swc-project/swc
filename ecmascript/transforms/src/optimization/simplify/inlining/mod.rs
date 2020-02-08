use crate::{pass::RepeatedJsPass, scope::ScopeKind};
use fxhash::FxHashMap;
use std::{
    borrow::Cow,
    cell::{Cell, RefCell},
};
use swc_common::{
    pass::{CompilerPass, Repeated},
    Fold, FoldWith, Visit, VisitWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
pub fn inlining() -> impl RepeatedJsPass + 'static {
    Inlining {
        is_first_run: true,
        changed: false,
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
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
}

#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,

    bindings: FxHashMap<Id, VarInfo>,

    /// Simple optimization. We don't need complex scope analysis.
    constants: FxHashMap<Id, Expr>,
}

impl Scope<'_> {
    /// True if the returned scope is self
    fn scope_for(&self, id: &Id) -> (&Scope, bool) {
        if let Some(..) = self.constants.get(id) {
            return (self, true);
        }

        match self.parent {
            None => (self, true),
            Some(ref p) => {
                let (s, _) = p.scope_for(id);
                (s, false)
            }
        }
    }

    pub fn add_read(&self, id: &Id) {
        let (scope, is_self) = self.scope_for(id);
        if !is_self {
            if let Some(var_info) = scope.bindings.get(id) {
                var_info.read_from_nested_scope.set(true);
            }
        }
    }

    pub fn add_write(&mut self, id: &Id) {
        let (scope, is_self) = self.scope_for(id);

        if let Some(var_info) = scope.bindings.get(id) {
            if !is_self {
                var_info.write_from_nested_scope.set(true);
            }
        } else {
            self.bindings.insert(
                id.clone(),
                VarInfo {
                    kind: VarDeclKind::Var,
                    read_from_nested_scope: Cell::new(false),
                    write_from_nested_scope: Cell::new(true),
                    value: RefCell::new(None),
                },
            );
        }
    }

    pub fn find_binding(&self, id: &Id) -> Option<&VarInfo> {
        if let Some(e) = self.bindings.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_binding(id))
    }

    pub fn find_constants(&self, id: &Id) -> Option<&Expr> {
        if let Some(e) = self.constants.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_constants(id))
    }
}

#[derive(Debug)]
struct VarInfo {
    kind: VarDeclKind,
    read_from_nested_scope: Cell<bool>,
    write_from_nested_scope: Cell<bool>,
    value: RefCell<Option<Expr>>,
}

//struct IdentFinder<'a> {
//    targets: &'a FxHashMap<Id, VarInfo>,
//    found: &'a mut Vec<Id>,
//}
//
//impl Visit<Ident> for IdentFinder<'_> {
//    fn visit(&mut self, node: &Ident) {
//        let id = node.to_id();
//        if self.targets.contains_key(&id) {
//            self.found.push(id)
//        }
//    }
//}

impl Inlining<'_> {
    fn fold_with_child<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: 'static + for<'any> FoldWith<Inlining<'any>>,
    {
        //TODO: Track accessed variables.

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
        };

        let node = node.fold_children(&mut child);

        self.changed |= child.changed;

        child.scope.parent = None;

        node
    }
}

impl Fold<VarDecl> for Inlining<'_> {
    fn fold(&mut self, decl: VarDecl) -> VarDecl {
        self.var_decl_kind = decl.kind;

        decl.fold_children(self)
    }
}

impl Fold<VarDeclarator> for Inlining<'_> {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        match node.name {
            Pat::Ident(ref name) => match &node.init {
                Some(box e @ Expr::Lit(..)) | Some(box e @ Expr::Ident(..)) => {
                    if self.var_decl_kind == VarDeclKind::Const {
                        if self.is_first_run {
                            self.scope.constants.insert(name.to_id(), e.clone());
                        }
                    } else {
                        self.scope.bindings.insert(
                            name.to_id(),
                            VarInfo {
                                kind: self.var_decl_kind,
                                read_from_nested_scope: Cell::new(false),
                                write_from_nested_scope: Cell::new(false),
                                value: RefCell::new(Some(e.clone().into())),
                            },
                        );
                    }
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
        self.fold_with_child(ScopeKind::Fn, node)
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

impl Fold<CatchClause> for Inlining<'_> {
    fn fold(&mut self, node: CatchClause) -> CatchClause {
        self.fold_with_child(ScopeKind::Block, node)
    }
}

impl Fold<AssignExpr> for Inlining<'_> {
    fn fold(&mut self, e: AssignExpr) -> AssignExpr {
        let e: AssignExpr = e.fold_children(self);

        match *e.right {
            Expr::Lit(..) | Expr::Ident(..) => {
                //
                match e.left {
                    PatOrExpr::Pat(box Pat::Ident(ref i))
                    | PatOrExpr::Expr(box Expr::Ident(ref i)) => {
                        let id = i.to_id();
                        self.scope.add_write(&id);

                        if let Some(var) = self.scope.find_binding(&id) {
                            if !var.write_from_nested_scope.get() {
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
        let node: Expr = node.fold_children(self);

        match node {
            Expr::Ident(ref i) => {
                let id = i.to_id();

                if self.is_first_run {
                    if let Some(expr) = self.scope.find_constants(&id) {
                        self.changed = true;
                        return expr.clone();
                    }
                }

                if let Some(var) = self.scope.find_binding(&id) {
                    if !var.write_from_nested_scope.get() {
                        let expr = var.value.borrow();

                        if let Some(expr) = &*expr {
                            self.changed = true;
                            return expr.clone();
                        }
                    }
                }

                self.scope.add_read(&i.to_id())
            }

            _ => {}
        }

        node
    }
}

impl Fold<Pat> for Inlining<'_> {
    fn fold(&mut self, node: Pat) -> Pat {
        let node: Pat = node.fold_children(self);

        match node {
            Pat::Ident(ref i) => {
                self.scope.add_write(&i.to_id());
            }

            _ => {}
        }

        node
    }
}
