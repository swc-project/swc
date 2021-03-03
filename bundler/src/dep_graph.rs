use crate::ModuleId;
use petgraph::graphmap::DiGraphMap;

pub(crate) type ModuleGraph = DiGraphMap<ModuleId, ()>;
