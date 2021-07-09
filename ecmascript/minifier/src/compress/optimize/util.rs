use super::Ctx;
use super::Optimizer;
use std::ops::Deref;
use std::ops::DerefMut;
use swc_atoms::JsWord;
use swc_common::comments::Comment;
use swc_common::comments::CommentKind;
use swc_common::Mark;
use swc_common::Span;
use swc_ecma_ast::*;
use swc_ecma_utils::prop_name_eq;
use swc_ecma_utils::ExprExt;

impl<'b> Optimizer<'b> {
    pub(super) fn access_property<'e>(
        &mut self,
        expr: &'e mut Expr,
        prop: &JsWord,
    ) -> Option<&'e mut Expr> {
        match expr {
            Expr::Object(obj) => {
                for obj_prop in obj.props.iter_mut() {
                    match obj_prop {
                        PropOrSpread::Spread(_) => {}
                        PropOrSpread::Prop(p) => match &mut **p {
                            Prop::Shorthand(_) => {}
                            Prop::KeyValue(p) => {
                                if prop_name_eq(&p.key, &prop) {
                                    return Some(&mut *p.value);
                                }
                            }
                            Prop::Assign(_) => {}
                            Prop::Getter(_) => {}
                            Prop::Setter(_) => {}
                            Prop::Method(_) => {}
                        },
                    }
                }
            }
            _ => {}
        }

        None
    }

    pub(super) fn access_property_with_prop_name<'e>(
        &mut self,
        expr: &'e mut Expr,
        prop: &PropName,
    ) -> Option<&'e mut Expr> {
        match prop {
            PropName::Ident(p) => self.access_property(expr, &p.sym),
            PropName::Str(p) => self.access_property(expr, &p.value),
            PropName::Num(p) => self.access_numeric_property(expr, p.value as _),
            PropName::Computed(_) => None,
            PropName::BigInt(_) => None,
        }
    }

    pub(super) fn access_numeric_property<'e>(
        &mut self,
        _expr: &'e mut Expr,
        _idx: usize,
    ) -> Option<&'e mut Expr> {
        None
    }

    /// Check for `/** @const */`.
    pub(super) fn has_const_ann(&self, span: Span) -> bool {
        self.find_comment(span, |c| {
            if c.kind == CommentKind::Block {
                if !c.text.starts_with('*') {
                    return false;
                }
                let t = c.text[1..].trim();
                //
                if t.starts_with("@const") {
                    return true;
                }
            }

            false
        })
    }

    /// Check for `/*#__NOINLINE__*/`
    pub(super) fn has_noinline(&self, span: Span) -> bool {
        self.has_flag(span, "NOINLINE")
    }

    fn find_comment<F>(&self, span: Span, mut op: F) -> bool
    where
        F: FnMut(&Comment) -> bool,
    {
        let mut found = false;
        if let Some(comments) = self.comments {
            let cs = comments.get_leading(span.lo);
            if let Some(cs) = cs {
                for c in &cs {
                    found |= op(&c);
                    if found {
                        break;
                    }
                }
            }
        }

        found
    }

    fn has_flag(&self, span: Span, text: &'static str) -> bool {
        self.find_comment(span, |c| {
            if c.kind == CommentKind::Block {
                //
                if c.text.len() == (text.len() + 5)
                    && c.text.starts_with("#__")
                    && c.text.ends_with("__")
                    && text == &c.text[3..c.text.len() - 2]
                {
                    return true;
                }
            }

            false
        })
    }

    #[allow(unused)]
    pub(super) fn is_done(&mut self, span: Span) -> bool {
        let mut ctxt = span.ctxt;
        if ctxt == self.done_ctxt {
            return true;
        }
        loop {
            let mark = ctxt.remove_mark();
            if mark == Mark::root() {
                return false;
            }
            if mark == self.done {
                return true;
            }
        }
    }

    /// RAII guard to change context temporarically
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'b> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            reducer: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a, 'b> {
    reducer: &'a mut Optimizer<'b>,
    orig_ctx: Ctx,
}

impl<'b> Deref for WithCtx<'_, 'b> {
    type Target = Optimizer<'b>;

    fn deref(&self) -> &Self::Target {
        &self.reducer
    }
}

impl DerefMut for WithCtx<'_, '_> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.reducer
    }
}

impl Drop for WithCtx<'_, '_> {
    fn drop(&mut self) {
        self.reducer.ctx = self.orig_ctx;
    }
}

pub(crate) fn class_has_side_effect(c: &Class) -> bool {
    if let Some(e) = &c.super_class {
        if e.may_have_side_effects() {
            return true;
        }
    }

    for m in &c.body {
        match m {
            ClassMember::Method(p) => {
                if let PropName::Computed(key) = &p.key {
                    if key.expr.may_have_side_effects() {
                        return true;
                    }
                }
            }

            ClassMember::ClassProp(p) => {
                if p.computed {
                    if p.key.may_have_side_effects() {
                        return true;
                    }
                }

                if let Some(v) = &p.value {
                    if v.may_have_side_effects() {
                        return true;
                    }
                }
            }
            ClassMember::PrivateProp(p) => {
                if let Some(v) = &p.value {
                    if v.may_have_side_effects() {
                        return true;
                    }
                }
            }

            _ => {}
        }
    }

    false
}

pub(crate) fn is_valid_for_lhs(e: &Expr) -> bool {
    match e {
        Expr::Lit(..) => return false,
        Expr::Unary(..) => return false,
        _ => true,
    }
}
