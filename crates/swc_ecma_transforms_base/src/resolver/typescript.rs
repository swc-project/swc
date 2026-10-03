//! Complete namespace lookup after lexical declarations have their IDs.
//!
//! At each namespace boundary, declarations in the current body take priority,
//! then the shared exported members, then the next enclosing environment. The
//! original lexical result identifies where to stop; we do not reimplement
//! lexical lookup or merge the IDs of separate emitted JS declarations.

use rustc_hash::FxHashMap;
use swc_atoms::Wtf8Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ts_bindings::{
    TsBindingCollector, TsBindings, TsContainerId, TsNamespaceBodyId,
};
use swc_ecma_visit::{VisitMut, VisitMutWith, VisitWith};

mod state;
pub(super) use state::NamespaceLookupStateRef;

pub(super) fn resolve<N>(
    node: &mut N,
    unresolved_ctxt: SyntaxContext,
    alias_fallbacks: FxHashMap<Id, SyntaxContext>,
) where
    N: VisitWith<TsBindingCollector> + VisitMutWith<NamespaceResolver>,
{
    let bindings = TsBindings::collect(node);
    node.visit_mut_with(&mut NamespaceResolver {
        bindings,
        alias_fallbacks,
        bodies: Vec::new(),
        next_body: 0,
        enum_container: None,
        unresolved_ctxt,
        in_type: false,
    });
}

pub(super) struct NamespaceResolver {
    bindings: TsBindings,
    alias_fallbacks: FxHashMap<Id, SyntaxContext>,
    bodies: Vec<TsNamespaceBodyId>,
    next_body: usize,
    enum_container: Option<TsContainerId>,
    unresolved_ctxt: SyntaxContext,
    in_type: bool,
}

impl NamespaceResolver {
    fn namespace(&mut self, body: &mut TsNamespaceBody) {
        let current = self
            .bindings
            .namespace_body(self.next_body)
            .expect("namespace lookup must walk the collected declaration sequence");
        self.next_body += 1;
        self.bodies.push(current);
        body.visit_mut_with(self);
        self.bodies.pop();
    }
}

impl VisitMut for NamespaceResolver {
    fn visit_mut_ident(&mut self, node: &mut Ident) {
        if node.ctxt == SyntaxContext::empty() {
            return;
        }

        if !self.in_type && !self.alias_fallbacks.is_empty() {
            while let Some(fallback) = self.alias_fallbacks.get(&node.to_id()) {
                let Some(declaration) = self.bindings.declaration_id(&node.to_id()) else {
                    break;
                };
                let Some(alias) = self.bindings.declaration_alias(declaration) else {
                    break;
                };
                if self.bindings.alias_has_value(alias) {
                    break;
                }
                node.ctxt = *fallback;
            }
        }
        if self.bodies.is_empty() {
            return;
        }

        // The lexical resolver reserves its unresolved context for bare enum
        // members. Keep that representation confined to the current enum;
        // exported namespace names must not override a nearer enum member.
        if node.ctxt == self.unresolved_ctxt {
            if let Some(container) = self.enum_container {
                let name: Wtf8Atom = node.sym.clone().into();
                if self
                    .bindings
                    .named_member(container, &name)
                    .is_some_and(|member| self.bindings.member(member).is_enum_member())
                {
                    return;
                }
            }
        }

        if let Some(target) =
            self.bindings
                .namespace_reference(&node.to_id(), &self.bodies, self.in_type)
        {
            node.ctxt = target.1;
        }
    }

    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        match (&node.id, &mut node.body) {
            (TsModuleName::Ident(_), Some(body)) if !node.global => self.namespace(body),
            _ => node.body.visit_mut_with(self),
        }
    }

    fn visit_mut_ts_namespace_decl(&mut self, node: &mut TsNamespaceDecl) {
        self.namespace(&mut node.body);
    }

    fn visit_mut_ts_enum_decl(&mut self, node: &mut TsEnumDecl) {
        let previous = self.enum_container;
        self.enum_container = self.bindings.container(&node.id.to_id());
        for member in &mut node.members {
            member.init.visit_mut_with(self);
        }
        self.enum_container = previous;
    }

    fn visit_mut_ts_type(&mut self, node: &mut TsType) {
        let previous = std::mem::replace(&mut self.in_type, true);
        node.visit_mut_children_with(self);
        self.in_type = previous;
    }

    fn visit_mut_ts_type_query(&mut self, node: &mut TsTypeQuery) {
        let previous = std::mem::replace(&mut self.in_type, false);
        node.expr_name.visit_mut_with(self);
        self.in_type = previous;
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_ts_qualified_name(&mut self, node: &mut TsQualifiedName) {
        node.left.visit_mut_with(self);
    }

    fn visit_mut_ts_expr_with_type_args(&mut self, node: &mut TsExprWithTypeArgs) {
        let previous = std::mem::replace(&mut self.in_type, true);
        node.visit_mut_children_with(self);
        self.in_type = previous;
    }

    fn visit_mut_import_decl(&mut self, _: &mut ImportDecl) {}

    fn visit_mut_ts_import_equals_decl(&mut self, node: &mut TsImportEqualsDecl) {
        node.module_ref.visit_mut_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, node: &mut ExportNamedSpecifier) {
        node.orig.visit_mut_with(self);
    }

    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        node.body.visit_mut_with(self);
    }

    fn visit_mut_break_stmt(&mut self, _: &mut BreakStmt) {}

    fn visit_mut_continue_stmt(&mut self, _: &mut ContinueStmt) {}

    fn visit_mut_jsx_attr_name(&mut self, _: &mut JSXAttrName) {}

    fn visit_mut_jsx_element_name(&mut self, node: &mut JSXElementName) {
        if matches!(node, JSXElementName::Ident(id) if id.sym.starts_with(|c: char| c.is_ascii_lowercase()))
        {
            return;
        }
        node.visit_mut_children_with(self);
    }
}
