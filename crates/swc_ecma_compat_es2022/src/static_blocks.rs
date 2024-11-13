use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, source_map::PLACEHOLDER_SP, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct ClassStaticBlock;

pub fn static_blocks() -> impl Pass {
    visit_mut_pass(ClassStaticBlock)
}

#[swc_trace]
impl ClassStaticBlock {
    fn transform_static_block(
        &mut self,
        mut static_block: StaticBlock,
        private_id: JsWord,
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

#[swc_trace]
impl VisitMut for ClassStaticBlock {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, class: &mut Class) {
        class.visit_mut_children_with(self);

        let mut private_names = AHashSet::default();
        for member in &class.body {
            if let ClassMember::PrivateProp(private_property) = member {
                private_names.insert(private_property.key.name.clone());
            }
        }

        let mut count = 0;
        for member in class.body.iter_mut() {
            if let ClassMember::StaticBlock(static_block) = member {
                if static_block.body.stmts.is_empty() {
                    *member = ClassMember::dummy();
                    continue;
                }

                let static_block_private_id = generate_uid(&private_names, &mut count);
                *member = self
                    .transform_static_block(static_block.take(), static_block_private_id)
                    .into();
            };
        }
    }
}

fn generate_uid(deny_list: &AHashSet<JsWord>, i: &mut u32) -> JsWord {
    *i += 1;

    let mut uid: JsWord = if *i == 1 {
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
