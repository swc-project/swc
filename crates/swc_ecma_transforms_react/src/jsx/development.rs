use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// Context for tracking jsx self state
#[derive(Clone, Copy, Default)]
pub(crate) struct DevelopmentContext {
    pub in_constructor: bool,
    pub in_derived_class: bool,
}

pub(crate) trait JsxDev: VisitMut {
    fn development_ctxt(&mut self) -> &mut DevelopmentContext;

    /// Helper method to run a closure with modified in_constructor state
    fn with_in_constructor<N: VisitMutWith<Self>>(&mut self, in_constructor: bool, n: &mut N) {
        let ctxt = *self.development_ctxt();
        self.development_ctxt().in_constructor = in_constructor;
        n.visit_mut_children_with(self);
        *self.development_ctxt() = ctxt;
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        let ctxt = *self.development_ctxt();
        self.development_ctxt().in_derived_class = n.super_class.is_some();
        n.visit_mut_children_with(self);
        *self.development_ctxt() = ctxt;
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        self.with_in_constructor(false, n);
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        self.with_in_constructor(false, n);
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Getter(_) | Prop::Setter(_) | Prop::Method(_) => {
                self.with_in_constructor(false, n)
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        match n {
            ClassMember::Constructor(_) => self.with_in_constructor(true, n),
            ClassMember::Method(_)
            | ClassMember::PrivateMethod(_)
            | ClassMember::StaticBlock(_) => self.with_in_constructor(false, n),
            _ => n.visit_mut_children_with(self),
        }
    }

    /// https://github.com/babel/babel/blob/1bdb1a4175ed1fc40751fb84dc4ad1900260f28f/packages/babel-plugin-transform-react-jsx-self/src/index.ts#L50
    fn is_this_allowed(&mut self) -> bool {
        !(self.development_ctxt().in_constructor && self.development_ctxt().in_derived_class)
    }

    fn self_props(&mut self) -> Expr {
        if self.is_this_allowed() {
            Expr::This(ThisExpr::dummy())
        } else {
            *Expr::undefined(DUMMY_SP)
        }
    }
}

macro_rules! visit_mut_development {
    () => {
        fn visit_mut_class(&mut self, n: &mut Class) {
            JsxDev::visit_mut_class(self, n);
        }

        fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
            JsxDev::visit_mut_fn_decl(self, n);
        }

        fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
            JsxDev::visit_mut_fn_expr(self, n);
        }

        fn visit_mut_prop(&mut self, n: &mut Prop) {
            JsxDev::visit_mut_prop(self, n);
        }

        fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
            JsxDev::visit_mut_class_member(self, n);
        }
    };
}

pub(crate) use visit_mut_development;
