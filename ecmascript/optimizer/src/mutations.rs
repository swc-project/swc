use fxhash::FxHashMap;
use swc_common::Spanned;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[derive(Debug, Default)]
pub(crate) struct Mutations {
    pub(crate) module_items: FxHashMap<SyntaxContext, ModuleItemMut>,
}

impl Mutations {
    pub fn apply(self, to: &mut Module) {}
}

#[derive(Debug, Default)]
pub(crate) struct ModuleItemMut {
    pub drop: bool,
}

#[derive(Debug)]
struct Operator<'a> {
    m: &'a mut Mutations,
}

impl VisitMut for Operator<'_> {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);

        stmts.retain(|stmt| {
            match stmt {
                Stmt::Empty(..) => return false,
                _ => {}
            }
            if let Some(ModuleItemMut { drop }) = self.m.module_items.get(&stmt.span().ctxt) {
                if drop {
                    return false;
                }
            }

            true
        });
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        stmts.retain(|stmt| {
            match stmt {
                ModuleItem::Stmt(Stmt::Empty(..)) => return false,
                _ => {}
            }
            if let Some(ModuleItemMut { drop }) = self.m.module_items.get(&stmt.span().ctxt) {
                if drop {
                    return false;
                }
            }

            true
        });
    }
}
