use swc_common::util::take::Take;
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
    noop_visit_mut_type!(fail);

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
}
