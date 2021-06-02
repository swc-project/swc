use crate::util::fast_graph::FastDiGraphMap;
use swc_bundler_analysis::id::ModuleId;

pub(crate) type ModuleGraph = FastDiGraphMap<ModuleId, ()>;
