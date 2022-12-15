use rustc_hash::FxHashMap;

use super::scope::{FastId, FastJsWord};

#[derive(Debug, Default)]
pub(super) struct ReverseMap {
    inner: Vec<FxHashMap<FastJsWord, Vec<FastId>>>,
}
