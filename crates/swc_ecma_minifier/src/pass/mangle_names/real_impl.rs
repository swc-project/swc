use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::hygiene::rename;
use swc_ecma_utils::UsageFinder;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};

use super::{analyzer::Analyzer, preserver::idents_to_preserve};
use crate::{marks::Marks, option::MangleOptions, pass::compute_char_freq::CharFreqInfo};

pub(crate) fn name_mangler(
    options: MangleOptions,
    char_freq_info: CharFreqInfo,
    _marks: Marks,
    top_level_ctxt: SyntaxContext,
) -> impl VisitMut {
    Mangler {
        options,
        top_level_ctxt,
        char_freq_info,
    }
}

struct Mangler {
    options: MangleOptions,
    char_freq_info: CharFreqInfo,

    /// Used to check `eval`.
    top_level_ctxt: SyntaxContext,
}

impl Mangler {
    fn contains_eval<N>(&self, node: &N) -> bool
    where
        N: for<'aa> VisitWith<UsageFinder<'aa>>,
    {
        UsageFinder::find(
            &Ident::new("eval".into(), DUMMY_SP.with_ctxt(self.top_level_ctxt)),
            node,
        )
    }
}

impl VisitMut for Mangler {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        if self.contains_eval(m) {
            return;
        }

        let preserved = idents_to_preserve(self.options.clone(), &*m);

        let map = {
            let mut analyzer = Analyzer {
                scope: Default::default(),
                is_pat_decl: Default::default(),
            };
            m.visit_with(&mut analyzer);

            analyzer.into_rename_map(&self.char_freq_info, &preserved)
        };

        m.visit_mut_with(&mut rename(&map));
    }

    fn visit_mut_script(&mut self, s: &mut Script) {
        if self.contains_eval(s) {
            return;
        }

        let preserved = idents_to_preserve(self.options.clone(), &*s);

        let map = {
            let mut analyzer = Analyzer {
                scope: Default::default(),
                is_pat_decl: Default::default(),
            };
            s.visit_with(&mut analyzer);

            analyzer.into_rename_map(&self.char_freq_info, &preserved)
        };

        s.visit_mut_with(&mut rename(&map));
    }
}
