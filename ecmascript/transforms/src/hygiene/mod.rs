use self::ops::{Operator, ScopeOp};
use crate::{pass::Pass, scope::ScopeKind};
use ast::*;
use fnv::{FnvHashMap, FnvHashSet};
use std::{cell::RefCell, rc::Rc};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext};

mod ops;
#[cfg(test)]
mod tests;

impl<'a> Hygiene<'a> {
    fn add_declared_ref(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        let can_declare_without_renaming = self.current.can_declare(&ident.sym, ctxt);

        dbg!((&ident.sym, can_declare_without_renaming));

        self.current
            .declared_symbols
            .entry(ident.sym.clone())
            .or_insert_with(Vec::new)
            .push(ctxt);

        if can_declare_without_renaming {
            // skip if previous symbol is declared on the same level.
            return;
        }

        self.rename(ident.sym, ctxt);
    }

    fn add_used_ref(&mut self, ident: Ident) {
        let ctxt = ident.span.ctxt();

        self.current
            .used_refs
            .insert((ident.sym.clone(), ident.span));

        // We rename declaration instead of usage
        let conflicts = self.current.conflicts(ident.sym.clone(), ctxt);

        for cx in conflicts {
            self.rename(ident.sym.clone(), cx)
        }
    }

    fn rename(&mut self, sym: JsWord, ctxt: SyntaxContext) {
        // symbol conflicts
        let renamed = {
            let mut i = 0;
            loop {
                i += 1;
                let sym: JsWord = format!("{}{}", sym, i).into();

                if !self.current.is_declared(&sym) {
                    break sym;
                }
            }
        };

        self.current
            .scope_of(&sym, ctxt)
            .ops
            .borrow_mut()
            .push(ScopeOp::Rename {
                from: (sym, ctxt),
                to: renamed,
            });
    }
}

pub fn hygiene() -> impl Pass + Clone + Copy {
    struct MarkClearer;
    impl Fold<Span> for MarkClearer {
        fn fold(&mut self, span: Span) -> Span {
            span.with_ctxt(SyntaxContext::empty())
        }
    }

    #[derive(Clone, Copy)]
    struct Folder;
    impl Fold<Module> for Folder {
        fn fold(&mut self, module: Module) -> Module {
            module
                .fold_with(&mut Hygiene::new())
                .fold_with(&mut MarkClearer)
        }
    }

    Folder
}

#[doc(hidden)]
struct Hygiene<'a> {
    current: Scope<'a>,
}

impl<'a> Hygiene<'a> {
    pub fn new() -> Self {
        Hygiene {
            current: Scope::new(ScopeKind::Fn, None),
        }
    }

    fn apply_ops<N>(&mut self, node: N) -> N
    where
        for<'o> N: FoldWith<Operator<'o>>,
    {
        let ops = self.current.ops.borrow();

        if ops.is_empty() {
            return node;
        }
        node.fold_with(&mut Operator(&ops))
    }
}

impl<'a> Fold<Module> for Hygiene<'a> {
    fn fold(&mut self, module: Module) -> Module {
        let module = module.fold_children(self);

        self.apply_ops(module)
    }
}

impl<'a> Fold<TryStmt> for Hygiene<'a> {
    fn fold(&mut self, node: TryStmt) -> TryStmt {
        TryStmt {
            span: node.span,
            block: node.block.fold_children(self),
            handler: node.handler.fold_with(self),
            finalizer: node.finalizer.fold_children(self),
        }
    }
}

impl<'a> Fold<BlockStmt> for Hygiene<'a> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        let node = {
            let mut folder = Hygiene {
                current: Scope::new(ScopeKind::Block, Some(&self.current)),
            };

            let node = node.fold_children(&mut folder);
            dbg!(&folder.current.ops);
            dbg!(&self.current.ops);
            node
        };

        self.apply_ops(node)
    }
}

impl<'a> Hygiene<'a> {
    fn fold_fn(&mut self, ident: Option<Ident>, mut node: Function) -> Function {
        match ident {
            Some(ident) => {
                self.add_declared_ref(ident);
            }
            _ => {}
        }

        let mut folder = Hygiene {
            current: Scope::new(ScopeKind::Fn, Some(&self.current)),
        };

        node.params = node.params.fold_with(&mut folder);
        node.body = node.body.map(|stmt| stmt.fold_children(&mut folder));

        dbg!(&folder.current.ops);
        dbg!(&self.current.ops);

        self.apply_ops(node)
    }
}

impl<'a> Fold<Pat> for Hygiene<'a> {
    fn fold(&mut self, pat: Pat) -> Pat {
        match pat {
            Pat::Ident(ident) => {
                self.add_declared_ref(ident.clone());
                Pat::Ident(ident)
            }
            // TODO
            _ => pat.fold_children(self),
        }
    }
}

impl<'a> Fold<FnExpr> for Hygiene<'a> {
    fn fold(&mut self, mut node: FnExpr) -> FnExpr {
        node.function = self.fold_fn(node.ident.clone(), node.function);

        node
    }
}

impl<'a> Fold<FnDecl> for Hygiene<'a> {
    fn fold(&mut self, mut node: FnDecl) -> FnDecl {
        node.function = self.fold_fn(Some(node.ident.clone()), node.function);

        node
    }
}

impl<'a> Fold<Expr> for Hygiene<'a> {
    fn fold(&mut self, node: Expr) -> Expr {
        match node {
            Expr::Ident(ref ident) => self.add_used_ref(ident.clone()),
            Expr::Member(e) => {
                return Expr::Member(MemberExpr {
                    obj: e.obj.fold_with(self),
                    ..e
                });
            }

            Expr::Fn(..) | Expr::Call(..) => return node.fold_children(self),
            _ => {}
        }

        node
    }
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    /// All references used in this scope
    pub used_refs: FnvHashSet<(JsWord, Span)>,

    /// All references declared in this scope
    pub declared_symbols: FnvHashMap<JsWord, Vec<SyntaxContext>>,

    pub(crate) ops: Rc<RefCell<Vec<ScopeOp>>>,
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            used_refs: Default::default(),
            declared_symbols: Default::default(),
            // children: Default::default(),
            ops: Default::default(),
        }
    }

    fn scope_of(&self, sym: &JsWord, ctxt: SyntaxContext) -> &'a Scope {
        if let Some(prev) = self.declared_symbols.get(sym) {
            if prev.contains(&ctxt) {
                return match self.parent {
                    Some(ref parent) => parent,
                    // Root scope.
                    _ => self,
                };
            }
        }

        match self.parent {
            Some(ref parent) => parent.scope_of(sym, ctxt),
            _ => self,
        }
    }

    fn can_declare(&self, sym: &JsWord, ctxt: SyntaxContext) -> bool {
        match self.parent {
            None => {}
            Some(parent) => {
                if !parent.can_declare(sym, ctxt) {
                    return false;
                }
            }
        }

        if let Some(ctxts) = self.declared_symbols.get(&sym) {
            if ctxts.contains(&ctxt) {
                // Already declared with same context.
                true
            } else {
                false
            }
        } else {
            // No variable named `sym` is declared
            true
        }
    }

    /// Returns all **conflicting** contexts.
    ///
    /// It other words, all `SyntaxContext`s with same `sym` will be returned,
    /// even when defined on parent scope.
    fn conflicts(&self, mut sym: JsWord, ctxt: SyntaxContext) -> Vec<SyntaxContext> {
        let mut ctxts = vec![];

        let mut cur = Some(self);

        while let Some(scope) = cur {
            for op in scope.ops.borrow().iter() {
                match *op {
                    ScopeOp::Rename { ref from, ref to } if from.0 == *sym => sym = to.clone(),
                    _ => {}
                }
            }

            if let Some(cxs) = scope.declared_symbols.get(&sym) {
                ctxts.extend_from_slice(&cxs);
            }

            cur = scope.parent;
        }
        ctxts.retain(|c| *c != ctxt);

        ctxts
    }

    fn is_declared(&self, sym: &JsWord) -> bool {
        if self.declared_symbols.contains_key(sym) {
            return true;
        }
        for op in self.ops.borrow().iter() {
            match *op {
                ScopeOp::Rename { ref to, .. } if sym == to => return true,
                _ => {}
            }
        }
        match self.parent {
            Some(parent) => parent.is_declared(sym),
            _ => false,
        }
    }
}
