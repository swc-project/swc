use crate::{load::Load, module::Specifier, resolve::Resolve, Bundler};
use std::{borrow::Cow, sync::Arc};
use swc_common::SourceFile;
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::dce;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::FoldWith;

impl<L, R> Bundler<L, R>
where
    L: Load,
    R: Resolve,
{
    /// If used_exports is [None], all exports are treated as exported.
    ///
    /// Note: Context of used_exports is ignored, as the specifiers comes from
    /// other module.
    pub(super) fn drop_unused(
        &self,
        _fm: Arc<SourceFile>,
        node: Module,
        used_exports: Option<&[Specifier]>,
    ) -> Module {
        let mut used = vec![];

        if let Some(used_exports) = used_exports {
            for export in used_exports {
                match export {
                    Specifier::Specific { alias, local, .. } => {
                        used.push(alias.as_ref().unwrap_or(local).to_id());
                    }
                    Specifier::Namespace { local } => {
                        used.push(local.to_id());
                    }
                }
            }
        }

        let used_mark = self.used_mark;

        let mut v = dce::dce(dce::Config {
            used: if used_exports.is_some() {
                Some(Cow::Owned(used))
            } else {
                None
            },
            used_mark,
        });

        let node = node.fold_with(&mut v);
        node
    }
}
