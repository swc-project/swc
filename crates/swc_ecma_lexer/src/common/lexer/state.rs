use swc_common::BytePos;

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
    fn set_is_expr_allowed(&mut self, is_expr_allowed: bool);
    fn set_next_regexp(&mut self, start: Option<BytePos>);
    fn had_line_break(&self) -> bool;
    fn mark_had_line_break(&mut self);
    fn had_line_break_before_last(&self) -> bool;
    fn token_contexts(&self) -> &crate::TokenContexts;
    fn mut_token_contexts(&mut self) -> &mut crate::TokenContexts;
    fn set_token_type(&mut self, token_type: Self::TokenType);
    fn token_type(&self) -> Option<Self::TokenType>;
    fn syntax(&self) -> crate::Syntax;
    fn prev_hi(&self) -> BytePos;
    fn start(&self) -> BytePos;
    fn set_line_start(&mut self, line_start: BytePos);

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
}
