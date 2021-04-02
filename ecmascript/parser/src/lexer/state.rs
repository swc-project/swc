use super::{Context, Input, Lexer};
use crate::{error::Error, input::Tokens, lexer::util::CharExt, token::*, JscTarget, Syntax};
use enum_kind::Kind;
use log::trace;
use std::{mem, mem::take};
use swc_common::BytePos;

/// State of lexer.
///
/// Ported from babylon.
#[derive(Clone)]
pub(super) struct State {
    pub is_expr_allowed: bool,
    pub octal_pos: Option<BytePos>,
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// TODO: Remove this field.
    is_first: bool,
    pub start: BytePos,
    pub cur_line: usize,
    pub line_start: BytePos,
    pub prev_hi: BytePos,

    context: TokenContexts,
    syntax: Syntax,

    token_type: Option<TokenType>,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
enum TokenType {
    Template,
    Dot,
    Colon,
    LBrace,
    RParen,
    Semi,
    BinOp(BinOpToken),
    Keyword(Keyword),
    JSXName,
    JSXText,
    JSXTagStart,
    JSXTagEnd,
    Other {
        before_expr: bool,
        can_have_trailing_comment: bool,
    },
}
impl TokenType {
    fn before_expr(self) -> bool {
        match self {
            TokenType::JSXName
            | TokenType::JSXTagStart
            | TokenType::JSXTagEnd
            | TokenType::Template
            | TokenType::Dot
            | TokenType::RParen => false,

            TokenType::JSXText | TokenType::Colon | TokenType::LBrace | TokenType::Semi => true,
            TokenType::BinOp(b) => b.before_expr(),
            TokenType::Keyword(k) => k.before_expr(),
            TokenType::Other { before_expr, .. } => before_expr,
        }
    }
}

impl<'a> From<&'a Token> for TokenType {
    fn from(t: &Token) -> Self {
        match *t {
            Token::Template { .. } => TokenType::Template,
            Token::Dot => TokenType::Dot,
            Token::Colon => TokenType::Colon,
            Token::LBrace => TokenType::LBrace,
            Token::RParen => TokenType::RParen,
            Token::Semi => TokenType::Semi,
            Token::JSXTagEnd => TokenType::JSXTagEnd,
            Token::JSXTagStart => TokenType::JSXTagStart,
            Token::JSXText { .. } => TokenType::JSXText,
            Token::JSXName { .. } => TokenType::JSXName,
            Token::BinOp(op) => TokenType::BinOp(op),

            Token::Word(Word::Keyword(k)) => TokenType::Keyword(k),
            _ => TokenType::Other {
                before_expr: t.before_expr(),
                can_have_trailing_comment: match *t {
                    Token::Num(..)
                    | Token::Str { .. }
                    | Token::Word(Word::Ident(..))
                    | Token::DollarLBrace
                    | Token::Regex(..)
                    | Token::BigInt(..)
                    | Token::JSXText { .. }
                    | Token::RBrace => true,

                    _ => false,
                },
            },
        }
    }
}

impl<I: Input> Tokens for Lexer<'_, I> {
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.module && !self.module_errors.borrow().is_empty() {
            let mut module_errors = self.module_errors.borrow_mut();
            self.errors.borrow_mut().append(&mut *module_errors);
        }
        self.ctx = ctx
    }

    fn ctx(&self) -> Context {
        self.ctx
    }

    fn syntax(&self) -> Syntax {
        self.syntax
    }
    fn target(&self) -> JscTarget {
        self.target
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.set_expr_allowed(allow)
    }

    fn token_context(&self) -> &TokenContexts {
        &self.state.context
    }
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.state.context
    }

    fn set_token_context(&mut self, c: TokenContexts) {
        self.state.context = c;
    }

    fn add_error(&self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    fn add_module_mode_error(&self, error: Error) {
        if self.ctx.module {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }
}

impl<'a, I: Input> Iterator for Lexer<'a, I> {
    type Item = TokenAndSpan;
    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = (|| -> Result<Option<_>, _> {
            if self.state.is_first {
                if let Some(shebang) = self.read_shebang()? {
                    return Ok(Some(Token::Shebang(shebang)));
                }
            }

            self.state.had_line_break = self.state.is_first;
            self.state.is_first = false;

            // skip spaces before getting next character, if we are allowed to.
            if self.state.can_skip_space() {
                self.skip_space()?;
                start = self.input.cur_pos();
            };

            let c = match self.input.cur() {
                Some(c) => c,
                // End of input.
                None => {
                    // Treat last comments as trailing.

                    if self
                        .leading_comments_buffer
                        .as_ref()
                        .map(|v| !v.borrow().is_empty())
                        .unwrap_or(false)
                    {
                        let last = self.state.prev_hi;

                        for c in self
                            .leading_comments_buffer
                            .as_ref()
                            .map(|v| v.borrow_mut())
                            .unwrap()
                            .drain(..)
                        {
                            self.comments.as_mut().unwrap().add_trailing(last, c);
                        }
                    }

                    return Ok(None);
                }
            };

            // println!(
            //     "\tContext: ({:?}) {:?}",
            //     self.input.cur().unwrap(),
            //     self.state.context.0
            // );

            self.state.start = start;

            if self.syntax.typescript() && self.ctx.in_type {
                if c == '<' {
                    self.input.bump();
                    return Ok(Some(tok!('<')));
                } else if c == '>' {
                    self.input.bump();
                    return Ok(Some(tok!('>')));
                }
            }

            if self.syntax.jsx() && !self.ctx.in_property_name && !self.ctx.in_type {
                //jsx
                if self.state.context.current() == Some(TokenContext::JSXExpr) {
                    return self.read_jsx_token();
                }

                let c = self.cur();
                if let Some(c) = c {
                    if self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                        || self.state.context.current() == Some(TokenContext::JSXClosingTag)
                    {
                        if c.is_ident_start() {
                            return self.read_jsx_word().map(Some);
                        }

                        if c == '>' {
                            self.input.bump();
                            return Ok(Some(Token::JSXTagEnd));
                        }

                        if (c == '\'' || c == '"')
                            && self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                        {
                            return self.read_jsx_str(c).map(Some);
                        }
                    }

                    if c == '<' && self.state.is_expr_allowed && self.input.peek() != Some('!') {
                        self.input.bump();
                        return Ok(Some(Token::JSXTagStart));
                    }
                }
            }

            if let Some(TokenContext::Tpl {
                start: start_pos_of_tpl,
            }) = self.state.context.current()
            {
                self.read_tmpl_token(start_pos_of_tpl).map(Some)
            } else {
                self.read_token()
            }
        })();

        let token = match res.map_err(Token::Error).map_err(Some) {
            Ok(t) => t,
            Err(e) => e,
        };

        let span = self.span(start);
        if let Some(ref token) = token {
            if self.leading_comments_buffer.is_some()
                && !self
                    .leading_comments_buffer
                    .as_ref()
                    .unwrap()
                    .borrow()
                    .is_empty()
            {
                self.comments.as_ref().unwrap().add_leading_comments(
                    start,
                    mem::replace(
                        &mut *self
                            .leading_comments_buffer
                            .as_ref()
                            .map(|v| v.borrow_mut())
                            .unwrap(),
                        vec![],
                    ),
                );
            }
            self.state.update(start, &token);
            self.state.prev_hi = self.last_pos();
        }

        token.map(|token| {
            // Attach span to token.
            TokenAndSpan {
                token,
                had_line_break: self.had_line_break_before_last(),
                span,
            }
        })
    }
}

impl State {
    pub fn new(syntax: Syntax) -> Self {
        State {
            is_expr_allowed: true,
            octal_pos: None,
            is_first: true,
            had_line_break: false,
            prev_hi: BytePos(0),
            context: TokenContexts(vec![TokenContext::BraceStmt]),
            token_type: None,
            start: BytePos(0),
            line_start: BytePos(0),
            cur_line: 1,
            syntax,
        }
    }
}

impl State {
    pub fn can_skip_space(&self) -> bool {
        !self
            .context
            .current()
            .map(|t| t.preserve_space())
            .unwrap_or(false)
    }

    pub fn can_have_trailing_comment(&self) -> bool {
        match self.token_type {
            Some(TokenType::Keyword(..)) => false,
            Some(TokenType::Semi) | Some(TokenType::LBrace) => true,
            Some(TokenType::Other {
                can_have_trailing_comment,
                ..
            }) => can_have_trailing_comment,
            _ => false,
        }
    }

    pub fn last_was_tpl_element(&self) -> bool {
        match self.token_type {
            Some(TokenType::Template) => true,
            _ => false,
        }
    }

    fn update(&mut self, start: BytePos, next: &Token) {
        trace!(
            "updating state: next={:?}, had_line_break={} ",
            next,
            self.had_line_break
        );
        let prev = self.token_type.take();
        self.token_type = Some(TokenType::from(next));

        self.is_expr_allowed = Self::is_expr_allowed_on_next(
            &mut self.context,
            self.syntax,
            prev,
            start,
            next,
            self.had_line_break,
            self.is_expr_allowed,
        );
    }

    /// `is_expr_allowed`: previous value.
    /// `start`: start of newly produced token.
    fn is_expr_allowed_on_next(
        context: &mut TokenContexts,
        syntax: Syntax,
        prev: Option<TokenType>,
        start: BytePos,
        next: &Token,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        let is_next_keyword = match *next {
            Word(Word::Keyword(..)) => true,
            _ => false,
        };

        if is_next_keyword && prev == Some(TokenType::Dot) {
            false
        } else {
            // ported updateContext
            match *next {
                tok!(')') | tok!('}') => {
                    // TODO: Verify
                    if context.len() == 1 {
                        return true;
                    }

                    let out = context.pop().unwrap();

                    // let a = function(){}
                    if out == TokenContext::BraceStmt
                        && context.current() == Some(TokenContext::FnExpr)
                    {
                        context.pop();
                        return false;
                    }

                    // ${} in template
                    if out == TokenContext::TplQuasi {
                        match context.current() {
                            Some(TokenContext::Tpl { .. }) => return false,
                            _ => return true,
                        }
                    }

                    // expression cannot follow expression
                    !out.is_expr()
                }

                tok!("function") => {
                    // This is required to lex
                    // `x = function(){}/42/i`
                    if is_expr_allowed
                        && !context.is_brace_block(prev, had_line_break, is_expr_allowed)
                    {
                        context.push(TokenContext::FnExpr);
                    }
                    false
                }

                // for (a of b) {}
                tok!("of")
                    if Some(TokenContext::ParenStmt { is_for_loop: true }) == context.current() =>
                {
                    // e.g. for (a of _) => true
                    !prev
                        .expect("context.current() if ParenStmt, so prev token cannot be None")
                        .before_expr()
                }

                Word(Word::Ident(..)) => {
                    // variable declaration
                    match prev {
                        Some(prev) => match prev {
                            // handle automatic semicolon insertion.
                            TokenType::Keyword(Let)
                            | TokenType::Keyword(Const)
                            | TokenType::Keyword(Var)
                                if had_line_break =>
                            {
                                true
                            }
                            _ => false,
                        },
                        _ => false,
                    }
                }

                tok!('{') => {
                    let cur = context.current();
                    if syntax.jsx() && cur == Some(TokenContext::JSXOpeningTag) {
                        context.push(TokenContext::BraceExpr)
                    } else if syntax.jsx() && cur == Some(TokenContext::JSXExpr) {
                        context.push(TokenContext::TplQuasi);
                    } else {
                        let next_ctxt =
                            if context.is_brace_block(prev, had_line_break, is_expr_allowed) {
                                TokenContext::BraceStmt
                            } else {
                                TokenContext::BraceExpr
                            };
                        context.push(next_ctxt);
                    }
                    true
                }

                tok!('/') if syntax.jsx() && prev == Some(TokenType::JSXTagStart) => {
                    context.pop();
                    context.pop(); // do not consider JSX expr -> JSX open tag -> ... anymore
                    context.push(TokenContext::JSXClosingTag); // reconsider as closing tag context
                    false
                }

                tok!("${") => {
                    context.push(TokenContext::TplQuasi);
                    true
                }

                tok!('(') => {
                    // if, for, with, while is statement

                    context.push(match prev {
                        Some(TokenType::Keyword(k)) => match k {
                            If | With | While => TokenContext::ParenStmt { is_for_loop: false },
                            For => TokenContext::ParenStmt { is_for_loop: true },
                            _ => TokenContext::ParenExpr,
                        },
                        _ => TokenContext::ParenExpr,
                    });
                    true
                }

                // remains unchanged.
                tok!("++") | tok!("--") => is_expr_allowed,

                tok!('`') => {
                    // If we are in template, ` terminates template.
                    if let Some(TokenContext::Tpl { .. }) = context.current() {
                        context.pop();
                    } else {
                        context.push(TokenContext::Tpl { start });
                    }
                    false
                }

                // tt.jsxTagStart.updateContext
                Token::JSXTagStart => {
                    context.push(TokenContext::JSXExpr); // treat as beginning of JSX expression
                    context.push(TokenContext::JSXOpeningTag); // start opening tag context
                    false
                }

                // tt.jsxTagEnd.updateContext
                Token::JSXTagEnd => {
                    let out = context.pop();
                    if (out == Some(TokenContext::JSXOpeningTag)
                        && prev == Some(TokenType::BinOp(BinOpToken::Div)))
                        || out == Some(TokenContext::JSXClosingTag)
                    {
                        context.pop();
                        context.current() == Some(TokenContext::JSXExpr)
                    } else {
                        true
                    }
                }

                _ => next.before_expr(),
            }
        }
    }
}

#[derive(Clone, Default)]
pub struct TokenContexts(pub(crate) Vec<TokenContext>);
impl TokenContexts {
    /// Returns true if following `LBrace` token is `block statement` according
    /// to  `ctx`, `prev`, `is_expr_allowed`.
    fn is_brace_block(
        &self,
        prev: Option<TokenType>,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        if let Some(TokenType::Colon) = prev {
            match self.current() {
                Some(TokenContext::BraceStmt) => return true,
                // `{ a: {} }`
                //     ^ ^
                Some(TokenContext::BraceExpr) => return false,
                _ => {}
            };
        }

        match prev {
            //  function a() {
            //      return { a: "" };
            //  }
            //  function a() {
            //      return
            //      {
            //          function b(){}
            //      };
            //  }
            Some(TokenType::Keyword(Return)) | Some(TokenType::Keyword(Yield)) => {
                return had_line_break;
            }

            Some(TokenType::Keyword(Else))
            | Some(TokenType::Semi)
            | None
            | Some(TokenType::RParen) => {
                return true;
            }

            // If previous token was `{`
            Some(TokenType::LBrace) => return self.current() == Some(TokenContext::BraceStmt),

            // `class C<T> { ... }`
            Some(TokenType::BinOp(Lt)) | Some(TokenType::BinOp(Gt)) => return true,
            _ => {}
        }

        !is_expr_allowed
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
    pub fn pop(&mut self) -> Option<TokenContext> {
        let opt = self.0.pop();
        trace!("context.pop({:?})", opt);
        opt
    }
    pub fn current(&self) -> Option<TokenContext> {
        self.0.last().cloned()
    }
    fn push(&mut self, t: TokenContext) {
        trace!("context.push({:?})", t);
        self.0.push(t);
    }
}

/// The algorithm used to determine whether a regexp can appear at a
/// given point in the program is loosely based on sweet.js' approach.
/// See https://github.com/mozilla/sweet.js/wiki/design
#[derive(Debug, Clone, Copy, PartialEq, Eq, Kind)]
#[kind(function(is_expr = "bool", preserve_space = "bool"))]
pub enum TokenContext {
    BraceStmt,
    #[kind(is_expr)]
    BraceExpr,
    #[kind(is_expr)]
    TplQuasi,
    ParenStmt {
        /// Is this `for` loop?
        is_for_loop: bool,
    },
    #[kind(is_expr)]
    ParenExpr,
    #[kind(is_expr, preserve_space)]
    Tpl {
        /// Start of a template literal.
        start: BytePos,
    },
    #[kind(is_expr)]
    FnExpr,
    JSXOpeningTag,
    JSXClosingTag,
    #[kind(is_expr, preserve_space)]
    JSXExpr,
}

#[cfg(test)]
pub(crate) fn with_lexer<F, Ret>(
    syntax: Syntax,
    target: JscTarget,
    s: &str,
    f: F,
) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&mut Lexer<'_, crate::lexer::input::StringInput<'_>>) -> Result<Ret, ()>,
{
    crate::with_test_sess(s, |_, fm| {
        let mut l = Lexer::new(syntax, target, fm, None);
        let res = f(&mut l);

        let c = vec![TokenContext::BraceStmt];
        debug_assert_eq!(l.state.context.0, c);

        res
    })
}

#[cfg(test)]
pub(crate) fn lex(syntax: Syntax, s: &'static str) -> Vec<TokenAndSpan> {
    with_lexer(syntax, Default::default(), s, |l| Ok(l.collect())).unwrap()
}

/// lex `s` within module context.
#[cfg(test)]
pub(crate) fn lex_module_errors(syntax: Syntax, s: &'static str) -> Vec<Error> {
    with_lexer(syntax, Default::default(), s, |l| {
        l.ctx.strict = true;
        l.ctx.module = true;

        let _: Vec<_> = l.collect();

        Ok(l.take_errors())
    })
    .unwrap()
}

#[cfg(test)]
pub(crate) fn lex_tokens(syntax: Syntax, s: &'static str) -> Vec<Token> {
    with_lexer(syntax, Default::default(), s, |l| {
        Ok(l.map(|ts| ts.token).collect())
    })
    .unwrap()
}

#[cfg(test)]
pub(crate) fn lex_tokens_with_target(
    syntax: Syntax,
    target: JscTarget,
    s: &'static str,
) -> Vec<Token> {
    with_lexer(syntax, target, s, |l| Ok(l.map(|ts| ts.token).collect())).unwrap()
}

/// Returns `(tokens, recovered_errors)`. `(tokens)` may contain an error token
/// if the lexer fails to recover from it.
#[cfg(test)]
pub(crate) fn lex_errors(syntax: Syntax, s: &'static str) -> (Vec<Token>, Vec<Error>) {
    with_lexer(syntax, JscTarget::Es2020, s, |l| {
        let tokens = l.map(|ts| ts.token).collect();
        let errors = l.take_errors();
        Ok((tokens, errors))
    })
    .unwrap()
}
