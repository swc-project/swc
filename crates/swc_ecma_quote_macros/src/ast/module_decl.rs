use swc_ecma_ast::*;

impl_struct!(ImportDecl, [span, specifiers, src, type_only, asserts]);
impl_struct!(ExportDecl, [span, decl]);
impl_struct!(ExportDefaultDecl, [span, decl]);
impl_struct!(ExportDefaultExpr, [span, expr]);
impl_struct!(ExportAll, [span, src, asserts]);
impl_struct!(NamedExport, [span, specifiers, src, type_only, asserts]);
