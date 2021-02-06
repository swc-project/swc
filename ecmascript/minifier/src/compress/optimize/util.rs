use super::Ctx;
use super::Optimizer;
use std::ops::Deref;
use std::ops::DerefMut;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::Mark;
use swc_common::Span;

impl<'b> Optimizer<'b> {
    /// Check for `/*#__NOINLINE__*/`
    pub(super) fn has_noinline(&self, span: Span) -> bool {
        self.has_flag(span, "NOINLINE")
    }

    fn has_flag(&self, span: Span, text: &'static str) -> bool {
        let mut found = false;
        if let Some(comments) = self.comments {
            let cs = comments.take_leading(span.lo);
            if let Some(cs) = cs {
                for c in &cs {
                    if c.kind == CommentKind::Block {
                        //
                        if c.text.len() == (text.len() + 5)
                            && c.text.starts_with("#__")
                            && c.text.ends_with("__")
                            && text == &c.text[3..c.text.len() - 2]
                        {
                            found = true;
                            break;
                        }
                    }
                }

                comments.add_leading_comments(span.lo, cs);
            }
        }

        found
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
