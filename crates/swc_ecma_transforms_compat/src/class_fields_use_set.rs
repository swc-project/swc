use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, prop_name_to_member_prop, ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn class_fields_use_set() -> impl Fold + VisitMut {
    as_folder(ClassFieldsUseSet)
}

struct ClassFieldsUseSet;

impl VisitMut for ClassFieldsUseSet {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        n.visit_mut_children_with(self);

        let mut fields_handler = FieldsHandler::default();
        n.visit_mut_with(&mut fields_handler);

        if fields_handler.constructor_inits.is_empty() {
            return;
        }

        let FieldsHandler {
            constructor_inits,
            constructor_found,
        } = fields_handler;

        let mut constructor_handler = ConstructorHandler {
            has_super: n.super_class.is_some(),
            constructor_inits,
            constructor_found,
        };
        n.visit_mut_with(&mut constructor_handler);
    }
}

#[derive(Debug, Default)]
struct FieldsHandler {
    constructor_inits: Vec<Box<Expr>>,
    constructor_found: bool,
}

impl VisitMut for FieldsHandler {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        n.body.visit_mut_children_with(self);
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        match n {
            ClassMember::Constructor(..) => self.constructor_found = true,
            ClassMember::ClassProp(ClassProp {
                ref span,
                ref is_static,
                key,
                value,
                ..
            }) => {
                if let Some(value) = value.take() {
                    let init_expr: Expr = AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: ThisExpr::dummy().into(),
                            prop: prop_name_to_member_prop(key.take()),
                        }
                        .into(),
                        right: value,
                    }
                    .into();

                    if *is_static {
                        *n = StaticBlock {
                            span: DUMMY_SP,
                            body: BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![init_expr.into_stmt()],
                            },
                        }
                        .into();

                        return;
                    } else {
                        self.constructor_inits.push(init_expr.into());
                    }
                }

                n.take();
            }
            ClassMember::PrivateProp(PrivateProp {
                ref span,
                is_static: false,
                key,
                value,
                ..
            }) => {
                if let Some(value) = value.take() {
                    let init_expr: Expr = AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: ThisExpr::dummy().into(),
                            prop: MemberProp::PrivateName(key.clone()),
                        }
                        .into(),
                        right: value,
                    }
                    .into();

                    self.constructor_inits.push(init_expr.into());
                }
            }
            _ => {}
        }
    }
}

#[derive(Debug, Default)]
struct ConstructorHandler {
    has_super: bool,
    constructor_inits: Vec<Box<Expr>>,
    constructor_found: bool,
}

impl VisitMut for ConstructorHandler {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        if !self.constructor_found {
            let mut constructor = default_constructor(self.has_super);
            constructor.visit_mut_with(self);
            n.body.push(constructor.into());
        } else {
            n.body.visit_mut_children_with(self);
        }
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        inject_after_super(n, self.constructor_inits.take());
    }
}
