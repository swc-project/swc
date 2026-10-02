//! Substitute enum reads while collecting the surviving runtime references.
//! Resolve import-alias dependencies after substitution.

use rustc_hash::FxHashSet;
use swc_common::{Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    stack_size::maybe_grow_default,
    ts_bindings::{TsAliasId, TsBindings, TsContainerId, TsValueTarget},
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::enums::{EnumFacts, EnumInitializer, EnumValue};

mod candidates;
use candidates::{Candidates, ReferenceFacts};

pub(super) struct RuntimeUsage {
    pub bindings: FxHashSet<Id>,
    pub aliases: FxHashSet<TsAliasId>,
    pub containers: FxHashSet<TsContainerId>,
}

pub(super) fn analyze(
    program: &mut Program,
    bindings: &TsBindings,
    enums: &EnumFacts,
    seed: FxHashSet<Id>,
    mutable: bool,
    verbatim: bool,
    unresolved: SyntaxContext,
) -> RuntimeUsage {
    let mut collector = UsageCollector {
        bindings,
        enums,
        candidates: Candidates::new(program, bindings),
        usage: RuntimeUsage {
            bindings: seed,
            aliases: FxHashSet::default(),
            containers: FxHashSet::default(),
        },
        mutable,
        verbatim,
        unresolved,
        enum_owner: None,
        enum_initializer: None,
        lhs: false,
    };
    program.visit_mut_with(&mut collector);
    finish_aliases(bindings, collector.usage, verbatim)
}

pub(super) fn from_resolved_usage(
    bindings: &TsBindings,
    references: FxHashSet<Id>,
    verbatim: bool,
) -> RuntimeUsage {
    let mut usage = RuntimeUsage {
        bindings: references,
        aliases: FxHashSet::default(),
        containers: FxHashSet::default(),
    };
    for reference in &usage.bindings {
        if let Some(target) = bindings.value_target(reference) {
            require_target(bindings, &mut usage.containers, target);
        }
    }
    finish_aliases(bindings, usage, verbatim)
}

fn finish_aliases(bindings: &TsBindings, mut usage: RuntimeUsage, verbatim: bool) -> RuntimeUsage {
    let mut pending = Vec::new();
    for alias in bindings.aliases() {
        let declaration = bindings.alias(alias);
        if bindings.alias_has_value(alias)
            && (declaration.is_export
                || declaration.is_script_global
                || verbatim
                || usage
                    .bindings
                    .contains(bindings.declaration(declaration.declaration)))
        {
            pending.push(alias);
        }
    }
    while let Some(alias) = pending.pop() {
        if !usage.aliases.insert(alias) {
            continue;
        }
        let declaration = bindings.alias(alias);
        usage
            .bindings
            .insert(bindings.declaration(declaration.declaration).clone());
        if let Some(target) = bindings.alias_target(alias) {
            require_target(bindings, &mut usage.containers, target);
        }
        if let Some(dependency) = bindings.alias_dependency(alias) {
            usage
                .bindings
                .insert(bindings.declaration(dependency).clone());
            if let Some(alias) = bindings.declaration_alias(dependency) {
                pending.push(alias);
            }
        }
    }
    usage
}

struct UsageCollector<'a> {
    bindings: &'a TsBindings,
    enums: &'a EnumFacts,
    candidates: Candidates<'a>,
    usage: RuntimeUsage,
    mutable: bool,
    verbatim: bool,
    unresolved: SyntaxContext,
    enum_owner: Option<TsContainerId>,
    enum_initializer: Option<EnumInitializer>,
    lhs: bool,
}

impl UsageCollector<'_> {
    fn require_target(&mut self, target: TsValueTarget) {
        require_target(self.bindings, &mut self.usage.containers, target);
    }

    fn record_ident(&mut self, node: &Ident, candidate: Option<ReferenceFacts>) {
        if candidate.is_some_and(|facts| facts.reference) {
            self.usage.bindings.insert(node.to_id());
        }
        if node.ctxt == self.unresolved {
            if let Some(owner) = self.enum_owner {
                if self
                    .bindings
                    .named_member(owner, &node.sym.clone().into())
                    .is_some_and(|member| self.bindings.member(member).is_enum_member())
                {
                    self.usage.containers.insert(owner);
                }
            }
        }
        if let Some(target) = candidate.and_then(|facts| facts.target) {
            self.require_target(target);
        }
    }
}

fn require_target(
    bindings: &TsBindings,
    containers: &mut FxHashSet<TsContainerId>,
    target: TsValueTarget,
) {
    let owner = match target {
        TsValueTarget::Binding(declaration) => bindings.declaration_container(declaration),
        TsValueTarget::EnumMember(member) => Some(bindings.member(member).owner),
    };
    if let Some(owner) = owner {
        containers.insert(owner);
    }
}

impl VisitMut for UsageCollector<'_> {
    noop_visit_mut_type!();

    fn visit_mut_decl(&mut self, node: &mut Decl) {
        if crate::retain::should_retain_decl(node) {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        let reference = match &*node {
            Expr::Ident(ident) => Some(ident),
            _ => None,
        };
        let candidate = reference.and_then(|ident| self.candidates.get(ident));
        let target = match reference {
            Some(_) => candidate.and_then(|facts| facts.target),
            None if matches!(node, Expr::Member(_) | Expr::Paren(_)) => {
                self.bindings.runtime_expression_target(node)
            }
            None => None,
        };

        // Inline selection and runtime dependencies share this resolved target.
        // Only import candidates need owned IDs across syntax erasure.
        if !self.lhs && !self.verbatim {
            let inline = match target {
                Some(TsValueTarget::EnumMember(member)) => self
                    .enums
                    .member_value(
                        self.bindings,
                        member,
                        self.mutable,
                        node.span(),
                        self.enum_initializer,
                    )
                    .and_then(EnumValue::literal),
                _ => None,
            };
            if let Some(value) = inline {
                *node = value;
                return;
            }
        }

        if let Some(ident) = reference {
            self.record_ident(ident, candidate);
            return;
        }
        if let Some(target) = target {
            self.require_target(target);
        }
        maybe_grow_default(|| node.visit_mut_children_with(self));
    }

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        self.record_ident(node, self.candidates.get(node));
    }

    fn visit_mut_binding_ident(&mut self, _: &mut BindingIdent) {}

    fn visit_mut_import_decl(&mut self, _: &mut ImportDecl) {}

    fn visit_mut_ts_import_equals_decl(&mut self, _: &mut TsImportEqualsDecl) {}

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

    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        node.body.visit_mut_with(self);
    }

    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        if let Decl::TsModule(namespace) = &node.decl {
            if crate::retain::should_retain_decl(&node.decl) {
                if let TsModuleName::Ident(id) = &namespace.id {
                    if let Some(target) = self.bindings.runtime_target(id) {
                        self.require_target(target);
                    }
                }
            }
        }
        node.decl.visit_mut_with(self);
    }

    fn visit_mut_ts_namespace_decl(&mut self, node: &mut TsNamespaceDecl) {
        node.body.visit_mut_with(self);
    }

    fn visit_mut_ts_enum_decl(&mut self, node: &mut TsEnumDecl) {
        let declaration = self.enums.declaration(&node.id.to_id(), node.span);
        let previous = self.enum_owner;
        self.enum_owner = declaration.map(|declaration| declaration.container);
        let previous_initializer = self.enum_initializer;
        self.enum_initializer = declaration.map(|declaration| declaration.initializer);
        for (index, member) in node.members.iter_mut().enumerate() {
            if declaration
                .and_then(|declaration| declaration.values.get(index))
                .is_some_and(|value| value.is_constant())
            {
                continue;
            }
            member.init.visit_mut_with(self);
        }
        self.enum_owner = previous;
        self.enum_initializer = previous_initializer;
    }

    fn visit_mut_assign_expr(&mut self, node: &mut AssignExpr) {
        let previous = std::mem::replace(&mut self.lhs, true);
        node.left.visit_mut_with(self);
        self.lhs = false;
        node.right.visit_mut_with(self);
        self.lhs = previous;
    }

    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        let previous = std::mem::replace(&mut self.lhs, true);
        node.arg.visit_mut_with(self);
        self.lhs = previous;
    }

    fn visit_mut_assign_pat(&mut self, node: &mut AssignPat) {
        let previous = std::mem::replace(&mut self.lhs, true);
        node.left.visit_mut_with(self);
        self.lhs = false;
        node.right.visit_mut_with(self);
        self.lhs = previous;
    }

    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        node.key.visit_mut_with(self);
        let previous = std::mem::replace(&mut self.lhs, false);
        node.value.visit_mut_with(self);
        self.lhs = previous;
    }

    fn visit_mut_member_expr(&mut self, node: &mut MemberExpr) {
        let previous = std::mem::replace(&mut self.lhs, false);
        node.visit_mut_children_with(self);
        self.lhs = previous;
    }

    fn visit_mut_for_head(&mut self, node: &mut ForHead) {
        let previous = std::mem::replace(&mut self.lhs, true);
        node.visit_mut_children_with(self);
        self.lhs = previous;
    }

    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        if !node.type_only && node.src.is_none() {
            node.visit_mut_children_with(self);
        }
    }

    fn visit_mut_export_named_specifier(&mut self, node: &mut ExportNamedSpecifier) {
        if !node.is_type_only {
            node.orig.visit_mut_with(self);
        }
    }

    fn visit_mut_jsx_element_name(&mut self, node: &mut JSXElementName) {
        if matches!(node, JSXElementName::Ident(ident) if ident.sym.starts_with(|character: char| character.is_ascii_lowercase()))
        {
            return;
        }
        node.visit_mut_children_with(self);
    }
}
