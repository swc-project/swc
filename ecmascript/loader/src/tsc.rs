use std::collections::HashMap;

use crate::Resolver;
use swc_common::errors::Diagnostic;
use swc_common::FileName;

/// Implementation of [Resolver] which mimics behavior of tsc.
pub struct TscResolver {
    paths: HashMap<String, String, ahash::RandomState>,
}

impl Resolver for TscResolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Diagnostic> {
        todo!()
    }
}
