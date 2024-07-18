use swc_ecma_ast::*;

impl_enum!(
    ModuleDecl,
    [
        Import,
        ExportDecl,
        ExportNamed,
        ExportDefaultDecl,
        ExportDefaultExpr,
        ExportAll,
        TsImportEquals,
        TsExportAssignment,
        TsNamespaceExport
    ]
);

impl_struct!(ImportDecl, [span, specifiers, src, type_only, with, phase]);
impl_struct!(ExportDecl, [span, decl]);
impl_struct!(ExportDefaultDecl, [span, decl]);
impl_struct!(ExportDefaultExpr, [span, expr]);
impl_struct!(ExportAll, [span, type_only, src, with]);
impl_struct!(NamedExport, [span, specifiers, src, type_only, with]);

impl_enum!(ImportSpecifier, [Named, Default, Namespace]);

impl_struct!(ImportNamedSpecifier, [span, local, imported, is_type_only]);
impl_struct!(ImportDefaultSpecifier, [span, local]);
impl_struct!(ImportStarAsSpecifier, [span, local]);

impl_enum!(ExportSpecifier, [Named, Default, Namespace]);

impl_enum!(DefaultDecl, [Class, Fn, TsInterfaceDecl]);

impl_enum!(ModuleExportName, [Ident, Str]);

impl_struct!(ExportNamedSpecifier, [span, orig, exported, is_type_only]);
impl_struct!(ExportDefaultSpecifier, [exported]);
impl_struct!(ExportNamespaceSpecifier, [span, name]);
