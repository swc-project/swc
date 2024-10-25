use std::{borrow::Cow, mem};

use swc_common::{pass::CompilerPass, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{should_work, Check};
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith,
};
use swc_trace_macro::swc_trace;

pub fn new_target() -> impl Pass {
    visit_mut_pass(NewTarget {
        ctx: Ctx::Constructor,
    })
}

struct NewTarget {
    ctx: Ctx,
}

enum Ctx {
    Constructor,
    Method,
    Function(Ident),
}

impl NewTarget {
    fn visit_mut_method<T: VisitMutWith<Self>>(&mut self, c: &mut T) {
        let old = mem::replace(&mut self.ctx, Ctx::Method);

        c.visit_mut_with(self);

        self.ctx = old;
    }
}

#[swc_trace]
impl VisitMut for NewTarget {
    noop_visit_mut_type!(fail);

    fn visit_mut_class_method(&mut self, c: &mut ClassMethod) {
        c.key.visit_mut_with(self);

        self.visit_mut_method(&mut c.function)
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let old = mem::replace(&mut self.ctx, Ctx::Constructor);

        c.visit_mut_children_with(self);

        self.ctx = old;
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::MetaProp(MetaPropExpr {
            kind: MetaPropKind::NewTarget,
            span,
        }) = e
        {
            let this_ctor = |span| {
                ThisExpr { span }
                    .make_member(quote_ident!("constructor"))
                    .into()
            };
            match &self.ctx {
                Ctx::Constructor => *e = this_ctor(*span),
                Ctx::Method => *e = *Expr::undefined(DUMMY_SP),
                Ctx::Function(i) => {
                    *e = CondExpr {
                        span: *span,
                        // this instanceof Foo
                        test: BinExpr {
                            span: DUMMY_SP,
                            op: op!("instanceof"),
                            left: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                            right: Box::new(Expr::Ident(i.clone())),
                        }
                        .into(),
                        cons: Box::new(this_ctor(DUMMY_SP)),
                        // void 0
                        alt: Expr::undefined(DUMMY_SP),
                    }
                    .into()
                }
            }
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        // Ensure that `f` contains `new.target`.
        if !should_work::<ShouldWork, _>(&*f) {
            return;
        }

        let old = mem::replace(&mut self.ctx, Ctx::Function(f.ident.clone()));

        f.visit_mut_children_with(self);

        self.ctx = old;
    }

    fn visit_mut_fn_expr(&mut self, f: &mut FnExpr) {
        // Ensure that `f` contains `new.target`.
        if !should_work::<ShouldWork, _>(&*f) {
            return;
        }

        let i = f
            .ident
            .get_or_insert_with(|| private_ident!("_target"))
            .clone();

        let old = mem::replace(&mut self.ctx, Ctx::Function(i));

        f.visit_mut_children_with(self);

        self.ctx = old;
    }

    fn visit_mut_method_prop(&mut self, m: &mut MethodProp) {
        m.key.visit_mut_with(self);
        self.visit_mut_method(&mut m.function)
    }

    fn visit_mut_getter_prop(&mut self, m: &mut GetterProp) {
        m.key.visit_mut_with(self);
        self.visit_mut_method(&mut m.body)
    }

    fn visit_mut_setter_prop(&mut self, m: &mut SetterProp) {
        m.key.visit_mut_with(self);
        self.visit_mut_method(&mut m.body)
    }
}

impl CompilerPass for NewTarget {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("new-target")
    }
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!(fail);

    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr) {
        if let MetaPropExpr {
            kind: MetaPropKind::NewTarget,
            ..
        } = n
        {
            self.found = true;
        }
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
