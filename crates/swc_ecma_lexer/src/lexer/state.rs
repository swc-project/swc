use std::mem::take;

use smallvec::{smallvec, SmallVec};
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;
use tracing::trace;

use super::{Context, Input, Lexer, LexerTrait};
use crate::{
    common::{
        input::Tokens,
        lexer::{
            char::CharExt,
            comments_buffer::{BufferedCommentKind, CommentsBufferTrait},
            state::{
                State as StateTrait, TokenKind as TokenKindTrait, TokenType as TokenTypeTrait,
            },
        },
        syntax::SyntaxFlags,
    },
    error::{Error, SyntaxError},
    token::{BinOpToken, Keyword, Token, TokenAndSpan, TokenKind, WordKind},
    *,
};

bitflags::bitflags! {
    #[derive(Debug, Default, Clone, Copy)]
    pub struct TokenFlags: u8 {
        const UNICODE = 1 << 0;
    }
}

/// State of lexer.
///
/// Ported from babylon.
#[derive(Clone)]
pub struct State {
    pub is_expr_allowed: bool,
    pub next_regexp: Option<BytePos>,
    /// if line break exists between previous token and new token?
    pub had_line_break: bool,
    /// if line break exists before last?
    pub had_line_break_before_last: bool,
    /// TODO: Remove this field.
    is_first: bool,
    pub start: BytePos,
    pub prev_hi: BytePos,
    pub tpl_start: BytePos,

    context: TokenContexts,
    syntax: SyntaxFlags,

    token_type: Option<TokenType>,
}

impl State {
    pub(super) fn update(&mut self, start: BytePos, next: TokenKind) {
        if cfg!(feature = "debug") {
            tracing::trace!(
                "updating state: next={:?}, had_line_break={} ",
                next,
                self.had_line_break()
            );
        }
        let prev = self.token_type();
        self.set_token_type(next.into());
        let is_expr_allowed_on_next = self.is_expr_allowed_on_next(prev, start, next);
        self.set_is_expr_allowed(is_expr_allowed_on_next);
    }

    /// Returns true if following `LBrace` token is `block statement` according
    /// to  `ctx`, `prev`, `is_expr_allowed`.
    fn is_brace_block(
        token_contexts: &TokenContexts,
        prev: Option<TokenType>,
        had_line_break: bool,
        is_expr_allowed: bool,
    ) -> bool {
        let Some(prev) = prev else {
            return true;
        };

        if prev.is_colon() {
            match token_contexts.current() {
                Some(TokenContext::BraceStmt) => return true,
                // `{ a: {} }`
                //     ^ ^
                Some(TokenContext::BraceExpr) => return false,
                _ => {}
            };
        }

        //  function a() {
        //      return { a: "" };
        //  }
        //  function a() {
        //      return
        //      {
        //          function b(){}
        //      };
        //  }
        if prev.is_keyword_return() || prev.is_keyword_yield() {
            had_line_break
        } else if prev.is_rparen()
            || prev.is_semi()
            || prev.is_keyword_else()
            || prev.is_lt()
            || prev.is_gt()
            || prev.is_arrow()
        {
            true
        } else if prev.is_lbrace() {
            // If previous token was `{`
            // https://github.com/swc-project/swc/issues/3241#issuecomment-1029584460
            // <Blah blah={function (): void {}} />
            let c = token_contexts.current();
            if c == Some(TokenContext::BraceExpr) {
                let len = token_contexts.len();
                if let Some(TokenContext::JSXOpeningTag) = token_contexts.0.get(len - 2) {
                    return true;
                }
            }
            c == Some(TokenContext::BraceStmt)
        } else {
            if had_line_break && prev.is_other_and_before_expr_is_false() {
                return true;
            }
            !is_expr_allowed
        }
    }

    /// `is_expr_allowed`: previous value.
    /// `start`: start of newly produced token.
    fn is_expr_allowed_on_next(
        &mut self,
        prev: Option<TokenType>,
        start: BytePos,
        next: TokenKind,
    ) -> bool {
        let is_expr_allowed = self.is_expr_allowed();
        let had_line_break = self.had_line_break();
        let had_line_break_before_last = self.had_line_break_before_last();
        let is_next_keyword = next.is_keyword();
        let syntax = self.syntax();
        let context = self.mut_token_contexts();

        if is_next_keyword && prev.is_some_and(|prev| prev.is_dot()) {
            false
        } else if next.is_rparen() || next.is_rbrace() {
            // TODO: Verify
            if context.len() == 1 {
                return true;
            } else {
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
                        Some(TokenContext::Tpl) => return false,
                        _ => return true,
                    }
                }
                // expression cannot follow expression
                !out.is_expr()
            }
        } else if next.is_keyword_fn() {
            // This is required to lex
            // `x = function(){}/42/i`
            if is_expr_allowed
                && !Self::is_brace_block(context, prev, had_line_break, is_expr_allowed)
            {
                context.push(TokenContext::FnExpr);
            }
            false
        } else if next.is_keyword_class() {
            if is_expr_allowed
                && !Self::is_brace_block(context, prev, had_line_break, is_expr_allowed)
            {
                context.push(TokenContext::ClassExpr);
            }
            false
        } else if next.is_colon()
            && matches!(
                context.current(),
                Some(TokenContext::FnExpr | TokenContext::ClassExpr)
            )
        {
            // `function`/`class` keyword is object prop
            //
            // ```JavaScript
            // { function: expr, class: expr }
            // ```
            context.pop(); // Remove FnExpr or ClassExpr
            true
        } else if next.is_known_ident_of()
            && context.current() == Some(TokenContext::ParenStmt { is_for_loop: true })
        {
            // for (a of b) {}

            // e.g. for (a of _) => true
            !prev
                .expect("context.current() if ParenStmt, so prev token cannot be None")
                .before_expr()
        } else if next.is_ident() {
            let Some(prev) = prev else {
                return false;
            };
            had_line_break_before_last
                && (prev.is_keyword_var() || prev.is_keyword_let() || prev.is_keyword_const())
        } else if next.is_lbrace() {
            let cur = context.current();
            if syntax.jsx() && cur == Some(TokenContext::JSXOpeningTag) {
                context.push(TokenContext::BraceExpr)
            } else if syntax.jsx() && cur == Some(TokenContext::JSXExpr) {
                context.push(TokenContext::TplQuasi);
            } else {
                let next_ctxt =
                    if Self::is_brace_block(context, prev, had_line_break, is_expr_allowed) {
                        TokenContext::BraceStmt
                    } else {
                        TokenContext::BraceExpr
                    };
                context.push(next_ctxt);
            }
            true
        } else if next.is_slash()
            && syntax.jsx()
            && prev.is_some_and(|prev| prev.is_jsx_tag_start())
        {
            context.pop();
            context.pop(); // do not consider JSX expr -> JSX open tag ->... anymore
            context.push(TokenContext::JSXClosingTag); // reconsider as closing tag context
            false
        } else if next.is_dollar_lbrace() {
            context.push(TokenContext::TplQuasi);
            true
        } else if next.is_lparen() {
            let c = match prev {
                Some(prev) => {
                    if prev.is_keyword_if() || prev.is_keyword_while() || prev.is_keyword_with() {
                        TokenContext::ParenStmt { is_for_loop: false }
                    } else if prev.is_keyword_for() {
                        TokenContext::ParenStmt { is_for_loop: true }
                    } else {
                        TokenContext::ParenExpr
                    }
                }
                None => TokenContext::ParenExpr,
            };
            context.push(c);
            true
        } else if next.is_plus_plus() || next.is_minus_minus() {
            is_expr_allowed
        } else if next.is_back_quote() {
            // If we are in template, ` terminates template.
            if let Some(TokenContext::Tpl) = context.current() {
                context.pop();
            } else {
                context.push(TokenContext::Tpl);
                self.tpl_start = start;
            }
            false
        } else if next.is_jsx_tag_start() {
            context.push(TokenContext::JSXExpr); // treat as beginning of JSX expression
            context.push(TokenContext::JSXOpeningTag); // start opening tag context
            false
        } else if next.is_jsx_tag_end() {
            let out = context.pop();
            if (out == Some(TokenContext::JSXOpeningTag)
                && prev.is_some_and(|prev| prev.is_slash()))
                || out == Some(TokenContext::JSXClosingTag)
            {
                context.pop();
                context.current() == Some(TokenContext::JSXExpr)
            } else {
                true
            }
        } else {
            next.before_expr()
        }
    }
}

impl common::lexer::state::State for State {
    type TokenKind = crate::token::TokenKind;
    type TokenType = self::TokenType;

    #[inline(always)]
    fn is_expr_allowed(&self) -> bool {
        self.is_expr_allowed
    }

    #[inline(always)]
    fn set_is_expr_allowed(&mut self, is_expr_allowed: bool) {
        self.is_expr_allowed = is_expr_allowed;
    }

    #[inline(always)]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.next_regexp = start;
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.had_line_break
    }

    #[inline(always)]
    fn mark_had_line_break(&mut self) {
        self.had_line_break = true;
    }

    #[inline(always)]
    fn had_line_break_before_last(&self) -> bool {
        self.had_line_break_before_last
    }

    #[inline(always)]
    fn token_contexts(&self) -> &crate::TokenContexts {
        &self.context
    }

    #[inline(always)]
    fn mut_token_contexts(&mut self) -> &mut crate::TokenContexts {
        &mut self.context
    }

    #[inline(always)]
    fn set_token_type(&mut self, token_type: Self::TokenType) {
        self.token_type = Some(token_type);
    }

    #[inline(always)]
    fn token_type(&self) -> Option<Self::TokenType> {
        self.token_type
    }

    #[inline(always)]
    fn syntax(&self) -> SyntaxFlags {
        self.syntax
    }

    #[inline(always)]
    fn prev_hi(&self) -> BytePos {
        self.prev_hi
    }

    #[inline(always)]
    fn start(&self) -> BytePos {
        self.start
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
            TokenKind::Template => TokenType::Template,
            TokenKind::Dot => TokenType::Dot,
            TokenKind::Colon => TokenType::Colon,
            TokenKind::LBrace => TokenType::LBrace,
            TokenKind::RParen => TokenType::RParen,
            TokenKind::Semi => TokenType::Semi,
            TokenKind::JSXTagEnd => TokenType::JSXTagEnd,
            TokenKind::JSXTagStart => TokenType::JSXTagStart,
            TokenKind::JSXText => TokenType::JSXText,
            TokenKind::JSXName => TokenType::JSXName,
            TokenKind::BinOp(op) => TokenType::BinOp(op),
            TokenKind::Arrow => TokenType::Arrow,

            TokenKind::Word(WordKind::Keyword(k)) => TokenType::Keyword(k),
            _ => TokenType::Other {
                before_expr: t.before_expr(),
                can_have_trailing_comment: matches!(
                    t,
                    TokenKind::Num
                        | TokenKind::Str
                        | TokenKind::Word(WordKind::Ident(..))
                        | TokenKind::DollarLBrace
                        | TokenKind::Regex
                        | TokenKind::BigInt
                        | TokenKind::JSXText
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
    type Checkpoint = Self;

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
    fn ctx_mut(&mut self) -> &mut Context {
        &mut self.ctx
    }

    fn checkpoint_save(&self) -> Self::Checkpoint {
        self.clone()
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        *self = checkpoint;
    }

    #[inline]
    fn syntax(&self) -> SyntaxFlags {
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
        self.state.is_expr_allowed = allow;
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

    #[inline]
    fn add_error(&mut self, error: Error) {
        self.errors.borrow_mut().push(error);
    }

    #[inline]
    fn add_module_mode_error(&mut self, error: Error) {
        if self.ctx.contains(Context::Module) {
            self.add_error(error);
            return;
        }
        self.module_errors.borrow_mut().push(error);
    }

    #[inline]
    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors.borrow_mut())
    }

    #[inline]
    fn take_script_module_errors(&mut self) -> Vec<Error> {
        take(&mut self.module_errors.borrow_mut())
    }

    #[inline]
    fn end_pos(&self) -> BytePos {
        self.input.end_pos()
    }

    fn update_token_flags(&mut self, _: impl FnOnce(&mut lexer::TokenFlags)) {
        // noop
    }

    fn token_flags(&self) -> lexer::TokenFlags {
        Default::default()
    }
}

impl Lexer<'_> {
    fn next_token(&mut self, start: &mut BytePos) -> Result<Token, Error> {
        if let Some(next_regexp) = self.state.next_regexp {
            *start = next_regexp;
            return self.read_regexp(next_regexp);
        }

        if self.state.is_first {
            if let Some(shebang) = self.read_shebang()? {
                return Ok(Token::Shebang(shebang));
            }
        }

        self.state.had_line_break = self.state.is_first;
        self.state.is_first = false;

        // skip spaces before getting next character, if we are allowed to.
        let can_skip_space = !self
            .state
            .context
            .current()
            .map(|t| t.preserve_space())
            .unwrap_or_default();
        if can_skip_space {
            self.skip_space::<true>();
            *start = self.input.cur_pos();
        };

        if self.input.last_pos() == self.input.end_pos() {
            // End of input.
            self.consume_pending_comments();
            return Ok(Token::Eof);
        }

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
                let c = c as char;
                if self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                    || self.state.context.current() == Some(TokenContext::JSXClosingTag)
                {
                    if c.is_ident_start() {
                        return self.read_jsx_word();
                    }

                    if c == '>' {
                        unsafe {
                            // Safety: cur() is Some('>')
                            self.input.bump_bytes(1);
                        }
                        return Ok(Token::JSXTagEnd);
                    }

                    if (c == '\'' || c == '"')
                        && self.state.context.current() == Some(TokenContext::JSXOpeningTag)
                    {
                        return self.read_jsx_str(c);
                    }
                }

                if c == '<' && self.state.is_expr_allowed && self.input.peek() != Some(b'!') {
                    let had_line_break_before_last = self.had_line_break_before_last();
                    let cur_pos = self.input.cur_pos();

                    unsafe {
                        // Safety: cur() is Some('<')
                        self.input.bump_bytes(1);
                    }

                    if had_line_break_before_last && self.is_str("<<<<<< ") {
                        let span = Span::new_with_checked(cur_pos, cur_pos + BytePos(7));

                        self.emit_error_span(span, SyntaxError::TS1185);
                        self.skip_line_comment(6);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    return Ok(Token::JSXTagStart);
                }
            }
        }

        if let Some(TokenContext::Tpl) = self.state.context.current() {
            let start = self.state.tpl_start;
            return self.read_tmpl_token(start);
        }

        self.read_token()
    }
}

impl Iterator for Lexer<'_> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let mut start = self.cur_pos();

        let res = self.next_token(&mut start);

        let token = match res.map_err(Token::Error) {
            Ok(t) => t,
            Err(e) => e,
        };

        let span = self.span(start);
        if !matches!(token, Token::Eof) {
            if let Some(comments) = self.comments_buffer.as_mut() {
                comments.pending_to_comment(BufferedCommentKind::Leading, start);
            }

            self.state.update(start, token.kind());
            self.state.prev_hi = self.last_pos();
            self.state.had_line_break_before_last = self.had_line_break_before_last();
            // Attach span to token.
            Some(TokenAndSpan {
                token,
                had_line_break: self.had_line_break_before_last(),
                span,
            })
        } else {
            None
        }
    }
}

impl State {
    pub fn new(syntax: SyntaxFlags, start_pos: BytePos) -> Self {
        let context = TokenContexts(smallvec![TokenContext::BraceStmt]);

        State {
            is_expr_allowed: true,
            next_regexp: None,
            had_line_break: false,
            had_line_break_before_last: false,
            is_first: true,
            start: BytePos(0),
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
