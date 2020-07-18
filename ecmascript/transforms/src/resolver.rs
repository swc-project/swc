use crate::scope::{IdentType, ScopeKind};
use std::{cell::RefCell, collections::HashSet};
use swc_atoms::JsWord;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::Fold;

#[cfg(test)]
mod tests;

const LOG: bool = false;

pub fn resolver() -> Resolver<'static> {
    resolver_with_mark(Mark::fresh(Mark::root()))
}

/// `mark` should not be root.
pub fn resolver_with_mark(mark: Mark) -> Resolver<'static> {
    assert_ne!(
        mark,
        Mark::root(),
        "Marker provided to resolver should not be root mark"
    );
    Resolver::new(mark, Scope::new(ScopeKind::Fn, None), None)
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of this scope
    parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    kind: ScopeKind,

    /// All references declared in this scope
    declared_symbols: HashSet<JsWord>,
    hoisted_symbols: RefCell<HashSet<JsWord>>,
}

impl<'a> Default for Scope<'a> {
    fn default() -> Self {
        Scope::new(ScopeKind::Fn, None)
    }
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            declared_symbols: Default::default(),
            hoisted_symbols: Default::default(),
        }
    }
}

/// # Phases
///
/// ## Hoisting phase
///
/// ## Resolving phase
pub struct Resolver<'a> {
    hoist: bool,
    mark: Mark,
    current: Scope<'a>,
    cur_defining: Option<(JsWord, Mark)>,
    ident_type: IdentType,
}

noop_fold_type!(Resolver<'_>);

impl<'a> Resolver<'a> {
    fn new(mark: Mark, current: Scope<'a>, cur_defining: Option<(JsWord, Mark)>) -> Self {
        Resolver {
            hoist: false,
            mark,
            current,
            cur_defining,
            ident_type: IdentType::Ref,
        }
    }

    /// Returns a [Mark] for an identifier reference.
    fn mark_for_ref(&self, sym: &JsWord) -> Option<Mark> {
        let mut mark = self.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains(sym) || cur.hoisted_symbols.borrow().contains(sym) {
                if mark == Mark::root() {
                    return None;
                }
                return Some(mark);
            }
            mark = mark.parent();
            scope = cur.parent;
        }

        if let Some((ref c, mark)) = self.cur_defining {
            if *c == *sym {
                return Some(mark);
            }
        }

        None
    }

    fn fold_binding_ident(&mut self, ident: Ident) -> Ident {
        if cfg!(debug_assertions) && LOG {
            eprintln!("resolver: Binding {}{:?}", ident.sym, ident.span.ctxt());
        }

        if ident.span.ctxt() != SyntaxContext::empty() {
            return ident;
        }

        if self.hoist {
            // If there's no binding with same name, it means the code depends on hoisting
            //
            //   e.g.
            //
            //      function test() {
            //          if (typeof Missing == typeof EXTENDS) {
            //              console.log("missing")
            //          }
            //          var EXTENDS = "test";
            //      }
            let val = (|| {
                let mut cursor = Some(&self.current);
                let mut mark = self.mark;

                while let Some(c) = cursor {
                    if c.declared_symbols.contains(&ident.sym)
                        || c.hoisted_symbols.borrow().contains(&ident.sym)
                    {
                        c.hoisted_symbols.borrow_mut().insert(ident.sym.clone());
                        return None;
                    }
                    cursor = c.parent;
                    let m = mark.parent();
                    if m == Mark::root() {
                        return Some(mark);
                    }
                    mark = m;
                }

                None
            })();
            if let Some(mark) = val {
                return Ident {
                    span: ident.span.apply_mark(mark),
                    ..ident
                };
            }
        }

        let (should_insert, mark) = if let Some((ref cur, override_mark)) = self.cur_defining {
            if *cur != ident.sym {
                (true, self.mark)
            } else {
                (false, override_mark)
            }
        } else {
            (true, self.mark)
        };

        let mut mark = mark;

        if should_insert {
            if self.hoist {
                let mut cursor = Some(&self.current);

                while let Some(c) = cursor {
                    if c.kind == ScopeKind::Fn {
                        c.hoisted_symbols.borrow_mut().insert(ident.sym.clone());
                        break;
                    }
                    cursor = c.parent;
                    mark = mark.parent();
                }
            } else {
                self.current.declared_symbols.insert(ident.sym.clone());
            }
        }

        Ident {
            span: if mark == Mark::root() {
                ident.span
            } else {
                let span = ident.span.apply_mark(mark);
                if cfg!(debug_assertions) && LOG {
                    eprintln!("\t-> {:?}", span.ctxt());
                }
                span
            },
            sym: ident.sym,
            ..ident
        }
    }
}

impl<'a> Fold<Function> for Resolver<'a> {
    fn fold(&mut self, mut f: Function) -> Function {
        self.ident_type = IdentType::Ref;
        f.decorators = f.decorators.fold_with(self);

        self.ident_type = IdentType::Binding;
        f.params = f.params.fold_with(self);

        self.ident_type = IdentType::Ref;
        f.body = f.body.map(|stmt| stmt.fold_children_with(self));

        f
    }
}

impl<'a> Fold<BlockStmt> for Resolver<'a> {
    fn fold(&mut self, block: BlockStmt) -> BlockStmt {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.cur_defining.take(),
        );

        let block = block.fold_children_with(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        block
    }
}

impl<'a> Fold<FnExpr> for Resolver<'a> {
    fn fold(&mut self, e: FnExpr) -> FnExpr {
        let ident = if let Some(ident) = e.ident {
            Some(self.fold_binding_ident(ident))
        } else {
            None
        };

        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
        );
        let function = e.function.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        FnExpr { ident, function }
    }
}

impl Fold<ClassMethod> for Resolver<'_> {
    fn fold(&mut self, m: ClassMethod) -> ClassMethod {
        let key = m.key.fold_with(self);

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
            );

            m.function.fold_with(&mut child)
        };

        ClassMethod { key, function, ..m }
    }
}

impl Fold<MethodProp> for Resolver<'_> {
    fn fold(&mut self, m: MethodProp) -> MethodProp {
        let key = m.key.fold_with(self);

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
            );

            m.function.fold_with(&mut child)
        };

        MethodProp { key, function, ..m }
    }
}

impl<'a> Fold<FnDecl> for Resolver<'a> {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        // We don't fold this as Hoister handles this.
        let ident = node.ident;

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut folder = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
            );

            folder.cur_defining = Some((ident.sym.clone(), ident.span.ctxt().remove_mark()));

            node.function.fold_with(&mut folder)
        };

        FnDecl {
            ident,
            function,
            ..node
        }
    }
}

impl Fold<Pat> for Resolver<'_> {
    fn fold(&mut self, p: Pat) -> Pat {
        let old = self.cur_defining.take();
        let p = p.fold_children_with(self);

        self.cur_defining = old;
        p
    }
}

impl<'a> Fold<Expr> for Resolver<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        let expr = match expr {
            // Leftmost one of a member expression should be resolved.
            Expr::Member(me) => {
                if me.computed {
                    Expr::Member(MemberExpr {
                        obj: me.obj.fold_with(self),
                        prop: me.prop.fold_with(self),
                        ..me
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: me.obj.fold_with(self),
                        ..me
                    })
                }
            }
            _ => expr.fold_children_with(self),
        };
        self.ident_type = old;

        expr
    }
}

impl<'a> Fold<VarDeclarator> for Resolver<'a> {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        // order is important

        let old_defining = self.cur_defining.take();

        let old_type = self.ident_type;
        self.ident_type = IdentType::Binding;
        let name = decl.name.fold_with(self);
        self.ident_type = old_type;

        let cur_name = match name {
            Pat::Ident(Ident { ref sym, .. }) => Some((sym.clone(), self.mark)),
            _ => None,
        };

        self.cur_defining = cur_name;
        let init = decl.init.fold_children_with(self);
        self.cur_defining = old_defining;

        VarDeclarator { name, init, ..decl }
    }
}

impl Fold<VarDecl> for Resolver<'_> {
    fn fold(&mut self, decl: VarDecl) -> VarDecl {
        let old_hoist = self.hoist;

        self.hoist = VarDeclKind::Var == decl.kind;
        let decls = decl.decls.fold_with(self);

        self.hoist = old_hoist;

        VarDecl { decls, ..decl }
    }
}

impl<'a> Fold<Ident> for Resolver<'a> {
    fn fold(&mut self, i: Ident) -> Ident {
        match self.ident_type {
            IdentType::Binding => self.fold_binding_ident(i),
            IdentType::Ref => {
                let Ident { span, sym, .. } = i;

                if cfg!(debug_assertions) && LOG {
                    eprintln!("resolver: IdentRef {}{:?}", sym, i.span.ctxt());
                }

                if span.ctxt() != SyntaxContext::empty() {
                    return Ident { sym, ..i };
                }

                if let Some(mark) = self.mark_for_ref(&sym) {
                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", span.ctxt());
                    }
                    Ident { sym, span, ..i }
                } else {
                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> Unresolved");
                    }

                    let mark = {
                        let mut mark = self.mark;
                        let mut cur = Some(&self.current);
                        while let Some(scope) = cur {
                            cur = scope.parent;

                            if cur.is_none() {
                                break;
                            }
                            mark = mark.parent();
                        }

                        mark
                    };

                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", span.ctxt());
                    }

                    // Support hoisting
                    self.fold_binding_ident(Ident { sym, span, ..i })
                }
            }
            IdentType::Label => {
                // We currently does not touch labels
                i
            }
        }
    }
}

impl Fold<ObjectLit> for Resolver<'_> {
    fn fold(&mut self, o: ObjectLit) -> ObjectLit {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.cur_defining.take(),
        );

        let o = o.fold_children_with(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        o
    }
}

track_ident!(Resolver);

impl<'a> Fold<ArrowExpr> for Resolver<'a> {
    fn fold(&mut self, e: ArrowExpr) -> ArrowExpr {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
        );

        let old_hoist = self.hoist;
        let old = folder.ident_type;
        folder.ident_type = IdentType::Binding;
        self.hoist = false;
        let params = e.params.fold_with(&mut folder);
        folder.ident_type = old;
        self.hoist = old_hoist;

        let body = e.body.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        ArrowExpr { params, body, ..e }
    }
}

/// Handle body of the arrow functions
impl Fold<BlockStmtOrExpr> for Resolver<'_> {
    fn fold(&mut self, node: BlockStmtOrExpr) -> BlockStmtOrExpr {
        match node {
            BlockStmtOrExpr::BlockStmt(block) => block.fold_children_with(self).into(),
            BlockStmtOrExpr::Expr(e) => e.fold_with(self).into(),
        }
    }
}

impl Fold<Vec<Stmt>> for Resolver<'_> {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        // Phase 1: Handle hoisting
        let stmts = {
            let mut hoister = Hoister { resolver: self };
            stmts.fold_children_with(&mut hoister)
        };

        // Phase 2.
        stmts.fold_children_with(self)
    }
}

impl Fold<Vec<ModuleItem>> for Resolver<'_> {
    fn fold(&mut self, stmts: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let stmts = validate!(stmts);

        if self.current.kind != ScopeKind::Fn {
            return stmts.fold_children_with(self);
        }

        // Phase 1: Handle hoisting
        let stmts = {
            let mut hoister = Hoister { resolver: self };
            stmts.fold_children_with(&mut hoister)
        };

        // Phase 2.
        stmts.fold_children_with(self)
    }
}

impl Fold<CatchClause> for Resolver<'_> {
    fn fold(&mut self, c: CatchClause) -> CatchClause {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
        );

        folder.ident_type = IdentType::Binding;
        let param = c.param.fold_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        let body = c.body.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        CatchClause { param, body, ..c }
    }
}

/// The folder which handles var / function hoisting.
struct Hoister<'a, 'b> {
    resolver: &'a mut Resolver<'b>,
}

impl Fold<FnDecl> for Hoister<'_, '_> {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        let ident = self.resolver.fold_binding_ident(node.ident);

        FnDecl { ident, ..node }
    }
}

impl Fold<Function> for Hoister<'_, '_> {
    fn fold(&mut self, node: Function) -> Function {
        node
    }
}

impl Fold<ArrowExpr> for Hoister<'_, '_> {
    fn fold(&mut self, node: ArrowExpr) -> ArrowExpr {
        node
    }
}

impl Fold<VarDecl> for Hoister<'_, '_> {
    fn fold(&mut self, node: VarDecl) -> VarDecl {
        if node.kind != VarDeclKind::Var {
            return node;
        }
        self.resolver.hoist = false;

        node.fold_children_with(self)
    }
}

impl Fold<VarDeclarator> for Hoister<'_, '_> {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        VarDeclarator {
            name: node.name.fold_with(self),
            ..node
        }
    }
}

impl Fold<Pat> for Hoister<'_, '_> {
    fn fold(&mut self, node: Pat) -> Pat {
        match node {
            Pat::Ident(i) => Pat::Ident(self.resolver.fold_binding_ident(i)),
            _ => node.fold_children_with(self),
        }
    }
}

impl Fold<PatOrExpr> for Hoister<'_, '_> {
    #[inline(always)]
    fn fold(&mut self, node: PatOrExpr) -> PatOrExpr {
        node
    }
}

impl Fold<Constructor> for Resolver<'_> {
    fn fold(&mut self, c: Constructor) -> Constructor {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let params = c.params.fold_with(self);
        self.ident_type = old;

        let body = c.body.fold_with(self);
        let key = c.key.fold_with(self);

        Constructor {
            params,
            body,
            key,
            ..c
        }
    }
}
