use rustc_hash::FxHashSet;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

#[derive(Default)]
pub(super) struct InitializerUsage {
    pub captured: bool,
    pub has_yield: bool,
}

pub(super) fn analyze(decl: &VarDecl, bindings: &[Id]) -> InitializerUsage {
    let mut finder = InitializerCaptures {
        bindings: bindings.iter().cloned().collect(),
        in_closure: false,
        usage: Default::default(),
    };
    decl.visit_with(&mut finder);
    finder.usage
}

struct InitializerCaptures {
    bindings: FxHashSet<Id>,
    in_closure: bool,
    usage: InitializerUsage,
}

impl InitializerCaptures {
    fn visit_closure<N: VisitWith<Self>>(&mut self, node: &N) {
        let old = self.in_closure;
        self.in_closure = true;
        node.visit_with(self);
        self.in_closure = old;
    }

    fn visit_field_initializer(&mut self, value: &Option<Box<Expr>>, is_static: bool) {
        let old = self.in_closure;
        // Instance fields run on construction, which may happen after the loop
        // initializer. Static fields run immediately, like computed property keys.
        self.in_closure |= !is_static;
        value.visit_with(self);
        self.in_closure = old;
    }
}

impl Visit for InitializerCaptures {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, ident: &Ident) {
        if self.in_closure && self.bindings.contains(&ident.to_id()) {
            self.usage.captured = true;
        }
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        // Even immediate direct eval can create a closure over header bindings.
        // Optional calls have an OptCall node; comma/member callees are indirect.
        if call
            .callee
            .as_expr()
            .is_some_and(|expr| expr.unwrap_parens().is_ident_ref_to("eval"))
        {
            self.usage.captured = true;
        }
        call.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        self.visit_closure(&node.params);
        self.visit_closure(&node.body);
    }

    fn visit_yield_expr(&mut self, node: &YieldExpr) {
        self.usage.has_yield |= !self.in_closure;
        node.visit_children_with(self);
    }

    fn visit_function(&mut self, node: &Function) {
        // Decorators execute in the enclosing environment. Getter, setter and
        // method keys are visited before their Function nodes for the same reason.
        node.decorators.visit_with(self);
        for param in &node.params {
            param.decorators.visit_with(self);
            self.visit_closure(&param.pat);
        }
        self.visit_closure(&node.body);
    }

    fn visit_constructor(&mut self, node: &Constructor) {
        node.key.visit_with(self);
        for param in &node.params {
            match param {
                ParamOrTsParamProp::Param(param) => {
                    param.decorators.visit_with(self);
                    self.visit_closure(&param.pat);
                }
                ParamOrTsParamProp::TsParamProp(param) => {
                    param.decorators.visit_with(self);
                    self.visit_closure(&param.param);
                }
            }
        }
        self.visit_closure(&node.body);
    }

    fn visit_class_prop(&mut self, node: &ClassProp) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }

    fn visit_private_prop(&mut self, node: &PrivateProp) {
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }

    fn visit_auto_accessor(&mut self, node: &AutoAccessor) {
        node.key.visit_with(self);
        node.decorators.visit_with(self);
        self.visit_field_initializer(&node.value, node.is_static);
    }
}
