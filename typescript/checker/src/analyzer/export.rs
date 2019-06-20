use super::{expr::never_ty, Analyzer};
use crate::errors::Error;
use std::{mem, sync::Arc};
use swc_atoms::{js_word, JsWord};
use swc_common::{Spanned, Visit, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

// ModuleDecl::ExportNamed(export) => {}
//
// ModuleDecl::ExportAll(export) => unimplemented!("export * from
// 'other-file';"),
//
// ModuleDecl::TsNamespaceExport(ns) =>
// unimplemented!("export namespace"),

impl Visit<TsExportAssignment> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &TsExportAssignment) {
        export.visit_children(self);

        self.export_default_expr(&export.expr);
    }
}

impl Analyzer<'_, '_> {
    #[inline(always)]
    pub(super) fn handle_pending_exports(&mut self) {
        if self.pending_exports.is_empty() {
            return;
        }

        let pending_exports: Vec<_> = mem::replace(&mut self.pending_exports, Default::default());

        for ((sym, _), expr) in pending_exports {
            // TODO(kdy1): Allow multiple exports with same name.

            debug_assert_eq!(self.info.exports.get(&sym), None);

            let exported_sym = if *sym != js_word!("default") {
                Some(&sym)
            } else {
                match *expr {
                    Expr::Ident(ref i) => Some(&i.sym),
                    _ => None,
                }
            };
            let ty = match exported_sym
                .and_then(|exported_sym| self.scope.types.get_mut(&exported_sym))
            {
                Some(export) => mem::replace(export, never_ty(DUMMY_SP)),
                None => match self.type_of(&expr) {
                    Ok(ty) => ty.into_owned().into(),
                    Err(err) => {
                        self.info.errors.push(err);
                        return;
                    }
                },
            };
            self.info.exports.insert(sym, Arc::new(ty));
        }

        assert_eq!(self.pending_exports, vec![]);
    }

    fn export_default_expr(&mut self, expr: &Expr) {
        assert_eq!(
            self.info.exports.get(&js_word!("default")),
            None,
            "A module can export only one item as default"
        );

        let ty = match self.type_of(expr) {
            Ok(ty) => ty.into_owned().into(),
            Err(err) => {
                match err {
                    // Handle hoisting. This allows
                    //
                    // export = React
                    // declare namespace React {}
                    Error::UndefinedSymbol { .. } => {
                        self.pending_exports
                            .push(((js_word!("default"), expr.span()), box expr.clone()));
                        return;
                    }
                    _ => {}
                }
                self.info.errors.push(err);
                return;
            }
        };
        self.info.exports.insert(js_word!("default"), Arc::new(ty));
    }
}

impl Visit<ExportDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDecl) {
        export.visit_children(self);

        match export.decl {
            Decl::Fn(ref f) => match self.export_fn(f.ident.sym.clone(), &f.function) {
                Ok(()) => {}
                Err(err) => self.info.errors.push(err),
            },
            Decl::TsInterface(ref i) => {
                self.export_interface(i.id.sym.clone(), &i);
            }
            Decl::Class(..) => unimplemented!("export class Foo"),
            Decl::Var(..) => unimplemented!("export var Foo = a;"),
            Decl::TsEnum(ref e) => {
                // TODO(kdy1): Allow multiple exports with same name.
                debug_assert_eq!(self.info.exports.get(&e.id.sym), None);
                self.info
                    .exports
                    .insert(e.id.sym.clone(), Arc::new(e.clone().into()));
            }
            Decl::TsModule(..) => unimplemented!("export module "),
            Decl::TsTypeAlias(ref decl) => {
                // export type Foo = 'a' | 'b';
                // export type Foo = {};

                // TODO(kdy1): Handle type parameters.

                self.info
                    .exports
                    .insert(decl.id.sym.clone(), Arc::new(decl.clone().into()));
            }
        }
    }
}

impl Visit<ExportDefaultDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDefaultDecl) {
        export.visit_children(self);

        match export.decl {
            DefaultDecl::Fn(ref f) => match self.export_fn(js_word!("default"), &f.function) {
                Ok(()) => {}
                Err(err) => self.info.errors.push(err),
            },
            DefaultDecl::Class(..) => unimplemented!("export default class"),
            DefaultDecl::TsInterfaceDecl(ref i) => {
                self.export_interface(js_word!("default"), i);
            }
        };
    }
}

impl Visit<ExportDefaultExpr> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDefaultExpr) {
        export.visit_children(self);

        self.export_default_expr(&export.expr);
    }
}

impl Analyzer<'_, '_> {
    fn export_interface(&mut self, name: JsWord, i: &TsInterfaceDecl) {
        // TODO(kdy1): Allow multiple exports with same name.
        debug_assert_eq!(self.info.exports.get(&name), None);

        self.info.exports.insert(name, Arc::new(i.clone().into()));
    }

    fn export_fn(&mut self, name: JsWord, f: &Function) -> Result<(), Error> {
        let ty = self.type_of_fn(f)?;

        self.info.exports.insert(name, Arc::new(ty.into()));

        Ok(())
    }
}

pub fn pat_to_ts_fn_param(p: Pat) -> TsFnParam {
    match p {
        Pat::Ident(i) => TsFnParam::Ident(i),
        Pat::Rest(rest) => TsFnParam::Rest(rest),
        Pat::Array(arr) => TsFnParam::Array(arr),
        Pat::Object(obj) => TsFnParam::Object(obj),
        // TODO: Pat::Assign()
        _ => unimplemented!("function parameter of type {:?}", p),
    }
}
