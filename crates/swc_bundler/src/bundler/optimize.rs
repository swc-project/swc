use swc_common::pass::Repeat;
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::simplify::{const_propagation::constant_propagation, dce};
use swc_ecma_visit::VisitMutWith;

use crate::{Bundler, Load, Resolve};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// If used_exports is [None], all exports are treated as exported.
    ///
    /// Note: Context of used_exports is ignored, as the specifiers comes from
    /// other module.
    pub(super) fn optimize(&self, mut node: Module) -> Module {
        self.run(|| {
            if !self.config.disable_inliner {
                node.visit_mut_with(&mut constant_propagation())
            }
            if !self.config.disable_dce {
                node.visit_mut_with(&mut Repeat::new(dce::dce(
                    dce::Config {
                        // TODO(kdy1): Apply mark to wrapped esms and use it at here.
                        module_mark: None,
                        top_level: true,
                        top_retain: Default::default(),
                        preserve_imports_with_side_effects: true,
                    },
                    self.unresolved_mark,
                )));
            }
            node
        })
    }
}
