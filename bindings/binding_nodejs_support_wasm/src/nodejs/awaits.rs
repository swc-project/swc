use serde::Serialize;
use swc_common::Spanned;
use swc_ecma_ast::{ArrowExpr, AwaitExpr, Constructor, ForOfStmt, Function, UsingDecl};
use swc_ecma_visit::{Visit, VisitWith};

use super::{parse_module, position::SourcePosition, span_range};

/// An Acorn-compatible location: one-based line and zero-based UTF-16 column.
#[derive(Debug, Serialize)]
pub struct TopLevelAwaitLocation {
    pub line: usize,
    pub column: usize,
}

/// Finds await expressions, for-await loops, and await-using declarations in
/// module scope. Invalid or incomplete modules have no diagnostic locations.
pub fn find_top_level_awaits(code: &str) -> Vec<TopLevelAwaitLocation> {
    let Some(module) = parse_module(code) else {
        return Vec::new();
    };
    let mut collector = AwaitCollector::default();
    module.visit_with(&mut collector);
    collector.positions.sort_unstable();

    let mut position = SourcePosition::new(code);
    collector
        .positions
        .into_iter()
        .map(|byte| {
            position.advance_to(byte);
            TopLevelAwaitLocation {
                line: position.line,
                column: position.column,
            }
        })
        .collect()
}

#[derive(Default)]
struct AwaitCollector {
    positions: Vec<usize>,
}

impl AwaitCollector {
    fn record(&mut self, node: &impl Spanned) {
        if let Some((start, _)) = span_range(node.span()) {
            self.positions.push(start);
        }
    }
}

impl Visit for AwaitCollector {
    fn visit_await_expr(&mut self, node: &AwaitExpr) {
        self.record(node);
        node.visit_children_with(self);
    }

    fn visit_for_of_stmt(&mut self, node: &ForOfStmt) {
        if node.is_await {
            self.record(node);
        }
        node.visit_children_with(self);
    }

    fn visit_using_decl(&mut self, node: &UsingDecl) {
        if node.is_await {
            self.record(node);
        }
        node.visit_children_with(self);
    }

    // Methods contain Function nodes, but their computed keys belong to the
    // enclosing scope and are visited separately by the default traversal.
    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_constructor(&mut self, _: &Constructor) {}
}
