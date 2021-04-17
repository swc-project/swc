// use super::Context;
// use crate::ast::{
//     common::IdOrString,
//     module::{
//         ModuleDeclaration, ExportDefaultDeclaration, ExportDefaultDeclType, ImportDeclaration,
//         ImportKind, ImportAttribute, ImportSpecifierType, ImportSpecifier as BabelImportSpecifier,
//         ImportDefaultSpecifier as BabelImportDefaultSpecifier, ImportNamespaceSpecifier,
//         ExportAllDeclaration, ExportNamedDeclaration, ExportKind, ExportSpecifierType,
//         ExportSpecifier as BabelExportSpecifier,
//         ExportDefaultSpecifier as BabelExportDefaultSpecifier,
//         ExportNamespaceSpecifier as BabelExportNamespaceSpecifier,
//     },
//     typescript::{TSImportEqualsDeclaration, TSExportAssignment, TSNamespaceExportDeclaration},
// };
// use crate::convert::Babelify;

use crate::{Context, Babelify};
use swc_babel_ast::{
    IdOrString, ModuleDeclaration, ExportDefaultDeclaration, ExportDefaultDeclType,
    ImportDeclaration, ImportKind, ImportAttribute, ImportSpecifierType,
    ImportSpecifier as BabelImportSpecifier, ImportDefaultSpecifier as BabelImportDefaultSpecifier,
    ImportNamespaceSpecifier, ExportAllDeclaration, ExportNamedDeclaration, ExportKind,
    ExportSpecifierType, ExportSpecifier as BabelExportSpecifier,
    ExportDefaultSpecifier as BabelExportDefaultSpecifier,
    ExportNamespaceSpecifier as BabelExportNamespaceSpecifier, TSImportEqualsDeclaration,
    TSExportAssignment, TSNamespaceExportDeclaration,
};

use swc_ecma_ast::{
    ModuleDecl, ExportDefaultExpr, ExportDefaultDecl, DefaultDecl, ExportDecl, Decl, ImportDecl,
    PropOrSpread, Prop, PropName, Expr, Lit, ImportSpecifier, ImportNamedSpecifier,
    ImportDefaultSpecifier, ImportStarAsSpecifier, ObjectLit, ExportAll, NamedExport,
    ExportSpecifier, ExportNamedSpecifier, ExportDefaultSpecifier, ExportNamespaceSpecifier,
};
use serde::{Serialize, Deserialize};
use std::any::type_name_of_val;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleDeclOutput {
    Import(ImportDeclaration),
    ExportDefault(ExportDefaultDeclaration),
    ExportNamed(ExportNamedDeclaration),
    ExportAll(ExportAllDeclaration),
    TsImportEquals(TSImportEqualsDeclaration),
    TsExportAssignment(TSExportAssignment),
    TsNamespaceExport(TSNamespaceExportDeclaration),
}

impl Babelify for ModuleDecl {
    type Output = ModuleDeclOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ModuleDecl::Import(i) => ModuleDeclOutput::Import(i.babelify(ctx)),
            ModuleDecl::ExportDecl(e) => ModuleDeclOutput::ExportDefault(e.babelify(ctx)),
            ModuleDecl::ExportNamed(n) => ModuleDeclOutput::ExportNamed(n.babelify(ctx)),
            ModuleDecl::ExportDefaultDecl(e) => ModuleDeclOutput::ExportDefault(e.babelify(ctx)),
            ModuleDecl::ExportDefaultExpr(e) => ModuleDeclOutput::ExportDefault(e.babelify(ctx)),
            ModuleDecl::ExportAll(a) => ModuleDeclOutput::ExportAll(a.babelify(ctx)),
            ModuleDecl::TsImportEquals(i) => ModuleDeclOutput::TsImportEquals(i.babelify(ctx)),
            ModuleDecl::TsExportAssignment(a) => ModuleDeclOutput::TsExportAssignment(a.babelify(ctx)),
            ModuleDecl::TsNamespaceExport(e) => ModuleDeclOutput::TsNamespaceExport(e.babelify(ctx)),
        }
    }
}

impl From<ModuleDeclOutput> for ModuleDeclaration {
    fn from(module: ModuleDeclOutput) -> Self {
        match module {
            ModuleDeclOutput::Import(i) => ModuleDeclaration::Import(i),
            ModuleDeclOutput::ExportDefault(e) => ModuleDeclaration::ExportDefault(e),
            ModuleDeclOutput::ExportNamed(n) => ModuleDeclaration::ExportNamed(n),
            ModuleDeclOutput::ExportAll(a) => ModuleDeclaration::ExportAll(a),
            _ => panic!("illegal conversion: Cannot convert {} to ModuleDeclaration (in impl From<ModuleDeclOutput> for ModuleDeclaration)", type_name_of_val(&module)),
        }
    }
}

impl Babelify for ExportDefaultExpr {
    type Output = ExportDefaultDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExportDefaultDeclaration {
            base: ctx.base(self.span),
            declaration: ExportDefaultDeclType::Expr(Box::new(self.expr.babelify(ctx).into())),
        }
    }
}

impl Babelify for ExportDecl {
    type Output = ExportDefaultDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExportDefaultDeclaration {
            base: ctx.base(self.span),
            declaration: match self.decl {
                Decl::Class(c) => ExportDefaultDeclType::Class(c.babelify(ctx)),
                Decl::Fn(f) => ExportDefaultDeclType::Func(f.babelify(ctx)),
                // TODO(dwoznicki): not sure how to do the rest of the conversions
                _ => panic!("illegal conversion: Cannot convert {} to ExportDefaultDeclType (in impl Babelify for ExportDecl)", type_name_of_val(&self.decl)),
            }
        }
    }
}

fn convert_import_asserts(asserts: Option<ObjectLit>, ctx: &Context) -> Option<Vec<ImportAttribute>> {
    asserts.map(|obj| {
        obj.props.iter().map(|prop_or_spread| {
            let prop = match prop_or_spread.clone() {
                PropOrSpread::Prop(p) => p,
                _ => panic!("illegal conversion: Cannot convert {} to Prop (in convert_import_asserts)", type_name_of_val(&prop_or_spread)),
            };
            let (key, val) = match *prop {
                Prop::KeyValue(keyval) => {
                    let key = match keyval.key {
                        PropName::Ident(i) => IdOrString::Id(i.babelify(ctx)),
                        PropName::Str(s) => IdOrString::String(s.babelify(ctx)),
                        _ => panic!("illegal conversion: Cannot convert {} to Prop::KeyValue (in convert_import_asserts)", type_name_of_val(&keyval.key)),
                    };
                    let val = match *keyval.value {
                        Expr::Lit(lit) => {
                            match lit {
                                Lit::Str(s) => s.babelify(ctx),
                                _ => panic!("illegal conversion: Cannot convert {} to Expr::Lit (in convert_import_asserts)", type_name_of_val(&lit)),
                            }
                        },
                        _ => panic!("illegal conversion: Cannot convert {} to Expr::Lit (in convert_import_asserts)", type_name_of_val(&keyval.value)),
                    };
                    (key, val)
                },
                _ => panic!("illegal conversion: Cannot convert {} to key, value (in convert_import_asserts)", type_name_of_val(&prop)),
            };
            ImportAttribute {
                base: ctx.base(obj.span),
                key: key,
                value: val,
            }
        }).collect()
    })
}

impl Babelify for ImportDecl {
    type Output = ImportDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ImportDeclaration {
            base: ctx.base(self.span),
            specifiers: self.specifiers.iter().map(|spec| spec.clone().babelify(ctx)).collect(),
            source: self.src.babelify(ctx),
            assertions: convert_import_asserts(self.asserts, ctx),
            import_kind: if self.type_only { Some(ImportKind::Type) } else { None },
        }
    }
}

impl Babelify for ExportAll {
    type Output = ExportAllDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExportAllDeclaration {
            base: ctx.base(self.span),
            source: self.src.babelify(ctx),
            assertions: convert_import_asserts(self.asserts, ctx),
            export_kind: None,
        }
    }
}

impl Babelify for NamedExport {
    type Output = ExportNamedDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExportNamedDeclaration {
            base: ctx.base(self.span),
            declaration: Default::default(),
            specifiers: self.specifiers.iter().map(|spec| spec.clone().babelify(ctx)).collect(),
            source: self.src.map(|s| s.babelify(ctx)),
            assertions: convert_import_asserts(self.asserts, ctx),
            export_kind: if self.type_only { Some(ExportKind::Type) } else { None },
        }
    }
}

impl Babelify for ExportDefaultDecl {
    type Output = ExportDefaultDeclaration;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ExportDefaultDeclaration {
            base: ctx.base(self.span),
            declaration: self.decl.babelify(ctx),
        }
    }
}

impl Babelify for DefaultDecl {
    type Output = ExportDefaultDeclType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            DefaultDecl::Class(c) => ExportDefaultDeclType::Class(c.babelify(ctx).into()),
            DefaultDecl::Fn(f) => ExportDefaultDeclType::Func(f.babelify(ctx).into()),
            DefaultDecl::TsInterfaceDecl(_) => panic!("unimplemented"), // TODO(dwoznicki): Babel expects a TSDeclareFunction here, which does not map cleanly to TsInterfaceDecl expected by swc
        }
    }
}

impl Babelify for ImportSpecifier {
    type Output = ImportSpecifierType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ImportSpecifier::Named(s) => ImportSpecifierType::Import(s.babelify(ctx)),
            ImportSpecifier::Default(s) => ImportSpecifierType::Default(s.babelify(ctx)),
            ImportSpecifier::Namespace(s) => ImportSpecifierType::Namespace(s.babelify(ctx)),
        }
    }
}

impl Babelify for ImportDefaultSpecifier {
    type Output = BabelImportDefaultSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelImportDefaultSpecifier {
            base: ctx.base(self.span),
            local: self.local.babelify(ctx),
        }
    }
}

impl Babelify for ImportStarAsSpecifier {
    type Output = ImportNamespaceSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ImportNamespaceSpecifier {
            base: ctx.base(self.span),
            local: self.local.babelify(ctx),
        }
    }
}

impl Babelify for ImportNamedSpecifier {
    type Output = BabelImportSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelImportSpecifier {
            base: ctx.base(self.span),
            local: self.local.babelify(ctx),
            imported: IdOrString::Id(self.imported.unwrap().babelify(ctx)), // TODO(dwoznicki): what to do when None?
            import_kind: ImportKind::Type, // TODO(dwoznicki): not sure what this should actually be
        }
    }
}

impl Babelify for ExportSpecifier {
    type Output = ExportSpecifierType;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ExportSpecifier::Named(s) => ExportSpecifierType::Export(s.babelify(ctx)),
            ExportSpecifier::Default(s) => ExportSpecifierType::Default(s.babelify(ctx)),
            ExportSpecifier::Namespace(s) => ExportSpecifierType::Namespace(s.babelify(ctx)),
        }
    }
}

impl Babelify for ExportNamespaceSpecifier {
    type Output = BabelExportNamespaceSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelExportNamespaceSpecifier {
            base: ctx.base(self.span),
            exported: self.name.babelify(ctx),
        }
    }
}

impl Babelify for ExportDefaultSpecifier {
    type Output = BabelExportDefaultSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let exported = self.exported.babelify(ctx);
        BabelExportDefaultSpecifier {
            base: exported.base.clone(),
            exported: exported,
        }
    }
}

impl Babelify for ExportNamedSpecifier {
    type Output = BabelExportSpecifier;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelExportSpecifier {
            base: ctx.base(self.span),
            local: self.orig.babelify(ctx),
            exported: IdOrString::Id(self.exported.unwrap().babelify(ctx)), // TODO(dwoznicki): what to do when None?
        }
    }
}

