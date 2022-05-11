use std::{cell::RefCell, rc::Rc};

use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::{
    AssignExpr, AssignPat, AssignPatProp, ComputedPropName, Expr, Id, Lit, MemberExpr, MemberProp,
    Module, Script, Str, Tpl,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use crate::TSEnumConfig;

pub(crate) type TSEnumLit = Rc<RefCell<AHashMap<Id, AHashMap<JsWord, Lit>>>>;

pub(crate) fn inline_enum(
    ts_enum_lit: TSEnumLit,
    ts_enum_config: TSEnumConfig,
) -> impl Fold + VisitMut {
    as_folder(InlineEnum {
        ts_enum_lit,
        ts_enum_config,
        is_lhs: false,
    })
}

struct InlineEnum {
    ts_enum_lit: TSEnumLit,
    ts_enum_config: TSEnumConfig,

    is_lhs: bool,
}

impl VisitMut for InlineEnum {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, a: &mut AssignExpr) {
        let is_lhs = self.is_lhs;

        self.is_lhs = true;
        a.left.visit_mut_with(self);

        self.is_lhs = false;
        a.right.visit_mut_with(self);

        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat(&mut self, a: &mut AssignPat) {
        let is_lhs = self.is_lhs;

        self.is_lhs = true;
        a.left.visit_mut_with(self);

        self.is_lhs = false;
        a.right.visit_mut_with(self);

        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat_prop(&mut self, a: &mut AssignPatProp) {
        let is_lhs = self.is_lhs;

        self.is_lhs = false;
        a.value.visit_mut_with(self);

        self.is_lhs = is_lhs;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if !self.is_lhs {
            if let Expr::Member(MemberExpr { obj, prop, .. }) = e {
                let lit = Self::get_enum_id(obj).and_then(|id| {
                    let ts_enum_lit = self.ts_enum_lit.borrow();
                    let k_v = ts_enum_lit.get(&id)?;
                    let key = Self::get_member_key(prop)?;
                    let lit = k_v.get(&key)?;
                    Some(lit.clone())
                });

                if let Some(lit) = lit {
                    *e = lit.into();
                    return;
                }
            }
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        if self.skip() || self.ts_enum_lit.borrow().is_empty() {
            return;
        }

        m.visit_mut_children_with(self)
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        if self.skip() || self.ts_enum_lit.borrow().is_empty() {
            return;
        }

        s.visit_mut_children_with(self)
    }
}

impl InlineEnum {
    fn skip(&self) -> bool {
        let Self {
            ts_enum_config:
                TSEnumConfig {
                    treat_const_enum_as_enum,
                    ts_enum_is_readonly,
                },
            ..
        } = self;

        *treat_const_enum_as_enum && !ts_enum_is_readonly
    }

    fn get_enum_id(e: &Expr) -> Option<Id> {
        if let Expr::Ident(ident) = e {
            Some(ident.to_id())
        } else {
            None
        }
    }

    fn get_member_key(prop: &MemberProp) -> Option<JsWord> {
        match prop {
            MemberProp::Ident(ident) => Some(ident.sym.clone()),
            MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
                Expr::Lit(Lit::Str(Str { value, .. })) => Some(value.clone()),
                Expr::Tpl(Tpl { exprs, quasis, .. }) => match (exprs.len(), quasis.len()) {
                    (0, 1) => quasis[0].cooked.as_ref().cloned(),
                    _ => None,
                },
                _ => None,
            },
            MemberProp::PrivateName(_) => None,
        }
    }
}
