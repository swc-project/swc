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

        let mut states = vec![AliasState::Pending; self.aliases.len()];
        let mut resolver = AliasResolver {
            bindings: self,
            states: &mut states,
        };
        for alias in self.aliases() {
            resolver.resolve(alias);
        }
        self.alias_states = states;
    }
}

struct AliasResolver<'a> {
    bindings: &'a TsBindings,
    states: &'a mut [AliasState],
}

impl AliasResolver<'_> {
    fn declaration(&mut self, declaration: TsDeclarationId) -> Option<TsValueTarget> {
        let declaration = self.bindings.canonical_value_declaration(declaration);
        match self.bindings.declaration_alias(declaration) {
            Some(alias) => self.resolve(alias),
            None => Some(TsValueTarget::Binding(declaration)),
        }
    }

    fn resolve(&mut self, alias: TsAliasId) -> Option<TsValueTarget> {
        match self.states[alias.index()] {
            AliasState::Resolved(target) => return Some(target),
            AliasState::Resolving | AliasState::Unknown => return None,
            AliasState::Pending => {}
        }

        self.states[alias.index()] = AliasState::Resolving;
        let result = self.resolve_path(self.bindings.alias(alias));
        self.states[alias.index()] = match result {
            Some(target) => AliasState::Resolved(target),
            None => AliasState::Unknown,
        };
        result
    }

    fn resolve_path(&mut self, alias: &TsAlias) -> Option<TsValueTarget> {
        if alias.is_type_only {
            return None;
        }
        let path = alias.path.as_ref()?;
        let root = self.bindings.declaration_id(&path.root)?;
        let mut target = self.declaration(root)?;

        for name in &path.members {
            let TsValueTarget::Binding(declaration) = target else {
                return None;
            };
            let container = self.bindings.declaration_container(declaration)?;
            let member_id = self.bindings.named_member(container, name)?;
            let member = self.bindings.member(member_id);
            if member.is_enum_member() {
                target = TsValueTarget::EnumMember(member_id);
            } else {
                // A known type terminal differs from an unknown external
                // target: it cannot shadow a lexical value or emit an alias.
                target = self.declaration(member.value.or(member.ty)?)?;
            }
        }

        Some(target)
    }
}
