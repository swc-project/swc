use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_obj_and_computed, Visit, VisitMut,
    VisitMutWith, VisitWith,
};

use crate::{id::Id, modules::Modules, util::Readonly};

#[derive(Debug, Default)]
pub(crate) struct InlineData {
    ids: AHashMap<Id, Id>,
}

/// Inline **injected** variables.
pub(crate) fn inline(injected_ctxt: SyntaxContext, module: &mut Modules) {
    tracing::debug!("Inlining injected variables");

    let mut data = Default::default();

    {
        let mut analyzer = Analyzer {
            injected_ctxt,
            data: &mut data,
        };

        module.visit_with(&mut analyzer);
    }

    let mut v = Inliner { data: data.into() };
    module.par_visit_mut_with(&mut v);
    module.retain_mut(|_, s| !matches!(s, ModuleItem::Stmt(Stmt::Empty(..))));
}

#[derive(Debug)]
#[cfg_attr(feature = "concurrent", derive(Clone))]
struct Inliner {
    data: Readonly<InlineData>,
}

struct Analyzer<'a> {
    injected_ctxt: SyntaxContext,
    data: &'a mut InlineData,
}

impl Analyzer<'_> {
    fn store(&mut self, from: Id, to: Id) {
        if let Some(prev) = self.data.ids.insert(from.clone(), to.clone()) {
            unreachable!(
                "Multiple identifiers equivalent up to span hygiene found: {:#?}\nFirst = \
                 {:#?}\nSecond = {:#?}",
                from, prev, to
            )
        }
    }
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    /// Noop
    fn visit_module_decl(&mut self, _: &ModuleDecl) {}

    /// Noop. We don't inline variables declared in subscopes.
    fn visit_function(&mut self, _: &Function) {}

    /// Noop. We don't inline variables declared in subscopes.
    fn visit_block_stmt(&mut self, _: &BlockStmt) {}

    fn visit_var_decl(&mut self, n: &VarDecl) {
        if n.ctxt != self.injected_ctxt || n.kind != VarDeclKind::Const {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        n.visit_children_with(self);
        if let (Pat::Ident(from), Some(Expr::Ident(to))) = (&n.name, n.init.as_deref()) {
            self.store(from.id.clone().into(), to.into());
        }
    }
}

impl VisitMut for Inliner {
    noop_visit_mut_type!(fail);

    visit_mut_obj_and_computed!();

    /// Don't modify exported ident.
    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if n.exported.is_none() {
            n.exported = Some(n.orig.clone());
        }

        n.orig.visit_mut_with(self);
    }

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if let Some(mapped) = self.data.ids.get(&n.clone().into()).cloned() {
            *n = mapped.into();
            n.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        n.retain(|v| !matches!(v, ModuleItem::Stmt(Stmt::Empty(..))));
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(i) => {
                let orig = i.clone();
                i.visit_mut_with(self);
                if i.ctxt == orig.ctxt {
                    return;
                }
                if i.sym != orig.sym {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(orig.into()),
                        value: i.clone().into(),
                    });
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Ident(_) => {}
            PropName::Str(_) => {}
            PropName::Num(_) => {}
            PropName::Computed(e) => {
                e.expr.visit_mut_with(self);
            }
            PropName::BigInt(_) => {}
        }
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        n.visit_mut_children_with(self);

        match n {
            Stmt::Decl(Decl::Var(var)) if var.decls.is_empty() => {
                *n = EmptyStmt { span: DUMMY_SP }.into();
            }
            _ => {}
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        n.retain(|d| {
            if let Pat::Ident(name) = &d.name {
                if self.data.ids.contains_key(&name.id.clone().into()) {
                    return false;
                }
            }

            true
        });

        n.visit_mut_children_with(self);
    }
}
