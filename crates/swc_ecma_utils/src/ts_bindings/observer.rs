use swc_ecma_ast::*;

/// Phase-specific facts collected alongside declaration relationships.
#[doc(hidden)]
pub trait TsBindingObserver: Default {
    /// Skip erased type syntax for runtime consumers. Lexical namespace
    /// resolution still collects its type-scope declaration owners.
    /// Parameters, catch bindings and named expression bindings only provide
    /// lexical shadowing owners, so runtime consumers omit those records too.
    /// Declared and imported bindings remain available for constant evaluation
    /// and alias dependencies.
    const RUNTIME: bool = false;

    /// Whether erased syntax must be walked to collect lexical owners. A
    /// resolver that supplies its scope facts can omit this repeated analysis.
    const TYPE_SCOPES: bool = true;

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
    /// Observe inherited ambient status and this declaration's export modifier.
    fn enum_decl(&mut self, _: &TsEnumDecl, _ambient: bool, _exported: bool) {}
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
