use swc_common::BytePos;

use crate::{TokenContext, TokenContexts};

pub trait TokenType: TokenKind {
    fn is_other_and_can_have_trailing_comment(self) -> bool;
    fn is_other_and_before_expr_is_false(self) -> bool;
}

pub trait TokenKind: Copy {
    fn is_dot(self) -> bool;
    fn is_bin_op(self) -> bool;
    fn is_semi(self) -> bool;
    fn is_template(self) -> bool;
    fn is_keyword(self) -> bool;
    fn is_colon(self) -> bool;
    fn is_lbrace(self) -> bool;
    fn is_rbrace(self) -> bool;
    fn is_lparen(self) -> bool;
    fn is_rparen(self) -> bool;
    fn is_keyword_fn(self) -> bool;
    fn is_keyword_return(self) -> bool;
    fn is_keyword_yield(self) -> bool;
    fn is_keyword_else(self) -> bool;
    fn is_keyword_class(self) -> bool;
    fn is_keyword_let(self) -> bool;
    fn is_keyword_var(self) -> bool;
    fn is_keyword_const(self) -> bool;
    fn is_keyword_if(self) -> bool;
    fn is_keyword_while(self) -> bool;
    fn is_keyword_for(self) -> bool;
    fn is_keyword_with(self) -> bool;
    fn is_lt(self) -> bool;
    fn is_gt(self) -> bool;
    fn is_arrow(self) -> bool;
    fn is_ident(self) -> bool;
    fn is_known_ident_of(self) -> bool;
    fn is_slash(self) -> bool;
    fn is_dollar_lbrace(self) -> bool;
    fn is_plus_plus(self) -> bool;
    fn is_minus_minus(self) -> bool;
    fn is_back_quote(self) -> bool;
    fn is_jsx_tag_start(self) -> bool;
    fn is_jsx_tag_end(self) -> bool;
    fn before_expr(self) -> bool;
}

pub trait State: Clone {
    type TokenKind: std::fmt::Debug + Copy + TokenKind + Into<Self::TokenType>;
    type TokenType: std::fmt::Debug + Copy + TokenType;

    fn is_expr_allowed(&self) -> bool;
    fn had_line_break(&self) -> bool;
    fn had_line_break_before_last(&self) -> bool;
    fn token_contexts(&self) -> &crate::TokenContexts;
    fn mut_token_contexts(&mut self) -> &mut crate::TokenContexts;
    fn set_token_type(&mut self, token_type: Self::TokenType);
    fn token_type(&self) -> Option<Self::TokenType>;
    fn set_expr_allowed(&mut self, allow: bool);
    fn set_tpl_start(&mut self, start: BytePos);
    fn syntax(&self) -> crate::Syntax;

    fn can_skip_space(&self) -> bool {
        !self
            .token_contexts()
            .current()
            .map(|t| t.preserve_space())
            .unwrap_or_default()
    }

    fn can_have_trailing_line_comment(&self) -> bool {
        let Some(t) = self.token_type() else {
            return true;
        };
        !t.is_bin_op()
    }

    fn can_have_trailing_comment(&self) -> bool {
        self.token_type().is_some_and(|t| {
            !t.is_keyword()
                && (t.is_semi() || t.is_lbrace() || t.is_other_and_can_have_trailing_comment())
        })
    }

    fn last_was_tpl_element(&self) -> bool {
        self.token_type().is_some_and(|t| t.is_template())
    }

    fn update(&mut self, start: BytePos, next: Self::TokenKind) {
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
        self.set_expr_allowed(is_expr_allowed_on_next);
    }

    /// Returns true if following `LBrace` token is `block statement` according
    /// to  `ctx`, `prev`, `is_expr_allowed`.
    fn is_brace_block(
        token_contexts: &TokenContexts,
        prev: Option<Self::TokenType>,
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
        prev: Option<Self::TokenType>,
        start: BytePos,
        next: Self::TokenKind,
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
                        Some(TokenContext::Tpl { .. }) => return false,
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
            if let Some(TokenContext::Tpl { .. }) = context.current() {
                context.pop();
            } else {
                context.push(TokenContext::Tpl);
                self.set_tpl_start(start);
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
