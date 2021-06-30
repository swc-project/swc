use crate::option::CompressOptions;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub fn postcompress_optimizer<'a>(options: &'a CompressOptions) -> impl 'a + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,
}

impl VisitMut for PostcompressOptimizer<'_> {
    noop_visit_mut_type!();
}
