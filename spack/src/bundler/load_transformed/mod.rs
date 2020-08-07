use super::Bundler;
use crate::{
    bundler::{
        export::{Exports, RawExports},
        helpers::Helpers,
        import::RawImports,
    },
    debug::assert_clean,
    Id, ModuleId,
};
use anyhow::{Context, Error};
use is_macro::Is;
use rayon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_atoms::js_word;
use swc_common::{FileName, Mark, SourceFile, DUMMY_SP};
use swc_ecma_ast::{
    Expr, ExprOrSuper, ImportDecl, ImportSpecifier, Invalid, MemberExpr, Module, ModuleDecl,
    Program, Str,
};
use swc_ecma_transforms::{
    optimization::{simplify::dead_branch_remover, InlineGlobals},
    resolver::resolver_with_mark,
};
use swc_ecma_visit::{FoldWith, Node, Visit, VisitWith};


impl Bundler<'_> {


}

struct Es6ModuleDetector {
    /// If import statement or export is detected, it's an es6 module regardless
    /// of other codes.
    forced_es6: bool,
    /// True if other module system is detected.
    found_other: bool,
}

impl Visit for Es6ModuleDetector {
    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }

        match &e.obj {
            ExprOrSuper::Expr(e) => {
                match &**e {
                    Expr::Ident(i) => {
                        // TODO: Check syntax context (Check if marker is the global mark)
                        if i.sym == *"module" {
                            self.found_other = true;
                        }

                        if i.sym == *"exports" {
                            self.found_other = true;
                        }
                    }

                    _ => {}
                }
            }
            _ => {}
        }

        //
    }

    fn visit_module_decl(&mut self, decl: &ModuleDecl, _: &dyn Node) {
        match decl {
            ModuleDecl::Import(_)
            | ModuleDecl::ExportDecl(_)
            | ModuleDecl::ExportNamed(_)
            | ModuleDecl::ExportDefaultDecl(_)
            | ModuleDecl::ExportDefaultExpr(_)
            | ModuleDecl::ExportAll(_) => {
                self.forced_es6 = true;
            }

            ModuleDecl::TsImportEquals(_) => {}
            ModuleDecl::TsExportAssignment(_) => {}
            ModuleDecl::TsNamespaceExport(_) => {}
        }
    }
}
