use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct ClassStaticBlock;

#[tracing::instrument(level = "info", skip_all)]
pub fn static_blocks() -> impl Fold + VisitMut {
    as_folder(ClassStaticBlock)
}

#[swc_trace]
impl ClassStaticBlock {
    fn visit_mut_static_block(
        &mut self,
        static_block: StaticBlock,
        private_id: JsWord,
    ) -> PrivateProp {
        PrivateProp {
            span: DUMMY_SP,
            is_static: true,
            is_optional: false,
            is_override: false,
            readonly: false,
            type_ann: None,
            decorators: Vec::new(),
            accessibility: None,
            key: PrivateName {
                span: DUMMY_SP,
                id: Ident {
                    span: DUMMY_SP,
                    sym: private_id,
                    optional: false,
                },
            },
            value: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: ArrowExpr {
                    span: DUMMY_SP,
                    params: Vec::new(),
                    is_async: false,
                    is_generator: false,
                    type_params: None,
                    return_type: None,
                    body: BlockStmtOrExpr::BlockStmt(static_block.body),
                }
                .as_callee(),
                args: Vec::new(),
                type_args: None,
            }))),
            definite: false,
        }
    }
}

#[swc_trace]
impl VisitMut for ClassStaticBlock {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, class: &mut Class) {
        class.visit_mut_children_with(self);

        let mut private_names = AHashSet::default();
        for member in &class.body {
            if let ClassMember::PrivateProp(private_property) = member {
                private_names.insert(private_property.key.id.sym.clone());
            }
        }

        for member in class.body.iter_mut() {
            if let ClassMember::StaticBlock(static_block) = member {
                let static_block_private_id: JsWord = {
                    let mut id_value: JsWord = "_".into();
                    let mut count = 0;
                    while private_names.contains(&id_value) {
                        count += 1;
                        id_value = format!("_{}", count).into();
                    }
                    private_names.insert(id_value.clone());
                    id_value
                };
                *member = ClassMember::PrivateProp(
                    self.visit_mut_static_block(static_block.take(), static_block_private_id),
                )
            };
        }
    }
}
