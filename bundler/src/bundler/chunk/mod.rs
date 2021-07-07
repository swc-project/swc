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
use std::time::Instant;

mod cjs;
mod computed_key;
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
        let start = Instant::now();
        let (plan, graph, cycles) = self.determine_entries(entries).context("failed to plan")?;
        let dur = Instant::now() - start;
        log::debug!("Dependency analysis took {:?}", dur);

        if cfg!(debug_assertions) {
            for (i, id1) in plan.all.iter().enumerate() {
                for (j, id2) in plan.all.iter().enumerate() {
                    if i == j {
                        continue;
                    }

                    debug_assert_ne!(
                        id1, id2,
                        "Dependency analysis created duplicate entries: {:?}",
                        id1
                    )
                }
            }
        }

        let ctx = Ctx {
            graph,
            cycles,
            transitive_remap: Default::default(),
            export_stars_in_wrapped: Default::default(),
        };

        let start = Instant::now();
        let all = (&*plan.all)
            .into_par_iter()
            .map(|id| -> Result<_, Error> {
                self.run(|| {
                    // TODO: is_entry should be false if it's dep of other entry.
                    let is_entry = plan.entries.contains_key(&id);
                    let module = self.get_for_merging(&ctx, *id, is_entry)?;

                    Ok((*id, module))
                })
            })
            .collect::<Result<FxHashMap<_, _>, _>>()?;

        let dur = Instant::now() - start;
        log::debug!("Module preparation took {:?}", dur);

        let entries = all
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
