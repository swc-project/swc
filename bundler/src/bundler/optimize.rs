use crate::{Bundler, Load, Resolve};
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::dce;
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
    pub(super) fn optimize(&self, node: Module) -> Module {
        self.run(|| {
            // let mut used = vec![];

            // if let Some(used_exports) = used_exports {
            //     for export in used_exports {
            //         match export {
            //             Specifier::Specific { alias, local, .. } => {
            //                 used.push(alias.as_ref().unwrap_or(local).to_id());
            //             }
            //             Specifier::Namespace { local, .. } => {
            //                 used.push(local.to_id());
            //             }
            //         }
            //     }
            // }

            let used_mark = self.used_mark;

            let mut v = dce::dce(dce::Config {
                used: None,
                used_mark,
            });

            let node = node.fold_with(&mut v);
            node
        })
    }
}
