use crate::ModuleId;
use swc_fast_graph::digraph::FastDiGraphMap;

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
