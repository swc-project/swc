use swc_ecma_ast::*;

/// Phase-specific facts collected alongside declaration relationships.
#[doc(hidden)]
pub trait TsBindingObserver: Default {
    /// Suppress observations of erased syntax, while still collecting its
    /// declaration owners. Runtime expression walks also guard stack depth.
    const RUNTIME: bool = false;

    type DeclarationState;
    type NamespaceState;

    fn module(&mut self, _: &Module) {}
    fn enter_decl(&mut self, _: &Decl) -> Self::DeclarationState;
    fn leave_decl(&mut self, _: Self::DeclarationState);
    fn ident(&mut self, _: &Ident) {}
    fn enter_namespace(&mut self, _: &Id) -> Self::NamespaceState;
    fn leave_namespace(&mut self, _: Self::NamespaceState);
    fn module_decl(&mut self, _: &TsModuleDecl) {}
    fn import_equals(&mut self, _: &TsImportEqualsDecl) {}
    fn enum_decl(&mut self, _: &TsEnumDecl) {}
    fn named_export(&mut self, _: &NamedExport) {}
    fn export_decl(&mut self, _: &ExportDecl) {}
    fn export_default_expr(&mut self, _: &ExportDefaultExpr) {}
}

impl TsBindingObserver for () {
    type DeclarationState = ();
    type NamespaceState = ();

    fn enter_decl(&mut self, _: &Decl) {}

    fn leave_decl(&mut self, _: ()) {}

    fn enter_namespace(&mut self, _: &Id) {}

    fn leave_namespace(&mut self, _: ()) {}
}
