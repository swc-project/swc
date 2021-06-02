use super::Bundler;
use crate::{load::Load, resolve::Resolve};
use swc_bundler_analysis::export::{ExportFinder, RawExports};
use swc_common::{FileName, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMutWith;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// TODO: Support pattern like
    ///     export const [a, b] = [1, 2]
    pub(super) fn extract_export_info(
        &self,
        file_name: &FileName,
        module: &mut Module,
        export_ctxt: SyntaxContext,
    ) -> RawExports {
        self.run(|| {
            let mut v = ExportFinder {
                info: Default::default(),
                file_name,
                handler: self,
                export_ctxt,
            };

            module.visit_mut_with(&mut v);

            v.info
        })
    }
}
