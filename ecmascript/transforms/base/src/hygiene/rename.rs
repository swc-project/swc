use std::mem::take;
use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

use super::usage_analyzer::Data;

#[derive(Debug, Default)]
pub struct RenameOps {
    pub rename: AHashMap<Id, JsWord>,

    /// Symbols used by **renaming**
    pub used_symbols: AHashMap<SyntaxContext, Vec<JsWord>>,
}

impl RenameOps {
    fn merge(&mut self, other: RenameOps) {
        self.rename.extend(other.rename);
    }
}

pub struct RenameAnalyzer<'a> {
    pub data: &'a mut Data,
    pub scope_ctxt: SyntaxContext,
    pub ops: RenameOps,
    pub is_pat_decl: bool,
}

impl RenameAnalyzer<'_> {
    fn visit_with_scope<F>(&mut self, scope_ctxt: SyntaxContext, op: F)
    where
        F: for<'aa> FnOnce(&mut RenameAnalyzer<'aa>),
    {
        let ops = take(&mut self.ops);
        let mut v = RenameAnalyzer {
            data: self.data,
            scope_ctxt,
            ops,
            is_pat_decl: self.is_pat_decl,
        };
        op(&mut v);
        self.ops = v.ops;
    }

    fn is_symbol_declared(&self, sym: &JsWord) -> bool {
        if let Some(scope) = self.data.scopes.get(&self.scope_ctxt) {
            if let Some(usages) = scope.decls.borrow().get(sym) {
                if usages.len() >= 1 {
                    return true;
                }
            }
        }

        if let Some(used) = self.ops.used_symbols.get(&self.scope_ctxt) {
            if used.contains(sym) {
                return true;
            }
        }

        false
    }

    fn apply_ops(&self, id: Id) -> Id {
        if let Some(rename) = self.ops.rename.get(&id) {
            return (rename.clone(), SyntaxContext::empty());
        }

        id
    }

    fn rename(&mut self, id: Id) {
        let renamed = {
            let mut i = 0;
            loop {
                i += 1;
                let sym = format!("{}{}", id.0, i).into();

                if !self.is_symbol_declared(&sym) {
                    break sym;
                }
            }
        };

        // Udpate scoping info

        if let Some(scope) = self.data.scopes.get_mut(&self.scope_ctxt) {
            if let Some(ctxts) = scope.usages.get_mut().get_mut(&id.0) {
                if let Some(pos) = ctxts.iter().position(|&v| v == id.1) {
                    ctxts.remove(pos);
                }
            }

            if let Some(ctxts) = scope.direct_usages.get_mut().get_mut(&id.0) {
                if let Some(pos) = ctxts.iter().position(|&v| v == id.1) {
                    ctxts.remove(pos);
                }
            }

            if let Some(ctxts) = scope.decls.get_mut().get_mut(&id.0) {
                if let Some(pos) = ctxts.iter().position(|&v| v == id.1) {
                    ctxts.remove(pos);
                }
            }
        }

        // Enqueue renaming

        self.ops
            .used_symbols
            .entry(self.scope_ctxt)
            .or_default()
            .push(renamed.clone());
        self.ops.rename.insert(id, renamed);
    }

    fn add_decl(&mut self, i: &Ident) {}

    fn add_usage(&mut self, i: &Ident) {
        let i = i.to_id();
        let i = self.apply_ops(i);

        if i.1 == SyntaxContext::empty() {
            return;
        }

        let rename = if let Some(scope) = self.data.scopes.get(&self.scope_ctxt) {
            if let Some(usages) = scope.direct_usages.borrow().get(&i.0) {
                if usages.len() >= 2 {
                    true
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };

        if rename {
            self.rename(i)
        }
    }
}

impl Visit for RenameAnalyzer<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr, _: &dyn Node) {
        self.visit_with_scope(f.span.ctxt, |v| {
            f.params.visit_with(f, v);

            match &f.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    // Bypass
                    body.visit_children_with(v);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(f, v);
                }
            }
        })
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt, _: &dyn Node) {
        self.visit_with_scope(n.span.ctxt, |v| n.visit_children_with(v))
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.add_usage(&i);
            }
            _ => {}
        }
    }

    fn visit_function(&mut self, f: &Function, _: &dyn Node) {
        f.decorators.visit_with(f, self);

        self.visit_with_scope(f.span.ctxt, |v| {
            f.params.visit_with(f, v);

            match f.body.as_ref() {
                Some(body) => {
                    body.visit_children_with(v);
                }
                None => {}
            }
        });
    }

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                if self.is_pat_decl {
                    self.add_decl(&i.id);
                } else {
                    self.add_usage(&i.id);
                }
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, p: &Prop, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Prop::Shorthand(i) => {
                self.add_usage(&i);
            }
            _ => {}
        }
    }

    fn visit_var_declarator(&mut self, v: &VarDeclarator, _: &dyn Node) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        v.name.visit_with(v, self);

        self.is_pat_decl = false;
        v.init.visit_with(v, self);

        self.is_pat_decl = old;
    }
}
