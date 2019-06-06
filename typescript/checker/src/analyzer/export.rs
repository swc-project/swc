use super::Analyzer;
use std::sync::Arc;
use swc_atoms::{js_word, JsWord};
use swc_common::{Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

#[derive(Debug, PartialEq)]
pub struct ExportInfo {
    pub ty: Option<TsType>,
    pub extra: Option<ExportExtra>,
}

/// TODO: Remove this
impl From<Option<TsType>> for ExportInfo {
    fn from(ty: Option<TsType>) -> Self {
        ExportInfo { ty, extra: None }
    }
}

impl From<TsType> for ExportInfo {
    fn from(ty: TsType) -> Self {
        ExportInfo {
            ty: Some(ty),
            extra: None,
        }
    }
}

impl From<ExportExtra> for ExportInfo {
    fn from(extra: ExportExtra) -> Self {
        ExportInfo {
            ty: None,
            extra: Some(extra),
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum ExportExtra {
    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
}

// ModuleDecl::ExportNamed(export) => {}
// ModuleDecl::ExportAll(export) => unimplemented!("export * from
// 'other-file';"), ModuleDecl::TsExportAssignment(export) =>
// unimplemented!("export A = B"), ModuleDecl::TsNamespaceExport(ns) =>
// unimplemented!("export namespace"),

impl Visit<ExportDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDecl) {
        export.visit_children(self);

        match export.decl {
            Decl::Fn(ref f) => {
                self.export_fn(f.ident.sym.clone(), &f.function);
            }
            Decl::TsInterface(ref i) => {
                self.export_interface(i.id.sym.clone(), &i);
            }
            Decl::Class(..) => unimplemented!("export class Foo"),
            Decl::Var(..) => unimplemented!("export var Foo = a;"),
            Decl::TsEnum(ref e) => {
                debug_assert_eq!(self.info.exports.get(&e.id.sym), None);
                self.info.exports.insert(
                    e.id.sym.clone(),
                    Arc::new(ExportExtra::Enum(e.clone()).into()),
                );
            }
            Decl::TsModule(..) => unimplemented!("export module "),
            Decl::TsTypeAlias(..) => unimplemented!("export TsTypeAlias"),
        }
    }
}

impl Visit<ExportDefaultDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDefaultDecl) {
        export.visit_children(self);

        match export.decl {
            DefaultDecl::Fn(ref f) => {
                self.export_fn(js_word!("default"), &f.function);
            }
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

        let ty = self.type_of(&export.expr);
        debug_assert_eq!(self.info.exports.get(&js_word!("default")), None);
        self.info
            .exports
            .insert(js_word!("default"), Arc::new(ty.into()));
    }
}

impl Analyzer<'_, '_> {
    fn export_interface(&mut self, name: JsWord, i: &TsInterfaceDecl) {
        debug_assert_eq!(self.info.exports.get(&name), None);

        self.info
            .exports
            .insert(name, Arc::new(ExportExtra::Interface(i.clone()).into()));
    }

    fn export_fn(&mut self, name: JsWord, f: &Function) {
        let ret_ty = f
            .return_type
            .as_ref()
            .map(|t| &*t.type_ann)
            .cloned()
            .unwrap_or_else(|| {
                if let Some(_) = f.body {
                    unimplemented!("return type inference (based on function's body)")
                }

                TsType::TsKeywordType(TsKeywordType {
                    span: f.span,
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                })
            });

        let ty = TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
            span: f.span,
            params: f
                .params
                .clone()
                .into_iter()
                .map(|p| match p {
                    Pat::Ident(i) => TsFnParam::Ident(i),
                    Pat::Rest(rest) => TsFnParam::Rest(rest),
                    Pat::Array(arr) => TsFnParam::Array(arr),
                    Pat::Object(obj) => TsFnParam::Object(obj),
                    // TODO: Pat::Assign()
                    _ => unimplemented!("function parameter of type {:?}", p),
                })
                .collect(),
            type_params: f.type_params.clone(),
            type_ann: TsTypeAnn {
                span: ret_ty.span(),
                type_ann: box ret_ty,
            },
        }));

        self.info.exports.insert(name, Arc::new(ty.into()));
    }
}
