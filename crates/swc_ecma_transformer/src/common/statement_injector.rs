//! Utility transform to add new statements before or after the specified
//! statement.
//!
//! `StatementInjectorStore` contains a `FxHashMap<Address,
//! Vec<AdjacentStatement>>`. It is stored on `TransformCtx`.
//!
//! `StatementInjector` transform inserts new statements before or after a
//! statement which is determined by the address of the statement.
//!
//! Other transforms can add statements to the store with following methods:
//!
//! ```rs
//! self.ctx.statement_injector.insert_before(address, statement);
//! self.ctx.statement_injector.insert_after(address, statement);
//! self.ctx.statement_injector.insert_many_after(address, statements);
//! ```

use rustc_hash::FxHashMap;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct StmtInjector {}

#[derive(Debug)]
enum Direction {
    Before,
    After,
}

#[derive(Debug)]
struct AdjacentStmt {
    stmt: Stmt,
    direction: Direction,
}

/// Store for Stmts to be added to the Stmts.
///
/// The key is the address of the statement in the AST, represented as a
/// pointer.
#[derive(Default)]
pub struct StmtInjectorStore {
    /// Map from statement address to adjacent statements to insert
    stmts: FxHashMap<*const Stmt, Vec<AdjacentStmt>>,
}

impl StmtInjectorStore {
    /// Insert a statement before the statement at the given address
    pub fn insert_before(&mut self, address: *const Stmt, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::Before,
        });
    }

    /// Insert a statement after the statement at the given address
    pub fn insert_after(&mut self, address: *const Stmt, stmt: Stmt) {
        self.stmts.entry(address).or_default().push(AdjacentStmt {
            stmt,
            direction: Direction::After,
        });
    }

    /// Insert multiple statements after the statement at the given address
    pub fn insert_many_after(&mut self, address: *const Stmt, stmts: Vec<Stmt>) {
        let entry = self.stmts.entry(address).or_default();
        for stmt in stmts {
            entry.push(AdjacentStmt {
                stmt,
                direction: Direction::After,
            });
        }
    }

    /// Get all statements to be inserted at the given address
    fn take_stmts(&mut self, address: *const Stmt) -> Option<Vec<AdjacentStmt>> {
        self.stmts.remove(&address)
    }
}

impl VisitMutHook<TraverseCtx> for StmtInjector {
    fn enter_arrow_expr(&mut self, node: &mut ArrowExpr, _: &mut TraverseCtx) {
        // We convert the arrow body to a block statement with a return statement
        // because we cannot inject statements after the arrow body.
        if let BlockStmtOrExpr::Expr(expr) = &mut *node.body {
            *node.body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(expr.take()),
                })],
                ..Default::default()
            });
        }
    }

    fn exit_arrow_expr(&mut self, node: &mut ArrowExpr, _: &mut TraverseCtx) {
        if let BlockStmtOrExpr::BlockStmt(block_stmt) = &mut *node.body {
            // If the block statement is something we inserted, we need to
            // convert it back to an expression.
            if block_stmt.span == DUMMY_SP && block_stmt.stmts.len() == 1 {
                if let Stmt::Return(return_stmt) = &mut block_stmt.stmts[0] {
                    if return_stmt.span == DUMMY_SP {
                        *node.body = BlockStmtOrExpr::Expr(return_stmt.arg.take().unwrap());
                    }
                }
            }
        }
    }

    fn exit_module_items(&mut self, node: &mut Vec<ModuleItem>, ctx: &mut TraverseCtx) {
        // First pass: collect all (index, adjacent_stmts) pairs while addresses are
        // valid.
        let mut insertions = Vec::new();
        let mut insertion_count = 0;
        for (i, item) in node.iter().enumerate() {
            // Only process ModuleItem::Stmt variants
            if let ModuleItem::Stmt(stmt) = item {
                let address = stmt as *const Stmt;
                if let Some(adjacent_stmts) = ctx.statement_injector.take_stmts(address) {
                    insertion_count += adjacent_stmts.len();
                    insertions.push((i, adjacent_stmts));
                }
            }
        }

        if insertions.is_empty() {
            return;
        }

        let mut next_insertion = insertions.into_iter().peekable();
        let original = node.take();
        let mut rewritten = Vec::with_capacity(original.len() + insertion_count);

        for (i, item) in original.into_iter().enumerate() {
            let mut after = Vec::new();

            if matches!(
                next_insertion.peek(),
                Some(&(insertion_idx, _)) if insertion_idx == i
            ) {
                let (_, adjacent_stmts) = next_insertion.next().unwrap();

                for adjacent in adjacent_stmts {
                    match adjacent.direction {
                        Direction::Before => rewritten.push(ModuleItem::Stmt(adjacent.stmt)),
                        Direction::After => after.push(ModuleItem::Stmt(adjacent.stmt)),
                    }
                }
            }

            rewritten.push(item);
            rewritten.extend(after);
        }

        *node = rewritten;
    }

    fn exit_stmts(&mut self, stmts: &mut Vec<Stmt>, ctx: &mut TraverseCtx) {
        // First pass: collect all (index, adjacent_stmts) pairs while addresses are
        // valid.
        let mut insertions = Vec::new();
        let mut insertion_count = 0;
        for (i, stmt) in stmts.iter().enumerate() {
            let address = stmt as *const Stmt;
            if let Some(adjacent_stmts) = ctx.statement_injector.take_stmts(address) {
                insertion_count += adjacent_stmts.len();
                insertions.push((i, adjacent_stmts));
            }
        }

        if insertions.is_empty() {
            return;
        }

        let mut next_insertion = insertions.into_iter().peekable();
        let original = stmts.take();
        let mut rewritten = Vec::with_capacity(original.len() + insertion_count);

        for (i, stmt) in original.into_iter().enumerate() {
            let mut after = Vec::new();

            if matches!(
                next_insertion.peek(),
                Some(&(insertion_idx, _)) if insertion_idx == i
            ) {
                let (_, adjacent_stmts) = next_insertion.next().unwrap();

                for adjacent in adjacent_stmts {
                    match adjacent.direction {
                        Direction::Before => rewritten.push(adjacent.stmt),
                        Direction::After => after.push(adjacent.stmt),
                    }
                }
            }

            rewritten.push(stmt);
            rewritten.extend(after);
        }

        *stmts = rewritten;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn labeled_stmt(label: &str) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: label.into(),
                raw: None,
            }))),
        })
    }

    fn stmt_label(stmt: &Stmt) -> String {
        let Stmt::Expr(ExprStmt { expr, .. }) = stmt else {
            panic!("expected expression statement")
        };
        let Expr::Lit(Lit::Str(Str { value, .. })) = &**expr else {
            panic!("expected string literal expression")
        };

        value.to_string_lossy().into_owned()
    }

    fn empty_named_export() -> ModuleItem {
        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
            span: DUMMY_SP,
            specifiers: Vec::new(),
            src: None,
            type_only: false,
            with: None,
        }))
    }

    #[test]
    fn exit_stmts_keeps_before_and_after_order_for_one_target() {
        let mut stmts = vec![labeled_stmt("base")];
        let target = &stmts[0] as *const Stmt;

        let mut ctx = TraverseCtx::default();
        ctx.statement_injector
            .insert_before(target, labeled_stmt("before_1"));
        ctx.statement_injector
            .insert_before(target, labeled_stmt("before_2"));
        ctx.statement_injector
            .insert_after(target, labeled_stmt("after_1"));
        ctx.statement_injector
            .insert_after(target, labeled_stmt("after_2"));

        StmtInjector::default().exit_stmts(&mut stmts, &mut ctx);

        let labels = stmts.iter().map(stmt_label).collect::<Vec<_>>();
        assert_eq!(
            labels,
            vec![
                "before_1".to_string(),
                "before_2".to_string(),
                "base".to_string(),
                "after_1".to_string(),
                "after_2".to_string(),
            ]
        );
    }

    #[test]
    fn exit_stmts_keeps_order_for_multiple_targets() {
        let mut stmts = vec![labeled_stmt("s0"), labeled_stmt("s1"), labeled_stmt("s2")];

        let s0 = &stmts[0] as *const Stmt;
        let s1 = &stmts[1] as *const Stmt;
        let s2 = &stmts[2] as *const Stmt;

        let mut ctx = TraverseCtx::default();
        ctx.statement_injector.insert_after(s0, labeled_stmt("a0"));
        ctx.statement_injector.insert_before(s1, labeled_stmt("b1"));
        ctx.statement_injector.insert_after(s2, labeled_stmt("a2"));

        StmtInjector::default().exit_stmts(&mut stmts, &mut ctx);

        let labels = stmts.iter().map(stmt_label).collect::<Vec<_>>();
        assert_eq!(
            labels,
            vec![
                "s0".to_string(),
                "a0".to_string(),
                "b1".to_string(),
                "s1".to_string(),
                "s2".to_string(),
                "a2".to_string(),
            ]
        );
    }

    #[test]
    fn exit_module_items_only_targets_statement_entries() {
        let mut items = vec![
            empty_named_export(),
            ModuleItem::Stmt(labeled_stmt("s0")),
            empty_named_export(),
            ModuleItem::Stmt(labeled_stmt("s1")),
        ];

        let s0 = match &items[1] {
            ModuleItem::Stmt(stmt) => stmt as *const Stmt,
            _ => unreachable!(),
        };
        let s1 = match &items[3] {
            ModuleItem::Stmt(stmt) => stmt as *const Stmt,
            _ => unreachable!(),
        };

        let mut ctx = TraverseCtx::default();
        ctx.statement_injector.insert_after(s0, labeled_stmt("a0"));
        ctx.statement_injector.insert_before(s1, labeled_stmt("b1"));

        StmtInjector::default().exit_module_items(&mut items, &mut ctx);

        let labels = items
            .iter()
            .map(|item| match item {
                ModuleItem::Stmt(stmt) => stmt_label(stmt),
                _ => "module".to_string(),
            })
            .collect::<Vec<_>>();

        assert_eq!(
            labels,
            vec![
                "module".to_string(),
                "s0".to_string(),
                "a0".to_string(),
                "module".to_string(),
                "b1".to_string(),
                "s1".to_string(),
            ]
        );
    }
}
