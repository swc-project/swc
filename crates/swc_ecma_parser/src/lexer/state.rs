use std::mem::take;

use swc_common::{BytePos, Span};
use tracing::trace;

use super::{
    comments_buffer::{BufferedComment, BufferedCommentKind},
    Context, Input, Lexer,
};
use crate::{
    error::{Error, SyntaxError},
    input::Tokens,
    lexer::util::CharExt,
    token::*,
    EsVersion, Syntax,
};

/// State of lexer.
///
/// Ported from babylon.
#[derive(Clone)]
pub(super) struct State {
    pub is_expr_allowed: bool,
    pub next_regexp: Option<BytePos>,
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// if line break exists before last?
    pub had_line_break_before_last: bool,
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
    Arrow,
    Other {
        before_expr: bool,
        can_have_trailing_comment: bool,
    },
}
impl TokenType {
    #[inline]
    const fn before_expr(self) -> bool {
        match self {
            TokenType::JSXName
            | TokenType::JSXTagStart
            | TokenType::JSXTagEnd
            | TokenType::Template
            | TokenType::Dot
            | TokenType::RParen => false,

            TokenType::JSXText
            | TokenType::Colon
            | TokenType::LBrace
            | TokenType::Semi
            | TokenType::Arrow => true,

            TokenType::BinOp(b) => b.before_expr(),
            TokenType::Keyword(k) => k.before_expr(),
            TokenType::Other { before_expr, .. } => before_expr,
        }
    }
}

impl<'a> From<&'a Token> for TokenType {
    #[inline]
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
            Token::Arrow => TokenType::Arrow,

            Token::Word(Word::Keyword(k)) => TokenType::Keyword(k),
            _ => TokenType::Other {
                before_expr: t.before_expr(),
                can_have_trailing_comment: matches!(
                    *t,
                    Token::Num { .. }
                        | Token::Str { .. }
                        | Token::Word(Word::Ident(..))
                        | Token::DollarLBrace
                        | Token::Regex(..)
                        | Token::BigInt { .. }
                        | Token::JSXText { .. }
                        | Token::RBrace
                ),
            },
        }
    }
}

impl Tokens for Lexer<'_> {
    #[inline]
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.module && !self.module_errors.borrow().is_empty() {
            let mut module_errors = self.module_errors.borrow_mut();
            self.errors.borrow_mut().append(&mut *module_errors);
        }
        self.ctx = ctx
    }

    #[inline]
    fn ctx(&self) -> Context {
        self.ctx
    }

    #[inline]
    fn syntax(&self) -> Syntax {
        self.syntax
    }

    #[inline]
    fn target(&self) -> EsVersion {
        self.target
    }

    #[inline]
    fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    #[inline]
    fn set_expr_allowed(&mut self, allow: bool) {
        self.set_expr_allowed(allow)
    }

    #[inline]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.state.next_regexp = start;
    }

    #[inline]
    fn token_context(&self) -> &TokenContexts {
        &self.state.context
    }

    #[inline]
    fn token_context_mut(&mut self) -> &mut TokenContexts {
        &mut self.state.context
    }

    #[inline]
    fn set_token_context(&mut self, c: TokenContexts) {
        self.state.context = c;
    }

    fn add_error(&self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    fn add_module_mode_error(&self, error: Error) {
        if self.ctx.module {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }
}

impl<'a> Iterator for Lexer<'a> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = (|| -> Result<Option<_>, _> {
            if let Some(start) = self.state.next_regexp {
                return Ok(Some(self.read_regexp(start)?));
            }

            if self.state.is_first {
                if let Some(shebang) = self.read_shebang()? {
                    return Ok(Some(Token::Shebang(shebang)));
                }
            }

            self.state.had_line_break = self.state.is_first;
            self.state.is_first = false;

            // skip spaces before getting next character, if we are allowed to.
            if self.state.can_skip_space() {
                self.skip_space::<true>()?;
                start = self.input.cur_pos();
            };

            match self.input.cur() {
                Some(..) => {}
                // End of input.
                None => {
                    if let Some(comments) = self.comments.as_mut() {
                        let comments_buffer = self.comments_buffer.as_mut().unwrap();
                        let last = self.state.prev_hi;

                        // move the pending to the leading or trailing
                        for c in comments_buffer.take_pending_leading() {
                            // if the file had no tokens and no shebang, then treat any
                            // comments in the leading comments buffer as leading.
                            // Otherwise treat them as trailing.
                            if last == self.start_pos {
                                comments_buffer.push(BufferedComment {
                                    kind: BufferedCommentKind::Leading,
                                    pos: last,
                                    comment: c,
                                });
                            } else {
                                comments_buffer.push(BufferedComment {
                                    kind: BufferedCommentKind::Trailing,
                                    pos: last,
                                    comment: c,
                                });
                            }
                        }

                        // now fill the user's passed in comments
                        for comment in comments_buffer.take_comments() {
                            match comment.kind {
                                BufferedCommentKind::Leading => {
                                    comments.add_leading(comment.pos, comment.comment);
                                }
                                BufferedCommentKind::Trailing => {
                                    comments.add_trailing(comment.pos, comment.comment);
                                }
                            }
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
                        let had_line_break_before_last = self.had_line_break_before_last();
                        let cur_pos = self.input.cur_pos();

                        self.input.bump();

                        if had_line_break_before_last && self.is_str("<<<<<< ") {
                            let span = Span::new(cur_pos, cur_pos + BytePos(7), Default::default());

                            self.emit_error_span(span, SyntaxError::TS1185);
                            self.skip_line_comment(6);
                            self.skip_space::<true>()?;
                            return self.read_token();
                        }

                        return Ok(Some(Token::JSXTagStart));
                    }
                }
            }

            if let Some(TokenContext::Tpl {
                start: start_pos_of_tpl,
            }) = self.state.context.current()
            {
                return self.read_tmpl_token(start_pos_of_tpl).map(Some);
            }

            self.read_token()
        })();

        let token = match res.map_err(Token::Error).map_err(Some) {
            Ok(t) => t,
            Err(e) => e,
        };

        let span = self.span(start);
        if let Some(ref token) = token {
            if let Some(comments) = self.comments_buffer.as_mut() {
                for comment in comments.take_pending_leading() {
                    comments.push(BufferedComment {
                        kind: BufferedCommentKind::Leading,
                        pos: start,
                        comment,
                    });
                }
            }

            self.state.update(start, token);
            self.state.prev_hi = self.last_pos();
            self.state.had_line_break_before_last = self.had_line_break_before_last();
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
    pub fn new(syntax: Syntax, start_pos: BytePos) -> Self {
        let context = TokenContexts(vec![TokenContext::BraceStmt]);

        State {
            is_expr_allowed: true,
            next_regexp: None,
            is_first: true,
            had_line_break: false,
            had_line_break_before_last: false,
            prev_hi: start_pos,
            context,
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

    pub fn can_have_trailing_line_comment(&self) -> bool {
        match self.token_type {
            Some(TokenType::BinOp(..)) => false,
            _ => true,
        }
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
        matches!(self.token_type, Some(TokenType::Template))
    }

    fn update(&mut self, start: BytePos, next: &Token) {
        if cfg!(feature = "debug") {
            trace!(
                "updating state: next={:?}, had_line_break={} ",
                next,
                self.had_line_break
            );
        }

        let prev = self.token_type.take();
        self.token_type = Some(TokenType::from(next));

        self.is_expr_allowed = Self::is_expr_allowed_on_next(
            &mut self.context,
            self.syntax,
            prev,
            start,
            next,
            self.had_line_break,
            self.had_line_break_before_last,
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
        had_line_break_before_last: bool,
        is_expr_allowed: bool,
    ) -> bool {
        let is_next_keyword = matches!(*next, Word(Word::Keyword(..)));

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
                        && matches!(
                            context.current(),
                            Some(TokenContext::FnExpr | TokenContext::ClassExpr)
                        )
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

                tok!("class") => {
                    if is_expr_allowed
                        && !context.is_brace_block(prev, had_line_break, is_expr_allowed)
                    {
                        context.push(TokenContext::ClassExpr);
                    }
                    false
                }

                tok!(':')
                    if matches!(
                        context.current(),
                        Some(TokenContext::FnExpr | TokenContext::ClassExpr)
                    ) =>
                {
                    // `function`/`class` keyword is object prop
                    //
                    // ```JavaScript
                    // { function: expr, class: expr }
                    // ```
                    context.pop(); // Remove FnExpr or ClassExpr
                    true
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
                                if had_line_break_before_last =>
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
            Some(TokenType::LBrace) => {
                // https://github.com/swc-project/swc/issues/3241#issuecomment-1029584460
                // <Blah blah={function (): void {}} />
                if self.current() == Some(TokenContext::BraceExpr) {
                    let len = self.len();
                    if let Some(TokenContext::JSXOpeningTag) = self.0.get(len - 2) {
                        return true;
                    }
                }

                return self.current() == Some(TokenContext::BraceStmt);
            }

            // `class C<T> { ... }`
            Some(TokenType::BinOp(Lt)) | Some(TokenType::BinOp(Gt)) => return true,

            // () => {}
            Some(TokenType::Arrow) => return true,
            _ => {}
        }

        if had_line_break {
            if let Some(TokenType::Other {
                before_expr: false, ..
            }) = prev
            {
                return true;
            }
        }

        !is_expr_allowed
    }

    #[inline]
    pub fn len(&self) -> usize {
        self.0.len()
    }

    #[inline]
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    #[inline]
    pub fn pop(&mut self) -> Option<TokenContext> {
        let opt = self.0.pop();
        if cfg!(feature = "debug") {
            trace!("context.pop({:?}): {:?}", opt, self.0);
        }
        opt
    }

    #[inline]
    pub fn current(&self) -> Option<TokenContext> {
        self.0.last().cloned()
    }

    #[inline]
    fn push(&mut self, t: TokenContext) {
        self.0.push(t);

        if cfg!(feature = "debug") {
            trace!("context.push({:?}): {:?}", t, self.0);
        }
    }
}

/// The algorithm used to determine whether a regexp can appear at a
/// given point in the program is loosely based on sweet.js' approach.
/// See https://github.com/mozilla/sweet.js/wiki/design
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TokenContext {
    BraceStmt,
    BraceExpr,
    TplQuasi,
    ParenStmt {
        /// Is this `for` loop?
        is_for_loop: bool,
    },
    ParenExpr,
    Tpl {
        /// Start of a template literal.
        start: BytePos,
    },
    FnExpr,
    ClassExpr,
    JSXOpeningTag,
    JSXClosingTag,
    JSXExpr,
}

impl TokenContext {
    pub(crate) const fn is_expr(&self) -> bool {
        matches!(
            self,
            Self::BraceExpr
                | Self::TplQuasi
                | Self::ParenExpr
                | Self::Tpl { .. }
                | Self::FnExpr
                | Self::ClassExpr
                | Self::JSXExpr
        )
    }

    pub(crate) const fn preserve_space(&self) -> bool {
        match self {
            Self::Tpl { .. } | Self::JSXExpr => true,
            _ => false,
        }
    }
}

#[cfg(test)]
pub(crate) fn with_lexer<F, Ret>(
    syntax: Syntax,
    target: EsVersion,
    s: &str,
    f: F,
) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&mut Lexer<'_>) -> Result<Ret, ()>,
{
    crate::with_test_sess(s, |_, fm| {
        let mut l = Lexer::new(syntax, target, fm, None);
        let res = f(&mut l);

        #[cfg(debug_assertions)]
        let c = vec![TokenContext::BraceStmt];
        #[cfg(debug_assertions)]
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

/// Returns `(tokens, recovered_errors)`. `(tokens)` may contain an error token
/// if the lexer fails to recover from it.
#[cfg(test)]
pub(crate) fn lex_errors(syntax: Syntax, s: &'static str) -> (Vec<Token>, Vec<Error>) {
    with_lexer(syntax, EsVersion::Es2020, s, |l| {
        let tokens = l.map(|ts| ts.token).collect();
        let errors = l.take_errors();
        Ok((tokens, errors))
    })
    .unwrap()
}
