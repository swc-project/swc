use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn hook(dev: bool) -> impl VisitMutHook<()> {
    JsxSelf {
        dev,
        ctx: Default::default(),
    }
}

/// See <https://github.com/babel/babel/blob/1bdb1a4175ed1fc40751fb84dc4ad1900260f28f/packages/babel-plugin-transform-react-jsx-self/src/index.ts#L27>
#[derive(Clone, Copy, Default)]
struct Context {
    in_constructor: bool,
    in_derived_class: bool,
}

#[derive(Clone, Copy)]
struct JsxSelf {
    dev: bool,
    ctx: Context,
}

// For tests
#[cfg(test)]
fn jsx_self(dev: bool) -> impl Pass {
    use swc_ecma_hooks::VisitMutWithHook;
    use swc_ecma_visit::visit_mut_pass;

    visit_mut_pass(VisitMutWithHook {
        hook: hook(dev),
        context: (),
    })
}

impl JsxSelf {
    fn with_in_constructor<N: VisitMutWith<JsxSelf>>(&mut self, in_constructor: bool, n: &mut N) {
        let old = self.ctx;
        self.ctx.in_constructor = in_constructor;
        n.visit_mut_children_with(self);
        self.ctx = old;
    }
}

// JsxSelf also needs to implement VisitMut for internal use
impl VisitMut for JsxSelf {
    noop_visit_mut_type!();

    fn visit_mut_jsx_opening_element(&mut self, n: &mut JSXOpeningElement) {
        if !self.dev {
            return;
        }

        if self.ctx.in_constructor && self.ctx.in_derived_class {
            return;
        }

        n.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__self")),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(ThisExpr { span: DUMMY_SP }.into())),
            })),
        }));
    }
}

impl VisitMutHook<()> for JsxSelf {
    fn enter_class(&mut self, n: &mut Class, _ctx: &mut ()) {
        self.ctx.in_derived_class = n.super_class.is_some();
    }

    fn exit_class(&mut self, _n: &mut Class, _ctx: &mut ()) {
        self.ctx.in_derived_class = false;
    }

    fn enter_fn_decl(&mut self, n: &mut FnDecl, _ctx: &mut ()) {
        self.with_in_constructor(false, n);
    }

    fn enter_fn_expr(&mut self, n: &mut FnExpr, _ctx: &mut ()) {
        self.with_in_constructor(false, n);
    }

    fn enter_prop(&mut self, n: &mut Prop, _ctx: &mut ()) {
        match n {
            Prop::Getter(_) | Prop::Setter(_) | Prop::Method(_) => {
                self.with_in_constructor(false, n)
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn enter_class_member(&mut self, n: &mut ClassMember, _ctx: &mut ()) {
        match n {
            ClassMember::Constructor(_) => self.with_in_constructor(true, n),
            ClassMember::Method(_)
            | ClassMember::PrivateMethod(_)
            | ClassMember::StaticBlock(_) => self.with_in_constructor(false, n),
            _ => n.visit_mut_children_with(self),
        }
    }

    fn enter_jsx_opening_element(&mut self, n: &mut JSXOpeningElement, _ctx: &mut ()) {
        if !self.dev {
            return;
        }

        // https://github.com/babel/babel/blob/1bdb1a4175ed1fc40751fb84dc4ad1900260f28f/packages/babel-plugin-transform-react-jsx-self/src/index.ts#L50
        if self.ctx.in_constructor && self.ctx.in_derived_class {
            return;
        }

        n.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__self")),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(ThisExpr { span: DUMMY_SP }.into())),
            })),
        }));
    }
}
