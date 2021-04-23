use super::{load::TransformedModule, Bundler};
use crate::{
    bundler::chunk::merge::Ctx, id::ModuleId, load::Load, resolve::Resolve,
    util::IntoParallelIterator, Bundle,
};
use ahash::AHashMap;
use anyhow::{Context, Error};
use fxhash::FxHashMap;
use fxhash::FxHashSet;
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;

mod cjs;
mod computed_key;
mod export;
mod merge;
mod plan;

#[derive(Debug)]
struct InternalEntry {
    basename: String,
    main: TransformedModule,
    included: Vec<ModuleId>,
    dynamic: bool,
}

#[derive(Debug, Default)]
struct State {
    synchronously_included: FxHashSet<ModuleId>,
    dynamic_entries: FxHashSet<ModuleId>,
    common_libs: FxHashSet<ModuleId>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// `entries` - Entry modules (provided by user) by it's basename.
    ///
    /// # How it works
    ///
    /// For first, we load all dependencies and determine all entries.
    pub(super) fn chunk(
        &self,
        entries: AHashMap<String, TransformedModule>,
    ) -> Result<Vec<Bundle>, Error> {
        let (plan, graph) = self.determine_entries(entries).context("failed to plan")?;
        let ctx = Ctx {
            graph,
            merged: Default::default(),
            transitive_remap: Default::default(),
            export_stars_in_wrapped: Default::default(),
        };

        let all = plan
            .all
            .into_par_iter()
            .map(|id| -> Result<_, Error> {
                let info = self.scope.get_module(id).unwrap();
                let is_entry = plan.entries.contains_key(&id);
                let mut module = self.apply_hooks(id, is_entry)?;
                self.prepare_for_merging(&ctx, &info, &mut module);

                Ok((id, module))
            })
            .collect::<Result<FxHashMap<_, _>, _>>()?;

        let mut entries = all
            .iter()
            .filter_map(|(id, module)| {
                if plan.entries.contains_key(&id) {
                    return Some((*id, module.clone()));
                }
                None
            })
            .collect::<Vec<_>>();

        let merged = entries
            .into_par_iter()
            .map(|(id, mut entry)| {
                self.merge_into_entry(&ctx, id, &mut entry, &all);

                (id, entry)
            })
            .map(|(id, module)| {
                let kind = plan
                    .entries
                    .get(&id)
                    .unwrap_or_else(|| {
                        unreachable!("Plan does not contain bundle kind for {:?}", id)
                    })
                    .clone();
                Bundle {
                    kind,
                    id,
                    module: module.into(),
                }
            })
            .collect();

        Ok(merged)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::bundler::tests::suite;
    use swc_common::FileName;

    #[test]
    fn cjs_chunk() {
        suite()
            .file(
                "main.js",
                "
                require('./a');
                require('./b');
                ",
            )
            .file("a.js", "require('./common')")
            .file("b.js", "require('./common')")
            .file("common.js", r#"console.log('foo')"#)
            .run(|t| {
                let module = t
                    .bundler
                    .load_transformed(&FileName::Real("main.js".into()))?
                    .unwrap();
                let mut entries = AHashMap::default();
                entries.insert("main.js".to_string(), module);

                let chunked = t.bundler.chunk(entries)?;
                assert_eq!(chunked.len(), 1);

                Ok(())
            });
    }
}
