use super::{load::TransformedModule, Bundler};
use crate::{
    id::ModuleId, load::Load, resolve::Resolve, util::IntoParallelIterator, Bundle, BundleKind,
};
use anyhow::{Context, Error};
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;
use std::collections::{HashMap, HashSet};
use swc_ecma_transforms::{hygiene, optimization::simplify::dce};
use swc_ecma_visit::FoldWith;

mod circular;
mod cjs;
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
        let entries = self.determine_entries(entries);

        Ok(entries
            .into_par_iter()
            .map(
                |(kind, id, mut module_ids_to_merge): (BundleKind, ModuleId, _)| {
                    self.run(|| {
                        let module = self
                            .merge_modules(id, true, &mut module_ids_to_merge)
                            .context("failed to merge module")
                            .unwrap(); // TODO

                        assert_eq!(module_ids_to_merge, vec![], "Everything should be merged");

                        let module = module
                            .fold_with(&mut dce::dce(Default::default()))
                            .fold_with(&mut hygiene());

                        Bundle { kind, id, module }
                    })
                },
            )
            .collect())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::bundler::tests::suite;
    use swc_common::FileName;

    #[test]
    fn es6_determine_entries() {
        suite()
            .file(
                "main.js",
                "
                    import './a';
                    import './b';
                    ",
            )
            .file("a.js", "import './common';")
            .file("b.js", "import './common';")
            .file("common.js", r#"console.log('foo')"#)
            .run(|t| {
                let module = t
                    .bundler
                    .load_transformed(&FileName::Real("main.js".into()))?
                    .unwrap();
                let mut entries = HashMap::default();
                entries.insert("main.js".to_string(), module);

                let determined = t.bundler.determine_entries(entries);

                assert_eq!(determined.len(), 1);

                Ok(())
            });
    }

    #[test]
    fn cjs_determine_entries() {
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

                let determined = t.bundler.determine_entries(entries);

                assert_eq!(determined.len(), 1);
                assert_eq!(
                    determined[0].0,
                    BundleKind::Named {
                        name: "main.js".to_string()
                    }
                );
                assert_eq!(determined[0].2.len(), 3);

                Ok(())
            });
    }

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
