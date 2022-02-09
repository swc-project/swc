use swc_fast_graph::digraph::FastDiGraphMap;

use crate::ModuleId;

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
