//! Runtime references under the currently emitted namespace or enum owner.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    ts_bindings::{TsBindings, TsDeclarationId},
    ExprFactory, QueryRef,
};

use super::ContainerContext;

/// Semantic storage outlives the emitter. The sparse query index therefore
/// borrows its names and carries declaration handles without copying IDs.
pub(super) struct EmissionIndex<'a> {
    declarations: Option<FxHashMap<&'a Atom, Vec<(SyntaxContext, TsDeclarationId)>>>,
}

impl<'a> EmissionIndex<'a> {
    pub(super) fn new(bindings: &'a TsBindings) -> Self {
        if !bindings.has_namespace_bodies() {
            return Self { declarations: None };
        }
        let mut declarations = FxHashMap::<&Atom, Vec<_>>::default();
        for (declaration, id) in bindings.emission_declarations() {
            declarations
                .entry(&id.0)
                .or_default()
                .push((id.1, declaration));
        }
        Self {
            declarations: Some(declarations),
        }
    }

    fn declaration(&self, bindings: &TsBindings, ident: &Ident) -> Option<TsDeclarationId> {
        match &self.declarations {
            Some(declarations) => declarations
                .get(&&ident.sym)?
                .iter()
                .find_map(|&(ctxt, declaration)| (ctxt == ident.ctxt).then_some(declaration)),
            None => bindings.ident_declaration(ident),
        }
    }
}

enum RuntimeAccess<'a> {
    Local(&'a Id),
    NamespaceProperty(&'a Id),
}

pub(super) struct ExportQuery<'a, 'semantic> {
    export_name: &'a FxHashMap<Id, Option<Id>>,
    bindings: &'a TsBindings,
    contexts: &'a [ContainerContext],
    emission_index: &'a EmissionIndex<'semantic>,
    has_legacy_exports: bool,
}

impl<'a, 'semantic> ExportQuery<'a, 'semantic> {
    pub(super) fn new(
        export_name: &'a FxHashMap<Id, Option<Id>>,
        bindings: &'a TsBindings,
        emission_index: &'a EmissionIndex<'semantic>,
        contexts: &'a [ContainerContext],
        has_legacy_exports: bool,
    ) -> Self {
        Self {
            export_name,
            bindings,
            contexts,
            emission_index,
            has_legacy_exports,
        }
    }

    fn runtime_access(&self, ident: &Ident) -> Option<RuntimeAccess<'_>> {
        if self.contexts.is_empty() {
            // Outside emitted containers only the legacy export fallback can
            // apply. Check its smaller index before looking up a declaration;
            // a shared member still requires a current emitted owner.
            let id = ident.to_id();
            let object = self.export_name.get(&id)?.as_ref()?;
            return self
                .bindings
                .member_of(&id)
                .is_none()
                .then_some(RuntimeAccess::NamespaceProperty(object));
        }
        // Missing declarations cannot name a current owner. Keep the context
        // scan inside the successful query and preserve the legacy fallback.
        if let Some(declaration) = self.emission_index.declaration(self.bindings, ident) {
            let container = self.bindings.declaration_container(declaration);
            let member = self.bindings.declaration_member(declaration);

            for context in self.contexts.iter().rev() {
                if container == Some(context.container) {
                    return Some(RuntimeAccess::Local(&context.object));
                }

                if let Some(member) = member {
                    if self.bindings.member(member).owner == context.container {
                        return Some(match context.locals.get(&member) {
                            Some(local) => RuntimeAccess::Local(local),
                            None => RuntimeAccess::NamespaceProperty(&context.object),
                        });
                    }
                }
            }

            // A shared namespace member requires a current emitted owner.
            // Never reuse another declaration body's object parameter.
            if member.is_some() {
                return None;
            }
        }
        if !self.has_legacy_exports {
            return None;
        }
        self.export_name
            .get(&ident.to_id())?
            .as_ref()
            .map(RuntimeAccess::NamespaceProperty)
    }

    pub(super) fn rewrite_entity_name(&self, name: &mut TsEntityName) {
        match name {
            TsEntityName::TsQualifiedName(qualified) => {
                self.rewrite_entity_name(&mut qualified.left);
            }
            TsEntityName::Ident(ident) => match self.runtime_access(ident) {
                Some(RuntimeAccess::Local(local)) => {
                    ident.sym = local.0.clone();
                    ident.ctxt = local.1;
                }
                Some(RuntimeAccess::NamespaceProperty(object)) => {
                    let qualified = TsQualifiedName {
                        span: ident.span,
                        left: TsEntityName::Ident(Ident::new(
                            object.0.clone(),
                            ident.span,
                            object.1,
                        )),
                        right: ident.clone().into(),
                    };
                    *name = TsEntityName::TsQualifiedName(Box::new(qualified));
                }
                None => {}
            },
            #[cfg(swc_ast_unknown)]
            _ => {}
        }
    }
}

impl QueryRef for ExportQuery<'_, '_> {
    fn query_ref(&self, ident: &Ident) -> Option<Box<Expr>> {
        match self.runtime_access(ident)? {
            RuntimeAccess::Local(local) if local.0 != ident.sym || local.1 != ident.ctxt => {
                Some(Ident::new(local.0.clone(), ident.span, local.1).into())
            }
            RuntimeAccess::Local(_) => None,
            RuntimeAccess::NamespaceProperty(object) => {
                Some(object.clone().make_member(ident.clone().into()).into())
            }
        }
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        match self.runtime_access(ident)? {
            RuntimeAccess::Local(local) if local.0 != ident.sym || local.1 != ident.ctxt => Some(
                JSXElementName::Ident(Ident::new(local.0.clone(), ident.span, local.1)),
            ),
            RuntimeAccess::Local(_) => None,
            RuntimeAccess::NamespaceProperty(object) => Some(
                JSXMemberExpr {
                    span: ident.span,
                    obj: JSXObject::Ident(Ident::new(object.0.clone(), ident.span, object.1)),
                    prop: ident.clone().into(),
                }
                .into(),
            ),
        }
    }
}
