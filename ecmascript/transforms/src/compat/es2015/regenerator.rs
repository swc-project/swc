use crate::{
    pass::Pass,
    util::{ModuleItemLike, StmtLike},
};
use ast::*;
use swc_common::{Fold, FoldWith, Visit, VisitWith};

pub fn regenerator() -> impl Pass {
    Regenerator::default()
}

#[derive(Debug, Default)]
struct Regenerator {
    used: bool,
}

impl<T> Fold<Vec<T>> for Regenerator
where
    T: FoldWith<Self> + StmtLike + ModuleItemLike + VisitWith<Finder>,
{
    fn fold(&mut self, items: Vec<T>) -> Vec<T> {
        {
            let mut v = Finder { found: false };
            items.visit_with(&mut v);
            if !v.found {
                return items;
            }
        }

        let mut buf = Vec::with_capacity(items.len() + 4);
    }
}

/// Finds a generator function
struct Finder {
    found: bool,
}

impl Visit<Function> for Finder {
    fn visit(&mut self, node: &Function) {
        if node.is_generator {
            self.found = true;
            return;
        }
        node.visit_children(self);
    }
}
