//! Dead code elimination for types.

use fxhash::FxHashSet;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::Ident;
use swc_ts_checker::ModuleTypeInfo;
use swc_ts_checker::id::Id;

pub fn get_used(info: &ModuleTypeInfo) -> FxHashSet<Id> {
    let mut used = FxHashSet::default();

    for (sym, v) in info.vars.iter() {
        used.insert(sym.clone());
        track(&mut used, v.normalize());
    }

    for (sym, types) in info.types.iter() {
        used.insert(sym.clone());
        for ty in types {
            track(&mut used, ty.normalize());
        }
    }

    used
}

fn track<T>(used: &mut FxHashSet<Id>, node: &T)
where
    T: for<'any> VisitWith<Tracker<'any>>,
{
    let mut v = Tracker { used };
    node.visit_with(&mut v);
}

#[derive(Debug)]
struct Tracker<'a> {
    used: &'a mut FxHashSet<Id>,
}

impl Visit<Id> for Tracker<'_> {
    fn visit(&mut self, node: &Id) {
        self.used.insert(node.clone());
    }
}

impl Visit<Ident> for Tracker<'_> {
    fn visit(&mut self, node: &Ident) {
        self.used.insert(node.into());
    }
}
