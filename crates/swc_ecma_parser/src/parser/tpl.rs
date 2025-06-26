use swc_common::{source_map::SmallPos, BytePos, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_lexer::{
    common::{
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer, eof_error, typescript::parse_ts_type, PResult, Parser as ParserTrait,
        },
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
        let start = self.cur_pos();
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
        debug_assert!(matches!(self.input.cur(), Some(&Token::TemplateHead)));

        let start = self.cur_pos();

        let (exprs, quasis) = self.parse_tpl_elements(is_tagged_tpl)?;

        let _ = self.input.cur();

        Ok(Tpl {
            span: self.span(start),
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
        let start = self.cur_pos();
        let Some(cur) = self.input_mut().cur() else {
            return Err(eof_error(self));
        };
        let (raw, cooked, tail, span) = match *cur {
            Token::TemplateMiddle => {
                let t = self.bump();
                let (cooked, raw) = t.take_template(self.input_mut());
                let pos = self.input.prev_span().hi;
                debug_assert!(start.0 <= pos.0 - 2);
                // case: ___${
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
            Token::TemplateTail => {
                let t = self.bump();
                let (cooked, raw) = t.take_template(self.input_mut());
                let pos = self.input.prev_span().hi;
                debug_assert!(start.0 < pos.0);
                // case: ____`
                // `pos.0 - 1` means skip '`'
                let span = Span::new(start, BytePos::from_u32(pos.0 - 1));
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
            Token::Error => {
                let t = self.input_mut().bump();
                let err = t.take_error(self.input_mut());
                return Err(err);
            }
            _ => {
                unexpected!(self, "`}`")
            }
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

    fn parse_tpl_ty_elements(&mut self) -> PResult<(Vec<Box<TsType>>, Vec<TplElement>)> {
        trace_cur!(self, parse_tpl_elements);

        let mut tys = Vec::new();
        let cur_elem = self.parse_template_head(false)?;
        let mut is_tail = cur_elem.tail;
        let mut quasis = vec![cur_elem];

        while !is_tail {
            tys.push(parse_ts_type(self)?);
            let elem = self.parse_tpl_element(false)?;
            is_tail = elem.tail;
            quasis.push(elem);
        }
        Ok((tys, quasis))
    }

    fn parse_no_substitution_template_ty(&mut self) -> PResult<TsTplLitType> {
        let start = self.input.cur_pos();
        let (raw, cooked) = match self.bump() {
            t @ Token::NoSubstitutionTemplateLiteral => {
                let (cooked, raw) = t.take_template(self.input_mut());
                match cooked {
                    Ok(cooked) => (raw, Some(cooked)),
                    Err(_) => (raw, None),
                }
            }
            _ => unreachable!(),
        };
        let pos = self.input.prev_span().hi;
        debug_assert!(start.0 <= pos.0);
        let span = Span::new(start, pos);
        Ok(TsTplLitType {
            span,
            types: vec![],
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

    fn parse_tpl_ty(&mut self) -> PResult<TsTplLitType> {
        trace_cur!(self, parse_tpl_ty);
        debug_assert!(matches!(self.input.cur(), Some(&Token::TemplateHead)));

        let start = self.cur_pos();

        let (types, quasis) = self.parse_tpl_ty_elements()?;

        let _ = self.input.cur();

        Ok(TsTplLitType {
            span: self.span(start),
            types,
            quasis,
        })
    }

    pub(super) fn parse_tagged_tpl_ty(&mut self) -> PResult<TsTplLitType> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, parse_tagged_tpl);
        if self.input_mut().is(&Token::NoSubstitutionTemplateLiteral) {
            self.parse_no_substitution_template_ty()
        } else {
            self.parse_tpl_ty()
        }
    }
}
