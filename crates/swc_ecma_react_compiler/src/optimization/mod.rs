mod constant_propagation;
mod dead_code_elimination;
mod optimize_for_ssr;
mod optimize_props_method_calls;
mod outline_functions;
mod outline_jsx;
mod prune_maybe_throws;

pub use self::{
    constant_propagation::constant_propagation, dead_code_elimination::dead_code_elimination,
    optimize_for_ssr::optimize_for_ssr, optimize_props_method_calls::optimize_props_method_calls,
    outline_functions::outline_functions, outline_jsx::outline_jsx,
    prune_maybe_throws::prune_maybe_throws,
};
