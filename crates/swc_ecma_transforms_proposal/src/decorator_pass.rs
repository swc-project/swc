use std::mem::take;

use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, Fold, NodeRef, VisitMut, VisitMutWith};

use crate::DecoratorVersion;

#[allow(unused)]
pub(crate) fn decorator_pass(version: DecoratorVersion) -> impl Fold + VisitMut {
    as_folder(DecoratorPass {
        version,
        state: Default::default(),
    })
}

struct DecoratorPass {
    version: DecoratorVersion,
    state: State,
}

#[derive(Default)]
struct State {
    class: ClassState,
}

#[derive(Default)]
struct ClassState {
    class_id_name: Option<Id>,

    has_element_decorators: bool,
    has_computed_keys_side_effects: bool,
    elem_decs_use_fn_context: bool,

    class_assignments: Vec<AssignExpr>,

    proto_init_local: Ident,
    static_init_local: Ident,

    instance_private_names: Vec<PrivateName>,
}

impl ClassState {
    fn memoize_expr(&mut self, expr: Box<Expr>, hint: &str, assignments: &mut Vec<AssignExpr>) {}
}

impl DecoratorPass {
    fn transform_class(&mut self, class_name: Option<Ident>, class: &mut Class) {
        let old_state = take(&mut self.state.class);

        let class_decorators = take(&mut class.decorators);

        // Iterate over the class to see if we need to decorate it, and also to
        // transform simple auto accessors which are not decorated, and handle inferred
        // class name when the initializer of the class field is a class expression

        for el in class.body.iter_mut() {
            if !is_class_decoratable_element_path(el) {
                continue;
            }

            if !el.is_static() {
                if let Key::Private(name) = el.key {
                    self.state.instance_private_names.push(name);
                }
            }

            if is_decorated(el) {
                match el {}
            }
        }

        self.state.class = old_state;
    }
}

impl VisitMut for DecoratorPass {
    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        self.transform_class(Some(node.ident.clone()), &mut node.class);
    }

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        self.transform_class(node.ident.clone(), &mut node.class);
    }
}

impl ClassState {
    fn uses_function_context_or_yield_await(&self, dec: &Decorator) -> bool {
        let nr = NodeRef::from(dec);
        let mut iter = nr.experimental_traverse();

        iter.any(|n| match n {
            NodeRef::ThisExpr(..)
            | NodeRef::Super(..)
            | NodeRef::AwaitExpr(..)
            | NodeRef::YieldExpr(..)
            | NodeRef::MetaPropKind(MetaPropKind::NewTarget) => true,

            NodeRef::Ident(i) => {
                if i.sym == "arguments" {
                    return true;
                }

                if self.class_id_name == Some(i.to_id()) {
                    return true;
                }

                false
            }

            _ => false,
        })
    }
}

struct PropertyVisitor {}

impl VisitMut for PropertyVisitor {}
