//! Share the parsed contents of Flow grouping and function type parameters.

use swc_common::{BytePos, Span};
use swc_ecma_ast::*;

use super::lookahead::ParameterStart;
use crate::{
    input::Tokens,
    lexer::Token,
    parser::{BoundaryContext, SyntaxContext, TypeContext},
    PResult, Parser,
};

enum ParenItem {
    Type {
        start: BytePos,
        dot3_token: Option<Span>,
        type_ann: Box<TsType>,
    },
    Named(TsFnParam),
}

impl<I: Tokens> Parser<I> {
    /// Recognize bindings without entering their annotations or initializers.
    fn is_flow_named_signature_param(&mut self) -> bool {
        let cur = self.input().cur();
        if !cur.is_word() && !matches!(cur, Token::LBrace | Token::LBracket | Token::DotDotDot) {
            return false;
        }
        self.ts_look_ahead(|p| {
            p.with_computed_key_lookahead(|p| {
                p.input_mut().eat(Token::DotDotDot);
                match p.probe_parameter_start() {
                    Ok(ParameterStart::Initializer) => true,
                    Ok(ParameterStart::Pattern) => {
                        matches!(p.input().cur(), Token::Colon | Token::Eq)
                            || (p.input().is(Token::QuestionMark)
                                && peek!(p).is_some_and(|peek| {
                                    matches!(
                                        peek,
                                        Token::Colon | Token::Comma | Token::Eq | Token::RParen
                                    )
                                }))
                    }
                    _ => false,
                }
            })
        })
    }

    fn parse_flow_paren_item(&mut self) -> PResult<ParenItem> {
        let start = self.cur_pos();
        if self.is_flow_named_signature_param() {
            return self.do_inside_of_boundary_context(BoundaryContext::InParameters, |p| {
                p.with_syntax_context(SyntaxContext::Parameters, |p| {
                    let pat = if p.input_mut().eat(Token::DotDotDot) {
                        p.parse_rest_parameter(start)?
                    } else {
                        p.parse_formal_param_pat()?
                    };
                    p.ts_fn_param_from_pat(pat).map(ParenItem::Named)
                })
            });
        }
        let dot3_token = self
            .input_mut()
            .eat(Token::DotDotDot)
            .then(|| self.input().prev_span());
        let type_ann = self
            .do_outside_of_type_context(TypeContext::DisallowFlowAnonFnType, Self::parse_ts_type)?;
        Ok(ParenItem::Type {
            start,
            dot3_token,
            type_ann,
        })
    }

    fn flow_paren_item_to_param(&mut self, item: ParenItem, index: usize) -> TsFnParam {
        match item {
            ParenItem::Type {
                start,
                dot3_token,
                type_ann,
            } => self.make_flow_anon_fn_param(start, index, dot3_token, type_ann),
            ParenItem::Named(param) => param,
        }
    }

    pub(super) fn parse_flow_signature_param(&mut self, index: usize) -> PResult<TsFnParam> {
        let item = self.parse_flow_paren_item()?;
        Ok(self.flow_paren_item_to_param(item, index))
    }

    fn finish_flow_fn_type(
        &mut self,
        start: BytePos,
        params: Vec<TsFnParam>,
    ) -> PResult<Box<TsType>> {
        let type_ann = self.parse_ts_type_or_type_predicate_ann(Token::Arrow)?;
        Ok(Box::new(TsType::TsFnOrConstructorType(
            TsFnOrConstructorType::TsFnType(TsFnType {
                span: self.span(start),
                params,
                type_params: None,
                type_ann,
            }),
        )))
    }

    /// Parse the common contents once, then choose grouping or a signature.
    pub(super) fn parse_flow_parenthesized_type(&mut self) -> PResult<Box<TsType>> {
        let start = self.cur_pos();
        let disallow_anon = self
            .type_ctx()
            .contains(TypeContext::DisallowFlowAnonFnType);
        expect!(self, Token::LParen);
        if self.input_mut().eat(Token::RParen) {
            return self.finish_flow_fn_type(start, Vec::new());
        }

        let first = match self.parse_flow_paren_item()? {
            ParenItem::Type {
                start: param_start,
                dot3_token: None,
                type_ann,
                ..
            } if self.input().is(Token::RParen) || Self::is_flow_bare_renders_type(&type_ann) => {
                let bare_renders = Self::is_flow_bare_renders_type(&type_ann);
                expect!(self, Token::RParen);
                if disallow_anon || bare_renders || !self.input().is(Token::Arrow) {
                    return Ok(Box::new(TsType::TsParenthesizedType(TsParenthesizedType {
                        span: self.span(start),
                        type_ann,
                    })));
                }
                let param = self.make_flow_anon_fn_param(param_start, 0, None, type_ann);
                return self.finish_flow_fn_type(start, vec![param]);
            }
            first => first,
        };

        let first = self.flow_paren_item_to_param(first, 0);
        let params =
            self.parse_parameter_list_with_first(Some(first), Self::parse_flow_signature_param)?;
        expect!(self, Token::RParen);
        self.finish_flow_fn_type(start, params)
    }
}
