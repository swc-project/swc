//! Complete namespace lookup after lexical declarations have their IDs.
//!
//! At each namespace boundary, declarations in the current body take priority,
//! then the shared exported members, then the next enclosing environment. The
//! original lexical result identifies where to stop; we do not reimplement
//! lexical lookup or merge the IDs of separate emitted JS declarations.

use std::borrow::Borrow;

use rustc_hash::FxHashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    stack_size::maybe_grow_default,
    ts_bindings::{
        TsBindingCollector, TsBindingObserver, TsBindings, TsContainerId, TsNamespaceBodyId,
        TsReferenceSpace,
    },
};
use swc_ecma_visit::{VisitMut, VisitMutWith, VisitWith};

mod bindings;
mod state;
use bindings::BindingResolver;
pub(super) use state::NamespaceLookupStateRef;
pub(super) use swc_ecma_utils::ts_bindings::TsLexicalNamespaceId as NamespaceScopeId;

pub(super) fn resolve<N>(
    node: &mut N,
    unresolved_ctxt: SyntaxContext,
    facts: state::NamespaceLookupFacts,
) where
    N: VisitWith<TsBindingCollector<(), false>>
        + VisitWith<TsBindingCollector<LexicalScopeObserver>>
        + VisitMutWith<NamespaceResolver>,
{
    let bindings = if facts.collect_type_scopes {
        TsBindings::collect_for_namespace(node, unresolved_ctxt)
    } else {
        TsBindings::collect_with_observer(node, LexicalScopeObserver)
            .0
            .with_lexical_scopes(facts.scopes)
    };
    // Alias meanings are fixed for this completion pass. Select erased
    // aliases once instead of resolving their targets at every value use.
    let mut alias_fallbacks = FxHashMap::default();
    for alias in bindings.aliases() {
        if !bindings.alias_has_value(alias) {
            let id = bindings.declaration(bindings.alias(alias).declaration);
            let fallback = facts
                .alias_fallbacks
                .get(id)
                .copied()
                .unwrap_or(unresolved_ctxt);
            alias_fallbacks.insert(id.clone(), fallback);
        }
    }
    node.visit_mut_with(&mut NamespaceResolver {
        bindings,
        alias_fallbacks,
        bodies: Vec::new(),
        next_body: 0,
        enum_container: None,
        unresolved_ctxt,
        space: TsReferenceSpace::Value,
    });
}

/// Lexical resolution already recorded erased scope owners. Declaration and
/// runtime-expression collection keeps the ordinary non-type binding facts.
#[derive(Default)]
pub(super) struct LexicalScopeObserver;

impl TsBindingObserver for LexicalScopeObserver {
    type DeclarationState = ();
    type NamespaceState = ();

    const TYPE_SCOPES: bool = false;

    fn enter_decl(&mut self, _: &Decl) {}

    fn leave_decl(&mut self, _: ()) {}

    fn enter_namespace(&mut self, _: &Id) {}

    fn leave_namespace(&mut self, _: ()) {}
}

pub(super) struct NamespaceResolver {
    bindings: TsBindings,
    alias_fallbacks: FxHashMap<Id, SyntaxContext>,
    bodies: Vec<TsNamespaceBodyId>,
    next_body: usize,
    enum_container: Option<TsContainerId>,
    unresolved_ctxt: SyntaxContext,
    space: TsReferenceSpace,
}

impl NamespaceResolver {
    fn computed_key(&mut self, key: &mut Expr) {
        // Signature keys look up values, but are erased together with the type.
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::TypeQuery);
        key.visit_mut_with(self);
        self.space = previous;
    }

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
    fn visit_mut_expr(&mut self, node: &mut Expr) {
        maybe_grow_default(|| node.visit_mut_children_with(self));
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_with(&mut BindingResolver(self));
        node.init.visit_mut_with(self);
    }

    fn visit_mut_param(&mut self, node: &mut Param) {
        node.decorators.visit_mut_with(self);
        node.pat.visit_mut_with(&mut BindingResolver(self));
    }

    fn visit_mut_ts_param_prop(&mut self, node: &mut TsParamProp) {
        node.decorators.visit_mut_with(self);
        node.param.visit_mut_with(&mut BindingResolver(self));
    }

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        node.param.visit_mut_with(&mut BindingResolver(self));
        node.body.visit_mut_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        node.params.visit_mut_with(&mut BindingResolver(self));
        node.body.visit_mut_with(self);
        node.type_params.visit_mut_with(self);
        node.return_type.visit_mut_with(self);
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        node.function.visit_mut_with(self);
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        node.function.visit_mut_with(self);
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        node.class.visit_mut_with(self);
    }

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        node.class.visit_mut_with(self);
    }

    fn visit_mut_ts_interface_decl(&mut self, node: &mut TsInterfaceDecl) {
        node.type_params.visit_mut_with(self);
        node.extends.visit_mut_with(self);
        node.body.visit_mut_with(self);
    }

    fn visit_mut_ts_type_alias_decl(&mut self, node: &mut TsTypeAliasDecl) {
        node.type_params.visit_mut_with(self);
        node.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_type_param(&mut self, node: &mut TsTypeParam) {
        node.constraint.visit_mut_with(self);
        node.default.visit_mut_with(self);
    }

    fn visit_mut_computed_prop_name(&mut self, node: &mut ComputedPropName) {
        if self.space == TsReferenceSpace::Any {
            // Signature parameter bindings accept either meaning. Their keys
            // instead require value lookup throughout the erased expression.
            self.computed_key(&mut node.expr);
        } else {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        if node.ctxt == SyntaxContext::empty() {
            return;
        }

        if self.space == TsReferenceSpace::Value && !self.alias_fallbacks.is_empty() {
            while let Some(fallback) = self.alias_fallbacks.get(&node.to_id()) {
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
                if self
                    .bindings
                    .named_member(container, node.sym.borrow())
                    .is_some_and(|member| self.bindings.member(member).is_enum_member())
                {
                    return;
                }
            }
        }

        if let Some(target) =
            self.bindings
                .ident_namespace_reference(node, &self.bodies, self.space)
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
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::Type);
        node.visit_mut_children_with(self);
        self.space = previous;
    }

    fn visit_mut_ts_type_query(&mut self, node: &mut TsTypeQuery) {
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::TypeQuery);
        node.expr_name.visit_mut_with(self);
        self.space = previous;
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_ts_fn_param(&mut self, node: &mut TsFnParam) {
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::Any);
        node.visit_mut_with(&mut BindingResolver(self));
        self.space = previous;
    }

    fn visit_mut_ts_getter_signature(&mut self, node: &mut TsGetterSignature) {
        if node.computed {
            self.computed_key(&mut node.key);
        }
        node.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_method_signature(&mut self, node: &mut TsMethodSignature) {
        if node.computed {
            self.computed_key(&mut node.key);
        }
        // Preserve the structural order used by the declaration collector.
        node.params.visit_mut_with(self);
        node.type_ann.visit_mut_with(self);
        node.type_params.visit_mut_with(self);
    }

    fn visit_mut_ts_property_signature(&mut self, node: &mut TsPropertySignature) {
        if node.computed {
            self.computed_key(&mut node.key);
        }
        node.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_setter_signature(&mut self, node: &mut TsSetterSignature) {
        if node.computed {
            self.computed_key(&mut node.key);
        }
        node.param.visit_mut_with(self);
    }

    fn visit_mut_ts_qualified_name(&mut self, node: &mut TsQualifiedName) {
        let previous = self.space;
        if matches!(self.space, TsReferenceSpace::Type | TsReferenceSpace::Any) {
            self.space = TsReferenceSpace::Namespace;
        }
        node.left.visit_mut_with(self);
        self.space = previous;
    }

    fn visit_mut_ts_expr_with_type_args(&mut self, node: &mut TsExprWithTypeArgs) {
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::Type);
        node.visit_mut_children_with(self);
        self.space = previous;
    }

    fn visit_mut_import_decl(&mut self, _: &mut ImportDecl) {}

    fn visit_mut_ts_import_equals_decl(&mut self, node: &mut TsImportEqualsDecl) {
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::Any);
        node.module_ref.visit_mut_with(self);
        self.space = previous;
    }

    fn visit_mut_export_named_specifier(&mut self, node: &mut ExportNamedSpecifier) {
        let previous = std::mem::replace(&mut self.space, TsReferenceSpace::Any);
        node.orig.visit_mut_with(self);
        self.space = previous;
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
