//! Enum values and runtime requirements share resolved declaration handles.
//! Evaluation borrows immutable definitions; cached facts own literals and
//! handles.

use rustc_hash::FxHashMap;
use swc_atoms::Wtf8Atom;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ts_bindings::{
    transparent_expr, TsBindings, TsContainerId, TsMemberId, TsValueTarget,
};

use super::availability::{Availability, AvailabilityCursor, Initialization, UseSite};

mod bodies;
mod definitions;
use bodies::EnumBodies;
pub(crate) use bodies::EnumBodyCursor;
use definitions::Definitions;

#[derive(Debug, Clone)]
pub(crate) enum EnumValue {
    Number(Number),
    String(Wtf8Atom),
    /// Syntactically a string, but its runtime value is not known.
    StringExpression,
    Unknown,
}

impl EnumValue {
    pub(crate) fn number(value: impl Into<f64>) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value: value.into(),
            raw: None,
        })
    }

    pub(crate) fn is_constant(&self) -> bool {
        matches!(self, Self::Number(_) | Self::String(_))
    }

    pub(crate) fn is_string(&self) -> bool {
        matches!(self, Self::String(_) | Self::StringExpression)
    }

    pub(crate) fn literal(&self) -> Option<Expr> {
        match self {
            Self::Number(number) => Some(Lit::Num(number.clone()).into()),
            Self::String(string) => Some(Lit::Str(string.clone().into()).into()),
            Self::StringExpression | Self::Unknown => None,
        }
    }

    fn increment(&self) -> Self {
        match self {
            Self::Number(number) => Self::number(number.value + 1.0),
            _ => Self::Unknown,
        }
    }
}

#[derive(Debug)]
pub(crate) struct EnumDeclaration {
    pub values: Vec<EnumValue>,
    pub container: TsContainerId,
}

/// Erasure requirements accumulated across every body of a merged enum.
#[derive(Debug)]
pub(super) struct EnumContainer {
    pub is_const: bool,
    pub exported: bool,
    pub all_constant: bool,
    pub runtime_required: bool,
}

#[derive(Debug)]
struct EnumMemberValue {
    value: EnumValue,
    inline: bool,
    initialization: Initialization,
}

/// Facts survive syntax erasure; no initializer AST or evaluator is retained.
#[derive(Debug, Default)]
pub(crate) struct EnumFacts {
    declarations: EnumBodies,
    pub(super) containers: FxHashMap<TsContainerId, EnumContainer>,
    values: FxHashMap<TsMemberId, EnumMemberValue>,
    has_member_aliases: bool,
    availability: Availability,
}

impl EnumFacts {
    pub(super) fn availability_cursor(&self) -> AvailabilityCursor<'_> {
        self.availability.cursor()
    }

    /// Select bodies in declaration order without relying on source locations.
    pub(crate) fn body_cursor(&self) -> EnumBodyCursor<'_> {
        self.declarations.cursor()
    }

    pub(crate) fn can_erase(&self, container: TsContainerId, verbatim: bool) -> bool {
        !verbatim
            && self.containers.get(&container).is_some_and(|facts| {
                facts.is_const && !facts.exported && facts.all_constant && !facts.runtime_required
            })
    }

    /// Module-level import-alias initializers are synthesized after analysis.
    /// They follow ordinary enum-read rules outside enum initializers.
    pub(crate) fn inline_module_value(
        &self,
        bindings: &TsBindings,
        expression: &Expr,
        mutable: bool,
        verbatim: bool,
    ) -> Option<&EnumValue> {
        if verbatim || self.values.is_empty() {
            return None;
        }
        // Only member accesses and aliases to enum members can be replaced.
        // Other expressions still visit their children during transformation.
        match transparent_expr(expression) {
            Expr::Member(_) => {}
            Expr::Ident(_) if self.has_member_aliases => {}
            _ => return None,
        }
        let TsValueTarget::EnumMember(member) = bindings.runtime_expression_target(expression)?
        else {
            return None;
        };
        self.member_value(bindings, member, mutable, None)
    }

    pub(crate) fn member_value(
        &self,
        bindings: &TsBindings,
        member: TsMemberId,
        mutable: bool,
        initializer: Option<UseSite>,
    ) -> Option<&EnumValue> {
        if mutable {
            let owner = bindings.member(member).owner;
            let facts = self.containers.get(&owner)?;
            if !facts.is_const {
                return None;
            }
        }
        let value = self.values.get(&member)?;
        if initializer.is_some_and(|location| {
            !self
                .availability
                .is_available(value.initialization, location)
        }) {
            return None;
        }
        (value.inline && value.value.is_constant()).then_some(&value.value)
    }

    pub(super) fn require_runtime(&mut self, container: TsContainerId) {
        if let Some(facts) = self.containers.get_mut(&container) {
            facts.runtime_required = true;
        }
    }
}

/// Initializer facts follow TypeScript independently of optional read inlining.
pub(super) fn analyze(
    program: &mut Program,
    bindings: &TsBindings,
    unresolved: SyntaxContext,
    flow: bool,
) -> EnumFacts {
    let definitions = Definitions::collect(program, bindings, unresolved);
    let mut evaluator = Evaluator {
        definitions: &definitions,
        constants: vec![ConstantState::Pending; definitions.constants.len()],
        enums: vec![EnumState::Pending; definitions.enums.len()],
        values: definitions
            .enums
            .iter()
            .map(|definition| vec![EnumValue::Unknown; definition.members.len()])
            .collect(),
        flow,
    };
    for index in 0..definitions.enums.len() {
        evaluator.evaluate_enum(index);
    }

    let mut facts = EnumFacts {
        values: FxHashMap::with_capacity_and_hasher(definitions.members.len(), Default::default()),
        has_member_aliases: bindings.aliases().any(|alias| {
            matches!(
                bindings.alias_target(alias),
                Some(TsValueTarget::EnumMember(_))
            )
        }),
        ..Default::default()
    };
    for (definition, values) in definitions.enums.iter().zip(evaluator.values) {
        let all_constant = values.iter().all(EnumValue::is_constant);
        let container = facts
            .containers
            .entry(definition.container)
            .or_insert(EnumContainer {
                is_const: true,
                exported: false,
                all_constant: true,
                runtime_required: false,
            });
        container.is_const &= definition.is_const;
        container.exported |= definition.exported;
        container.all_constant &= all_constant;
        for (member, value) in definition.members.iter().zip(&values) {
            facts.values.insert(
                member.id,
                EnumMemberValue {
                    value: value.clone(),
                    inline: !definition.ambient || definition.is_const,
                    initialization: member.initialization,
                },
            );
        }
        if !definition.ambient {
            // Ambient bodies contribute constant evaluation and container
            // facts, but neither runtime usage nor emission visits their bodies.
            facts.declarations.insert(
                definition.declaration,
                EnumDeclaration {
                    values,
                    container: definition.container,
                },
            );
        }
    }
    facts.availability = definitions.availability;
    facts
}

#[derive(Clone)]
enum ConstantState {
    Pending,
    Evaluating,
    Evaluated(EnumValue),
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum EnumState {
    Pending,
    Evaluating,
    Evaluated,
}

struct Evaluator<'a, 'b> {
    definitions: &'a Definitions<'b>,
    constants: Vec<ConstantState>,
    enums: Vec<EnumState>,
    values: Vec<Vec<EnumValue>>,
    flow: bool,
}

impl Evaluator<'_, '_> {
    fn reference(&mut self, target: TsValueTarget, usage: UseSite) -> EnumValue {
        match target {
            TsValueTarget::Binding(declaration) => {
                let Some(&index) = self.definitions.constants_by_declaration.get(&declaration)
                else {
                    return EnumValue::Unknown;
                };
                let definition = &self.definitions.constants[index];
                // Availability belongs to this use, even after a previous use
                // caused the definition to be memoized.
                if !self
                    .definitions
                    .availability
                    .is_available(definition.initialization, usage)
                {
                    return EnumValue::Unknown;
                }
                match &self.constants[index] {
                    ConstantState::Evaluated(value) => return value.clone(),
                    ConstantState::Evaluating => return EnumValue::Unknown,
                    ConstantState::Pending => {}
                }
                self.constants[index] = ConstantState::Evaluating;
                let value = definition.expression.evaluate(&mut |target| {
                    self.reference(target, definition.initialization.use_site())
                });
                self.constants[index] = ConstantState::Evaluated(value.clone());
                value
            }
            TsValueTarget::EnumMember(member) => {
                let Some(&(index, member_index)) = self.definitions.members.get(&member) else {
                    return EnumValue::Unknown;
                };
                let definition = &self.definitions.enums[index];
                if !self
                    .definitions
                    .availability
                    .is_available(definition.members[member_index].initialization, usage)
                {
                    return EnumValue::Unknown;
                }
                self.evaluate_enum(index);
                self.values[index][member_index].clone()
            }
        }
    }

    fn evaluate_enum(&mut self, index: usize) {
        if self.enums[index] != EnumState::Pending {
            return;
        }
        self.enums[index] = EnumState::Evaluating;
        let definition = &self.definitions.enums[index];
        let mut default = if self.flow {
            EnumValue::Unknown
        } else {
            EnumValue::number(0.0)
        };
        for (member_index, member) in definition.members.iter().enumerate() {
            let value = match &member.expression {
                Some(expression) => expression.evaluate(&mut |target| {
                    self.reference(target, member.initialization.use_site())
                }),
                None if definition.ambient && !definition.is_const => EnumValue::Unknown,
                None => default_member(
                    &default,
                    &self.definitions.bindings.member(member.id).name,
                    self.flow,
                ),
            };
            default = value.increment();
            self.values[index][member_index] = value;
        }
        self.enums[index] = EnumState::Evaluated;
    }
}

pub(super) fn default_member(default: &EnumValue, name: &Wtf8Atom, flow: bool) -> EnumValue {
    if flow && matches!(default, EnumValue::Unknown) {
        EnumValue::String(name.clone())
    } else {
        default.clone()
    }
}
