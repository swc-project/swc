// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

//! Apply the React Compiler's binding renames to identifiers in uncompiled
//! sibling code. Compiled functions already carry the renamed identifiers.

use react_compiler::entrypoint::compile_result::BindingRenameInfo;
use react_compiler_ast::scope::{BindingId, ScopeInfo};
use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_ecma_ast as swc;
use swc_ecma_ast::Program;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// Map each `span.lo` of a renamed-binding reference to its new name.
pub fn build_rename_plan(
    scope_info: &ScopeInfo,
    renames: &[BindingRenameInfo],
) -> FxHashMap<u32, String> {
    if renames.is_empty() {
        return FxHashMap::default();
    }

    let renames_by_declaration: FxHashMap<u32, &BindingRenameInfo> = renames
        .iter()
        .map(|rename| (rename.declaration_start, rename))
        .collect();

    let mut renamed_bindings: FxHashMap<BindingId, String> = FxHashMap::default();
    for binding in &scope_info.bindings {
        let Some(rename) = binding
            .declaration_start
            .and_then(|start| renames_by_declaration.get(&start))
        else {
            continue;
        };
        if binding.name == rename.original {
            renamed_bindings.insert(binding.id, rename.renamed.clone());
        }
    }

    if renamed_bindings.is_empty() {
        return FxHashMap::default();
    }

    scope_info
        .ref_node_id_to_binding
        .iter()
        .filter_map(|(&position, binding_id)| {
            renamed_bindings
                .get(binding_id)
                .map(|renamed| (position, renamed.clone()))
        })
        .collect()
}

/// Walk the program and apply `rename_plan`, expanding shorthand properties
/// when the value is renamed.
pub fn apply_renames(program: &mut Program, rename_plan: &FxHashMap<u32, String>) {
    if rename_plan.is_empty() {
        return;
    }
    program.visit_mut_with(&mut RenameApplyVisitor { rename_plan });
}

struct RenameApplyVisitor<'p> {
    rename_plan: &'p FxHashMap<u32, String>,
}

impl RenameApplyVisitor<'_> {
    fn renamed_at(&self, position: u32) -> Option<&str> {
        self.rename_plan
            .get(&position)
            .map(std::string::String::as_str)
    }

    fn rename_ident(&self, ident: &mut swc::Ident) -> bool {
        let Some(renamed) = self.renamed_at(ident.span.lo.0) else {
            return false;
        };

        ident.sym = Atom::from(renamed);
        true
    }
}

impl VisitMut for RenameApplyVisitor<'_> {
    fn visit_mut_ident(&mut self, ident: &mut swc::Ident) {
        self.rename_ident(ident);
    }

    /// Rename the object of a member expression, never a static property name.
    fn visit_mut_member_expr(&mut self, member: &mut swc::MemberExpr) {
        member.obj.visit_mut_with(self);
        if let swc::MemberProp::Computed(computed) = &mut member.prop {
            computed.visit_mut_with(self);
        }
    }

    /// Rename the JSX member object, never a static property name.
    fn visit_mut_jsx_member_expr(&mut self, member: &mut swc::JSXMemberExpr) {
        member.obj.visit_mut_with(self);
    }

    /// Preserve the imported name when a named import's local binding changes.
    fn visit_mut_import_named_specifier(&mut self, specifier: &mut swc::ImportNamedSpecifier) {
        if specifier.imported.is_none() {
            let imported = swc::ModuleExportName::Ident(specifier.local.clone());
            if self.rename_ident(&mut specifier.local) {
                specifier.imported = Some(imported);
            }
            return;
        }

        self.rename_ident(&mut specifier.local);
    }

    /// Preserve the exported name when a local named export binding changes.
    fn visit_mut_export_named_specifier(&mut self, specifier: &mut swc::ExportNamedSpecifier) {
        if specifier.exported.is_some() {
            if let swc::ModuleExportName::Ident(orig) = &mut specifier.orig {
                self.rename_ident(orig);
            }
            return;
        }

        if let swc::ModuleExportName::Ident(orig) = &mut specifier.orig {
            let exported = swc::ModuleExportName::Ident(orig.clone());
            if self.rename_ident(orig) {
                specifier.exported = Some(exported);
            }
        }
    }

    /// Expand a renamed shorthand object property `{x}` into `{x: x_0}`.
    fn visit_mut_prop(&mut self, prop: &mut swc::Prop) {
        match prop {
            swc::Prop::Shorthand(ident) => {
                if let Some(renamed) = self.renamed_at(ident.span.lo.0) {
                    let key = swc::PropName::Ident(swc::IdentName::from(ident.clone()));
                    let mut value = ident.clone();
                    value.sym = Atom::from(renamed);
                    *prop = swc::Prop::KeyValue(swc::KeyValueProp {
                        key,
                        value: Box::new(swc::Expr::Ident(value)),
                    });
                }
            }
            swc::Prop::Assign(assign) => {
                assign.value.visit_mut_with(self);
            }
            _ => prop.visit_mut_children_with(self),
        }
    }

    /// Expand a renamed shorthand binding property `{x}` into `{x: x_0}`.
    fn visit_mut_object_pat_prop(&mut self, prop: &mut swc::ObjectPatProp) {
        match prop {
            swc::ObjectPatProp::Assign(assign) => {
                assign.value.visit_mut_with(self);

                if let Some(renamed) = self.renamed_at(assign.key.id.span.lo.0) {
                    let mut binding = assign.key.clone();
                    binding.id.sym = Atom::from(renamed);
                    let value = match assign.value.take() {
                        Some(default_value) => swc::Pat::Assign(swc::AssignPat {
                            span: assign.span,
                            left: Box::new(swc::Pat::Ident(binding)),
                            right: default_value,
                        }),
                        None => swc::Pat::Ident(binding),
                    };

                    let key = swc::PropName::Ident(swc::IdentName::from(assign.key.id.clone()));
                    *prop = swc::ObjectPatProp::KeyValue(swc::KeyValuePatProp {
                        key,
                        value: Box::new(value),
                    });
                }
            }
            _ => prop.visit_mut_children_with(self),
        }
    }
}
