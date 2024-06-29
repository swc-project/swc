use std::hash::{BuildHasherDefault, Hash};

use indexmap::IndexSet;
use rustc_hash::FxHasher;
use swc_fast_graph::digraph::FastDiGraphMap;

#[derive(Debug, Clone)]
pub struct InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    pub(super) idx_graph: FastDiGraphMap<u32, Dependency>,
    pub(super) graph_ix: IndexSet<T, BuildHasherDefault<FxHasher>>,
}

#[derive(Debug, Clone, Copy)]
pub enum Dependency {
    Strong,
    Weak,
}

impl<T> Default for InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    fn default() -> Self {
        Self {
            idx_graph: Default::default(),
            graph_ix: Default::default(),
        }
    }
}

impl<T> InternedGraph<T>
where
    T: Eq + Hash + Clone,
{
    pub(super) fn node(&mut self, id: &T) -> u32 {
        self.graph_ix.get_index_of(id).unwrap_or_else(|| {
            let ix = self.graph_ix.len();
            self.graph_ix.insert_full(id.clone());
            ix
        }) as _
    }

    /// Panics if `id` is not found.
    pub(super) fn get_node(&self, id: &T) -> u32 {
        self.graph_ix.get_index_of(id).unwrap() as _
    }
}

#[derive(Debug, Clone, Copy)]
pub(super) enum Mode {
    #[allow(dead_code)]
    Development,
    Production,
}
