use swc_atoms::js_word;

use super::*;
use crate::token::{IdentKind, Keyword, KnownIdent, WordKind};

impl Context {
    pub(crate) fn is_reserved(self, word: WordKind) -> bool {
        match word {
            WordKind::Keyword(Keyword::Let) => self.strict,
            WordKind::Keyword(Keyword::Await) => self.in_async || self.strict,
            WordKind::Keyword(Keyword::Yield) => self.in_generator || self.strict,

            WordKind::Null
            | WordKind::True
            | WordKind::False
            | WordKind::Keyword(Keyword::Break)
            | WordKind::Keyword(Keyword::Case)
            | WordKind::Keyword(Keyword::Catch)
            | WordKind::Keyword(Keyword::Continue)
            | WordKind::Keyword(Keyword::Debugger)
            | WordKind::Keyword(Keyword::Default_)
            | WordKind::Keyword(Keyword::Do)
            | WordKind::Keyword(Keyword::Export)
            | WordKind::Keyword(Keyword::Else)
            | WordKind::Keyword(Keyword::Finally)
            | WordKind::Keyword(Keyword::For)
            | WordKind::Keyword(Keyword::Function)
            | WordKind::Keyword(Keyword::If)
            | WordKind::Keyword(Keyword::Return)
            | WordKind::Keyword(Keyword::Switch)
            | WordKind::Keyword(Keyword::Throw)
            | WordKind::Keyword(Keyword::Try)
            | WordKind::Keyword(Keyword::Var)
            | WordKind::Keyword(Keyword::Const)
            | WordKind::Keyword(Keyword::While)
            | WordKind::Keyword(Keyword::With)
            | WordKind::Keyword(Keyword::New)
            | WordKind::Keyword(Keyword::This)
            | WordKind::Keyword(Keyword::Super)
            | WordKind::Keyword(Keyword::Class)
            | WordKind::Keyword(Keyword::Extends)
            | WordKind::Keyword(Keyword::Import)
            | WordKind::Keyword(Keyword::In)
            | WordKind::Keyword(Keyword::InstanceOf)
            | WordKind::Keyword(Keyword::TypeOf)
            | WordKind::Keyword(Keyword::Void)
            | WordKind::Keyword(Keyword::Delete) => true,

            // Future reserved word
            WordKind::Ident(IdentKind::Known(KnownIdent::Enum)) => true,

            // Future reserved word
            WordKind::Ident(IdentKind::Known(
                KnownIdent::Implements
                | KnownIdent::Package
                | KnownIdent::Protected
                | KnownIdent::Private
                | KnownIdent::Public
                | KnownIdent::Interface,
            )) => self.strict,

            _ => false,
        }
    }

    pub fn is_reserved_word(self, word: &JsWord) -> bool {
        match *word {
            js_word!("let") => self.strict,
            // SyntaxError in the module only, not in the strict.
            // ```JavaScript
            // function foo() {
            //     "use strict";
            //     let await = 1;
            // }
            // ```
            js_word!("await") => self.in_async || self.module,
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

impl<I: Tokens> Parser<I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx(&mut self, ctx: Context) -> WithCtx<I> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    /// Original state is restored when returned guard is dropped.
    pub(super) fn with_state(&mut self, state: State) -> WithState<I> {
        let orig_state = std::mem::replace(&mut self.state, state);
        WithState {
            orig_state,
            inner: self,
        }
    }

    pub(super) fn set_ctx(&mut self, ctx: Context) {
        self.input.set_ctx(ctx);
    }

    pub(super) fn strict_mode(&mut self) -> WithCtx<I> {
        let ctx = Context {
            strict: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn in_type(&mut self) -> WithCtx<I> {
        let ctx = Context {
            in_type: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn include_in_expr(&mut self, include_in_expr: bool) -> WithCtx<I> {
        let ctx = Context {
            include_in_expr,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Parse with given closure
    #[inline(always)]
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> PResult<Ret>
    where
        F: FnOnce(&mut Self) -> PResult<Ret>,
    {
        f(self)
    }

    pub(super) fn syntax(&self) -> Syntax {
        self.input.syntax()
    }
}
pub trait ParseObject<Obj> {
    type Prop;
    fn make_object(
        &mut self,
        span: Span,
        props: Vec<Self::Prop>,
        trailing_comma: Option<Span>,
    ) -> PResult<Obj>;
    fn parse_object_prop(&mut self) -> PResult<Self::Prop>;
}

pub struct WithState<'w, I: 'w + Tokens> {
    inner: &'w mut Parser<I>,
    orig_state: State,
}
impl<'w, I: Tokens> Deref for WithState<'w, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<'w, I: Tokens> DerefMut for WithState<'w, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}
impl<'w, I: Tokens> Drop for WithState<'w, I> {
    fn drop(&mut self) {
        std::mem::swap(&mut self.inner.state, &mut self.orig_state);
    }
}

pub struct WithCtx<'w, I: 'w + Tokens> {
    inner: &'w mut Parser<I>,
    orig_ctx: Context,
}
impl<'w, I: Tokens> Deref for WithCtx<'w, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<'w, I: Tokens> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<'w, I: Tokens> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}

pub(super) trait ExprExt {
    fn as_expr(&self) -> &Expr;

    /// "IsValidSimpleAssignmentTarget" from spec.
    fn is_valid_simple_assignment_target(&self, strict: bool) -> bool {
        match self.as_expr() {
            Expr::Ident(ident) => {
                if strict && ident.is_reserved_in_strict_bind() {
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
            Expr::Paren(ParenExpr { expr, .. }) => expr.is_valid_simple_assignment_target(strict),

            Expr::Member(MemberExpr { obj, .. }) => match obj.as_ref() {
                Expr::Member(..) => obj.is_valid_simple_assignment_target(strict),
                Expr::OptChain(..) => false,
                _ => true,
            },

            Expr::SuperProp(..) => true,

            Expr::New(..) | Expr::Call(..) => false,
            // TODO: Spec only mentions `new.target`
            Expr::MetaProp(..) => false,

            Expr::Update(..) => false,

            Expr::Unary(..) | Expr::Await(..) => false,

            Expr::Bin(..) => false,

            Expr::Cond(..) => false,

            Expr::Yield(..) | Expr::Arrow(..) | Expr::Assign(..) => false,

            Expr::Seq(..) => false,

            Expr::OptChain(..) => false,

            // MemberExpression is valid assignment target
            Expr::PrivateName(..) => false,

            // jsx
            Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => false,

            // typescript
            Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
            | Expr::TsAs(TsAsExpr { ref expr, .. })
            | Expr::TsInstantiation(TsInstantiation { ref expr, .. })
            | Expr::TsSatisfies(TsSatisfiesExpr { ref expr, .. }) => {
                expr.is_valid_simple_assignment_target(strict)
            }

            Expr::TsConstAssertion(..) => false,

            Expr::Invalid(..) => false,
        }
    }
}

impl ExprExt for Box<Expr> {
    fn as_expr(&self) -> &Expr {
        self
    }
}
impl ExprExt for Expr {
    fn as_expr(&self) -> &Expr {
        self
    }
}
