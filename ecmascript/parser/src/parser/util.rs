use super::*;
use swc_atoms::js_word;

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
            | js_word!("public")
                if self.strict =>
            {
                true
            }

            _ => false,
        }
    }
}

impl<'a, I: Tokens> Parser<'a, I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx<'w>(&'w mut self, ctx: Context) -> WithCtx<'w, 'a, I> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    /// Original state is restored when returned guard is dropped.
    pub(super) fn with_state<'w>(&'w mut self, state: State) -> WithState<'w, 'a, I> {
        let orig_state = std::mem::replace(&mut self.state, state);
        WithState {
            orig_state,
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
    pub(super) fn in_type<'w>(&'w mut self) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            in_type: true,
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
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> PResult<'a, Ret>
    where
        F: FnOnce(&mut Self) -> PResult<'a, Ret>,
    {
        f(self)
    }

    /// Creates a span from `start` to current pos.
    pub(super) fn span(&mut self, start: BytePos) -> Span {
        let end = last_pos!(self);
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        Span::new(start, end, Default::default())
    }

    pub(super) fn syntax(&self) -> Syntax {
        self.input.syntax()
    }
}
pub trait ParseObject<'a, Obj> {
    type Prop;
    fn make_object(&mut self, span: Span, props: Vec<Self::Prop>) -> PResult<'a, Obj>;
    fn parse_object_prop(&mut self) -> PResult<'a, Self::Prop>;
}

pub struct WithState<'w, 'a: 'w, I: 'w + Tokens> {
    inner: &'w mut Parser<'a, I>,
    orig_state: State,
}
impl<'w, 'a, I: Tokens> Deref for WithState<'w, 'a, I> {
    type Target = Parser<'a, I>;

    fn deref(&self) -> &Parser<'a, I> {
        &self.inner
    }
}
impl<'w, 'a, I: Tokens> DerefMut for WithState<'w, 'a, I> {
    fn deref_mut(&mut self) -> &mut Parser<'a, I> {
        &mut self.inner
    }
}
impl<'w, 'a, I: Tokens> Drop for WithState<'w, 'a, I> {
    fn drop(&mut self) {
        std::mem::swap(&mut self.inner.state, &mut self.orig_state);
    }
}

pub struct WithCtx<'w, 'a: 'w, I: 'w + Tokens> {
    inner: &'w mut Parser<'a, I>,
    orig_ctx: Context,
}
impl<'w, 'a, I: Tokens> Deref for WithCtx<'w, 'a, I> {
    type Target = Parser<'a, I>;

    fn deref(&self) -> &Parser<'a, I> {
        &self.inner
    }
}
impl<'w, 'a, I: Tokens> DerefMut for WithCtx<'w, 'a, I> {
    fn deref_mut(&mut self) -> &mut Parser<'a, I> {
        &mut self.inner
    }
}

impl<'w, 'a, I: Tokens> Drop for WithCtx<'w, 'a, I> {
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}

pub(super) trait ExprExt {
    fn as_expr(&self) -> &Expr;

    /// "IsValidSimpleAssignmentTarget" from spec.
    fn is_valid_simple_assignment_target(&self, strict: bool) -> bool {
        match *self.as_expr() {
            Expr::Ident(Ident { ref sym, .. }) => {
                if strict && (&*sym == "arguments" || &*sym == "eval") {
                    return false;
                }
                true
            }

            Expr::This(..)
            | Expr::Lit(..)
            | Expr::Array(..)
            | Expr::Object(..)
            | Expr::Fn(..)
            | Expr::Class(..)
            | Expr::Tpl(..)
            | Expr::TaggedTpl(..) => false,
            Expr::Paren(ParenExpr { ref expr, .. }) => {
                expr.is_valid_simple_assignment_target(strict)
            }

            Expr::Member(..) => true,

            Expr::New(..) | Expr::Call(..) => false,
            // TODO: Spec only mentions `new.target`
            Expr::MetaProp(..) => false,

            Expr::Update(..) => false,

            Expr::Unary(..) | Expr::Await(..) => false,

            Expr::Bin(..) => false,

            Expr::Cond(..) => false,

            Expr::Yield(..) | Expr::Arrow(..) | Expr::Assign(..) => false,

            Expr::Seq(..) => false,

            // MemberExpression is valid assignment target
            Expr::PrivateName(..) => false,

            // jsx
            Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => false,

            // typescript
            Expr::OptChain(OptChainExpr { ref expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
            | Expr::TsTypeCast(TsTypeCastExpr { ref expr, .. })
            | Expr::TsAs(TsAsExpr { ref expr, .. }) => {
                expr.is_valid_simple_assignment_target(strict)
            }

            Expr::TsConstAssertion(..) => false,

            Expr::Invalid(..) => false,
        }
    }
}

impl ExprExt for Box<Expr> {
    fn as_expr(&self) -> &Expr {
        &*self
    }
}
impl ExprExt for Expr {
    fn as_expr(&self) -> &Expr {
        self
    }
}
