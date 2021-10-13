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
    pub data: &'a Data,
    pub scope_ctxt: SyntaxContext,
    pub ops: RenameOps,
}

impl RenameAnalyzer<'_> {
    fn visit_with_scope<F>(&mut self, scope_ctxt: SyntaxContext, op: F)
    where
        F: for<'aa> FnOnce(&mut RenameAnalyzer<'aa>),
    {
        let ops = take(&mut self.ops);
        let mut v = RenameAnalyzer {
            data: &self.data,
            scope_ctxt,
            ops,
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

        self.ops
            .used_symbols
            .entry(self.scope_ctxt)
            .or_default()
            .push(renamed.clone());
        self.ops.rename.insert(id, renamed);
    }

    fn rename_usage(&mut self, i: &Ident) {
        let i = i.to_id();
        let i = self.apply_ops(i);

        if let Some(scope) = self.data.scopes.get(&self.scope_ctxt) {
            if let Some(usages) = scope.direct_usages.borrow().get(&i.0) {
                if usages.len() >= 2 {
                    self.rename(i)
                }
            }
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
                self.rename_usage(&i);
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
}
