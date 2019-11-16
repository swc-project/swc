use crate::{
    pass::Pass,
    scope::{IdentType, ScopeKind},
};
use ast::*;
use hashbrown::HashSet;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Mark, SyntaxContext};

#[cfg(test)]
mod tests;

const LOG: bool = false;

pub fn resolver() -> impl Pass + 'static {
    Resolver::new(
        Mark::fresh(Mark::root()),
        Scope::new(ScopeKind::Fn, None),
        None,
    )
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of this scope
    parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    kind: ScopeKind,

    /// All references declared in this scope
    declared_symbols: HashSet<JsWord>,
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
        }
    }
}

pub struct Resolver<'a> {
    mark: Mark,
    current: Scope<'a>,
    cur_defining: Option<(JsWord, Mark)>,
    ident_type: IdentType,
}

impl<'a> Resolver<'a> {
    fn new(mark: Mark, current: Scope<'a>, cur_defining: Option<(JsWord, Mark)>) -> Self {
        Resolver {
            mark: mark.into(),
            current: current.into(),
            cur_defining: cur_defining.into(),
            ident_type: IdentType::Ref,
        }
    }

    fn mark_for(&self, sym: &JsWord) -> Option<Mark> {
        let mut mark = self.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains(sym) {
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

        let (should_insert, mark) = if let Some((ref cur, override_mark)) = self.cur_defining {
            if *cur != ident.sym {
                (true, self.mark)
            } else {
                (false, override_mark)
            }
        } else {
            (true, self.mark)
        };

        if should_insert {
            self.current.declared_symbols.insert(ident.sym.clone());
        }

        Ident {
            span: if mark == Mark::root() {
                ident.span
            } else {
                if cfg!(debug_assertions) && LOG {
                    eprintln!("\t-> {:?}", mark);
                }
                ident.span.apply_mark(mark)
            },
            sym: ident.sym,
            ..ident
        }
    }
}

impl<'a> Fold<Function> for Resolver<'a> {
    fn fold(&mut self, mut f: Function) -> Function {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
        );

        folder.ident_type = IdentType::Ref;
        f.decorators = f.decorators.fold_with(&mut folder);

        folder.ident_type = IdentType::Binding;
        f.params = f.params.fold_with(&mut folder);

        folder.ident_type = IdentType::Ref;
        f.body = f.body.map(|stmt| stmt.fold_children(&mut folder));

        self.cur_defining = folder.cur_defining;

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

        let block = block.fold_children(&mut child_folder);
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

        let function = e.function.fold_with(self);

        FnExpr { ident, function }
    }
}

impl<'a> Fold<FnDecl> for Resolver<'a> {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        let ident = self.fold_binding_ident(node.ident);

        let old = self.cur_defining.take();
        self.cur_defining = Some((ident.sym.clone(), ident.span.ctxt().remove_mark()));

        let function = node.function.fold_with(self);

        self.cur_defining = old;

        FnDecl {
            ident,
            function,
            ..node
        }
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
            _ => expr.fold_children(self),
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
        let init = decl.init.fold_children(self);
        self.cur_defining = old_defining;

        VarDeclarator { name, init, ..decl }
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

                if let Some(mark) = self.mark_for(&sym) {
                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", mark);
                    }
                    Ident {
                        sym,
                        span: span.apply_mark(mark),
                        ..i
                    }
                } else {
                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> Unresolved");
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

track_ident!(Resolver);

impl<'a> Fold<ArrowExpr> for Resolver<'a> {
    fn fold(&mut self, e: ArrowExpr) -> ArrowExpr {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let params = e.params.fold_with(self);
        self.ident_type = old;

        let body = e.body.fold_with(self);

        ArrowExpr { params, body, ..e }
    }
}
