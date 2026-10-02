//! Enum values and runtime requirements share resolved declaration handles.
//! Evaluation borrows immutable definitions; cached values own only literals.

use rustc_hash::FxHashMap;
use swc_atoms::Wtf8Atom;
use swc_common::{Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ts_bindings::{
    transparent_expr, TsBindings, TsContainerId, TsDeclarationId, TsMemberId, TsValueTarget,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::constants::ConstantExpr;

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
    pub initializer: EnumInitializer,
}

/// Constant member reads within an initializer also obey definition order.
#[derive(Debug, Clone, Copy)]
pub(crate) struct EnumInitializer {
    deferred: Option<Span>,
}

#[derive(Debug)]
pub(super) struct EnumContainer {
    pub is_const: bool,
    pub declaration_count: usize,
    pub exported: bool,
    pub all_constant: bool,
    pub runtime_required: bool,
}

#[derive(Debug)]
struct EnumMemberValue {
    value: EnumValue,
    inline: bool,
    span: Span,
}

/// Facts survive syntax erasure; no initializer AST or evaluator is retained.
#[derive(Debug, Default)]
pub(crate) struct EnumFacts {
    declarations: FxHashMap<(Id, Span), EnumDeclaration>,
    pub(super) containers: FxHashMap<TsContainerId, EnumContainer>,
    values: FxHashMap<TsMemberId, EnumMemberValue>,
    has_member_aliases: bool,
}

impl EnumFacts {
    pub(crate) fn declaration(&self, id: &Id, span: Span) -> Option<&EnumDeclaration> {
        self.declarations.get(&(id.clone(), span))
    }

    pub(crate) fn can_erase(&self, container: TsContainerId, verbatim: bool) -> bool {
        !verbatim
            && self.containers.get(&container).is_some_and(|facts| {
                facts.is_const
                    && facts.declaration_count == 1
                    && !facts.exported
                    && facts.all_constant
                    && !facts.runtime_required
            })
    }

    pub(crate) fn inline_value(
        &self,
        bindings: &TsBindings,
        expression: &Expr,
        mutable: bool,
        verbatim: bool,
        initializer: Option<EnumInitializer>,
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
        self.member_value(bindings, member, mutable, expression.span(), initializer)
    }

    pub(crate) fn member_value(
        &self,
        bindings: &TsBindings,
        member: TsMemberId,
        mutable: bool,
        span: Span,
        initializer: Option<EnumInitializer>,
    ) -> Option<&EnumValue> {
        if mutable {
            let owner = bindings.member(member).owner;
            let facts = self.containers.get(&owner)?;
            if !facts.is_const {
                return None;
            }
        }
        let value = self.values.get(&member)?;
        if initializer.is_some_and(|location| !available(value.span, span, location.deferred)) {
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

pub(super) fn analyze(
    program: &Program,
    bindings: &TsBindings,
    unresolved: SyntaxContext,
    mutable: bool,
    flow: bool,
) -> EnumFacts {
    let mut definitions = Definitions {
        bindings,
        unresolved,
        constants: Vec::new(),
        constants_by_declaration: FxHashMap::default(),
        enums: Vec::new(),
        members: FxHashMap::default(),
        deferred: None,
        exported: false,
        ambient: false,
        phase: DefinitionPhase::Enums,
    };
    program.visit_with(&mut definitions);
    let needs_constants = definitions.enums.iter().any(|definition| {
        definition.members.iter().any(|member| {
            member
                .expression
                .as_ref()
                .is_some_and(ConstantExpr::may_reference_const_binding)
        })
    });
    if needs_constants {
        // Enum-only arithmetic has no ordinary binding dependency. Collect
        // const initializers only when a resolved enum expression needs them.
        definitions.phase = DefinitionPhase::Constants;
        program.visit_with(&mut definitions);
    }
    let mut evaluator = Evaluator {
        definitions: &definitions,
        constants: vec![ConstantState::Pending; definitions.constants.len()],
        enums: vec![EnumState::Pending; definitions.enums.len()],
        values: definitions
            .enums
            .iter()
            .map(|definition| vec![EnumValue::Unknown; definition.members.len()])
            .collect(),
        active_const: false,
        mutable,
        flow,
    };
    for index in 0..definitions.enums.len() {
        evaluator.evaluate_enum(index);
    }

    let mut facts = EnumFacts {
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
                declaration_count: 0,
                exported: false,
                all_constant: true,
                runtime_required: false,
            });
        container.is_const &= definition.is_const;
        container.declaration_count += 1;
        container.exported |= definition.exported;
        container.all_constant &= all_constant;
        for (member, value) in definition.members.iter().zip(&values) {
            facts.values.insert(
                member.id,
                EnumMemberValue {
                    value: value.clone(),
                    inline: !definition.ambient || definition.is_const,
                    span: member.span,
                },
            );
        }
        facts.declarations.insert(
            (
                bindings.declaration(definition.declaration).clone(),
                definition.span,
            ),
            EnumDeclaration {
                values,
                container: definition.container,
                initializer: EnumInitializer {
                    deferred: definition.deferred,
                },
            },
        );
    }
    facts
}

#[derive(Debug)]
struct ConstantDefinition {
    span: Span,
    expression: ConstantExpr,
}

#[derive(Debug)]
struct EnumMemberDefinition {
    id: TsMemberId,
    span: Span,
    expression: Option<ConstantExpr>,
}

#[derive(Debug)]
struct EnumDefinition {
    declaration: TsDeclarationId,
    container: TsContainerId,
    span: Span,
    is_const: bool,
    ambient: bool,
    exported: bool,
    deferred: Option<Span>,
    members: Vec<EnumMemberDefinition>,
}

enum DefinitionPhase {
    Enums,
    Constants,
}

struct Definitions<'a> {
    bindings: &'a TsBindings,
    unresolved: SyntaxContext,
    constants: Vec<ConstantDefinition>,
    constants_by_declaration: FxHashMap<TsDeclarationId, usize>,
    enums: Vec<EnumDefinition>,
    members: FxHashMap<TsMemberId, (usize, usize)>,
    deferred: Option<Span>,
    exported: bool,
    ambient: bool,
    phase: DefinitionPhase,
}

impl Definitions<'_> {
    fn expression(&self, expression: &Expr, owner: Option<TsContainerId>) -> ConstantExpr {
        ConstantExpr::collect(
            expression,
            self.bindings,
            owner,
            self.unresolved,
            self.deferred,
        )
    }

    fn deferred<N: VisitWith<Self>>(&mut self, node: &N, region: Span) {
        let previous = self.deferred.replace(region);
        node.visit_children_with(self);
        self.deferred = previous;
    }
}

impl Visit for Definitions<'_> {
    noop_visit_type!();

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        let previous = std::mem::replace(&mut self.exported, true);
        node.decl.visit_with(self);
        self.exported = previous;
    }

    fn visit_ts_module_decl(&mut self, node: &TsModuleDecl) {
        let exported = std::mem::take(&mut self.exported);
        let previous = self.ambient;
        self.ambient |= node.declare || node.global || matches!(node.id, TsModuleName::Str(_));
        node.body.visit_with(self);
        self.ambient = previous;
        self.exported = exported;
    }

    fn visit_var_decl(&mut self, node: &VarDecl) {
        let exported = std::mem::take(&mut self.exported);
        for declaration in &node.decls {
            if matches!(self.phase, DefinitionPhase::Constants) && node.kind == VarDeclKind::Const {
                if let (Pat::Ident(BindingIdent { id, type_ann: None }), Some(init)) =
                    (&declaration.name, &declaration.init)
                {
                    if let Some(id) = self.bindings.declaration_id(&id.to_id()) {
                        let expression = self.expression(init, None);
                        let index = self.constants.len();
                        self.constants.push(ConstantDefinition {
                            span: declaration.span,
                            expression,
                        });
                        self.constants_by_declaration.insert(id, index);
                    }
                }
            }
            declaration.visit_with(self);
        }
        self.exported = exported;
    }

    fn visit_ts_enum_decl(&mut self, node: &TsEnumDecl) {
        if matches!(self.phase, DefinitionPhase::Constants) {
            node.members.visit_with(self);
            return;
        }
        let exported = std::mem::take(&mut self.exported);
        let Some(declaration) = self.bindings.declaration_id(&node.id.to_id()) else {
            return;
        };
        let Some(container) = self.bindings.declaration_container(declaration) else {
            return;
        };
        let index = self.enums.len();
        let mut members = Vec::with_capacity(node.members.len());
        for member in &node.members {
            let name = crate::shared::enum_member_name(&member.id);
            let Some(id) = self.bindings.named_member(container, &name) else {
                continue;
            };
            self.members.entry(id).or_insert((index, members.len()));
            let expression = member
                .init
                .as_deref()
                .map(|init| self.expression(init, Some(container)));
            members.push(EnumMemberDefinition {
                id,
                span: member.span,
                expression,
            });
        }
        self.enums.push(EnumDefinition {
            declaration,
            container,
            span: node.span,
            is_const: node.is_const,
            ambient: self.ambient || node.declare,
            exported,
            deferred: self.deferred,
            members,
        });
        node.members.visit_with(self);
        self.exported = exported;
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        let exported = std::mem::take(&mut self.exported);
        node.function.visit_with(self);
        self.exported = exported;
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        let exported = std::mem::take(&mut self.exported);
        node.class.visit_with(self);
        self.exported = exported;
    }

    fn visit_function(&mut self, node: &Function) {
        self.deferred(node, node.span);
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        self.deferred(node, node.span);
    }

    fn visit_constructor(&mut self, node: &Constructor) {
        self.deferred(node, node.span);
    }

    fn visit_class_method(&mut self, node: &ClassMethod) {
        // Method names participate in the method's semantic deferred region,
        // as do parameters and the body. Ordinary computed properties do not.
        let previous = self.deferred.replace(node.span);
        node.key.visit_with(self);
        node.function.visit_children_with(self);
        self.deferred = previous;
    }

    fn visit_private_method(&mut self, node: &PrivateMethod) {
        self.deferred(node, node.span);
    }

    fn visit_method_prop(&mut self, node: &MethodProp) {
        let previous = self.deferred.replace(node.span());
        node.key.visit_with(self);
        node.function.visit_children_with(self);
        self.deferred = previous;
    }

    fn visit_getter_prop(&mut self, node: &GetterProp) {
        let previous = self.deferred.replace(node.span);
        node.key.visit_with(self);
        node.function.visit_children_with(self);
        self.deferred = previous;
    }

    fn visit_setter_prop(&mut self, node: &SetterProp) {
        let previous = self.deferred.replace(node.span);
        node.key.visit_with(self);
        node.function.visit_children_with(self);
        self.deferred = previous;
    }

    fn visit_auto_accessor(&mut self, node: &AutoAccessor) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        if node.is_static {
            node.value.visit_with(self);
        } else if let Some(value) = &node.value {
            let previous = self.deferred.replace(value.span());
            value.visit_with(self);
            self.deferred = previous;
        }
    }

    fn visit_class_prop(&mut self, node: &ClassProp) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        if node.is_static {
            node.value.visit_with(self);
        } else if let Some(value) = &node.value {
            let previous = self.deferred.replace(value.span());
            value.visit_with(self);
            self.deferred = previous;
        }
    }

    fn visit_private_prop(&mut self, node: &PrivateProp) {
        node.decorators.visit_with(self);
        if node.is_static {
            node.value.visit_with(self);
        } else if let Some(value) = &node.value {
            let previous = self.deferred.replace(value.span());
            value.visit_with(self);
            self.deferred = previous;
        }
    }

    fn visit_call_expr(&mut self, node: &CallExpr) {
        // A direct function IIFE executes in the surrounding initialization
        // region. Nested functions inside it still introduce their own region.
        if let Callee::Expr(callee) = &node.callee {
            match transparent_expr(callee) {
                Expr::Fn(function) => function.function.visit_children_with(self),
                Expr::Arrow(arrow) => arrow.visit_children_with(self),
                _ => callee.visit_with(self),
            }
        } else {
            node.callee.visit_with(self);
        }
        node.args.visit_with(self);
    }
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
    active_const: bool,
    mutable: bool,
    flow: bool,
}

impl Evaluator<'_, '_> {
    fn reference(
        &mut self,
        target: TsValueTarget,
        use_span: Span,
        deferred: Option<Span>,
    ) -> EnumValue {
        match target {
            TsValueTarget::Binding(declaration) => {
                let Some(&index) = self.definitions.constants_by_declaration.get(&declaration)
                else {
                    return EnumValue::Unknown;
                };
                let definition = &self.definitions.constants[index];
                // Availability belongs to this use, even after a previous use
                // caused the definition to be memoized.
                if !available(definition.span, use_span, deferred) {
                    return EnumValue::Unknown;
                }
                match &self.constants[index] {
                    ConstantState::Evaluated(value) => return value.clone(),
                    ConstantState::Evaluating => return EnumValue::Unknown,
                    ConstantState::Pending => {}
                }
                self.constants[index] = ConstantState::Evaluating;
                let previous = std::mem::replace(&mut self.active_const, true);
                let value = definition
                    .expression
                    .evaluate(&mut |target, span, region| self.reference(target, span, region));
                self.active_const = previous;
                self.constants[index] = ConstantState::Evaluated(value.clone());
                value
            }
            TsValueTarget::EnumMember(member) => {
                let Some(&(index, member_index)) = self.definitions.members.get(&member) else {
                    return EnumValue::Unknown;
                };
                let definition = &self.definitions.enums[index];
                if !available(definition.members[member_index].span, use_span, deferred) {
                    return EnumValue::Unknown;
                }
                if self.mutable && !definition.is_const && (self.active_const || definition.ambient)
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
        let previous = std::mem::replace(&mut self.active_const, false);
        let definition = &self.definitions.enums[index];
        let mut default = if self.flow {
            EnumValue::Unknown
        } else {
            EnumValue::number(0.0)
        };
        for (member_index, member) in definition.members.iter().enumerate() {
            let value = match &member.expression {
                Some(expression) => expression
                    .evaluate(&mut |target, span, region| self.reference(target, span, region)),
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
        self.active_const = previous;
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

fn available(definition: Span, use_span: Span, deferred: Option<Span>) -> bool {
    definition.lo < use_span.lo
        || deferred.is_some_and(|region| definition.lo < region.lo || definition.hi > region.hi)
}
