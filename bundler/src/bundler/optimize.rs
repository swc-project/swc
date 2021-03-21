use crate::{Bundler, Load, Resolve};
use swc_common::pass::Repeat;
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::{const_propgation::constant_propagation, dce};
use swc_ecma_visit::FoldWith;

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
                node = node.fold_with(&mut constant_propagation())
            }

            node = node.fold_with(&mut Repeat::new(dce::dce(dce::Config {
                used: None,
                used_mark: self.used_mark,
            })));

            node
        })
    }
}
