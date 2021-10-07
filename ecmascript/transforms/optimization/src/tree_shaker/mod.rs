use rustc_hash::FxHashSet;
use swc_common::{pass::Repeated, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
    VisitWith,
};

pub fn tree_shaker(config: Config) -> impl Fold + VisitMut + Repeated {
    as_folder(TreeShaker {
        config,
        changed: false,
        data: Default::default(),
    })
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash)]
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

    fn visit_pat(&mut self, p: &Pat, _: &dyn Node) {
        p.visit_children_with(self);

        match p {
            Pat::Ident(i) => {
                self.data.used_names.insert(i.id.to_id());
            }
            _ => {}
        }
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.data.used_names.insert(i.to_id());
            }
            _ => {}
        }
    }
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
