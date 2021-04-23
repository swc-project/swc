use crate::util::fast_graph::FastDiGraphMap;
use crate::ModuleId;

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
