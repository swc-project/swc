use swc_common::{source_map::SmallPos, BytePos, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_lexer::{
    common::{
        lexer::token::TokenFactory,
        parser::{buffer::Buffer, PResult, Parser as ParserTrait},
    },
    error::SyntaxError,
};

use super::{input::Tokens, Parser};
use crate::lexer::Token;

impl<I: Tokens> Parser<I> {
    pub(super) fn parse_no_substitution_template_literal(
        &mut self,
        is_tagged_tpl: bool,
    ) -> PResult<Tpl> {
        let start = self.input.cur_pos();
        let (raw, cooked) = match self.bump() {
            t @ Token::NoSubstitutionTemplateLiteral => {
                let (cooked, raw) = t.take_template(self.input_mut());
                match cooked {
                    Ok(cooked) => (raw, Some(cooked)),
                    Err(err) => {
                        if is_tagged_tpl {
                            (raw, None)
                        } else {
                            return Err(err);
                        }
                    }
                }
            }
            _ => unreachable!(),
        };
        let pos = self.input.prev_span().hi;
        debug_assert!(start <= pos);
        let span = Span::new(start, pos);
        Ok(Tpl {
            span,
            exprs: vec![],
            quasis: vec![TplElement {
                span: {
                    debug_assert!(start.0 <= pos.0 - 2);
                    // `____`
                    // `start.0 + 1` means skip the first backtick
                    // `pos.0 - 1` means skip the last backtick
                    Span::new(BytePos::from_u32(start.0 + 1), BytePos::from_u32(pos.0 - 1))
                },
                tail: true,
                raw,
                cooked,
            }],
        })
    }

    fn parse_template_head(&mut self, is_tagged_tpl: bool) -> PResult<TplElement> {
        let start = cur_pos!(self);
        debug_assert!(matches!(self.input.cur(), Some(&Token::TemplateHead)));
        let (raw, cooked) = match self.input_mut().bump() {
            t @ Token::TemplateHead => {
                let (cooked, raw) = t.take_template(self.input_mut());
                match cooked {
                    Ok(cooked) => (raw, Some(cooked)),
                    Err(err) => {
                        if is_tagged_tpl {
                            (raw, None)
                        } else {
                            return Err(err);
                        }
                    }
                }
            }
            _ => todo!(),
        };

        let _ = self.input.cur();

        let pos = self.input.prev_span().hi;
        // `__${
        // `start.0 + 1` means skip the first backtick
        // `pos.0 - 2` means skip "${"
        debug_assert!(start.0 <= pos.0 - 3);
        let span = Span::new(BytePos::from_u32(start.0 + 1), BytePos::from_u32(pos.0 - 2));
        Ok(TplElement {
            span,
            raw,
            tail: false,
            cooked,
        })
    }

    pub(super) fn parse_tpl(&mut self, is_tagged_tpl: bool) -> PResult<Tpl> {
        trace_cur!(self, parse_tpl);
        let start = cur_pos!(self);

        debug_assert!(matches!(
            self.input.cur(),
            Some(&Token::TemplateHead { .. })
        ));

        let (exprs, quasis) = self.parse_tpl_elements(is_tagged_tpl)?;

        let _ = self.input.cur();

        let span = span!(self, start);
        Ok(Tpl {
            span,
            exprs,
            quasis,
        })
    }

    fn parse_tpl_elements(
        &mut self,
        is_tagged_tpl: bool,
    ) -> PResult<(Vec<Box<Expr>>, Vec<TplElement>)> {
        trace_cur!(self, parse_tpl_elements);

        let mut exprs = Vec::new();
        let cur_elem = self.parse_template_head(is_tagged_tpl)?;
        let mut is_tail = cur_elem.tail;
        let mut quasis = vec![cur_elem];

        while !is_tail {
            exprs.push(self.include_in_expr(true).parse_expr()?);
            let elem = self.parse_tpl_element(is_tagged_tpl)?;
            is_tail = elem.tail;
            quasis.push(elem);
        }
        Ok((exprs, quasis))
    }

    fn parse_tpl_element(&mut self, is_tagged_tpl: bool) -> PResult<TplElement> {
        if self.input_mut().is(&Token::RBrace) {
            self.input_mut().rescan_template_token(false);
        }
        let start = cur_pos!(self);
        let (raw, cooked, tail, span) = match *cur!(self, true) {
            Token::TemplateMiddle => match self.bump() {
                t @ Token::TemplateMiddle => {
                    let (cooked, raw) = t.take_template(self.input_mut());
                    let pos = self.input.prev_span().hi;
                    debug_assert!(start.0 <= pos.0 - 2);
                    // ___${
                    // `pos.0 - 2` means skip '${'
                    let span = Span::new(start, BytePos::from_u32(pos.0 - 2));
                    match cooked {
                        Ok(cooked) => (raw, Some(cooked), false, span),
                        Err(err) => {
                            if is_tagged_tpl {
                                (raw, None, false, span)
                            } else {
                                return Err(err);
                            }
                        }
                    }
                }
                _ => unreachable!(),
            },
            Token::TemplateTail => match self.bump() {
                t @ Token::TemplateTail => {
                    let (cooked, raw) = t.take_template(self.input_mut());
                    let pos = self.input.prev_span().hi;
                    debug_assert!(start.0 <= pos.0 - 2);
                    // $____`
                    // `start.0 + 1` means skip '$'
                    // `pos.0 - 1` means skip '`'
                    let span =
                        Span::new(BytePos::from_u32(start.0 + 1), BytePos::from_u32(pos.0 - 1));
                    match cooked {
                        Ok(cooked) => (raw, Some(cooked), true, span),
                        Err(err) => {
                            if is_tagged_tpl {
                                (raw, None, true, span)
                            } else {
                                return Err(err);
                            }
                        }
                    }
                }
                _ => unreachable!(),
            },
            _ => todo!(),
        };

        Ok(TplElement {
            span,
            raw,
            tail,

            cooked,
        })
    }

    pub(super) fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<Box<TsTypeParamInstantiation>>,
    ) -> PResult<TaggedTpl> {
        let tagged_tpl_start = tag.span_lo();
        trace_cur!(self, parse_tagged_tpl);

        let tpl = Box::new(
            if self.input_mut().is(&Token::NoSubstitutionTemplateLiteral) {
                self.input_mut().rescan_template_token(true);
                self.parse_no_substitution_template_literal(true)?
            } else {
                self.parse_tpl(true)?
            },
        );

        let span = self.span(tagged_tpl_start);

        if tag.is_opt_chain() {
            self.emit_err(span, SyntaxError::TaggedTplInOptChain);
        }

        Ok(TaggedTpl {
            span,
            tag,
            type_params,
            tpl,
            ..Default::default()
        })
    }
}
