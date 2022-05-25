use swc_ecma_visit::{as_folder, Fold, VisitMut};

use crate::module_decl_strip::ModuleDeclStrip;

pub fn cjs() -> impl Fold + VisitMut {
    as_folder(ModuleDeclStrip::default())
}
