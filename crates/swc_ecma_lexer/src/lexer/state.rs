use std::mem::take;

use smallvec::{smallvec, SmallVec};
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;
use tracing::trace;

use super::{Context, Input, Lexer};
use crate::{
    common::{
        input::Tokens,
        lexer::{
            char::CharExt,
            comments_buffer::{BufferedComment, BufferedCommentKind},
            state::State as StateTrait,
        },
    },
    error::{Error, SyntaxError},
    token::{BinOpToken, Keyword, Token, TokenAndSpan, TokenKind, WordKind},
    *,
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
    pub tpl_start: BytePos,

    context: TokenContexts,
    syntax: Syntax,

    token_type: Option<TokenType>,
}

impl common::lexer::state::State for State {
    type TokenKind = crate::token::TokenKind;
    type TokenType = self::TokenType;

    fn is_expr_allowed(&self) -> bool {
        self.is_expr_allowed
    }

    fn had_line_break(&self) -> bool {
        self.had_line_break
    }

    fn had_line_break_before_last(&self) -> bool {
        self.had_line_break_before_last
    }

    fn token_contexts(&self) -> &crate::TokenContexts {
        &self.context
    }

    fn mut_token_contexts(&mut self) -> &mut crate::TokenContexts {
        &mut self.context
    }

    fn set_token_type(&mut self, token_type: Self::TokenType) {
        self.token_type = Some(token_type);
    }

    fn token_type(&self) -> Option<Self::TokenType> {
        self.token_type
    }

    fn set_expr_allowed(&mut self, allow: bool) {
        self.is_expr_allowed = allow;
    }

    fn set_tpl_start(&mut self, start: BytePos) {
        self.tpl_start = start;
    }

    fn syntax(&self) -> crate::Syntax {
        self.syntax
    }
}

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub enum TokenType {
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
    pub const fn before_expr(self) -> bool {
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

impl From<TokenKind> for TokenType {
    #[inline]
    fn from(t: TokenKind) -> Self {
        match t {
            TokenKind::Template { .. } => TokenType::Template,
            TokenKind::Dot => TokenType::Dot,
            TokenKind::Colon => TokenType::Colon,
            TokenKind::LBrace => TokenType::LBrace,
            TokenKind::RParen => TokenType::RParen,
            TokenKind::Semi => TokenType::Semi,
            TokenKind::JSXTagEnd => TokenType::JSXTagEnd,
            TokenKind::JSXTagStart => TokenType::JSXTagStart,
            TokenKind::JSXText { .. } => TokenType::JSXText,
            TokenKind::JSXName { .. } => TokenType::JSXName,
            TokenKind::BinOp(op) => TokenType::BinOp(op),
            TokenKind::Arrow => TokenType::Arrow,

            TokenKind::Word(WordKind::Keyword(k)) => TokenType::Keyword(k),
            _ => TokenType::Other {
                before_expr: t.before_expr(),
                can_have_trailing_comment: matches!(
                    t,
                    TokenKind::Num { .. }
                        | TokenKind::Str { .. }
                        | TokenKind::Word(WordKind::Ident(..))
                        | TokenKind::DollarLBrace
                        | TokenKind::Regex
                        | TokenKind::BigInt { .. }
                        | TokenKind::JSXText { .. }
                        | TokenKind::RBrace
                ),
            },
        }
    }
}

impl crate::common::lexer::state::TokenKind for TokenType {
    #[inline(always)]
    fn is_dot(self) -> bool {
        self == Self::Dot
    }

    #[inline(always)]
    fn is_bin_op(self) -> bool {
        matches!(self, Self::BinOp(_))
    }

    #[inline(always)]
    fn is_semi(self) -> bool {
        self == Self::Semi
    }

    #[inline(always)]
    fn is_template(self) -> bool {
        self == Self::Template
    }

    #[inline(always)]
    fn is_keyword(self) -> bool {
        matches!(self, Self::Keyword(_))
    }

    #[inline(always)]
    fn is_colon(self) -> bool {
        self == Self::Colon
    }

    #[inline(always)]
    fn is_lbrace(self) -> bool {
        self == Self::LBrace
    }

    #[inline(always)]
    fn is_rbrace(self) -> bool {
        unreachable!("RBrace is not a token type")
    }

    #[inline(always)]
    fn is_lparen(self) -> bool {
        unreachable!("LParen is not a token type")
    }

    #[inline(always)]
    fn is_rparen(self) -> bool {
        self == Self::RParen
    }

    #[inline(always)]
    fn is_keyword_fn(self) -> bool {
        self == Self::Keyword(Keyword::Function)
    }

    #[inline(always)]
    fn is_keyword_return(self) -> bool {
        self == Self::Keyword(Keyword::Return)
    }

    #[inline(always)]
    fn is_keyword_yield(self) -> bool {
        self == Self::Keyword(Keyword::Yield)
    }

    #[inline(always)]
    fn is_keyword_else(self) -> bool {
        self == Self::Keyword(Keyword::Else)
    }

    #[inline(always)]
    fn is_keyword_class(self) -> bool {
        self == Self::Keyword(Keyword::Class)
    }

    #[inline(always)]
    fn is_keyword_let(self) -> bool {
        self == Self::Keyword(Keyword::Let)
    }

    #[inline(always)]
    fn is_keyword_var(self) -> bool {
        self == Self::Keyword(Keyword::Var)
    }

    #[inline(always)]
    fn is_keyword_const(self) -> bool {
        self == Self::Keyword(Keyword::Const)
    }

    #[inline(always)]
    fn is_keyword_if(self) -> bool {
        self == Self::Keyword(Keyword::If)
    }

    #[inline(always)]
    fn is_keyword_while(self) -> bool {
        self == Self::Keyword(Keyword::While)
    }

    #[inline(always)]
    fn is_keyword_for(self) -> bool {
        self == Self::Keyword(Keyword::For)
    }

    #[inline(always)]
    fn is_keyword_with(self) -> bool {
        self == Self::Keyword(Keyword::With)
    }

    #[inline(always)]
    fn is_lt(self) -> bool {
        self == Self::BinOp(BinOpToken::Lt)
    }

    #[inline(always)]
    fn is_gt(self) -> bool {
        self == Self::BinOp(BinOpToken::Gt)
    }

    #[inline(always)]
    fn is_arrow(self) -> bool {
        self == Self::Arrow
    }

    #[inline(always)]
    fn is_ident(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn is_known_ident_of(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn is_slash(self) -> bool {
        self == Self::BinOp(BinOpToken::Div)
    }

    #[inline(always)]
    fn is_dollar_lbrace(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn is_plus_plus(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn is_minus_minus(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn is_back_quote(self) -> bool {
        unreachable!()
    }

    #[inline(always)]
    fn before_expr(self) -> bool {
        self.before_expr()
    }

    #[inline(always)]
    fn is_jsx_tag_start(self) -> bool {
        self == Self::JSXTagStart
    }

    #[inline(always)]
    fn is_jsx_tag_end(self) -> bool {
        self == Self::JSXTagEnd
    }
}

impl crate::common::lexer::state::TokenType for TokenType {
    #[inline(always)]
    fn is_other_and_before_expr_is_false(self) -> bool {
        match self {
            TokenType::Other { before_expr, .. } => !before_expr,
            _ => false,
        }
    }

    #[inline(always)]
    fn is_other_and_can_have_trailing_comment(self) -> bool {
        match self {
            TokenType::Other {
                can_have_trailing_comment,
                ..
            } => can_have_trailing_comment,
            _ => false,
        }
    }
}

impl Tokens<TokenAndSpan> for Lexer<'_> {
    #[inline]
    fn set_ctx(&mut self, ctx: Context) {
        if ctx.contains(Context::Module) && !self.module_errors.borrow().is_empty() {
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
        if self.ctx.contains(Context::Module) {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    fn take_script_module_errors(&mut self) -> Vec<Error> {
        take(&mut self.module_errors.borrow_mut())
    }

    fn end_pos(&self) -> BytePos {
        self.input.end_pos()
    }
}

impl Lexer<'_> {
    /// Consume pending comments.
    ///
    /// This is called when the input is exhausted.
    #[cold]
    #[inline(never)]
    fn consume_pending_comments(&mut self) {
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
    }

    fn next_token(&mut self, start: &mut BytePos) -> Result<Option<Token>, Error> {
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
            self.skip_space::<true>();
            *start = self.input.cur_pos();
        };

        match self.input.cur() {
            Some(..) => {}
            // End of input.
            None => {
                self.consume_pending_comments();

                return Ok(None);
            }
        };

        // println!(
        //     "\tContext: ({:?}) {:?}",
        //     self.input.cur().unwrap(),
        //     self.state.context.0
        // );

        self.state.start = *start;

        if self.syntax.jsx()
            && !self.ctx.contains(Context::InPropertyName)
            && !self.ctx.contains(Context::InType)
        {
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
                        unsafe {
                            // Safety: cur() is Some('>')
                            self.input.bump();
                        }
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

                    unsafe {
                        // Safety: cur() is Some('<')
                        self.input.bump();
                    }

                    if had_line_break_before_last && self.is_str("<<<<<< ") {
                        let span = Span::new(cur_pos, cur_pos + BytePos(7));

                        self.emit_error_span(span, SyntaxError::TS1185);
                        self.skip_line_comment(6);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    return Ok(Some(Token::JSXTagStart));
                }
            }
        }

        if let Some(TokenContext::Tpl {}) = self.state.context.current() {
            let start = self.state.tpl_start;
            return self.read_tmpl_token(start).map(Some);
        }

        self.read_token()
    }
}

impl Iterator for Lexer<'_> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = self.next_token(&mut start);

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

            self.state.update(start, token.kind());
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
        let context = TokenContexts(smallvec![TokenContext::BraceStmt]);

        State {
            is_expr_allowed: true,
            next_regexp: None,
            had_line_break: false,
            had_line_break_before_last: false,
            is_first: true,
            start: BytePos(0),
            cur_line: 1,
            line_start: BytePos(0),
            prev_hi: start_pos,
            tpl_start: BytePos::DUMMY,
            context,
            syntax,
            token_type: None,
        }
    }
}

#[derive(Clone, Default)]
pub struct TokenContexts(pub SmallVec<[TokenContext; 128]>);

impl TokenContexts {
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
    pub fn push(&mut self, t: TokenContext) {
        self.0.push(t);

        if cfg!(feature = "debug") {
            trace!("context.push({:?}): {:?}", t, self.0);
        }
    }
}

/// The algorithm used to determine whether a regexp can appear at a
/// given point in the program is loosely based on sweet.js' approach.
/// See https://github.com/mozilla/sweet.js/wiki/design
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
    Tpl,
    FnExpr,
    ClassExpr,
    JSXOpeningTag,
    JSXClosingTag,
    JSXExpr,
}

impl TokenContext {
    pub const fn is_expr(&self) -> bool {
        matches!(
            self,
            Self::BraceExpr
                | Self::TplQuasi
                | Self::ParenExpr
                | Self::Tpl
                | Self::FnExpr
                | Self::ClassExpr
                | Self::JSXExpr
        )
    }

    pub const fn preserve_space(&self) -> bool {
        match self {
            Self::Tpl | Self::JSXExpr => true,
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
        let c = TokenContexts(smallvec![TokenContext::BraceStmt]);
        #[cfg(debug_assertions)]
        debug_assert_eq!(l.state.context.0, c.0);

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
        l.ctx.insert(Context::Module);
        l.ctx.insert(Context::Strict);

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
