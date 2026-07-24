pub mod builder;
pub mod graph;
pub mod analyzer;

#[cfg(test)]
mod tests;

pub use builder::CfgBuilder;
pub use graph::{ControlFlowGraph, BasicBlock, CfgNode, CfgEdge, EdgeKind};
pub use analyzer::{CfgAnalyzer, DeadCode, DeadCodeKind, Loop, RedundantCondition};