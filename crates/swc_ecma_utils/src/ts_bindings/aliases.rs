use std::{ops::ControlFlow, slice};

use super::{
    lookup::{NamespaceAncestors, NamespaceCandidates},
    *,
};

pub(super) fn path(name: &TsEntityName) -> AliasPath {
    if let TsEntityName::Ident(root) = name {
        return AliasPath {
            root: root.to_id(),
            members: AliasMembers::Empty,
        };
    }
    if let TsEntityName::TsQualifiedName(qualified) = name {
        if let TsEntityName::Ident(root) = &qualified.left {
            return AliasPath {
                root: root.to_id(),
                members: AliasMembers::Single(qualified.right.sym.clone().into()),
            };
        }
    }

    fn collect(name: &TsEntityName, members: &mut Vec<Wtf8Atom>) -> Id {
        match name {
            TsEntityName::Ident(ident) => ident.to_id(),
            TsEntityName::TsQualifiedName(qualified) => {
                let root = collect(&qualified.left, members);
                members.push(qualified.right.sym.clone().into());
                root
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    let mut members = Vec::new();
    let root = collect(name, &mut members);
    AliasPath {
        root,
        members: AliasMembers::Qualified(members.into_boxed_slice()),
    }
}

impl TsBindings {
    pub(super) fn resolve_aliases(&mut self) {
        if self.aliases.is_empty() {
            return;
        }
        self.alias_states = AliasResolver::new(self, false).resolve_all().0;
    }

    /// Complete alias roots against the collected namespace scopes before
    /// caching their meanings. Root selection resolves alias dependencies with
    /// the same worklist, so qualifiers never consult an earlier target cache.
    #[doc(hidden)]
    pub fn with_namespace_aliases(mut self) -> Self {
        if self.aliases.is_empty() {
            return self;
        }
        let (states, roots) = AliasResolver::new(&self, true).resolve_all();
        for (alias, root) in self.aliases.iter_mut().zip(roots) {
            if let (Some(path), Some(root)) = (&mut alias.path, root) {
                let id = &self.declarations[root.index()].id;
                if path.root != *id {
                    path.root.clone_from(id);
                }
            }
        }
        self.alias_states = states;
        self
    }
}

type AliasResolution = ControlFlow<TsAliasId, Option<TsValueTarget>>;

struct AliasFrame<'a> {
    alias: TsAliasId,
    members: slice::Iter<'a, Wtf8Atom>,
    root: Option<Box<AliasRoot<'a>>>,
}

struct AliasRoot<'a> {
    candidates: NamespaceCandidates<'a, NamespaceAncestors<'a>>,
    current: Option<TsDeclarationId>,
    original: Option<TsDeclarationId>,
    space: TsReferenceSpace,
}

struct AliasResolver<'a> {
    bindings: &'a TsBindings,
    states: Vec<AliasState>,
    pending: Vec<AliasFrame<'a>>,
    roots: Vec<Option<TsDeclarationId>>,
}

impl<'a> AliasResolver<'a> {
    fn new(bindings: &'a TsBindings, complete_roots: bool) -> Self {
        Self {
            bindings,
            states: vec![AliasState::Pending; bindings.aliases.len()],
            pending: Vec::new(),
            roots: if complete_roots {
                vec![None; bindings.aliases.len()]
            } else {
                Vec::new()
            },
        }
    }

    fn resolve_all(mut self) -> (Vec<AliasState>, Vec<Option<TsDeclarationId>>) {
        let bindings = self.bindings;
        for alias in bindings.aliases() {
            self.resolve(alias);
        }
        (self.states, self.roots)
    }

    fn declaration(&self, declaration: TsDeclarationId) -> AliasResolution {
        let declaration = self.bindings.canonical_value_declaration(declaration);
        let Some(alias) = self.bindings.declaration_alias(declaration) else {
            return ControlFlow::Continue(Some(TsValueTarget::Binding(declaration)));
        };
        match self.states[alias.index()] {
            AliasState::Pending => ControlFlow::Break(alias),
            AliasState::Resolved(target) => ControlFlow::Continue(Some(target)),
            AliasState::Resolving | AliasState::Unknown => ControlFlow::Continue(None),
        }
    }

    fn resolve(&mut self, alias: TsAliasId) {
        if !matches!(self.states[alias.index()], AliasState::Pending) {
            return;
        }
        let Some((mut frame, mut resolution)) = self.start(alias) else {
            return;
        };

        // Alias dependencies can be much deeper than the AST. Keep suspended
        // paths on the heap and resume their existing member iterators, so a
        // flat input cannot exhaust the call stack or repeat name lookups.
        loop {
            match resolution {
                ControlFlow::Break(dependency) => {
                    if let Some((next_frame, next_resolution)) = self.start(dependency) {
                        self.pending.push(frame);
                        frame = next_frame;
                        resolution = next_resolution;
                    } else {
                        resolution = ControlFlow::Continue(None);
                    }
                }
                ControlFlow::Continue(result) => {
                    if let Some(root) = &mut frame.root {
                        resolution = match self.namespace_root(root) {
                            ControlFlow::Break(dependency) => ControlFlow::Break(dependency),
                            ControlFlow::Continue(root) => {
                                self.roots[frame.alias.index()] = root;
                                frame.root = None;
                                root.map_or(ControlFlow::Continue(None), |root| {
                                    self.declaration(root)
                                })
                            }
                        };
                        continue;
                    }
                    if let Some(target) = result {
                        if let Some(name) = frame.members.next() {
                            resolution = self.member(target, name);
                            continue;
                        }
                    }
                    self.states[frame.alias.index()] = match result {
                        Some(target) => AliasState::Resolved(target),
                        None => AliasState::Unknown,
                    };
                    let Some(parent) = self.pending.pop() else {
                        break;
                    };
                    frame = parent;
                }
            }
        }
    }

    fn start(&mut self, alias: TsAliasId) -> Option<(AliasFrame<'a>, AliasResolution)> {
        self.states[alias.index()] = AliasState::Unknown;
        let declaration = self.bindings.alias(alias);
        if declaration.is_type_only {
            return None;
        }
        let path = declaration.path.as_ref()?;
        let original = self.bindings.declaration_id(&path.root);
        let mut frame = AliasFrame {
            alias,
            members: path.members.as_slice().iter(),
            root: None,
        };
        let resolution = if self.roots.is_empty() {
            let original = original?;
            self.states[alias.index()] = AliasState::Resolving;
            self.declaration(original)
        } else {
            let space = if path.members.as_slice().is_empty() {
                TsReferenceSpace::Any
            } else {
                TsReferenceSpace::Namespace
            };
            let mut root = AliasRoot {
                candidates: NamespaceCandidates::new(
                    self.bindings,
                    &path.root.0,
                    path.root.1,
                    NamespaceAncestors {
                        bindings: self.bindings,
                        next: self.bindings.declarations[declaration.declaration.index()].owner,
                    },
                    space,
                ),
                current: None,
                original,
                space,
            };
            self.states[alias.index()] = AliasState::Resolving;
            match self.namespace_root(&mut root) {
                ControlFlow::Break(dependency) => {
                    // Only a suspended qualifier lookup needs to retain its
                    // candidate cursor alongside the ordinary member frame.
                    frame.root = Some(Box::new(root));
                    ControlFlow::Break(dependency)
                }
                ControlFlow::Continue(root) => {
                    self.roots[alias.index()] = root;
                    root.map_or(ControlFlow::Continue(None), |root| self.declaration(root))
                }
            }
        };
        Some((frame, resolution))
    }

    fn namespace_root(
        &self,
        root: &mut AliasRoot<'a>,
    ) -> ControlFlow<TsAliasId, Option<TsDeclarationId>> {
        loop {
            let Some(declaration) = root.current.or_else(|| root.candidates.next()) else {
                return ControlFlow::Continue(root.original);
            };
            root.current = Some(declaration);
            let source = self.bindings.declarations[declaration.index()]
                .export_target
                .unwrap_or(declaration);
            let eligible = if root.space == TsReferenceSpace::Any {
                true
            } else if let Some(alias) = self.bindings.declaration_alias(source) {
                match self.states[alias.index()] {
                    AliasState::Pending => return ControlFlow::Break(alias),
                    AliasState::Resolved(target) => {
                        self.bindings.target_has_space(target, root.space)
                    }
                    AliasState::Resolving | AliasState::Unknown => true,
                }
            } else {
                self.bindings
                    .target_has_space(TsValueTarget::Binding(source), root.space)
            };
            if eligible {
                return ControlFlow::Continue(Some(declaration));
            }
            root.current = None;
        }
    }

    fn member(&self, target: TsValueTarget, name: &Wtf8Atom) -> AliasResolution {
        let TsValueTarget::Binding(declaration) = target else {
            return ControlFlow::Continue(None);
        };
        let Some(container) = self.bindings.declaration_container(declaration) else {
            return ControlFlow::Continue(None);
        };
        let Some(member_id) = self.bindings.named_member(container, name) else {
            return ControlFlow::Continue(None);
        };
        let member = self.bindings.member(member_id);
        if member.is_enum_member() {
            return ControlFlow::Continue(Some(TsValueTarget::EnumMember(member_id)));
        }
        // A known type terminal differs from an unknown external target:
        // it cannot shadow a lexical value or emit an alias.
        match member.value.or(member.erased) {
            Some(declaration) => self.declaration(declaration),
            None => ControlFlow::Continue(None),
        }
    }
}
