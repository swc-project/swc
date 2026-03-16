use swc_ecma_ast::{BlockStmt, Function, Ident, Pat};

use crate::{hir::HirFunction, transform::ReactFunctionType};

/// Generated outlined function.
#[derive(Debug, Clone)]
pub struct OutlinedFunction {
    pub function: CodegenFunction,
    pub kind: Option<ReactFunctionType>,
}

/// Final codegen payload for one compiled function.
#[derive(Debug, Clone)]
pub struct CodegenFunction {
    pub id: Option<Ident>,
    pub params: Vec<Pat>,
    pub body: BlockStmt,
    pub is_async: bool,
    pub is_generator: bool,
    pub memo_slots_used: u32,
    pub memo_blocks: u32,
    pub memo_values: u32,
    pub pruned_memo_blocks: u32,
    pub pruned_memo_values: u32,
    pub outlined: Vec<OutlinedFunction>,
}

/// Reactive function IR placeholder.
#[derive(Debug, Clone)]
pub struct ReactiveFunction {
    pub id: Option<Ident>,
    pub params: Vec<Pat>,
    pub body: BlockStmt,
    pub is_async: bool,
    pub is_generator: bool,
}

pub fn build_reactive_function(hir: &HirFunction) -> ReactiveFunction {
    function_to_reactive(&hir.function, hir.id.clone())
}

pub fn codegen_function(reactive: ReactiveFunction) -> CodegenFunction {
    CodegenFunction {
        id: reactive.id,
        params: reactive.params,
        body: reactive.body,
        is_async: reactive.is_async,
        is_generator: reactive.is_generator,
        memo_slots_used: 0,
        memo_blocks: 0,
        memo_values: 0,
        pruned_memo_blocks: 0,
        pruned_memo_values: 0,
        outlined: Vec::new(),
    }
}

fn function_to_reactive(function: &Function, id: Option<Ident>) -> ReactiveFunction {
    ReactiveFunction {
        id,
        params: function
            .params
            .iter()
            .map(|param| param.pat.clone())
            .collect(),
        body: function.body.clone().unwrap_or_default(),
        is_async: function.is_async,
        is_generator: function.is_generator,
    }
}
