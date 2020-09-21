//! Dead code elimination for types.

use fxhash::FxHashSet;
use swc_ts_checker::{Id, ModuleTypeInfo};
use swc_ts_types::TypeNode;

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
    T: for<'any> swc_ts_types::VisitWith<Tracker<'any>>,
{
    let mut v = Tracker { used };
    node.visit_with(&node, &mut v);
}

#[derive(Debug)]
struct Tracker<'a> {
    used: &'a mut FxHashSet<Id>,
}

impl swc_ts_types::Visit for Tracker<'_> {
    fn visit_id(&mut self, node: &Id, _: &dyn TypeNode) {
        self.used.insert(node.clone());
    }
}
