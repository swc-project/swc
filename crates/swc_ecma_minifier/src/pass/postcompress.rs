use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{Parallel, ParallelExt};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{maybe_par, option::CompressOptions, LIGHT_TASK_PARALLELS};

pub fn postcompress_optimizer(options: &CompressOptions) -> impl '_ + VisitMut {
    PostcompressOptimizer {
        options,
        ctx: Default::default(),
    }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,

    ctx: Ctx,
}

#[derive(Default, Clone, Copy)]
struct Ctx {
    is_module: bool,
    is_top_level: bool,
}

impl Parallel for PostcompressOptimizer<'_> {
    fn create(&self) -> Self {
        Self {
            options: self.options,
            ctx: self.ctx,
        }
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for PostcompressOptimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_export_decl(&mut self, export: &mut ExportDecl) {
        match &mut export.decl {
            Decl::Var(decl) => {
                // Don't change constness of exported variables.
                decl.visit_mut_children_with(self);
            }
            _ => {
                export.decl.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_module_decl(&mut self, m: &mut ModuleDecl) {
        if let ModuleDecl::ExportDefaultExpr(e) = m {
            match &mut *e.expr {
                Expr::Fn(f) => {
                    if f.ident.is_some() {
                        if self.options.top_level() {
                            *m = ExportDefaultDecl {
                                span: e.span,
                                decl: DefaultDecl::Fn(f.take()),
                            }
                            .into()
                        }
                    } else {
                        *m = ExportDefaultDecl {
                            span: e.span,
                            decl: DefaultDecl::Fn(f.take()),
                        }
                        .into()
                    }
                }
                Expr::Class(c) => {
                    if c.ident.is_some() {
                        if self.options.top_level() {
                            *m = ExportDefaultDecl {
                                span: e.span,
                                decl: DefaultDecl::Class(c.take()),
                            }
                            .into()
                        }
                    } else {
                        *m = ExportDefaultDecl {
                            span: e.span,
                            decl: DefaultDecl::Class(c.take()),
                        }
                        .into()
                    }
                }
                _ => (),
            }
        }

        m.visit_mut_children_with(self)
    }

    fn visit_mut_module_items(&mut self, nodes: &mut Vec<ModuleItem>) {
        self.ctx.is_module = maybe_par!(
            nodes
                .iter()
                .any(|s| matches!(s, ModuleItem::ModuleDecl(..))),
            *crate::LIGHT_TASK_PARALLELS
        );
        self.ctx.is_top_level = true;

        self.maybe_par(*crate::LIGHT_TASK_PARALLELS, nodes, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_stmts(&mut self, nodes: &mut Vec<Stmt>) {
        let old = self.ctx;

        self.ctx.is_top_level = false;

        self.maybe_par(*crate::LIGHT_TASK_PARALLELS, nodes, |v, n| {
            n.visit_mut_with(v);
        });

        self.ctx = old;
    }

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        v.visit_mut_children_with(self);

        if self.options.const_to_let {
            if self.ctx.is_module || !self.ctx.is_top_level {
                // We don't change constness of top-level variables in a script

                if let VarDeclKind::Const = v.kind {
                    v.kind = VarDeclKind::Let;
                }
            }
        }
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(*LIGHT_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(*LIGHT_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(*LIGHT_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        self.maybe_par(*LIGHT_TASK_PARALLELS, n, |v, n| {
            n.visit_mut_with(v);
        });
    }
}
