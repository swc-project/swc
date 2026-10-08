//! Build a phase-local declaration graph from an unchanged, resolved AST.
//! Traversal flags and pending exports belong to this walk, not its result.

use swc_ecma_visit::{Visit, VisitWith};

use super::*;
use crate::for_each_binding_ident;

impl TsBindings {
    /// Collect declaration relationships after ordinary lexical resolution.
    /// No reference is looked up by spelling during this walk.
    pub fn collect<N: VisitWith<TsBindingCollector>>(node: &N) -> Self {
        Self::collect_with_observer(node, ()).0
    }

    /// Collect declaration relationships and phase facts in a single walk.
    #[doc(hidden)]
    pub fn collect_with_observer<O: TsBindingObserver, N: VisitWith<TsBindingCollector<O>>>(
        node: &N,
        observer: O,
    ) -> (Self, O) {
        let mut collector = TsBindingCollector {
            observer,
            ..Default::default()
        };
        node.visit_with(&mut collector);
        collector.finish_exports();
        let mut bindings = collector.bindings;
        bindings.resolve_aliases();
        (bindings, collector.observer)
    }
}

impl<O: TsBindingObserver> TsBindingCollector<O> {
    fn visit_erased<N: VisitWith<Self>>(&mut self, node: &N) {
        // Runtime consumers keep the enclosing declaration's identity, but
        // erased syntax cannot contribute a runtime binding or reference.
        // Lexical namespace resolution still needs owners inside type scopes.
        if !O::RUNTIME {
            node.visit_children_with(self);
        }
    }

    fn record_owner(&mut self, id: Id) {
        let declaration = self.bindings.register(id, self.body);
        self.bindings.declarations[declaration.index()].value_space = true;
    }

    fn declaration(&mut self, id: Id, value: bool, ty: bool, exported: bool) -> TsDeclarationId {
        let declaration = self.bindings.register(id, self.body);
        let facts = &mut self.bindings.declarations[declaration.index()];
        facts.ambient = self.ambient && (!(facts.value_space || facts.type_space) || facts.ambient);
        facts.value_space |= value;
        facts.type_space |= ty;
        let Some(body) = self.body else {
            return declaration;
        };
        if !(exported || self.implicit_exports) {
            return declaration;
        }

        let owner = self.bindings.bodies[body.index()].container;
        let name = self.bindings.declaration(declaration).0.clone().into();
        let member = self.bindings.add_member(owner, name);
        let replaces_ambient =
            self.bindings.members[member.index()]
                .value
                .is_some_and(|previous| {
                    self.bindings.declarations[previous.index()].ambient && !self.ambient
                });
        let facts = &mut self.bindings.members[member.index()];
        if value && (facts.value.is_none() || replaces_ambient) {
            facts.value = Some(declaration);
        }
        if ty && facts.ty.is_none() {
            facts.ty = Some(declaration);
        }
        self.bindings.declarations[declaration.index()].member = Some(member);
        declaration
    }

    fn container(&mut self, declaration: TsDeclarationId) -> TsContainerId {
        let member = self.bindings.declarations[declaration.index()].member;
        let existing = member
            .and_then(|member| self.bindings.member(member).container)
            .or_else(|| self.bindings.declaration_container(declaration));

        let container = existing.unwrap_or_else(|| {
            let container = TsContainerId::from_index(self.bindings.containers.len());
            self.bindings.containers.push(Container {
                declaration,
                members: FxHashMap::default(),
            });
            container
        });
        if let Some(member) = member {
            self.bindings.members[member.index()].container = Some(container);
        }
        self.bindings.declarations[declaration.index()].container = Some(container);
        container
    }

    fn namespace(&mut self, id: Id, body: &TsNamespaceBody, declare: bool) {
        let observer_state = self.observer.enter_namespace(&id);
        let exported = std::mem::take(&mut self.exported);
        let declaration = self.declaration(id, exports::has_value(body), true, exported);
        let container = self.container(declaration);
        let next = TsNamespaceBodyId::from_index(self.bindings.bodies.len());
        self.bindings.bodies.push(NamespaceBody { container });
        let previous_body = self.body.replace(next);
        let previous_ambient = self.ambient;
        self.ambient |= declare;
        let previous_implicit = self.implicit_exports;
        self.implicit_exports = self.ambient && !exports::has_export_specifiers(body);

        body.visit_with(self);

        self.ambient = previous_ambient;
        self.implicit_exports = previous_implicit;
        self.body = previous_body;
        self.observer.leave_namespace(observer_state);
    }

    fn finish_exports(&mut self) {
        for export in std::mem::take(&mut self.namespace_exports) {
            self.bindings.add_namespace_export(export);
        }
    }
}

impl<O: TsBindingObserver> Visit for TsBindingCollector<O> {
    fn visit_decl(&mut self, node: &Decl) {
        let state = self.observer.enter_decl(node);
        node.visit_children_with(self);
        self.observer.leave_decl(state);
    }

    fn visit_ident(&mut self, node: &Ident) {
        self.observer.ident(node);
    }

    fn visit_expr(&mut self, node: &Expr) {
        if O::RUNTIME {
            crate::stack_size::maybe_grow_default(|| node.visit_children_with(self));
        } else {
            node.visit_children_with(self);
        }
    }

    fn visit_ts_type(&mut self, node: &TsType) {
        self.visit_erased(node);
    }

    fn visit_ts_expr_with_type_args(&mut self, node: &TsExprWithTypeArgs) {
        self.visit_erased(node);
    }

    fn visit_jsx_element_name(&mut self, node: &JSXElementName) {
        if O::RUNTIME
            && matches!(node, JSXElementName::Ident(ident) if ident.sym.starts_with(|character: char| character.is_ascii_lowercase()))
        {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_block_stmt(&mut self, node: &BlockStmt) {
        let previous = std::mem::take(&mut self.implicit_exports);
        node.visit_children_with(self);
        self.implicit_exports = previous;
    }

    fn visit_named_export(&mut self, node: &NamedExport) {
        self.observer.named_export(node);
        let Some(body) = self.body.filter(|_| node.src.is_none()) else {
            return;
        };
        for specifier in &node.specifiers {
            let ExportSpecifier::Named(specifier) = specifier else {
                continue;
            };
            let ModuleExportName::Ident(source) = &specifier.orig else {
                continue;
            };
            let name = match &specifier.exported {
                Some(ModuleExportName::Ident(exported)) => exported.sym.clone(),
                Some(ModuleExportName::Str(_)) => continue,
                None => source.sym.clone(),
                #[cfg(swc_ast_unknown)]
                _ => continue,
            };
            self.namespace_exports.push(NamespaceExport {
                body,
                source: source.to_id(),
                name,
                type_only: node.type_only || specifier.is_type_only,
            });
        }
    }

    fn visit_module(&mut self, node: &Module) {
        self.observer.module(node);
        // SWC's Module AST also represents TS scripts containing internal
        // import-equals declarations. Those aliases remain script globals.
        self.is_module = node.body.iter().any(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(alias)) => {
                alias.is_export || matches!(alias.module_ref, TsModuleRef::TsExternalModuleRef(_))
            }
            ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(_)) | ModuleItem::Stmt(_) => false,
            ModuleItem::ModuleDecl(_) => true,
            #[cfg(swc_ast_unknown)]
            _ => false,
        });
        node.visit_children_with(self);
    }

    fn visit_script(&mut self, node: &Script) {
        self.is_module = false;
        node.visit_children_with(self);
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        let previous = std::mem::replace(&mut self.exported, true);
        node.decl.visit_with(self);
        self.exported = previous;
        self.observer.export_decl(node);
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        node.expr.visit_with(self);
        self.observer.export_default_expr(node);
    }

    fn visit_binding_ident(&mut self, node: &BindingIdent) {
        // BindingIdent is also used in assignment patterns. Declaration owners
        // are recorded only from binding positions, never from those uses.
        node.type_ann.visit_with(self);
    }

    fn visit_function(&mut self, node: &Function) {
        if !O::RUNTIME {
            for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        }
        node.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        if !O::RUNTIME {
            for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        }
        node.visit_children_with(self);
    }

    fn visit_constructor(&mut self, node: &Constructor) {
        if !O::RUNTIME {
            for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        }
        node.visit_children_with(self);
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        if !O::RUNTIME {
            for_each_binding_ident(&node.param, |id| self.record_owner(id.id.to_id()));
        }
        node.visit_children_with(self);
    }

    fn visit_ts_type_param(&mut self, node: &TsTypeParam) {
        if !O::RUNTIME {
            self.record_owner(node.name.to_id());
            node.constraint.visit_with(self);
            node.default.visit_with(self);
        }
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.ident.to_id(), true, false, exported);
        node.function.visit_with(self);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        if !O::RUNTIME {
            if let Some(ident) = &node.ident {
                self.record_owner(ident.to_id());
            }
        }
        node.function.visit_with(self);
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.ident.to_id(), true, true, exported);
        node.class.visit_with(self);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        if !O::RUNTIME {
            if let Some(ident) = &node.ident {
                self.record_owner(ident.to_id());
            }
        }
        node.class.visit_with(self);
    }

    fn visit_var_decl(&mut self, node: &VarDecl) {
        let exported = std::mem::take(&mut self.exported);
        for_each_binding_ident(&node.decls, |binding| {
            self.declaration(binding.id.to_id(), true, false, exported);
        });
        node.decls.visit_with(self);
    }

    fn visit_using_decl(&mut self, node: &UsingDecl) {
        let exported = std::mem::take(&mut self.exported);
        for_each_binding_ident(&node.decls, |binding| {
            self.declaration(binding.id.to_id(), true, false, exported);
        });
        node.decls.visit_with(self);
    }

    fn visit_ts_interface_decl(&mut self, node: &TsInterfaceDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.id.to_id(), false, true, exported);
        self.visit_erased(node);
    }

    fn visit_ts_type_alias_decl(&mut self, node: &TsTypeAliasDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.id.to_id(), false, true, exported);
        self.visit_erased(node);
    }

    fn visit_ts_enum_decl(&mut self, node: &TsEnumDecl) {
        self.observer.enum_decl(node);
        let exported = std::mem::take(&mut self.exported);
        let declaration = self.declaration(node.id.to_id(), true, true, exported);
        let owner = self.container(declaration);
        for member in &node.members {
            let name = match &member.id {
                TsEnumMemberId::Ident(id) => id.sym.clone().into(),
                TsEnumMemberId::Str(string) => string.value.clone(),
                #[cfg(swc_ast_unknown)]
                _ => continue,
            };
            let member = self.bindings.add_member(owner, name);
            self.bindings.members[member.index()].kind = MemberKind::Enum;
        }
        node.members.visit_with(self);
    }

    fn visit_ts_module_decl(&mut self, node: &TsModuleDecl) {
        self.observer.module_decl(node);
        match (&node.id, &node.body) {
            (TsModuleName::Ident(id), Some(body)) if !node.global => {
                self.namespace(id.to_id(), body, node.declare);
            }
            _ => {
                self.exported = false;
                node.body.visit_with(self);
            }
        }
    }

    fn visit_ts_namespace_decl(&mut self, node: &TsNamespaceDecl) {
        // A dotted namespace segment is an implicitly exported namespace.
        self.exported = true;
        self.namespace(node.id.to_id(), &node.body, node.declare);
    }

    fn visit_import_decl(&mut self, node: &ImportDecl) {
        for specifier in &node.specifiers {
            self.record_owner(specifier.local().to_id());
        }
    }

    fn visit_ts_import_equals_decl(&mut self, node: &TsImportEqualsDecl) {
        self.observer.import_equals(node);
        // Import bindings are private unless explicitly exported, including
        // inside namespaces with an ambient implicit export context.
        let previous = std::mem::take(&mut self.implicit_exports);
        let declaration =
            self.declaration(node.id.to_id(), !node.is_type_only, true, node.is_export);
        self.implicit_exports = previous;
        let path = match &node.module_ref {
            TsModuleRef::TsEntityName(name) => Some(aliases::path(name)),
            TsModuleRef::TsExternalModuleRef(_) => None,
            #[cfg(swc_ast_unknown)]
            _ => None,
        };
        let alias = TsAliasId::from_index(self.bindings.aliases.len());
        self.bindings.aliases.push(TsAlias {
            declaration,
            span: node.span,
            is_export: node.is_export,
            is_type_only: node.is_type_only,
            is_script_global: self.body.is_none() && !self.is_module,
            path,
        });
        self.bindings.aliases_by_decl.insert(declaration, alias);
        // Alias roots are dependency edges, not direct runtime uses.
        self.visit_erased(&node.module_ref);
    }
}
