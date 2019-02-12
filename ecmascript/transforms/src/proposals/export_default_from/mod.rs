use crate::{
    pass::Pass,
    util::{
        alias_ident_for, constructor::inject_after_super, prop_name_to_expr_value, undefined,
        ExprFactory, IdentExt,
    },
};
use ast::*;
use std::iter;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn export_default_from() -> impl Pass + Clone {
    ExportDefaultFrom
}

#[derive(Clone)]
struct ExportDefaultFrom;

impl Fold<Vec<ModuleItem>> for ExportDefaultFrom {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len() + 1);    
    }
}
