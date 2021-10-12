use std::mem::take;

use super::usage_analyzer::FreezedData;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

#[derive(Debug, Default)]
pub struct RenameOps {
    pub rename: AHashMap<Id, JsWord>,
}

impl RenameOps {
    fn merge(&mut self, other: RenameOps) {
        self.rename.extend(other.rename);
    }
}

pub struct RenameAnalyzer<'a> {
    pub data: &'a FreezedData,
    pub scope_ctxt: SyntaxContext,
    pub ops: RenameOps,
    pub par_depth: u8,
}

impl RenameAnalyzer<'_> {
    fn visit_par<N>(&mut self, nodes: &[N], _threshold: usize)
    where
        N: Send + Sync + for<'aa> VisitWith<RenameAnalyzer<'aa>>,
    {
        #[cfg(feature = "concurrent")]
        if nodes.len() > _threshold && self.par_depth < 3 {
            use rayon::prelude::*;

            let ops = nodes
                .par_iter()
                .map(|node| {
                    let mut v = RenameAnalyzer {
                        data: &self.data,
                        scope_ctxt: self.scope_ctxt,
                        ops: Default::default(),
                        par_depth: self.par_depth + 1,
                    };
                    node.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

                    v.ops
                })
                .reduce(Default::default, |mut a, b| {
                    a.merge(b);
                    a
                });

            self.ops.merge(ops);
            return;
        }

        for n in nodes {
            n.visit_with(&Invalid { span: DUMMY_SP }, self);
        }
    }

    fn visit_with_scope<F>(&mut self, scope_ctxt: SyntaxContext, op: F)
    where
        F: for<'aa> FnOnce(&mut RenameAnalyzer<'aa>),
    {
        let ops = take(&mut self.ops);
        let mut v = RenameAnalyzer {
            data: &self.data,
            scope_ctxt,
            ops,
            par_depth: self.par_depth,
        };
        op(&mut v);
        self.ops = v.ops;
    }

    fn rename_usage(&mut self, i: &Ident) {}
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

    fn visit_exprs(&mut self, items: &[Box<Expr>], _: &dyn Node) {
        self.visit_par(items, 4);
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

    fn visit_module_items(&mut self, items: &[ModuleItem], _: &dyn Node) {
        self.visit_par(items, 64);
    }

    fn visit_stmts(&mut self, items: &[Stmt], _: &dyn Node) {
        self.visit_par(items, 128);
    }
}
