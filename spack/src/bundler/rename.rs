use crate::{Bundle, BundleKind, Bundler};

impl Bundler<'_> {
    pub(super) fn rename(&self, bundles: Vec<Bundle>) -> Vec<Bundle> {
        let mut new = Vec::with_capacity(bundles.len());

        for bundle in bundles {
            match bundle.kind {
                BundleKind::Lib { name } => {}
                _ => {}
            }
        }

        new
    }
}
