//! Declaration relationships for TypeScript runtime containers.
//!
//! The lexical resolver owns reference lookup. This index links its declaration
//! IDs to shared namespace/enum members without merging physical JS bindings.
//! It is rebuilt from the AST at each phase boundary; body handles are valid
//! only during a walk of that same, structurally unchanged AST.

use std::{
    borrow::Borrow,
    hash::{Hash, Hasher},
};

use hashbrown::HashTable;
use rustc_hash::FxHasher;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::*;
mod aliases;
mod collect;
mod exports;
mod ids;
mod namespaces;
mod observer;
mod scopes;

use self::scopes::{ScopeOwner, ScopeOwners};
pub use self::{
    ids::{TsAliasId, TsContainerId, TsDeclarationId, TsMemberId, TsNamespaceBodyId},
    observer::TsBindingObserver,
    scopes::{TsLexicalNamespaceId, TsLexicalScopes},
};

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

/// The meaning required by a reference, independent of JavaScript emission.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TsReferenceSpace {
    /// A reference that survives type erasure.
    Value,
    /// An ordinary type reference.
    Type,
    /// The qualifier of a type name or internal import alias.
    Namespace,
    /// A value lookup inside erased syntax, including `typeof`.
    TypeQuery,
    /// A binding, alias, or export may refer to any target meaning.
    Any,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum MemberKind {
    Namespace,
    Enum,
}

/// Declaration candidates for runtime and erased references to a shared member.
#[derive(Debug)]
pub struct TsMember {
    pub owner: TsContainerId,
    pub name: Wtf8Atom,
    pub value: Option<TsDeclarationId>,
    /// Also carries namespaces, aliases, and type-only export specifiers.
    /// Lookup checks the target's meaning before selecting this candidate.
    pub erased: Option<TsDeclarationId>,
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
}

#[derive(Debug)]
struct Declaration {
    id: Id,
    owner: Option<TsNamespaceBodyId>,
    member: Option<TsMemberId>,
    container: Option<TsContainerId>,
    export_target: Option<TsDeclarationId>,
    alias: Option<TsAliasId>,
    value_space: bool,
    type_space: bool,
    ambient: bool,
}

#[derive(Debug)]
struct AliasPath {
    root: Id,
    members: AliasMembers,
}

/// Most internal aliases name a root or one direct member. Keep those paths
/// inline; only longer qualified paths need a separate allocation.
#[derive(Debug)]
enum AliasMembers {
    Empty,
    Single(Wtf8Atom),
    Qualified(Box<[Wtf8Atom]>),
}

impl AliasMembers {
    fn as_slice(&self) -> &[Wtf8Atom] {
        match self {
            Self::Empty => &[],
            Self::Single(member) => std::slice::from_ref(member),
            Self::Qualified(members) => members,
        }
    }
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
    // Member storage owns each (container, name) once. A shared handle index
    // avoids allocating a separate hash table for every small namespace.
    members_by_name: HashTable<TsMemberId>,
    declarations: Vec<Declaration>,
    // Declaration storage owns each ID once. The hash table carries handles
    // and compares against that storage, without a second owning key copy.
    declarations_by_id: HashTable<TsDeclarationId>,
    aliases: Vec<TsAlias>,
    alias_states: Vec<AliasState>,
    bodies: Vec<NamespaceBody>,
    // Erased parameters share a lexical context. Namespace completion needs
    // one owner per scope rather than a declaration for every parameter.
    erased_scopes: ScopeOwners,
    // Full declaration identities avoid scanning every same-named binding.
    // The declarations own the names; this index only stores handles and targets.
    runtime_values: Option<HashTable<(TsDeclarationId, TsValueTarget)>>,
}

impl TsBindings {
    /// Reuse lexical scope ownership supplied by the resolver instead of
    /// collecting owner-only bindings from erased type syntax again.
    #[doc(hidden)]
    pub fn with_lexical_scopes(mut self, scopes: TsLexicalScopes) -> Self {
        self.erased_scopes = scopes.resolve(&self);
        self
    }

    /// Build runtime-read queries for a transform that also performs enum
    /// substitution. Namespace resolution does not need this additional index.
    pub fn with_runtime_queries(mut self) -> Self {
        self.index_runtime_values();
        self
    }

    /// Get a body while walking the same declaration sequence again.
    pub fn namespace_body(&self, index: usize) -> Option<TsNamespaceBodyId> {
        (index < self.bodies.len()).then(|| TsNamespaceBodyId::from_index(index))
    }

    /// The owner shared by all declarations contributing to a container.
    pub fn container(&self, declaration: &Id) -> Option<TsContainerId> {
        self.declaration_id(declaration)
            .and_then(|declaration| self.declaration_container(declaration))
    }

    /// The source binding identity for an interned declaration.
    pub fn declaration(&self, declaration: TsDeclarationId) -> &Id {
        &self.declarations[declaration.index()].id
    }

    /// Interned declaration corresponding to an already resolved AST ID.
    pub fn declaration_id(&self, id: &Id) -> Option<TsDeclarationId> {
        self.lookup_declaration(&id.0, id.1)
    }

    /// Resolve an identifier without copying its owned declaration ID.
    pub fn ident_declaration(&self, ident: &Ident) -> Option<TsDeclarationId> {
        self.lookup_declaration(&ident.sym, ident.ctxt)
    }

    fn lookup_declaration(&self, name: &Atom, ctxt: SyntaxContext) -> Option<TsDeclarationId> {
        self.declarations_by_id
            .find(declaration_hash(name, ctxt), |&declaration| {
                let id = &self.declarations[declaration.index()].id;
                id.0 == *name && id.1 == ctxt
            })
            .copied()
    }

    /// The runtime container attached to this declaration or merged member.
    pub fn declaration_container(&self, declaration: TsDeclarationId) -> Option<TsContainerId> {
        let declaration = &self.declarations[declaration.index()];
        declaration.container.or_else(|| {
            declaration
                .member
                .and_then(|member| self.member(member).container)
        })
    }

    /// One representative declaration of a shared runtime container.
    pub fn container_declaration(&self, container: TsContainerId) -> TsDeclarationId {
        self.containers[container.index()].declaration
    }

    /// The shared member contributed by an exported declaration.
    pub fn member_of(&self, declaration: &Id) -> Option<TsMemberId> {
        self.declaration_id(declaration)
            .and_then(|declaration| self.declaration_member(declaration))
    }

    /// Shared membership of an already interned declaration.
    pub fn declaration_member(&self, declaration: TsDeclarationId) -> Option<TsMemberId> {
        self.declarations[declaration.index()].member
    }

    /// Facts for a handle obtained from this index.
    pub fn member(&self, member: TsMemberId) -> &TsMember {
        &self.members[member.index()]
    }

    /// Lookup under a resolved owner, preserving quoted/lone-surrogate keys.
    pub fn named_member(&self, container: TsContainerId, name: &Wtf8Atom) -> Option<TsMemberId> {
        self.members_by_name
            .find(member_hash(container, name), |&member| {
                let member = self.member(member);
                member.owner == container && member.name == *name
            })
            .copied()
    }

    /// Aliases in declaration order, with independent binding identities.
    pub fn aliases(&self) -> impl Iterator<Item = TsAliasId> + '_ {
        (0..self.aliases.len()).map(TsAliasId::from_index)
    }

    /// Declaration and dependency policy inputs for one alias.
    pub fn alias(&self, alias: TsAliasId) -> &TsAlias {
        &self.aliases[alias.index()]
    }

    /// Whether a declaration is an import-equals binding.
    pub fn declaration_alias(&self, declaration: TsDeclarationId) -> Option<TsAliasId> {
        self.declarations[declaration.index()].alias
    }

    /// Known terminal value of an internal alias. Cycles, type-only aliases,
    /// and external targets deliberately return no value.
    pub fn alias_target(&self, alias: TsAliasId) -> Option<TsValueTarget> {
        match self.alias_states[alias.index()] {
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
                self.declarations[declaration.index()].value_space
            }
            Some(TsValueTarget::EnumMember(_)) | None => true,
        }
    }

    /// Whether an alias initializer can create a runtime dependency.
    ///
    /// Ambient aliases retain their target's symbol meanings, but their
    /// erased initializers never access that target at runtime.
    pub fn alias_has_runtime_initializer(&self, alias: TsAliasId) -> bool {
        !self.declarations[self.alias(alias).declaration.index()].ambient
            && self.alias_has_value(alias)
    }

    fn target_has_space(&self, target: TsValueTarget, space: TsReferenceSpace) -> bool {
        let TsValueTarget::Binding(declaration) = target else {
            return matches!(
                space,
                TsReferenceSpace::Value | TsReferenceSpace::TypeQuery | TsReferenceSpace::Any
            );
        };
        let facts = &self.declarations[declaration.index()];
        match space {
            TsReferenceSpace::Value | TsReferenceSpace::TypeQuery => facts.value_space,
            TsReferenceSpace::Type => {
                // A value and a type may have separate physical declarations
                // while contributing to the same exported namespace member.
                facts.type_space
                    || facts.member.is_some_and(|member| {
                        self.member(member)
                            .erased
                            .is_some_and(|ty| self.declarations[ty.index()].type_space)
                    })
            }
            TsReferenceSpace::Namespace => self.declaration_container(declaration).is_some(),
            TsReferenceSpace::Any => true,
        }
    }

    fn declaration_has_space(&self, declaration: TsDeclarationId, space: TsReferenceSpace) -> bool {
        let facts = &self.declarations[declaration.index()];
        let source = facts.export_target.unwrap_or(declaration);
        if let Some(alias) = self.declaration_alias(source) {
            if space == TsReferenceSpace::Value {
                return self.alias_has_value(alias);
            }
            // An unknown external target can contribute any meaning. A known
            // internal target contributes only its actual symbol meanings.
            return self
                .alias_target(alias)
                .map_or(true, |target| self.target_has_space(target, space));
        }
        self.target_has_space(TsValueTarget::Binding(source), space)
    }

    /// The root dependency retains its own alias declaration identity.
    pub fn alias_dependency(&self, alias: TsAliasId) -> Option<TsDeclarationId> {
        self.aliases[alias.index()]
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

    /// Resolve an AST identifier through declaration/member/alias facts
    /// without constructing an owned binding ID.
    pub fn ident_value_target(&self, ident: &Ident) -> Option<TsValueTarget> {
        self.ident_declaration(ident)
            .and_then(|declaration| self.declaration_value(declaration))
    }

    /// Resolve only values that can retain a runtime container or inline an
    /// enum member. Ordinary local references need neither operation, so this
    /// smaller index accepts a borrowed identifier without constructing an ID.
    pub fn runtime_target(&self, ident: &Ident) -> Option<TsValueTarget> {
        match &self.runtime_values {
            Some(values) => values
                .find(
                    declaration_hash(&ident.sym, ident.ctxt),
                    |&(declaration, _)| {
                        let id = &self.declarations[declaration.index()].id;
                        id.0 == ident.sym && id.1 == ident.ctxt
                    },
                )
                .map(|&(_, target)| target),
            None => self
                .ident_declaration(ident)
                .and_then(|declaration| self.declaration_value(declaration))
                .filter(|&target| self.is_runtime_target(target)),
        }
    }

    /// Cached runtime identities for a phase-local consumer index. Names
    /// borrow this declaration graph; targets remain valid while it is alive.
    pub fn runtime_values(&self) -> impl Iterator<Item = (&Atom, SyntaxContext, TsValueTarget)> {
        self.runtime_values.iter().flat_map(|values| {
            values.iter().map(|&(declaration, target)| {
                let (name, ctxt) = &self.declarations[declaration.index()].id;
                (name, *ctxt, target)
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
        let mut values = HashTable::new();
        for index in 0..self.declarations.len() {
            let declaration = TsDeclarationId::from_index(index);
            let Some(target) = self.declaration_value(declaration) else {
                continue;
            };
            if !self.is_runtime_target(target) {
                continue;
            }
            let (name, ctxt) = &self.declarations[index].id;
            values.insert_unique(
                declaration_hash(name, *ctxt),
                (declaration, target),
                |&(id, _)| {
                    let (name, ctxt) = &self.declarations[id.index()].id;
                    declaration_hash(name, *ctxt)
                },
            );
        }
        self.runtime_values = Some(values);
    }

    fn declaration_value(&self, declaration: TsDeclarationId) -> Option<TsValueTarget> {
        let declaration = self.canonical_value_declaration(declaration);
        if !self.declarations[declaration.index()].value_space {
            return None;
        }
        match self.declaration_alias(declaration) {
            Some(alias) => self.alias_target(alias),
            None => Some(TsValueTarget::Binding(declaration)),
        }
    }

    fn canonical_value_declaration(&self, declaration: TsDeclarationId) -> TsDeclarationId {
        let facts = &self.declarations[declaration.index()];
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
            Expr::Ident(ident) => self.ident_value_target(ident),
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
            declaration_hash(&id.0, id.1),
            |&declaration| declarations[declaration.index()].id == id,
            |&declaration| {
                let id = &declarations[declaration.index()].id;
                declaration_hash(&id.0, id.1)
            },
        );
        match entry {
            Entry::Occupied(entry) => {
                let declaration = *entry.get();
                declarations[declaration.index()].owner = owner;
                declaration
            }
            Entry::Vacant(entry) => {
                let declaration = TsDeclarationId::from_index(declarations.len());
                declarations.push(Declaration {
                    id,
                    owner,
                    member: None,
                    container: None,
                    export_target: None,
                    alias: None,
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
        space: TsReferenceSpace,
    ) -> Option<&Id> {
        self.namespace_lookup(&reference.0, reference.1, bodies, space)
    }

    /// Complete an AST identifier's namespace lookup without copying its ID.
    pub fn ident_namespace_reference(
        &self,
        reference: &Ident,
        bodies: &[TsNamespaceBodyId],
        space: TsReferenceSpace,
    ) -> Option<&Id> {
        self.namespace_lookup(&reference.sym, reference.ctxt, bodies, space)
    }

    fn namespace_lookup(
        &self,
        name: &Atom,
        ctxt: SyntaxContext,
        bodies: &[TsNamespaceBodyId],
        space: TsReferenceSpace,
    ) -> Option<&Id> {
        // A lexical scope has one namespace owner for all of its bindings.
        // Reuse that identity before looking up an individual declaration.
        let lexical_owner = self.erased_scopes.get(ctxt).or_else(|| {
            self.lookup_declaration(name, ctxt).and_then(|declaration| {
                self.declarations[declaration.index()]
                    .owner
                    .map(ScopeOwner::Body)
            })
        });
        if let (Some(owner), Some(&body)) = (lexical_owner, bodies.last()) {
            if owner.matches(body, self.bodies[body.index()].container) {
                return None;
            }
        }
        let name: &Wtf8Atom = name.borrow();

        for body in bodies.iter().rev() {
            let container = self.bodies[body.index()].container;
            if lexical_owner.is_some_and(|owner| owner.matches(*body, container)) {
                return None;
            }

            let Some(member) = self.named_member(container, name) else {
                continue;
            };
            let member = self.member(member);
            let candidates = match space {
                TsReferenceSpace::Value => [member.value, None],
                _ => [member.erased, member.value],
            };
            let target = candidates
                .into_iter()
                .flatten()
                .find(|&declaration| self.declaration_has_space(declaration, space));
            if let Some(target) = target {
                return Some(self.declaration(target));
            }
        }

        None
    }

    fn add_member(&mut self, owner: TsContainerId, name: Wtf8Atom) -> TsMemberId {
        use hashbrown::hash_table::Entry;

        let members = &mut self.members;
        let entry = self.members_by_name.entry(
            member_hash(owner, &name),
            |&member| {
                let member = &members[member.index()];
                member.owner == owner && member.name == name
            },
            |&member| {
                let member = &members[member.index()];
                member_hash(member.owner, &member.name)
            },
        );
        match entry {
            Entry::Occupied(entry) => *entry.get(),
            Entry::Vacant(entry) => {
                let member = TsMemberId::from_index(members.len());
                members.push(TsMember {
                    owner,
                    name,
                    value: None,
                    erased: None,
                    container: None,
                    kind: MemberKind::Namespace,
                });
                entry.insert(member);
                member
            }
        }
    }
}

fn member_hash(owner: TsContainerId, name: &Wtf8Atom) -> u64 {
    let mut hasher = FxHasher::default();
    (owner, name).hash(&mut hasher);
    hasher.finish()
}

fn declaration_hash(name: &Atom, ctxt: SyntaxContext) -> u64 {
    let mut hasher = FxHasher::default();
    (name, ctxt).hash(&mut hasher);
    hasher.finish()
}

/// Visitor used by [`TsBindings::collect`]. Its state is intentionally private.
#[derive(Default)]
pub struct TsBindingCollector<O: TsBindingObserver = (), const TYPE_OWNERS: bool = true> {
    observer: O,
    unresolved_ctxt: SyntaxContext,
    bindings: TsBindings,
    body: Option<TsNamespaceBodyId>,
    exported: bool,
    ambient: bool,
    is_module: bool,
    implicit_exports: bool,
    namespace_has_value: bool,
    namespace_exports: Vec<NamespaceExport>,
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
