//! Collect immutable definitions and their shared AST initialization
//! coordinates.

use rustc_hash::FxHashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    stack_size::maybe_grow_default,
    ts_bindings::{TsBindings, TsContainerId, TsDeclarationId, TsMemberId},
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::super::{
    availability::{visit_execution_regions, Availability, AvailabilityBuilder, Initialization},
    constants::ConstantExpr,
};

#[derive(Debug)]
pub(super) struct ConstantDefinition {
    pub(super) initialization: Initialization,
    pub(super) expression: ConstantExpr,
}

#[derive(Debug)]
pub(super) struct EnumMemberDefinition {
    pub(super) id: TsMemberId,
    pub(super) initialization: Initialization,
    pub(super) expression: Option<ConstantExpr>,
}

#[derive(Debug)]
pub(super) struct EnumDefinition {
    pub(super) declaration: TsDeclarationId,
    pub(super) container: TsContainerId,
    pub(super) is_const: bool,
    pub(super) ambient: bool,
    pub(super) exported: bool,
    pub(super) members: Vec<EnumMemberDefinition>,
}

pub(super) struct Definitions<'a> {
    pub(super) bindings: &'a TsBindings,
    pub(super) constants: Vec<ConstantDefinition>,
    pub(super) constants_by_declaration: FxHashMap<TsDeclarationId, usize>,
    pub(super) enums: Vec<EnumDefinition>,
    pub(super) members: FxHashMap<TsMemberId, (usize, usize)>,
    pub(super) availability: Availability,
}

impl<'a> Definitions<'a> {
    pub(super) fn collect(
        program: &mut Program,
        bindings: &'a TsBindings,
        unresolved: SyntaxContext,
    ) -> Self {
        let mut collector = DefinitionCollector {
            definitions: Self {
                bindings,
                constants: Vec::new(),
                constants_by_declaration: FxHashMap::default(),
                enums: Vec::new(),
                members: FxHashMap::default(),
                availability: Availability::default(),
            },
            unresolved,
            order: AvailabilityBuilder::default(),
            exported: false,
            ambient: false,
            constant: false,
        };
        // This walk does not mutate syntax. Sharing the mutable execution-region
        // visitor with substitution keeps both walks on exactly the same model.
        program.visit_mut_with(&mut collector);
        collector.definitions.availability = collector.order.finish();
        collector.definitions
    }
}

struct DefinitionCollector<'a> {
    definitions: Definitions<'a>,
    unresolved: SyntaxContext,
    order: AvailabilityBuilder,
    exported: bool,
    ambient: bool,
    constant: bool,
}

impl DefinitionCollector<'_> {
    fn expression(&self, expression: &Expr, owner: Option<TsContainerId>) -> ConstantExpr {
        ConstantExpr::collect(
            expression,
            self.definitions.bindings,
            owner,
            self.unresolved,
        )
    }

    fn collect_constant(&mut self, node: &VarDeclarator, initialization: Initialization) {
        if !self.constant {
            return;
        }
        let (Pat::Ident(BindingIdent { id, type_ann: None }), Some(init)) =
            (&node.name, &node.init)
        else {
            return;
        };
        let expression = self.expression(init, None);
        // Unsupported initializers are already unknown to evaluation;
        // they need no definition entry or declaration lookup.
        if matches!(expression, ConstantExpr::Unknown) {
            return;
        }
        let Some(id) = self.definitions.bindings.ident_declaration(id) else {
            return;
        };
        let index = self.definitions.constants.len();
        self.definitions.constants.push(ConstantDefinition {
            initialization,
            expression,
        });
        self.definitions.constants_by_declaration.insert(id, index);
    }

    fn deferred(&mut self, visit: impl FnOnce(&mut Self)) {
        let region = self.order.enter_deferred();
        visit(self);
        self.order.exit_deferred(region);
    }
}

impl VisitMut for DefinitionCollector<'_> {
    noop_visit_mut_type!();

    visit_execution_regions!();

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        maybe_grow_default(|| node.visit_mut_children_with(self));
    }

    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        let previous = std::mem::replace(&mut self.exported, true);
        node.decl.visit_mut_with(self);
        self.exported = previous;
    }

    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        let exported = std::mem::take(&mut self.exported);
        let previous = self.ambient;
        self.ambient |= node.declare || node.global || matches!(node.id, TsModuleName::Str(_));
        node.body.visit_mut_with(self);
        self.ambient = previous;
        self.exported = exported;
    }

    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        let exported = std::mem::take(&mut self.exported);
        let constant = std::mem::replace(&mut self.constant, node.kind == VarDeclKind::Const);
        node.decls.visit_mut_with(self);
        self.constant = constant;
        self.exported = exported;
    }

    fn visit_mut_using_decl(&mut self, node: &mut UsingDecl) {
        let constant = std::mem::replace(&mut self.constant, false);
        node.visit_mut_children_with(self);
        self.constant = constant;
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        let initialization = self.order.initialization();
        self.collect_constant(node, initialization);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_ts_enum_decl(&mut self, node: &mut TsEnumDecl) {
        let Some(declaration) = self.definitions.bindings.ident_declaration(&node.id) else {
            node.members.visit_mut_with(self);
            return;
        };
        let Some(container) = self.definitions.bindings.declaration_container(declaration) else {
            node.members.visit_mut_with(self);
            return;
        };
        let exported = std::mem::take(&mut self.exported);
        let index = self.definitions.enums.len();
        // Reserve the body before descending into initializers. Nested enums
        // keep their own identities without moving later outer members ahead
        // of the declarations in an earlier initializer.
        self.definitions.enums.push(EnumDefinition {
            declaration,
            container,
            is_const: node.is_const,
            ambient: self.ambient || node.declare,
            exported,
            members: Vec::new(),
        });
        let mut members = Vec::with_capacity(node.members.len());
        for member in &mut node.members {
            let initialization = self.order.initialization();
            let name = crate::shared::enum_member_name(&member.id);
            if let Some(id) = self.definitions.bindings.named_member(container, &name) {
                self.definitions
                    .members
                    .entry(id)
                    .or_insert((index, members.len()));
                let expression = member
                    .init
                    .as_deref()
                    .map(|init| self.expression(init, Some(container)));
                members.push(EnumMemberDefinition {
                    id,
                    initialization,
                    expression,
                });
            }
            member.visit_mut_children_with(self);
        }
        self.definitions.enums[index].members = members;
        self.exported = exported;
    }

    fn visit_mut_ts_enum_member(&mut self, node: &mut TsEnumMember) {
        self.order.initialization();
        node.visit_mut_children_with(self);
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        let exported = std::mem::take(&mut self.exported);
        node.function.visit_mut_with(self);
        self.exported = exported;
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        let exported = std::mem::take(&mut self.exported);
        node.class.visit_mut_with(self);
        self.exported = exported;
    }
}
