use rustc_hash::FxHashSet;
use swc_common::{pass::Repeated, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

pub fn tree_shaker(config: Config) -> impl Fold + VisitMut + Repeated {
    as_folder(TreeShaker {
        config,
        changed: false,
        data: Default::default(),
    })
}

pub struct Config {
    /// If this [Mark] is applied to a function expression, it's treated as a
    /// separate module.
    pub module_mark: Option<Mark>,
}

struct TreeShaker {
    config: Config,
    changed: bool,
    data: Data,
}

#[derive(Default)]
struct Data {
    used_names: FxHashSet<Id>,
}

struct Analyzer<'a> {
    config: &'a Config,
    data: &'a mut Data,
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();
}

impl Repeated for TreeShaker {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
        self.data = Default::default();
    }
}

impl VisitMut for TreeShaker {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, m: &mut Module) {
        {
            let mut analyzer = Analyzer {
                config: &self.config,
                data: &mut self.data,
            };
            m.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
        }

        m.visit_mut_children_with(self);
    }
}
