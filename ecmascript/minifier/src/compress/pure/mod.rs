use self::ctx::Ctx;
use crate::{option::CompressOptions, MAX_PAR_DEPTH};
use rayon::prelude::*;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

mod ctx;

struct Pure<'a> {
    options: &'a CompressOptions,
    ctx: Ctx,
    changed: bool,
}

impl Pure<'_> {
    fn visit_par<N>(&mut self, nodes: &mut Vec<N>)
    where
        N: for<'aa> VisitMutWith<Pure<'aa>> + Send + Sync,
    {
        if self.ctx.par_depth >= MAX_PAR_DEPTH * 2 {
            for node in nodes {
                let mut v = Pure {
                    options: self.options,
                    ctx: self.ctx,
                    changed: false,
                };
                node.visit_mut_with(&mut v);

                self.changed |= v.changed;
            }
        } else {
            let results = nodes
                .par_iter_mut()
                .map(|node| {
                    let mut v = Pure {
                        options: self.options,
                        ctx: Ctx {
                            par_depth: self.ctx.par_depth + 1,
                            ..self.ctx
                        },
                        changed: false,
                    };
                    node.visit_mut_with(&mut v);

                    v.changed
                })
                .collect::<Vec<_>>();

            for res in results {
                self.changed |= res;
            }
        }
    }
}

impl VisitMut for Pure<'_> {
    noop_visit_mut_type!();

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        self.visit_par(exprs);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(items);
    }

    fn visit_mut_prop_or_spreads(&mut self, exprs: &mut Vec<PropOrSpread>) {
        self.visit_par(exprs);
    }
}
