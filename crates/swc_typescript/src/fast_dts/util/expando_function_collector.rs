use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_ecma_ast::{FnDecl, FnExpr, Id, VarDecl};

use super::ast_ext::PatExt;

pub(crate) struct ExpandoFunctionCollector<'a> {
    declared_function_names: FxHashSet<Atom>,
    used_refs: &'a FxHashSet<Id>,
}

impl<'a> ExpandoFunctionCollector<'a> {
    pub(crate) fn new(used_refs: &'a FxHashSet<Id>) -> Self {
        Self {
            declared_function_names: FxHashSet::default(),
            used_refs,
        }
    }

    pub(crate) fn add_fn_expr(&mut self, fn_expr: &FnExpr) {
        if let Some(ident) = fn_expr.ident.as_ref() {
            self.declared_function_names.insert(ident.sym.clone());
        }
    }

    pub(crate) fn add_fn_decl(&mut self, fn_decl: &FnDecl, check_binding: bool) {
        if !check_binding || self.used_refs.contains(&fn_decl.ident.to_id()) {
            self.declared_function_names
                .insert(fn_decl.ident.sym.clone());
        }
    }

    pub(crate) fn add_var_decl(&mut self, var_decl: &VarDecl, check_binding: bool) {
        for decl in &var_decl.decls {
            if decl
                .name
                .get_type_ann()
                .as_ref()
                .is_some_and(|type_ann| type_ann.type_ann.is_ts_fn_or_constructor_type())
            {
                if let Some(name) = decl.name.as_ident() {
                    if !check_binding || self.used_refs.contains(&name.to_id()) {
                        self.declared_function_names.insert(name.sym.clone());
                    }
                }
            }
        }
    }

    pub(crate) fn contains(&self, name: &Atom) -> bool {
        self.declared_function_names.contains(name)
    }
}
