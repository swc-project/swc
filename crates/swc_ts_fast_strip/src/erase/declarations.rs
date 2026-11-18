use super::*;

impl TypeEraser<'_> {
    pub(super) fn erase_decl(&mut self, declaration: &Decl) {
        if is_whole_type_declaration(declaration) {
            self.erase_statement(declaration.span());
        } else {
            declaration.visit_children_with(self);
        }
    }

    pub(super) fn erase_export_decl(&mut self, export: &ExportDecl) {
        if is_whole_type_declaration(&export.decl) {
            self.erase_statement(export.span);
        } else {
            export.decl.visit_with(self);
        }
    }

    pub(super) fn erase_export_default_decl(&mut self, export: &ExportDefaultDecl) {
        let erased = match &export.decl {
            DefaultDecl::TsInterfaceDecl(_) => true,
            DefaultDecl::Fn(function) => function.function.body.is_none(),
            _ => false,
        };
        if erased {
            self.erase_statement(export.span);
        } else {
            export.visit_children_with(self);
        }
    }

    pub(super) fn erase_ts_module_decl(&mut self, module: &TsModuleDecl) {
        if is_type_only_module(module) {
            self.erase_statement(module.span);
        } else {
            self.report_unsupported(module.span, UnsupportedSyntax::Namespace);
        }
    }

    pub(super) fn erase_import_decl(&mut self, import: &ImportDecl) {
        if import.type_only {
            self.erase_statement(import.span);
            return;
        }
        for (index, specifier) in import.specifiers.iter().enumerate() {
            if let ImportSpecifier::Named(specifier) = specifier {
                if specifier.is_type_only {
                    self.erase_list_item(
                        specifier.span,
                        import.specifiers.get(index + 1).map(Spanned::span),
                        import.span,
                    );
                }
            }
        }
    }

    pub(super) fn erase_named_export(&mut self, export: &NamedExport) {
        if export.type_only {
            self.erase_statement(export.span);
            return;
        }
        for (index, specifier) in export.specifiers.iter().enumerate() {
            if let ExportSpecifier::Named(specifier) = specifier {
                if specifier.is_type_only {
                    self.erase_list_item(
                        specifier.span,
                        export.specifiers.get(index + 1).map(Spanned::span),
                        export.span,
                    );
                }
            }
        }
    }

    fn erase_list_item(&mut self, item: Span, next: Option<Span>, container: Span) {
        let gap_end = next.map_or_else(
            || {
                self.tokens
                    .find_forward(item.hi, container.hi, Token::RBrace)
                    .map_or(container.hi, |t| t.span.lo)
            },
            |next| next.lo,
        );
        let end = self
            .tokens
            .find_forward(item.hi, gap_end, Token::Comma)
            .map_or(item.hi, |t| t.span.hi);
        self.edits.blank(Span::new(item.lo, end));
    }
}

fn is_whole_type_declaration(declaration: &Decl) -> bool {
    match declaration {
        Decl::TsInterface(_) | Decl::TsTypeAlias(_) => true,
        Decl::Class(class) => class.declare,
        Decl::Fn(function) => function.declare || function.function.body.is_none(),
        Decl::Var(variable) => variable.declare,
        Decl::TsEnum(enumeration) => enumeration.declare,
        Decl::TsModule(module) => is_type_only_module(module),
        _ => false,
    }
}

fn is_type_only_module(module: &TsModuleDecl) -> bool {
    // Legacy `module` syntax is controlled by `deprecated_ts_module_as_error`
    // before erasure. When allowed, it has the same runtime effect as a namespace.
    module.declare
        || module.global
        || module.id.is_str()
        || module
            .body
            .as_ref()
            .is_some_and(is_type_only_namespace_body)
}

fn is_type_only_namespace_body(body: &TsNamespaceBody) -> bool {
    match body {
        TsNamespaceBody::TsNamespaceDecl(namespace) => is_type_only_namespace_body(&namespace.body),
        TsNamespaceBody::TsModuleBlock(block) => {
            block.body.iter().all(|item| !has_runtime_effect(item))
        }
        #[cfg(swc_ast_unknown)]
        _ => true,
    }
}

fn declaration_has_runtime_effect(declaration: &Decl) -> bool {
    match declaration {
        Decl::TsInterface(_) | Decl::TsTypeAlias(_) => false,
        Decl::TsModule(module) => !is_type_only_module(module),
        _ => true,
    }
}

fn has_runtime_effect(item: &ModuleItem) -> bool {
    match item {
        ModuleItem::Stmt(Stmt::Decl(declaration)) => declaration_has_runtime_effect(declaration),
        ModuleItem::ModuleDecl(ModuleDecl::Import(_) | ModuleDecl::TsNamespaceExport(_)) => false,
        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => {
            declaration_has_runtime_effect(&export.decl)
        }
        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => !export.type_only,
        ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => !import.is_type_only,
        _ => true,
    }
}
