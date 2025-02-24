use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn jsx_self(dev: bool) -> impl Pass {
    visit_mut_pass(JsxSelf {
        dev,
        ctx: Default::default(),
    })
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

impl JsxSelf {
    fn with_in_constructor<N: VisitMutWith<JsxSelf>>(&mut self, in_constructor: bool, n: &mut N) {
        let old = self.ctx;
        self.ctx.in_constructor = in_constructor;
        n.visit_mut_children_with(self);
        self.ctx = old;
    }
}

impl Parallel for JsxSelf {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for JsxSelf {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old = self.ctx;
        self.ctx.in_derived_class = n.super_class.is_some();
        n.visit_mut_children_with(self);
        self.ctx = old;
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

    fn visit_mut_jsx_opening_element(&mut self, n: &mut JSXOpeningElement) {
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
