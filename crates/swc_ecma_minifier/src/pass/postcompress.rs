use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::option::CompressOptions;

pub fn postcompress_optimizer(options: &CompressOptions) -> impl '_ + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,
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

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        v.visit_mut_children_with(self);

        if self.options.const_to_let {
            if let VarDeclKind::Const = v.kind {
                v.kind = VarDeclKind::Let;
            }
        }
    }
}
