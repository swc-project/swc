use std::mem;

use swc_ecma_ast::{AssignPatProp, Pat};
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub(crate) struct FormalParameterBindingPattern;

impl FormalParameterBindingPattern {
    pub(crate) fn remove_assignments_from_pat(pat: &mut Pat) {
        pat.visit_mut_with(&mut FormalParameterBindingPattern);
    }
}

impl VisitMut for FormalParameterBindingPattern {
    fn visit_mut_assign_pat_prop(&mut self, prop: &mut AssignPatProp) {
        prop.value = None;
    }

    fn visit_mut_pat(&mut self, pat: &mut Pat) {
        if let Pat::Assign(..) = pat {
            let Pat::Assign(assign_pat) = mem::take(pat) else {
                unreachable!()
            };
            *pat = *assign_pat.left;
            self.visit_mut_pat(pat);
            return;
        }

        pat.visit_mut_children_with(self);
    }
}
