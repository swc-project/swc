use std::{ops::ControlFlow, slice};

use super::*;

pub(super) fn path(name: &TsEntityName) -> AliasPath {
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
        members: members.into_boxed_slice(),
    }
}

impl TsBindings {
    pub(super) fn resolve_aliases(&mut self) {
        if self.aliases.is_empty() {
            return;
        }
        let resolver = AliasResolver {
            bindings: self,
            states: vec![AliasState::Pending; self.aliases.len()],
            pending: Vec::new(),
        };
        self.alias_states = resolver.resolve_all();
    }
}

type AliasResolution = ControlFlow<TsAliasId, Option<TsValueTarget>>;

struct AliasFrame<'a> {
    alias: TsAliasId,
    members: slice::Iter<'a, Wtf8Atom>,
}

struct AliasResolver<'a> {
    bindings: &'a TsBindings,
    states: Vec<AliasState>,
    pending: Vec<AliasFrame<'a>>,
}

impl<'a> AliasResolver<'a> {
    fn resolve_all(mut self) -> Vec<AliasState> {
        let bindings = self.bindings;
        for alias in bindings.aliases() {
            self.resolve(alias);
        }
        self.states
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
        let root = self.bindings.declaration_id(&path.root)?;
        self.states[alias.index()] = AliasState::Resolving;
        let frame = AliasFrame {
            alias,
            members: path.members.iter(),
        };
        Some((frame, self.declaration(root)))
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
        match member.value.or(member.ty) {
            Some(declaration) => self.declaration(declaration),
            None => ControlFlow::Continue(None),
        }
    }
}
