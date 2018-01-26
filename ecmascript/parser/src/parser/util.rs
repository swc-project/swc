use super::*;
use swc_common::Spanned;

impl Context {
    pub fn is_reserved_word(self, word: &JsWord) -> bool {
        match *word {
            js_word!("let") => self.strict,
            js_word!("await") => self.in_async || self.strict,
            js_word!("yield") => self.in_generator || self.strict,

            js_word!("null")
            | js_word!("true")
            | js_word!("false")
            | js_word!("break")
            | js_word!("case")
            | js_word!("catch")
            | js_word!("continue")
            | js_word!("debugger")
            | js_word!("default")
            | js_word!("do")
            | js_word!("export")
            | js_word!("else")
            | js_word!("finally")
            | js_word!("for")
            | js_word!("function")
            | js_word!("if")
            | js_word!("return")
            | js_word!("switch")
            | js_word!("throw")
            | js_word!("try")
            | js_word!("var")
            | js_word!("const")
            | js_word!("while")
            | js_word!("with")
            | js_word!("new")
            | js_word!("this")
            | js_word!("super")
            | js_word!("class")
            | js_word!("extends")
            | js_word!("import")
            | js_word!("in")
            | js_word!("instanceof")
            | js_word!("typeof")
            | js_word!("void")
            | js_word!("delete") => true,

            // Future reserved word
            js_word!("enum") => true,

            js_word!("implements")
            | js_word!("package")
            | js_word!("protected")
            | js_word!("interface")
            | js_word!("private")
            | js_word!("public") if self.strict =>
            {
                return true
            }

            _ => false,
        }
    }
}

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx<'w>(&'w mut self, ctx: Context) -> WithCtx<'w, 'a, I> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    pub(super) fn set_ctx(&mut self, ctx: Context) {
        self.input.set_ctx(ctx);
    }

    pub(super) fn strict_mode<'w>(&'w mut self) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            strict: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn include_in_expr<'w>(&'w mut self, include_in_expr: bool) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            include_in_expr,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Parse with given closure
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> Ret
    where
        F: FnOnce(&mut Self) -> Ret,
    {
        f(self)
    }

    pub(super) fn spanned<F, Node, Ret>(&mut self, f: F) -> PResult<'a, Node>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Ret>,
        Node: Spanned<Ret>,
    {
        let start = self.input.cur_pos();
        let val = f(self)?;

        let span = span!(start);
        Ok(Spanned::from_unspanned(val, span))
    }
}
pub trait ParseObject<'a, Obj> {
    type Prop;
    fn make_object(span: Span, props: Vec<Self::Prop>) -> Obj;
    fn parse_object_prop(&mut self) -> PResult<'a, Self::Prop>;
}

pub struct WithCtx<'w, 'a: 'w, I: 'w + Input> {
    inner: &'w mut Parser<'a, I>,
    orig_ctx: Context,
}
impl<'w, 'a, I: Input> Deref for WithCtx<'w, 'a, I> {
    type Target = Parser<'a, I>;
    #[inline(always)]
    fn deref(&self) -> &Parser<'a, I> {
        &self.inner
    }
}
impl<'w, 'a, I: Input> DerefMut for WithCtx<'w, 'a, I> {
    #[inline(always)]
    fn deref_mut(&mut self) -> &mut Parser<'a, I> {
        &mut self.inner
    }
}

impl<'w, 'a, I: Input> Drop for WithCtx<'w, 'a, I> {
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}

pub(super) trait ExprExt {
    fn as_expr_kind(&self) -> &ExprKind;

    /// "IsValidSimpleAssignmentTarget" from spec.
    fn is_valid_simple_assignment_target(&self, strict: bool) -> bool {
        match *self.as_expr_kind() {
            ExprKind::Ident(Ident { ref sym, .. }) => {
                if strict {
                    if &*sym == "arguments" || &*sym == "eval" {
                        return false;
                    }
                }
                true
            }

            ExprKind::This
            | ExprKind::Lit(..)
            | ExprKind::Array(..)
            | ExprKind::Object(..)
            | ExprKind::Fn(..)
            | ExprKind::Class(..)
            | ExprKind::Tpl(..) => false,
            ExprKind::Paren(ref expr) => expr.is_valid_simple_assignment_target(strict),

            ExprKind::Member(..) => true,

            ExprKind::New(..) | ExprKind::Call(..) => false,
            // TODO: Spec only mentions `new.target`
            ExprKind::MetaProp(..) => false,

            ExprKind::Update(..) => false,

            ExprKind::Unary(..) | ExprKind::Await(..) => false,

            ExprKind::Bin(..) => false,

            ExprKind::Cond(..) => false,

            ExprKind::Yield(..) | ExprKind::Arrow(..) | ExprKind::Assign(..) => false,

            ExprKind::Seq(..) => false,
        }
    }
}

impl ExprExt for Box<Expr> {
    fn as_expr_kind(&self) -> &ExprKind {
        &self.node
    }
}
impl ExprExt for Expr {
    fn as_expr_kind(&self) -> &ExprKind {
        &self.node
    }
}
impl ExprExt for ExprKind {
    fn as_expr_kind(&self) -> &ExprKind {
        self
    }
}
