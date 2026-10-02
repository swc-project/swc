//! Declaration relationships for TypeScript runtime containers.
//!
//! The lexical resolver owns reference lookup. This index links its declaration
//! IDs to shared namespace/enum members without merging physical JS bindings.
//! It is rebuilt from the AST at each phase boundary; body handles are valid
//! only during a walk of that same, structurally unchanged AST.

use std::hash::{Hash, Hasher};

use hashbrown::HashTable;
use rustc_hash::{FxHashMap, FxHasher};
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::for_each_binding_ident;

mod aliases;
mod exports;
mod observer;

pub use self::observer::TsBindingObserver;

/// A same-file namespace or enum owner, including merged declarations.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TsContainerId(usize);

/// An exported declaration or enum member under one resolved owner.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TsMemberId(usize);

/// One namespace declaration body's private lexical environment.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TsNamespaceBodyId(usize);

/// A declaration ID interned once for this analysis phase.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TsDeclarationId(usize);

/// An import-equals declaration, kept separate from its terminal target.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct TsAliasId(usize);

/// A resolved value reached through a binding, member, or internal alias.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TsValueTarget {
    Binding(TsDeclarationId),
    EnumMember(TsMemberId),
}

/// The selected member grammar differs between constant evaluation and reads.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TsMemberResolution {
    Constant,
    Inline,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum MemberKind {
    Namespace,
    Enum,
}

/// The value/type contributions to a shared member.
#[derive(Debug)]
pub struct TsMember {
    pub owner: TsContainerId,
    pub name: Wtf8Atom,
    pub value: Option<TsDeclarationId>,
    pub ty: Option<TsDeclarationId>,
    pub container: Option<TsContainerId>,
    kind: MemberKind,
}

impl TsMember {
    /// Enum members have a value identity without a physical JS declaration.
    pub fn is_enum_member(&self) -> bool {
        self.kind == MemberKind::Enum
    }
}

#[derive(Debug)]
struct Container {
    declaration: TsDeclarationId,
    members: FxHashMap<Wtf8Atom, TsMemberId>,
}

#[derive(Debug)]
struct Declaration {
    id: Id,
    owner: Option<TsNamespaceBodyId>,
    member: Option<TsMemberId>,
    container: Option<TsContainerId>,
    export_target: Option<TsDeclarationId>,
    value_space: bool,
    type_space: bool,
    ambient: bool,
}

#[derive(Debug)]
struct AliasPath {
    root: Id,
    members: Box<[Wtf8Atom]>,
}

/// Same-file alias metadata used by transform dependency analysis.
#[derive(Debug)]
pub struct TsAlias {
    pub declaration: TsDeclarationId,
    pub span: Span,
    pub is_export: bool,
    pub is_type_only: bool,
    pub is_script_global: bool,
    path: Option<AliasPath>,
}

#[derive(Debug, Clone, Copy)]
enum AliasState {
    Pending,
    Resolving,
    Resolved(TsValueTarget),
    Unknown,
}

#[derive(Debug)]
struct NamespaceBody {
    container: TsContainerId,
}

struct NamespaceExport {
    body: TsNamespaceBodyId,
    source: Id,
    name: swc_atoms::Atom,
    type_only: bool,
}

/// A phase-local index of resolved declarations and TS container membership.
#[derive(Debug, Default)]
pub struct TsBindings {
    containers: Vec<Container>,
    members: Vec<TsMember>,
    declarations: Vec<Declaration>,
    // Declaration storage owns each ID once. The hash table carries handles
    // and compares against that storage, without a second owning key copy.
    declarations_by_id: HashTable<TsDeclarationId>,
    aliases: Vec<TsAlias>,
    aliases_by_decl: FxHashMap<TsDeclarationId, TsAliasId>,
    alias_states: Vec<AliasState>,
    bodies: Vec<NamespaceBody>,
    runtime_values: Option<FxHashMap<Atom, Vec<(SyntaxContext, TsValueTarget)>>>,
}

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
            observe_runtime: true,
            ..Default::default()
        };
        node.visit_with(&mut collector);
        collector.finish_exports();
        let mut bindings = collector.bindings;
        bindings.resolve_aliases();
        (bindings, collector.observer)
    }

    /// Build runtime-read queries for a transform that also performs enum
    /// substitution. Namespace resolution does not need this additional index.
    pub fn with_runtime_queries(mut self) -> Self {
        self.index_runtime_values();
        self
    }

    /// Whether this input has namespace bodies requiring an emission context.
    pub fn has_namespace_bodies(&self) -> bool {
        !self.bodies.is_empty()
    }

    /// Bodies in declaration visitation order, for the immediately following
    /// Resolver walk. Do not retain these handles across structural AST edits.
    pub fn namespace_bodies(&self) -> impl Iterator<Item = TsNamespaceBodyId> + '_ {
        (0..self.bodies.len()).map(TsNamespaceBodyId)
    }

    /// Get a body while walking the same declaration sequence again.
    pub fn namespace_body(&self, index: usize) -> Option<TsNamespaceBodyId> {
        (index < self.bodies.len()).then_some(TsNamespaceBodyId(index))
    }

    /// The owner shared by all declarations contributing to a container.
    pub fn container(&self, declaration: &Id) -> Option<TsContainerId> {
        self.declaration_id(declaration)
            .and_then(|declaration| self.declaration_container(declaration))
    }

    /// The source binding identity for an interned declaration.
    pub fn declaration(&self, declaration: TsDeclarationId) -> &Id {
        &self.declarations[declaration.0].id
    }

    /// Interned declaration corresponding to an already resolved AST ID.
    pub fn declaration_id(&self, id: &Id) -> Option<TsDeclarationId> {
        self.declarations_by_id
            .find(declaration_hash(id), |&declaration| {
                self.declarations[declaration.0].id == *id
            })
            .copied()
    }

    /// Declarations whose container or membership can rewrite a runtime read.
    /// The returned IDs borrow this index throughout the emission phase.
    pub fn emission_declarations(&self) -> impl Iterator<Item = (TsDeclarationId, &Id)> + '_ {
        self.declarations
            .iter()
            .enumerate()
            .filter_map(|(index, declaration)| {
                (declaration.container.is_some() || declaration.member.is_some())
                    .then_some((TsDeclarationId(index), &declaration.id))
            })
    }

    /// The runtime container attached to this declaration or merged member.
    pub fn declaration_container(&self, declaration: TsDeclarationId) -> Option<TsContainerId> {
        let declaration = &self.declarations[declaration.0];
        declaration.container.or_else(|| {
            declaration
                .member
                .and_then(|member| self.member(member).container)
        })
    }

    /// One representative declaration of a shared runtime container.
    pub fn container_declaration(&self, container: TsContainerId) -> TsDeclarationId {
        self.containers[container.0].declaration
    }

    /// The shared member contributed by an exported declaration.
    pub fn member_of(&self, declaration: &Id) -> Option<TsMemberId> {
        self.declaration_id(declaration)
            .and_then(|declaration| self.declaration_member(declaration))
    }

    /// Shared membership of an already interned declaration.
    pub fn declaration_member(&self, declaration: TsDeclarationId) -> Option<TsMemberId> {
        self.declarations[declaration.0].member
    }

    /// Facts for a handle obtained from this index.
    pub fn member(&self, member: TsMemberId) -> &TsMember {
        &self.members[member.0]
    }

    /// Lookup under a resolved owner, preserving quoted/lone-surrogate keys.
    pub fn named_member(&self, container: TsContainerId, name: &Wtf8Atom) -> Option<TsMemberId> {
        self.containers[container.0].members.get(name).copied()
    }

    /// Aliases in declaration order, with independent binding identities.
    pub fn aliases(&self) -> impl Iterator<Item = TsAliasId> + '_ {
        (0..self.aliases.len()).map(TsAliasId)
    }

    /// Declaration and dependency policy inputs for one alias.
    pub fn alias(&self, alias: TsAliasId) -> &TsAlias {
        &self.aliases[alias.0]
    }

    /// Whether a declaration is an import-equals binding.
    pub fn declaration_alias(&self, declaration: TsDeclarationId) -> Option<TsAliasId> {
        self.aliases_by_decl.get(&declaration).copied()
    }

    /// Known terminal value of an internal alias. Cycles, type-only aliases,
    /// and external targets deliberately return no value.
    pub fn alias_target(&self, alias: TsAliasId) -> Option<TsValueTarget> {
        match self.alias_states[alias.0] {
            AliasState::Resolved(target) => Some(target),
            AliasState::Pending | AliasState::Resolving | AliasState::Unknown => None,
        }
    }

    /// A known type-only terminal cannot introduce a runtime alias binding.
    /// Unknown external targets remain possible values.
    pub fn alias_has_value(&self, alias: TsAliasId) -> bool {
        if self.alias(alias).is_type_only {
            return false;
        }
        match self.alias_target(alias) {
            Some(TsValueTarget::Binding(declaration)) => {
                self.declarations[declaration.0].value_space
            }
            Some(TsValueTarget::EnumMember(_)) | None => true,
        }
    }

    /// The root dependency retains its own alias declaration identity.
    pub fn alias_dependency(&self, alias: TsAliasId) -> Option<TsDeclarationId> {
        self.aliases[alias.0]
            .path
            .as_ref()
            .and_then(|path| self.declaration_id(&path.root))
    }

    /// Resolve a runtime value through the known declaration/member/alias
    /// facts.
    pub fn value_target(&self, id: &Id) -> Option<TsValueTarget> {
        self.declaration_id(id)
            .and_then(|declaration| self.declaration_value(declaration))
    }

    /// Resolve only values that can retain a runtime container or inline an
    /// enum member. Ordinary local references need neither operation, so this
    /// smaller index accepts a borrowed identifier without constructing an ID.
    pub fn runtime_target(&self, ident: &Ident) -> Option<TsValueTarget> {
        match &self.runtime_values {
            Some(values) => values
                .get(&ident.sym)?
                .iter()
                .find_map(|&(ctxt, target)| (ctxt == ident.ctxt).then_some(target)),
            None => self
                .value_target(&ident.to_id())
                .filter(|&target| self.is_runtime_target(target)),
        }
    }

    /// Cached runtime identities for a phase-local consumer index. Names
    /// borrow this declaration graph; targets remain valid while it is alive.
    pub fn runtime_values(&self) -> impl Iterator<Item = (&Atom, SyntaxContext, TsValueTarget)> {
        self.runtime_values.iter().flat_map(|values| {
            values.iter().flat_map(|(name, entries)| {
                entries
                    .iter()
                    .map(move |&(ctxt, target)| (name, ctxt, target))
            })
        })
    }

    fn is_runtime_target(&self, target: TsValueTarget) -> bool {
        match target {
            TsValueTarget::Binding(declaration) => {
                self.declaration_container(declaration).is_some()
            }
            TsValueTarget::EnumMember(_) => true,
        }
    }

    fn index_runtime_values(&mut self) {
        let mut values = FxHashMap::<Atom, Vec<(SyntaxContext, TsValueTarget)>>::default();
        for index in 0..self.declarations.len() {
            let Some(target) = self.declaration_value(TsDeclarationId(index)) else {
                continue;
            };
            if !self.is_runtime_target(target) {
                continue;
            }
            let (name, ctxt) = &self.declarations[index].id;
            values
                .entry(name.clone())
                .or_default()
                .push((*ctxt, target));
        }
        self.runtime_values = Some(values);
    }

    fn declaration_value(&self, declaration: TsDeclarationId) -> Option<TsValueTarget> {
        let declaration = self.canonical_value_declaration(declaration);
        if !self.declarations[declaration.0].value_space {
            return None;
        }
        match self.declaration_alias(declaration) {
            Some(alias) => self.alias_target(alias),
            None => Some(TsValueTarget::Binding(declaration)),
        }
    }

    fn canonical_value_declaration(&self, declaration: TsDeclarationId) -> TsDeclarationId {
        let facts = &self.declarations[declaration.0];
        facts
            .export_target
            .or_else(|| facts.member.and_then(|member| self.member(member).value))
            .unwrap_or(declaration)
    }

    /// Resolve a statically named member with the selected entity-name grammar.
    /// Parentheses are transparent; optional runtime accesses remain opaque.
    pub fn expression_target(
        &self,
        expression: &Expr,
        resolution: TsMemberResolution,
    ) -> Option<TsValueTarget> {
        self.expression_target_inner(expression, resolution, false)
    }

    /// Runtime reads start from a known container or enum-member alias. Their
    /// member grammar matches inline substitution and does not inspect
    /// unrelated lexical declarations.
    pub fn runtime_expression_target(&self, expression: &Expr) -> Option<TsValueTarget> {
        self.expression_target_inner(expression, TsMemberResolution::Inline, true)
    }

    fn expression_target_inner(
        &self,
        expression: &Expr,
        resolution: TsMemberResolution,
        runtime: bool,
    ) -> Option<TsValueTarget> {
        match transparent_expr(expression) {
            Expr::Ident(ident) if runtime => self.runtime_target(ident),
            Expr::Ident(ident) => self.value_target(&ident.to_id()),
            Expr::Member(member) => self.member_target(member, resolution, runtime),
            Expr::OptChain(chain) if resolution == TsMemberResolution::Constant => {
                match &*chain.base {
                    OptChainBase::Member(member) => self.member_target(member, resolution, runtime),
                    OptChainBase::Call(_) => None,
                    #[cfg(swc_ast_unknown)]
                    _ => None,
                }
            }
            _ => None,
        }
    }

    fn member_target(
        &self,
        member: &MemberExpr,
        resolution: TsMemberResolution,
        runtime: bool,
    ) -> Option<TsValueTarget> {
        let TsValueTarget::Binding(object) =
            self.expression_target_inner(&member.obj, resolution, runtime)?
        else {
            return None;
        };
        let container = self.declaration_container(object)?;
        let name = static_member_name(&member.prop)?;
        let member_id = self.named_member(container, &name)?;
        let facts = self.member(member_id);

        if facts.is_enum_member() {
            return Some(TsValueTarget::EnumMember(member_id));
        }
        if resolution == TsMemberResolution::Constant
            && matches!(member.prop, MemberProp::Computed(_))
        {
            return None;
        }
        facts
            .value
            .and_then(|declaration| self.declaration_value(declaration))
    }

    fn register(&mut self, id: Id, owner: Option<TsNamespaceBodyId>) -> TsDeclarationId {
        use hashbrown::hash_table::Entry;

        let declarations = &mut self.declarations;
        let entry = self.declarations_by_id.entry(
            declaration_hash(&id),
            |&declaration| declarations[declaration.0].id == id,
            |&declaration| declaration_hash(&declarations[declaration.0].id),
        );
        match entry {
            Entry::Occupied(entry) => {
                let declaration = *entry.get();
                declarations[declaration.0].owner = owner;
                declaration
            }
            Entry::Vacant(entry) => {
                let declaration = TsDeclarationId(declarations.len());
                declarations.push(Declaration {
                    id,
                    owner,
                    member: None,
                    container: None,
                    export_target: None,
                    value_space: false,
                    type_space: false,
                    ambient: false,
                });
                entry.insert(declaration);
                declaration
            }
        }
    }

    /// A declaration target selected at a namespace boundary. The original
    /// lexical result remains authoritative for bindings owned by that body.
    pub fn namespace_reference(
        &self,
        reference: &Id,
        bodies: &[TsNamespaceBodyId],
        in_type: bool,
    ) -> Option<&Id> {
        let lexical_owner = self
            .declaration_id(reference)
            .and_then(|declaration| self.declarations[declaration.0].owner);
        if bodies.last().copied() == lexical_owner {
            return None;
        }
        let name: Wtf8Atom = reference.0.clone().into();

        for body in bodies.iter().rev() {
            if lexical_owner == Some(*body) {
                return None;
            }

            let container = self.bodies[body.0].container;
            let Some(member) = self.named_member(container, &name) else {
                continue;
            };
            let member = self.member(member);
            let target = if in_type {
                member.ty.or(member.value)
            } else {
                member.value.filter(|declaration| {
                    let declaration = self.canonical_value_declaration(*declaration);
                    self.declaration_alias(declaration)
                        .map_or(self.declarations[declaration.0].value_space, |alias| {
                            self.alias_has_value(alias)
                        })
                })
            };
            if let Some(target) = target {
                return Some(self.declaration(target));
            }
        }

        None
    }

    fn add_member(&mut self, owner: TsContainerId, name: Wtf8Atom) -> TsMemberId {
        use std::collections::hash_map::Entry;

        match self.containers[owner.0].members.entry(name) {
            Entry::Occupied(entry) => *entry.get(),
            Entry::Vacant(entry) => {
                let member = TsMemberId(self.members.len());
                self.members.push(TsMember {
                    owner,
                    name: entry.key().clone(),
                    value: None,
                    ty: None,
                    container: None,
                    kind: MemberKind::Namespace,
                });
                entry.insert(member);
                member
            }
        }
    }
}

fn declaration_hash(id: &Id) -> u64 {
    let mut hasher = FxHasher::default();
    id.hash(&mut hasher);
    hasher.finish()
}

/// Visitor used by [`TsBindings::collect`]. Its state is intentionally private.
#[derive(Default)]
pub struct TsBindingCollector<O: TsBindingObserver = ()> {
    observer: O,
    observe_runtime: bool,
    bindings: TsBindings,
    body: Option<TsNamespaceBodyId>,
    exported: bool,
    ambient: bool,
    is_module: bool,
    implicit_exports: bool,
    namespace_exports: Vec<NamespaceExport>,
}

impl<O: TsBindingObserver> TsBindingCollector<O> {
    fn visit_erased<N: VisitWith<Self>>(&mut self, node: &N) {
        if O::RUNTIME {
            let previous = std::mem::replace(&mut self.observe_runtime, false);
            node.visit_children_with(self);
            self.observe_runtime = previous;
        } else {
            node.visit_children_with(self);
        }
    }

    fn record_owner(&mut self, id: Id) {
        let declaration = self.bindings.register(id, self.body);
        self.bindings.declarations[declaration.0].value_space = true;
    }

    fn declaration(&mut self, id: Id, value: bool, ty: bool, exported: bool) -> TsDeclarationId {
        let declaration = self.bindings.register(id, self.body);
        let facts = &mut self.bindings.declarations[declaration.0];
        facts.ambient = self.ambient && (!(facts.value_space || facts.type_space) || facts.ambient);
        facts.value_space |= value;
        facts.type_space |= ty;
        let Some(body) = self.body else {
            return declaration;
        };
        if !(exported || self.implicit_exports) {
            return declaration;
        }

        let owner = self.bindings.bodies[body.0].container;
        let name = self.bindings.declaration(declaration).0.clone().into();
        let member = self.bindings.add_member(owner, name);
        let replaces_ambient = self.bindings.members[member.0]
            .value
            .is_some_and(|previous| {
                self.bindings.declarations[previous.0].ambient && !self.ambient
            });
        let facts = &mut self.bindings.members[member.0];
        if value && (facts.value.is_none() || replaces_ambient) {
            facts.value = Some(declaration);
        }
        if ty && facts.ty.is_none() {
            facts.ty = Some(declaration);
        }
        self.bindings.declarations[declaration.0].member = Some(member);
        declaration
    }

    fn container(&mut self, declaration: TsDeclarationId) -> TsContainerId {
        let member = self.bindings.declarations[declaration.0].member;
        let existing = member
            .and_then(|member| self.bindings.member(member).container)
            .or_else(|| self.bindings.declaration_container(declaration));

        let container = existing.unwrap_or_else(|| {
            let container = TsContainerId(self.bindings.containers.len());
            self.bindings.containers.push(Container {
                declaration,
                members: FxHashMap::default(),
            });
            container
        });
        if let Some(member) = member {
            self.bindings.members[member.0].container = Some(container);
        }
        self.bindings.declarations[declaration.0].container = Some(container);
        container
    }

    fn namespace(&mut self, id: Id, body: &TsNamespaceBody, declare: bool) {
        let observer_state = self.observer.enter_namespace(&id);
        let exported = std::mem::take(&mut self.exported);
        let declaration = self.declaration(id, exports::has_value(body), true, exported);
        let container = self.container(declaration);
        let next = TsNamespaceBodyId(self.bindings.bodies.len());
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
        if self.observe_runtime {
            self.observer.ident(node);
        }
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
        for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        node.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        node.visit_children_with(self);
    }

    fn visit_constructor(&mut self, node: &Constructor) {
        for_each_binding_ident(&node.params, |id| self.record_owner(id.id.to_id()));
        node.visit_children_with(self);
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        for_each_binding_ident(&node.param, |id| self.record_owner(id.id.to_id()));
        node.visit_children_with(self);
    }

    fn visit_ts_type_param(&mut self, node: &TsTypeParam) {
        self.record_owner(node.name.to_id());
        node.constraint.visit_with(self);
        node.default.visit_with(self);
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.ident.to_id(), true, false, exported);
        node.function.visit_with(self);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        if let Some(ident) = &node.ident {
            self.record_owner(ident.to_id());
        }
        node.function.visit_with(self);
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        let exported = std::mem::take(&mut self.exported);
        self.declaration(node.ident.to_id(), true, true, exported);
        node.class.visit_with(self);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        if let Some(ident) = &node.ident {
            self.record_owner(ident.to_id());
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
            self.bindings.members[member.0].kind = MemberKind::Enum;
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
        let alias = TsAliasId(self.bindings.aliases.len());
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

/// Parentheses carry syntax grouping, not a new value or binding identity.
pub fn transparent_expr(mut expression: &Expr) -> &Expr {
    while let Expr::Paren(paren) = expression {
        expression = &paren.expr;
    }
    expression
}

/// A literal member key, with transparent grouping and lossless WTF-8 text.
pub fn static_member_name(property: &MemberProp) -> Option<Wtf8Atom> {
    match property {
        MemberProp::Ident(ident) => Some(ident.sym.clone().into()),
        MemberProp::Computed(computed) => match transparent_expr(&computed.expr) {
            Expr::Lit(Lit::Str(string)) => Some(string.value.clone()),
            Expr::Tpl(template) if template.exprs.is_empty() && template.quasis.len() == 1 => {
                template.quasis[0].cooked.clone()
            }
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
        #[cfg(swc_ast_unknown)]
        _ => None,
    }
}
