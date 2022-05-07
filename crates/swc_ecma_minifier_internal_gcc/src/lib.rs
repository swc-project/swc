//! This is PRIVATE crate. Don't use this directly. The only purpose of this
//! crate is improving compile times.

mod coalesce_var_names;
mod control_flow;
pub mod dataflow;
mod graph;
mod liveness;
mod node;
mod ptr;
