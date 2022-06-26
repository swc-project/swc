use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{maybe_par, option::CompressOptions};

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

    fn visit_mut_module_items(&mut self, nodes: &mut Vec<ModuleItem>) {
        self.ctx.is_module = maybe_par!(
            nodes
                .iter()
                .any(|s| matches!(s, ModuleItem::ModuleDecl(..))),
            *crate::LIGHT_TASK_PARALLELS
        );
        self.ctx.is_top_level = true;

        nodes.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, nodes: &mut Vec<Stmt>) {
        let old = self.ctx;

        self.ctx.is_top_level = false;

        nodes.visit_mut_children_with(self);

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
}
