use petgraph::{prelude::GraphMap, Directed};
use rustc_hash::FxBuildHasher;

use crate::ModuleId;

pub(crate) type ModuleGraph = GraphMap<ModuleId, (), Directed, FxBuildHasher>;
