use super::{analyzer::Analyzer, preserver::idents_to_preserve};
use crate::{marks::Marks, option::MangleOptions, pass::compute_char_freq::CharFreqInfo};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms::hygiene::rename;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

pub(crate) fn name_mangler(
    options: MangleOptions,
    _char_freq_info: CharFreqInfo,
    _marks: Marks,
) -> impl VisitMut {
    Mangler { options }
}

struct Mangler {
    options: MangleOptions,
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        let preserved = idents_to_preserve(self.options.clone(), &*m);

        let map = {
            let mut analyzer = Analyzer {
                scope: Default::default(),
                is_pat_decl: Default::default(),
            };
            m.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);

            analyzer.into_rename_map(&preserved)
        };

        m.visit_mut_with(&mut rename(&map));
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        let preserved = idents_to_preserve(self.options.clone(), &*s);

        let map = {
            let mut analyzer = Analyzer {
                scope: Default::default(),
                is_pat_decl: Default::default(),
            };
            s.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);

            analyzer.into_rename_map(&preserved)
        };

        s.visit_mut_with(&mut rename(&map));
    }
}
