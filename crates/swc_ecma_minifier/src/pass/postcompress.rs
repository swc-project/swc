use swc_common::util::take::Take;
use swc_ecma_ast::*;

use crate::option::CompressOptions;

pub fn postcompress_optimizer(program: &mut Program, options: &CompressOptions) {
    let Some(module) = program.as_mut_module() else {
        return;
    };

    for item in &mut module.body {
        let Some(m) = item.as_mut_module_decl() else {
            continue;
        };

        if let ModuleDecl::ExportDefaultExpr(e) = m {
            match &mut *e.expr {
                Expr::Fn(f) => {
                    if f.ident.is_some() {
                        if options.top_level() {
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
                        if options.top_level() {
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
    }
}
