//! Dead code elimination for types.

use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::Ident;
use swc_ts_checker::ModuleTypeInfo;

pub fn get_used(info: &ModuleTypeInfo) -> FxHashSet<JsWord> {
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

fn track<T>(used: &mut FxHashSet<JsWord>, node: &T)
where
    T: for<'any> VisitWith<Tracker<'any>>,
{
    let mut v = Tracker { used };
    node.visit_with(&mut v);
}

#[derive(Debug)]
struct Tracker<'a> {
    used: &'a mut FxHashSet<JsWord>,
}

impl Visit<JsWord> for Tracker<'_> {
    fn visit(&mut self, node: &JsWord) {
        self.used.insert(node.clone());
    }
}

impl Visit<Ident> for Tracker<'_> {
    fn visit(&mut self, node: &Ident) {
        self.used.insert(node.sym.clone());
    }
}
