use super::*;
use crate::token::{IdentLike, Keyword};

impl Context {
    pub(crate) fn is_reserved(self, word: &Word) -> bool {
        match *word {
            Word::Keyword(Keyword::Let) => self.strict,
            Word::Keyword(Keyword::Await) => self.in_async || self.in_static_block || self.strict,
            Word::Keyword(Keyword::Yield) => self.in_generator || self.strict,

            Word::Null
            | Word::True
            | Word::False
            | Word::Keyword(Keyword::Break)
            | Word::Keyword(Keyword::Case)
            | Word::Keyword(Keyword::Catch)
            | Word::Keyword(Keyword::Continue)
            | Word::Keyword(Keyword::Debugger)
            | Word::Keyword(Keyword::Default_)
            | Word::Keyword(Keyword::Do)
            | Word::Keyword(Keyword::Export)
            | Word::Keyword(Keyword::Else)
            | Word::Keyword(Keyword::Finally)
            | Word::Keyword(Keyword::For)
            | Word::Keyword(Keyword::Function)
            | Word::Keyword(Keyword::If)
            | Word::Keyword(Keyword::Return)
            | Word::Keyword(Keyword::Switch)
            | Word::Keyword(Keyword::Throw)
            | Word::Keyword(Keyword::Try)
            | Word::Keyword(Keyword::Var)
            | Word::Keyword(Keyword::Const)
            | Word::Keyword(Keyword::While)
            | Word::Keyword(Keyword::With)
            | Word::Keyword(Keyword::New)
            | Word::Keyword(Keyword::This)
            | Word::Keyword(Keyword::Super)
            | Word::Keyword(Keyword::Class)
            | Word::Keyword(Keyword::Extends)
            | Word::Keyword(Keyword::Import)
            | Word::Keyword(Keyword::In)
            | Word::Keyword(Keyword::InstanceOf)
            | Word::Keyword(Keyword::TypeOf)
            | Word::Keyword(Keyword::Void)
            | Word::Keyword(Keyword::Delete) => true,

            // Future reserved word
            Word::Ident(IdentLike::Known(known_ident!("enum"))) => true,

            Word::Ident(IdentLike::Known(
                known_ident!("implements")
                | known_ident!("package")
                | known_ident!("protected")
                | known_ident!("interface")
                | known_ident!("private")
                | known_ident!("public"),
            )) if self.strict => true,

            _ => false,
        }
    }

    #[cfg_attr(not(feature = "verify"), inline(always))]
    pub fn is_reserved_word(self, word: &Atom) -> bool {
        if !cfg!(feature = "verify") {
            return false;
        }

        match &**word {
            "let" => self.strict,
            // SyntaxError in the module only, not in the strict.
            // ```JavaScript
            // function foo() {
            //     "use strict";
            //     let await = 1;
            // }
            // ```
            "await" => self.in_async || self.in_static_block || self.module,
            "yield" => self.in_generator || self.strict,

            "null" | "true" | "false" | "break" | "case" | "catch" | "continue" | "debugger"
            | "default" | "do" | "export" | "else" | "finally" | "for" | "function" | "if"
            | "return" | "switch" | "throw" | "try" | "var" | "const" | "while" | "with"
            | "new" | "this" | "super" | "class" | "extends" | "import" | "in" | "instanceof"
            | "typeof" | "void" | "delete" => true,

            // Future reserved word
            "enum" => true,

            "implements" | "package" | "protected" | "interface" | "private" | "public"
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
impl<I: Tokens> Deref for WithState<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithState<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}
impl<I: Tokens> Drop for WithState<'_, I> {
    fn drop(&mut self) {
        std::mem::swap(&mut self.inner.state, &mut self.orig_state);
    }
}

pub struct WithCtx<'w, I: 'w + Tokens> {
    inner: &'w mut Parser<I>,
    orig_ctx: Context,
}
impl<I: Tokens> Deref for WithCtx<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithCtx<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<I: Tokens> Drop for WithCtx<'_, I> {
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
