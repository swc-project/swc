mod gating;
mod imports;
mod program;
mod suppression;

pub use program::{
    compile_fn, compile_program, find_directive_disabling_memoization,
    get_react_compiler_runtime_module, try_find_directive_enabling_memoization, CompileReport,
    CompilerPass,
};
