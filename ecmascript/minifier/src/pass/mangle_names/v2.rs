use super::analyzer::Analyzer;
use crate::{marks::Marks, option::MangleOptions, pass::compute_char_freq::CharFreqInfo};
use swc_common::{collections::AHashMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::hygiene::rename;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

pub(crate) fn name_mangler(
    options: MangleOptions,
    _char_freq_info: CharFreqInfo,
    _marks: Marks,
) -> impl VisitMut {
    Mangler::default()
}

#[derive(Default)]
struct Mangler {}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        let map = {
            let mut analyzer = Analyzer {
                scope: Default::default(),
                is_pat_decl: Default::default(),
            };
            m.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);

            analyzer.into_rename_map()
        };

        m.visit_mut_with(rename(&map));
    }
}
