use swc_fast_graph::graphmap::FastDiGraphMap;

use crate::ModuleId;

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
