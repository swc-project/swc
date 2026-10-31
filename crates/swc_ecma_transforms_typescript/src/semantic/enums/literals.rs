//! Reference-free enums need neither constant dependencies nor order replay.
//! Collect them in the existing declaration walk; any unsupported initializer
//! selects the complete definition collector for the entire file instead.

use swc_atoms::Wtf8Atom;
use swc_ecma_ast::{Id, TsEnumDecl};
use swc_ecma_utils::ts_bindings::TsBindings;

use super::{
    default_member, EnumContainer, EnumDeclaration, EnumFacts, EnumMemberValue, EnumValue,
};
use crate::{semantic::constants::ConstantExpr, shared::enum_member_name};

struct LiteralEnum {
    id: Id,
    is_const: bool,
    exported: bool,
    members: Vec<(Wtf8Atom, EnumValue)>,
}

pub(in crate::semantic) struct LiteralEnums {
    declarations: Option<Vec<LiteralEnum>>,
    flow: bool,
}

impl Default for LiteralEnums {
    fn default() -> Self {
        Self::new(false)
    }
}

impl LiteralEnums {
    pub(in crate::semantic) fn new(flow: bool) -> Self {
        Self {
            declarations: Some(Vec::new()),
            flow,
        }
    }

    pub(in crate::semantic) fn collect(
        &mut self,
        node: &TsEnumDecl,
        ambient: bool,
        exported: bool,
    ) {
        let Some(declarations) = &mut self.declarations else {
            return;
        };
        if ambient {
            self.declarations = None;
            return;
        }
        let mut next = if self.flow {
            EnumValue::Unknown
        } else {
            EnumValue::number(0.0)
        };
        let mut members = Vec::with_capacity(node.members.len());
        for member in &node.members {
            let name = enum_member_name(&member.id);
            let value = match &member.init {
                Some(expression) => ConstantExpr::literal(expression),
                None => default_member(&next, &name, self.flow),
            };
            if !value.is_constant() {
                self.declarations = None;
                return;
            }
            next = value.increment();
            members.push((name, value));
        }
        declarations.push(LiteralEnum {
            id: node.id.to_id(),
            is_const: node.is_const,
            exported,
            members,
        });
    }

    pub(in crate::semantic) fn finish(self, bindings: &TsBindings) -> Option<EnumFacts> {
        let declarations = self.declarations?;
        let mut facts = EnumFacts::default();
        for declaration in declarations {
            let id = bindings.declaration_id(&declaration.id)?;
            let container = bindings.declaration_container(id)?;
            let owner = facts.containers.entry(container).or_insert(EnumContainer {
                is_const: true,
                exported: false,
                all_constant: true,
                runtime_required: false,
            });
            owner.is_const &= declaration.is_const;
            owner.exported |= declaration.exported;
            let mut values = Vec::with_capacity(declaration.members.len());
            for (name, value) in declaration.members {
                let member = bindings.named_member(container, &name)?;
                facts.values.insert(
                    member,
                    EnumMemberValue {
                        value: value.clone(),
                        inline: true,
                        initialization: None,
                    },
                );
                values.push(value);
            }
            facts
                .declarations
                .insert(id, EnumDeclaration { values, container });
        }
        facts.has_member_aliases = bindings.aliases().any(|alias| {
            matches!(
                bindings.alias_target(alias),
                Some(super::TsValueTarget::EnumMember(_))
            )
        });
        Some(facts)
    }
}
