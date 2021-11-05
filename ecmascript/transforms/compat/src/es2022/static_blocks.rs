use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

struct ClassStaticBlock;

pub fn static_blocks() -> impl Fold {
    ClassStaticBlock
}

impl ClassStaticBlock {
    fn fold_class_for_static_block(&mut self, class: Class) -> Class {
        let mut private_names = AHashSet::default();
        for member in &class.body {
            if let ClassMember::PrivateProp(private_property) = member {
                private_names.insert(private_property.key.id.sym.clone());
            }
        }
        let mut members = vec![];
        for member in class.body {
            let new_member = match member {
                ClassMember::StaticBlock(static_block) => {
                    let static_block_private_id: JsWord = {
                        let mut id_value: JsWord = "_".into();
                        let mut count = 0;
                        while private_names.contains(&id_value) {
                            count = count + 1;
                            id_value = format!("_{}", count).into();
                        }
                        private_names.insert(id_value.clone());
                        id_value
                    };
                    ClassMember::PrivateProp(
                        self.fold_static_block(static_block, static_block_private_id),
                    )
                }
                m => m,
            };
            members.push(new_member);
        }
        Class {
            body: members,
            ..class
        }
    }
    fn fold_static_block(&mut self, static_block: StaticBlock, private_id: JsWord) -> PrivateProp {
        PrivateProp {
            span: DUMMY_SP,
            is_static: true,
            is_abstract: false,
            is_optional: false,
            is_override: false,
            readonly: false,
            computed: false,
            definite: false,
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
                callee: ExprOrSuper::Expr(Box::new(Expr::Arrow(ArrowExpr {
                    span: DUMMY_SP,
                    params: Vec::new(),
                    is_async: false,
                    is_generator: false,
                    type_params: None,
                    return_type: None,
                    body: BlockStmtOrExpr::BlockStmt(static_block.body),
                }))),
                args: Vec::new(),
                type_args: None,
            }))),
        }
    }
}

impl Fold for ClassStaticBlock {
    noop_fold_type!();

    fn fold_decl(&mut self, declaration: Decl) -> Decl {
        let declaration = declaration.fold_children_with(self);
        match declaration {
            Decl::Class(class_declaration) => {
                let class = self.fold_class_for_static_block(class_declaration.class);
                Decl::Class(ClassDecl {
                    class,
                    ..class_declaration
                })
            }
            _ => declaration,
        }
    }

    fn fold_expr(&mut self, expression: Expr) -> Expr {
        let expression = expression.fold_children_with(self);
        match expression {
            Expr::Class(class_expression) => {
                let class = self.fold_class_for_static_block(class_expression.class);
                Expr::Class(ClassExpr {
                    class,
                    ..class_expression
                })
            }
            _ => expression,
        }
    }
}
