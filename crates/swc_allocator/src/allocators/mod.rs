//! Various flavors of allocators

pub use self::{arena::Arena, global::Global};

mod arena;
mod global;
mod scoped;
