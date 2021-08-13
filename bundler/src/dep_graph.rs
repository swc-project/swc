use crate::{util::fast_graph::FastDiGraphMap, ModuleId};

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
