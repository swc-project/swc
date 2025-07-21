use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{source_map::PLACEHOLDER_SP, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

use crate::CompilerImpl;

impl CompilerImpl<'_> {
    pub(crate) fn transform_static_block(
        &mut self,
        mut static_block: StaticBlock,
        private_id: Atom,
    ) -> PrivateProp {
        let mut stmts = static_block.body.stmts.take();
        let span = static_block.span;

        // We special-case the single expression case to avoid the iife, since it's
        // common.
        let value = if stmts.len() == 1 && stmts[0].is_expr() {
            stmts[0].take().expr().map(|expr_stmt| expr_stmt.expr)
        } else {
            static_block.body.stmts = stmts;

            let expr = CallExpr {
                callee: ArrowExpr {
                    body: Box::new(BlockStmtOrExpr::BlockStmt(static_block.body)),
                    ..Default::default()
                }
                .as_callee(),
                ..Default::default()
            }
            .into();

            Some(Box::new(expr))
        };

        PrivateProp {
            span,
            is_static: true,
            key: PrivateName {
                span: PLACEHOLDER_SP,
                name: private_id,
            },
            value,
            ..Default::default()
        }
    }
}

pub(crate) fn generate_uid(deny_list: &FxHashSet<Atom>, i: &mut u32) -> Atom {
    *i += 1;

    let mut uid: Atom = if *i == 1 {
        "_".to_string()
    } else {
        format!("_{i}")
    }
    .into();
    while deny_list.contains(&uid) {
        *i += 1;
        uid = format!("_{i}").into();
    }

    uid
}
