use crate::scope::ScopeKind;
use ast::*;
use fnv::FnvHashSet;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Mark, SyntaxContext};

#[cfg(test)]
mod tests;

const LOG: bool = false;

pub fn resolver() -> Resolver<'static> {
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
    declared_symbols: FnvHashSet<JsWord>,
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

#[derive(Clone)]
pub struct Resolver<'a> {
    mark: Mark,
    current: Scope<'a>,
    cur_defining: Option<(JsWord, Mark)>,
    in_var_decl: bool,
}

impl<'a> Resolver<'a> {
    fn new(mark: Mark, current: Scope<'a>, cur_defining: Option<(JsWord, Mark)>) -> Self {
        Resolver {
            mark,
            current,
            cur_defining,
            in_var_decl: false,
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

        folder.in_var_decl = true;
        f.params = f.params.fold_with(&mut folder);

        folder.in_var_decl = false;
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

        let function = node.function.fold_with(self);

        FnDecl {
            ident,
            function,
            ..node
        }
    }
}

impl<'a> Fold<Expr> for Resolver<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        let old_in_var_decl = self.in_var_decl;
        self.in_var_decl = false;
        let expr = match expr {
            // Leftmost one of a member expression shoukld be resolved.
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
        self.in_var_decl = old_in_var_decl;

        expr
    }
}

impl<'a> Fold<VarDeclarator> for Resolver<'a> {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        // order is important

        let old_in_var_decl = self.in_var_decl;
        self.in_var_decl = true;
        let name = decl.name.fold_with(self);
        self.in_var_decl = old_in_var_decl;

        let cur_name = match name {
            Pat::Ident(Ident { ref sym, .. }) => Some((sym.clone(), self.mark)),
            _ => None,
        };

        let is_class_like = match decl.init {
            Some(box Expr::Fn(FnExpr { ref ident, .. }))
                if cur_name.is_some()
                    && ident.as_ref().map(|v| &v.sym) == cur_name.as_ref().map(|v| &v.0) =>
            {
                true
            }

            Some(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(box Expr::Fn(FnExpr { ident: None, .. })),
                ..
            }))
            | Some(box Expr::Call(CallExpr {
                callee:
                    ExprOrSuper::Expr(box Expr::Paren(ParenExpr {
                        expr: box Expr::Fn(FnExpr { ident: None, .. }),
                        ..
                    })),
                ..
            })) => true,
            _ => false,
        };

        let old_def = self.cur_defining.take();
        self.cur_defining = if is_class_like { cur_name } else { None };

        let init = decl.init.fold_children(self);

        self.cur_defining = old_def;

        VarDeclarator { name, init, ..decl }
    }
}

impl<'a> Fold<Ident> for Resolver<'a> {
    fn fold(&mut self, i: Ident) -> Ident {
        if self.in_var_decl {
            self.fold_binding_ident(i)
        } else {
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
                // Cannot resolve reference. (TODO: Report error)
                Ident { sym, span, ..i }
            }
        }
    }
}

impl<'a> Fold<ArrowExpr> for Resolver<'a> {
    fn fold(&mut self, e: ArrowExpr) -> ArrowExpr {
        let old_in_var_decl = self.in_var_decl;
        self.in_var_decl = true;
        let params = e.params.fold_with(self);
        self.in_var_decl = old_in_var_decl;

        let body = e.body.fold_with(self);

        ArrowExpr { params, body, ..e }
    }
}

impl<'a> Fold<Constructor> for Resolver<'a> {
    fn fold(&mut self, c: Constructor) -> Constructor {
        let old_in_var_decl = self.in_var_decl;
        self.in_var_decl = true;
        let params = c.params.fold_with(self);
        self.in_var_decl = old_in_var_decl;

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

impl<'a> Fold<CatchClause> for Resolver<'a> {
    fn fold(&mut self, c: CatchClause) -> CatchClause {
        let old_in_var_decl = self.in_var_decl;
        self.in_var_decl = true;
        let param = c.param.fold_with(self);
        self.in_var_decl = old_in_var_decl;

        let body = c.body.fold_with(self);

        CatchClause { param, body, ..c }
    }
}
