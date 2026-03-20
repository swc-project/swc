mod eliminate_redundant_phi;
mod enter_ssa;
mod rewrite_instruction_kinds_based_on_reassignment;

pub use self::{
    eliminate_redundant_phi::eliminate_redundant_phi, enter_ssa::enter_ssa,
    rewrite_instruction_kinds_based_on_reassignment::rewrite_instruction_kinds_based_on_reassignment,
};
