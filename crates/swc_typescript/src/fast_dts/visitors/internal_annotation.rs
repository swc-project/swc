use std::collections::HashSet;

use swc_common::{BytePos, Spanned};
use swc_ecma_ast::TsTypeElement;
use swc_ecma_visit::VisitMut;

pub struct InternalAnnotationTransformer<'a> {
    internal_annotations: &'a HashSet<BytePos>,
}

impl<'a> InternalAnnotationTransformer<'a> {
    pub fn new(internal_annotations: &'a HashSet<BytePos>) -> Self {
        Self {
            internal_annotations,
        }
    }
}

impl VisitMut for InternalAnnotationTransformer<'_> {
    fn visit_mut_ts_type_elements(&mut self, node: &mut Vec<TsTypeElement>) {
        node.retain(|elem| !self.internal_annotations.contains(&elem.span_lo()));
    }
}
