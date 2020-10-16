use super::{load::TransformedModule, Bundler};
use crate::{id::ModuleId, load::Load, resolve::Resolve, util::IntoParallelIterator, Bundle};
use anyhow::{Context, Error};
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;
use std::collections::{HashMap, HashSet};
use swc_ecma_transforms::{hygiene, optimization::simplify::dce};
use swc_ecma_visit::FoldWith;

mod circular;
mod cjs;
mod computed_key;
mod export;
mod merge;
mod plan;
mod remark;

#[derive(Debug)]
struct InternalEntry {
    basename: String,
    main: TransformedModule,
    included: Vec<ModuleId>,
    dynamic: bool,
}

#[derive(Debug, Default)]
struct State {
    synchronously_included: HashSet<ModuleId>,
    dynamic_entries: HashSet<ModuleId>,
    common_libs: HashSet<ModuleId>,
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
        entries: HashMap<String, TransformedModule>,
    ) -> Result<Vec<Bundle>, Error> {
        let plan = self.determine_entries(entries).context("failed to plan")?;
        let merged = Default::default();

        Ok((&*plan.entries)
            .into_par_iter()
            .map(|&entry| {
                self.run(|| {
                    let kind = plan
                        .bundle_kinds
                        .get(&entry)
                        .unwrap_or_else(|| {
                            unreachable!("Plan does not contain bundle kind for {:?}", entry)
                        })
                        .clone();

                    let module = self
                        .merge_modules(&plan, entry, true, false, &merged)
                        .context("failed to merge module")
                        .unwrap(); // TODO

                    Bundle {
                        kind,
                        id: entry,
                        module,
                    }
                })
            })
            .collect())
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
                let mut entries = HashMap::default();
                entries.insert("main.js".to_string(), module);

                let chunked = t.bundler.chunk(entries)?;
                assert_eq!(chunked.len(), 1);

                Ok(())
            });
    }
}
