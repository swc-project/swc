use crate::id::Id;
use fxhash::FxHashSet;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub fn top_level_ident_folder(top_level_mark: Mark, module_mark: Mark) -> impl 'static + Fold {
    MergeFolder {
        scope: Default::default(),
        top_level_mark,
        module_mark,
    }
}

#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    binding_idents: FxHashSet<Id>,
}

/// Modifies mark of top-level identifiers so they can be merged cleanly.
struct MergeFolder<'a> {
    scope: Scope<'a>,
    /// Global marker for the top-level identifiers
    top_level_mark: Mark,
    /// THe marker for the module's top-level identifiers.
    module_mark: Mark,
}

impl<'a> Scope<'a> {
    pub fn new(parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            ..Default::default()
        }
    }

    pub fn contains(&self, i: &Ident) -> bool {
        if self.binding_idents.contains(&Id::from(i)) {
            return true;
        }

        self.parent.map(|p| p.contains(i)).unwrap_or(false)
    }
}

impl<'a> MergeFolder<'a> {
    fn fold_bindine_ident(&mut self, i: Ident) -> Ident {
        log::trace!("BindingIdent: {}{:?}", i.sym, i.span.ctxt);

        self.scope.binding_idents.insert((&i).into());
        i
    }

    fn fold_ref_ident(&mut self, mut i: Ident) -> Ident {
        // Skip reference to globals.
        if !self.scope.contains(&i) {
            return i;
        }
        log::trace!("Changing context of ident ref: {}{:?}", i.sym, i.span.ctxt);

        let mut ctxt = i.span.clone();
        if self.top_level_mark == ctxt.remove_mark() {
            i.span = i
                .span
                .with_ctxt(SyntaxContext::empty().apply_mark(self.module_mark));
        }
        i
    }

    fn child(&'a self) -> MergeFolder<'a> {
        MergeFolder {
            top_level_mark: self.top_level_mark,
            module_mark: self.module_mark,
            scope: Scope::new(Some(&self.scope)),
        }
    }
}

impl Fold for MergeFolder<'_> {
    fn fold_member_expr(&mut self, e: MemberExpr) -> MemberExpr {
        if e.computed {
            MemberExpr {
                obj: e.obj.fold_with(self),
                prop: e.prop.fold_with(self),
                ..e
            }
        } else {
            MemberExpr {
                obj: e.obj.fold_with(self),
                ..e
            }
        }
    }

    fn fold_expr(&mut self, mut e: Expr) -> Expr {
        e = e.fold_children_with(self);

        match e {
            Expr::Ident(i) => Expr::Ident(self.fold_ref_ident(i)),
            _ => e,
        }
    }

    fn fold_fn_decl(&mut self, decl: FnDecl) -> FnDecl {
        let ident = self.fold_bindine_ident(decl.ident);

        let mut child = self.child();
        let function = decl.function.fold_with(&mut child);

        FnDecl {
            ident,
            function,
            ..decl
        }
    }

    fn fold_fn_expr(&mut self, f: FnExpr) -> FnExpr {
        let ident = f.ident.map(|i| self.fold_bindine_ident(i));

        let mut child = self.child();
        let function = f.function.fold_with(&mut child);

        FnExpr {
            ident,
            function,
            ..f
        }
    }

    fn fold_pat(&mut self, mut p: Pat) -> Pat {
        p = p.fold_children_with(self);

        match p {
            Pat::Ident(i) => Pat::Ident(self.fold_bindine_ident(i)),
            _ => p,
        }
    }
}
