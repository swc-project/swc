mod analyse_functions;
mod drop_manual_memoization;
mod infer_mutation_aliasing_effects;
mod infer_mutation_aliasing_ranges;
mod infer_reactive_places;
mod infer_types;
mod inline_immediately_invoked_function_expressions;

pub use self::{
    analyse_functions::analyse_functions, drop_manual_memoization::drop_manual_memoization,
    infer_mutation_aliasing_effects::infer_mutation_aliasing_effects,
    infer_mutation_aliasing_ranges::infer_mutation_aliasing_ranges,
    infer_reactive_places::infer_reactive_places, infer_types::infer_types,
    inline_immediately_invoked_function_expressions::inline_immediately_invoked_function_expressions,
};
