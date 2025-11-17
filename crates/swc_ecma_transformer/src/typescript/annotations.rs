//! Type annotation stripping.
//!
//! This module removes TypeScript type annotations and type-only constructs,
//! converting TypeScript code to valid JavaScript while preserving runtime
//! behavior.

use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Strips type annotations and TypeScript-specific type constructs.
///
/// This visitor removes:
/// - Type annotations (e.g., `: string`, `: number`)
/// - Type parameters and generic constraints
/// - Type assertions and casts
/// - Interface and type alias declarations
/// - Type-only imports and exports
/// - Abstract class members
/// - Declare statements
///
/// # Example
///
/// Input:
/// ```typescript
/// const x: string = "hello";
/// interface Foo { x: number }
/// class Bar implements Foo { x: number = 1; }
/// ```
///
/// Output:
/// ```javascript
/// const x = "hello";
/// class Bar { x = 1; }
/// ```
pub struct TypeAnnotations {
    /// Track whether we're inside a namespace (affects declare handling)
    in_namespace: bool,
}

impl TypeAnnotations {
    /// Creates a new type annotation stripper.
    pub fn new() -> Self {
        Self {
            in_namespace: false,
        }
    }
}

impl Default for TypeAnnotations {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMut for TypeAnnotations {
    // Don't visit type nodes
    noop_visit_mut_type!(fail);

    // Remove type annotations
    fn visit_mut_opt_ts_type(&mut self, n: &mut Option<Box<TsType>>) {
        *n = None;
    }

    fn visit_mut_opt_ts_type_ann(&mut self, n: &mut Option<Box<TsTypeAnn>>) {
        *n = None;
    }

    fn visit_mut_opt_ts_type_param_decl(&mut self, n: &mut Option<Box<TsTypeParamDecl>>) {
        *n = None;
    }

    fn visit_mut_opt_ts_type_param_instantiation(
        &mut self,
        n: &mut Option<Box<TsTypeParamInstantiation>>,
    ) {
        *n = None;
    }

    // Strip TypeScript-specific modifiers from identifiers
    fn visit_mut_ident(&mut self, n: &mut Ident) {
        n.optional = false;
    }

    // Handle array patterns
    fn visit_mut_array_pat(&mut self, n: &mut ArrayPat) {
        n.visit_mut_children_with(self);
        n.optional = false;
    }

    // Handle object patterns
    fn visit_mut_object_pat(&mut self, n: &mut ObjectPat) {
        n.visit_mut_children_with(self);
        n.optional = false;
    }

    // Strip type assertions and non-null assertions
    fn visit_mut_expr(&mut self, n: &mut Expr) {
        // Unwrap type assertions, non-null assertions, etc.
        while let Expr::TsAs(TsAsExpr { expr, .. })
        | Expr::TsNonNull(TsNonNullExpr { expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
        | Expr::TsInstantiation(TsInstantiation { expr, .. })
        | Expr::TsSatisfies(TsSatisfiesExpr { expr, .. }) = n
        {
            *n = *expr.take();
        }

        n.visit_mut_children_with(self);
    }

    // Handle simple assign targets (for type assertions in assignments)
    fn visit_mut_simple_assign_target(&mut self, n: &mut SimpleAssignTarget) {
        while let SimpleAssignTarget::TsAs(TsAsExpr { expr, .. })
        | SimpleAssignTarget::TsNonNull(TsNonNullExpr { expr, .. })
        | SimpleAssignTarget::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | SimpleAssignTarget::TsInstantiation(TsInstantiation { expr, .. })
        | SimpleAssignTarget::TsSatisfies(TsSatisfiesExpr { expr, .. }) = n
        {
            *n = expr.take().try_into().unwrap();
        }

        n.visit_mut_children_with(self);
    }

    // Strip class-level TypeScript features
    fn visit_mut_class(&mut self, n: &mut Class) {
        n.is_abstract = false;
        n.implements.clear();
        n.visit_mut_children_with(self);
    }

    // Filter out TypeScript-only class members
    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        members.retain(|member| match member {
            // Remove index signatures
            ClassMember::TsIndexSignature(..) => false,
            // Remove constructors without bodies (overload signatures)
            ClassMember::Constructor(Constructor { body: None, .. }) => false,
            // Remove abstract methods and method overload signatures
            ClassMember::Method(ClassMethod {
                is_abstract,
                function,
                ..
            })
            | ClassMember::PrivateMethod(PrivateMethod {
                is_abstract,
                function,
                ..
            }) => !is_abstract && function.body.is_some(),
            // Remove abstract or declared properties
            ClassMember::ClassProp(
                ClassProp { declare: true, .. }
                | ClassProp {
                    is_abstract: true, ..
                },
            )
            | ClassMember::AutoAccessor(AutoAccessor {
                is_abstract: true, ..
            }) => false,
            _ => true,
        });

        members.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from class properties
    fn visit_mut_class_prop(&mut self, prop: &mut ClassProp) {
        prop.declare = false;
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.is_abstract = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from private properties
    fn visit_mut_private_prop(&mut self, prop: &mut PrivateProp) {
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from class methods
    fn visit_mut_class_method(&mut self, method: &mut ClassMethod) {
        method.accessibility = None;
        method.is_override = false;
        method.is_abstract = false;
        method.is_optional = false;
        method.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from private methods
    fn visit_mut_private_method(&mut self, method: &mut PrivateMethod) {
        method.accessibility = None;
        method.is_abstract = false;
        method.is_optional = false;
        method.is_override = false;
        method.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from auto accessors
    fn visit_mut_auto_accessor(&mut self, n: &mut AutoAccessor) {
        n.type_ann = None;
        n.accessibility = None;
        n.definite = false;
        n.is_override = false;
        n.is_abstract = false;
        n.visit_mut_children_with(self);
    }

    // Strip TypeScript modifiers from constructors
    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.accessibility = None;
        n.visit_mut_children_with(self);
    }

    // Remove 'this' parameters from function signatures
    fn visit_mut_params(&mut self, params: &mut Vec<Param>) {
        // Remove 'this' parameter if present
        if params.first().is_some_and(|param| {
            matches!(
                &param.pat,
                Pat::Ident(BindingIdent {
                    id: Ident { sym, .. },
                    ..
                }) if &**sym == "this"
            )
        }) {
            params.drain(0..1);
        }

        params.visit_mut_children_with(self);
    }

    // Handle setter 'this' parameters
    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        n.this_param = None;
        n.visit_mut_children_with(self);
    }

    // Strip type-only imports
    fn visit_mut_import_specifiers(&mut self, specifiers: &mut Vec<ImportSpecifier>) {
        specifiers.retain(|s| !matches!(s, ImportSpecifier::Named(named) if named.is_type_only));
    }

    // Strip type-only exports
    fn visit_mut_export_specifiers(&mut self, specifiers: &mut Vec<ExportSpecifier>) {
        specifiers.retain(|s| match s {
            ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => !is_type_only,
            _ => true,
        });
    }

    // Track namespace context
    fn visit_mut_ts_module_block(&mut self, node: &mut TsModuleBlock) {
        let was_in_namespace = self.in_namespace;
        self.in_namespace = true;
        node.visit_mut_children_with(self);
        self.in_namespace = was_in_namespace;
    }

    // Filter out TypeScript-only module items
    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        items.retain(|item| self.should_retain_module_item(item));
        items.visit_mut_children_with(self);
    }

    // Filter out TypeScript-only statements
    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);
        stmts.retain(|s| !matches!(s, Stmt::Empty(e) if e.span.is_dummy()));
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        if self.should_retain_stmt(stmt) {
            stmt.visit_mut_children_with(self);
        } else if !stmt.is_empty() {
            stmt.take();
        }
    }
}

impl TypeAnnotations {
    /// Determines if a module item should be retained after type stripping.
    fn should_retain_module_item(&self, item: &ModuleItem) -> bool {
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                // In namespaces, retain `export declare var`
                if self.in_namespace && export_decl.decl.is_var() {
                    return true;
                }
                self.should_retain_decl(&export_decl.decl)
            }
            ModuleItem::Stmt(stmt) => self.should_retain_stmt(stmt),
            ModuleItem::ModuleDecl(decl) => self.is_concrete_module_decl(decl),
            #[cfg(swc_ast_unknown)]
            _ => true,
        }
    }

    /// Determines if a statement should be retained.
    fn should_retain_stmt(&self, stmt: &Stmt) -> bool {
        match stmt {
            Stmt::Decl(decl) => self.should_retain_decl(decl),
            Stmt::Empty(..) => false,
            _ => true,
        }
    }

    /// Determines if a declaration should be retained.
    fn should_retain_decl(&self, decl: &Decl) -> bool {
        // Remove declare declarations
        if self.is_declare(decl) {
            return false;
        }

        // Remove type-only declarations
        match decl {
            Decl::TsInterface(..) | Decl::TsTypeAlias(..) => false,
            Decl::Fn(fn_decl) => fn_decl.function.body.is_some(),
            Decl::TsModule(module) => self.is_concrete_ts_module(module),
            _ => true,
        }
    }

    /// Checks if a declaration has the 'declare' modifier.
    fn is_declare(&self, decl: &Decl) -> bool {
        match decl {
            Decl::Class(class) => class.declare,
            Decl::Fn(fn_decl) => fn_decl.declare,
            Decl::Var(var) => var.declare,
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => true,
            Decl::TsEnum(ts_enum) => ts_enum.declare,
            Decl::TsModule(ts_module) => ts_module.declare || ts_module.global,
            _ => false,
        }
    }

    /// Checks if a module declaration has concrete (runtime) content.
    fn is_concrete_module_decl(&self, decl: &ModuleDecl) -> bool {
        match decl {
            ModuleDecl::Import(import) => !import.type_only,
            ModuleDecl::ExportDecl(export) => self.should_retain_decl(&export.decl),
            ModuleDecl::ExportNamed(named) => !named.type_only,
            ModuleDecl::ExportDefaultDecl(default) => self.is_concrete_default_decl(&default.decl),
            ModuleDecl::ExportDefaultExpr(..) => true,
            ModuleDecl::ExportAll(all) => !all.type_only,
            ModuleDecl::TsImportEquals(import_eq) => !import_eq.is_type_only,
            ModuleDecl::TsExportAssignment(..) => true,
            ModuleDecl::TsNamespaceExport(..) => false,
            #[cfg(swc_ast_unknown)]
            _ => true,
        }
    }

    /// Checks if a default export declaration has concrete content.
    fn is_concrete_default_decl(&self, decl: &DefaultDecl) -> bool {
        match decl {
            DefaultDecl::Class(_) => true,
            DefaultDecl::Fn(fn_decl) => fn_decl.function.body.is_some(),
            DefaultDecl::TsInterfaceDecl(..) => false,
            #[cfg(swc_ast_unknown)]
            _ => true,
        }
    }

    /// Checks if a TypeScript module has concrete content.
    fn is_concrete_ts_module(&self, module: &TsModuleDecl) -> bool {
        module
            .body
            .as_ref()
            .map(|body| self.is_concrete_namespace_body(body))
            .unwrap_or(false)
    }

    /// Checks if a namespace body has concrete content.
    fn is_concrete_namespace_body(&self, body: &TsNamespaceBody) -> bool {
        match body {
            TsNamespaceBody::TsModuleBlock(block) => block.body.iter().any(|item| {
                matches!(
                    item,
                    ModuleItem::Stmt(stmt) if self.should_retain_stmt(stmt)
                ) || matches!(
                    item,
                    ModuleItem::ModuleDecl(decl) if self.is_concrete_module_decl(decl)
                )
            }),
            TsNamespaceBody::TsNamespaceDecl(ns) => self.is_concrete_namespace_body(&ns.body),
            #[cfg(swc_ast_unknown)]
            _ => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;

    use super::*;

    #[test]
    fn test_strip_type_annotation() {
        let mut annotations = TypeAnnotations::new();
        let mut type_ann = Some(Box::new(TsTypeAnn {
            span: DUMMY_SP,
            type_ann: Box::new(TsType::TsKeywordType(TsKeywordType {
                span: DUMMY_SP,
                kind: TsKeywordTypeKind::TsStringKeyword,
            })),
        }));

        annotations.visit_mut_opt_ts_type_ann(&mut type_ann);
        assert!(type_ann.is_none());
    }

    #[test]
    fn test_strip_optional_modifier() {
        let mut annotations = TypeAnnotations::new();
        let mut ident = Ident {
            span: DUMMY_SP,
            sym: "x".into(),
            optional: true,
            ..Default::default()
        };

        annotations.visit_mut_ident(&mut ident);
        assert!(!ident.optional);
    }

    #[test]
    fn test_strip_class_implements() {
        let mut annotations = TypeAnnotations::new();
        let mut class = Class {
            span: DUMMY_SP,
            is_abstract: true,
            implements: vec![TsExprWithTypeArgs {
                span: DUMMY_SP,
                expr: Box::new(Expr::Ident(Ident::new(
                    "Foo".into(),
                    DUMMY_SP,
                    Default::default(),
                ))),
                type_args: None,
            }],
            ..Default::default()
        };

        annotations.visit_mut_class(&mut class);
        assert!(!class.is_abstract);
        assert!(class.implements.is_empty());
    }
}
