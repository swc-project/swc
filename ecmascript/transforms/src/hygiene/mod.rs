use crate::{
    pass::Pass,
    scope::{Scope, ScopeKind, ScopeOp},
};
use ast::*;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext};

#[cfg(test)]
mod tests;

impl<'a> Hygiene<'a> {
    fn add_declared_ref(&mut self, ident: Ident) {
        if !self.current.is_declared(&ident.sym) {
            // first symbol
            self.current
                .declared_symbols
                .insert(ident.sym.clone(), ident.span.ctxt());
            return;
        }

        if self.current.get_deflcared_symbol(&ident.sym) == Some(ident.span.ctxt()) {
            // skip if previous symbol is declared on the same level.
            return;
        }

        self.rename(ident.sym, ident.span.ctxt());
    }

    fn add_used_ref(&mut self, ident: Ident) {
        self.current
            .used_refs
            .insert((ident.sym.clone(), ident.span));

        // Context of the previous ident declaration.
        let prev_decl_ctxt = self.current.get_deflcared_symbol(&ident.sym);

        if prev_decl_ctxt.is_none() || prev_decl_ctxt == Some(ident.span.ctxt()) {
            // Good. No need to rename.
            return;
        }

        self.rename(ident.sym, prev_decl_ctxt.unwrap())
    }

    fn rename(&mut self, sym: JsWord, ctxt: SyntaxContext) {
        // symbol conflicts
        let renamed = {
            debug_assert!(self.current.is_declared(&sym));

            let mut i = 0;
            loop {
                i += 1;
                let sym: JsWord = format!("{}{}", sym, i).into();

                if !self.current.is_declared(&sym) {
                    break sym;
                }
            }
        };

        eprintln!("Renaming {}{:?} -> {}", sym, ctxt, renamed);

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
            let mut analyzer = Hygiene {
                current: Scope::new(ScopeKind::Block, Some(&self.current)),
            };

            node.fold_children(&mut analyzer)
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
        node.body = node.body.fold_with(&mut folder);

        // self.current.children.push(analyzer.current);

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
            Expr::This(..) => {
                self.current.used_this.set(true);
            }

            Expr::Fn(..) | Expr::Call(..) => return node.fold_children(self),
            _ => {}
        }

        node
    }
}

impl<'a> Fold<ExprOrSuper> for Hygiene<'a> {
    fn fold(&mut self, node: ExprOrSuper) -> ExprOrSuper {
        match node {
            ExprOrSuper::Super(..) => {
                self.current.used_super.set(true);
                node
            }
            _ => node.fold_children(self),
        }
    }
}

struct Operator<'a>(&'a [ScopeOp]);

impl<'a> Fold<Prop> for Operator<'a> {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(i) => {
                // preserve key
                match self.rename_ident(i.clone()) {
                    Ok(renamed) => Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident {
                            // clear mark
                            span: i.span.with_ctxt(SyntaxContext::empty()),
                            ..i
                        }),
                        value: box Expr::Ident(renamed),
                    }),
                    Err(i) => Prop::Shorthand(i),
                }
            }
            _ => prop.fold_children(self),
        }
    }
}

impl<'a> Operator<'a> {
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&mut self, ident: Ident) -> Result<Ident, Ident> {
        for op in self.0 {
            match *op {
                ScopeOp::Rename { ref from, ref to }
                    if *from.0 == ident.sym && from.1 == ident.span.ctxt() =>
                {
                    return Ok(Ident {
                        // Clear mark
                        span: ident.span.with_ctxt(SyntaxContext::empty()),
                        sym: to.clone(),
                        ..ident
                    });
                }
                _ => {}
            }
        }
        Err(ident)
    }
}

impl<'a> Fold<Ident> for Operator<'a> {
    fn fold(&mut self, ident: Ident) -> Ident {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }
}
