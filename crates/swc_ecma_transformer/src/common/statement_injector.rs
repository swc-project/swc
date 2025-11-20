use std::cell::RefCell;

use rustc_hash::FxHashMap;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::AstKindPath;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct StatementInjector {}

#[derive(Debug)]
enum Direction {
    Before,
    After,
}

#[derive(Debug)]
struct AdjacentStatement {
    stmt: Stmt,
    direction: Direction,
}

/// Store for statements to be added to the statements.
#[derive(Default)]
pub struct StatementInjectorStore {
    insertions: RefCell<FxHashMap<AstKindPath, Vec<AdjacentStatement>>>,
}

impl VisitMutHook<TraverseCtx> for StatementInjector {}
