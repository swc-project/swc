use crate::id::Id;
use crate::modules::Modules;
use ahash::RandomState;
use std::collections::HashMap;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

#[derive(Debug, Default)]
pub(crate) struct InlineData {
    ids: HashMap<Id, Id, RandomState>,
}

/// Inline **injected** variables.
pub(crate) fn inline(injected_ctxt: SyntaxContext, module: &mut Modules) {
    log::debug!("Inlining injected variables");

    let mut v = Inliner {
        injected_ctxt,
        data: Default::default(),
    };

    module.visit_with(&mut v);
    module.visit_mut_with(&mut v);
    module.retain_mut(|_, s| match s {
        ModuleItem::Stmt(Stmt::Empty(..)) => false,
        _ => true,
    });
}

#[derive(Debug)]
struct Inliner {
    injected_ctxt: SyntaxContext,
    data: InlineData,
}

impl Inliner {
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

impl Visit for Inliner {
    noop_visit_type!();

    /// Noop
    fn visit_module_decl(&mut self, _: &ModuleDecl, _: &dyn Node) {}

    /// Noop. We don't inline variables declared in subscopes.
    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}

    /// Noop. We don't inline variables declared in subscopes.
    fn visit_block_stmt(&mut self, _: &BlockStmt, _: &dyn Node) {}

    fn visit_var_decl(&mut self, n: &VarDecl, _: &dyn Node) {
        if n.span.ctxt != self.injected_ctxt || n.kind != VarDeclKind::Const {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator, _: &dyn Node) {
        n.visit_children_with(self);
        match (&n.name, n.init.as_deref()) {
            (Pat::Ident(from), Some(Expr::Ident(to))) => {
                self.store(from.id.clone().into(), to.into());
            }
            _ => {}
        }
    }
}

impl VisitMut for Inliner {
    noop_visit_mut_type!();

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

    /// General logic for member expression.s
    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        n.retain(|v| match v {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(i) => {
                let orig = i.clone();
                i.visit_mut_with(self);
                if i.span.ctxt == orig.span.ctxt {
                    return;
                }
                if i.sym != orig.sym {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(orig),
                        value: Box::new(Expr::Ident(i.clone())),
                    });
                    return;
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
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
            }
            _ => {}
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        n.retain(|d| {
            match &d.name {
                Pat::Ident(name) => {
                    if self.data.ids.contains_key(&name.id.clone().into()) {
                        return false;
                    }
                }
                _ => {}
            }

            true
        });

        n.visit_mut_children_with(self);
    }
}
