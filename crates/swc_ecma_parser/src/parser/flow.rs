#![warn(unused)]

use swc_common::{BytePos, Span, DUMMY_SP};
use swc_ecma_ast::{op, Decorator, Expr, Ident, Invalid};

use crate::{
    error::SyntaxError,
    token::{Token, TokenKind, Word},
    Context, PResult, Parser, Tokens,
};

struct FlowTypeParam {
    default: bool,
}

impl<I> Parser<I>
where
    I: Tokens,
{
    pub(super) fn may_consume_flow_type_param_decls(&mut self) -> PResult<()> {
        if !is_one_of!(self, '<', JSXTagStart) {
            return Ok(());
        }

        self.consume_flow_type_param_decl()
    }

    /// Ported from `flowParseTypeParameterDeclaration`
    pub(super) fn consume_flow_type_param_decl(&mut self) -> PResult<()> {
        self.in_type().parse_with(|p| {
            if !(eat!(p, '<') || eat!(p, JSXTagStart)) {
                unexpected!(p, "< or JSXTagStart")
            }

            let mut default_required = false;
            while !is!(p, '>') {
                if is!(p, '>') {
                    break;
                }

                let tp = p.consume_flow_type_param(default_required)?;

                if tp.default {
                    default_required = true;
                }

                if !is!(p, '>') {
                    expect!(p, ',');
                }
            }

            expect!(p, '>');

            Ok(())
        })
    }

    /// Ported from `flowParseTypeParameter`
    fn consume_flow_type_param(&mut self, require_default: bool) -> PResult<FlowTypeParam> {
        self.consume_flow_variance()?;

        self.consume_flow_type_annotation_identifier(false)?;

        let has_default = if eat!(self, '=') {
            self.consume_flow_type()?;

            true
        } else if require_default {
            let got = format!("{:?}", cur!(self, true));
            self.emit_err(
                self.input.cur_span(),
                SyntaxError::Expected(&Token::AssignOp(op!("=")), got),
            );
            false
        } else {
            false
        };

        Ok(FlowTypeParam {
            default: has_default,
        })
    }

    pub(super) fn consume_flow_variance(&mut self) -> PResult<()> {
        if !eat!(self, '+') {
            eat!(self, '-');
        }

        Ok(())
    }

    /// Ported from babel
    pub(super) fn consume_flow_type_annotation_identifier(
        &mut self,
        allow_primitive_override: bool,
    ) -> PResult<()> {
        if allow_primitive_override {
            self.parse_ident_name()?;
        } else {
            self.parse_flow_restricted_ident(false, false)?;
        }

        if is!(self, ':') {
            self.consume_flow_type_ann()?;
        }

        Ok(())
    }

    /// Ported from babel
    fn parse_flow_restricted_ident(&mut self, liberal: bool, declaration: bool) -> PResult<()> {
        if declaration {
            // self.check_flow_reserved_type(declaration)?;
        }

        self.parse_ident_name()?;

        Ok(())
    }

    pub(super) fn consume_flow_type_ann(&mut self) -> PResult<()> {
        expect!(self, ':');

        self.consume_flow_type()?;

        Ok(())
    }

    /// Ported from babel
    pub(super) fn consume_flow_type(&mut self) -> PResult<()> {
        self.in_type().consume_flow_union_type()?;

        Ok(())
    }

    /// Ported from babel
    pub(super) fn consume_flow_union_type(&mut self) -> PResult<()> {
        eat!(self, '|');

        self.consume_intersection_type()?;

        while eat!(self, '|') && !eof!(self) {
            self.consume_intersection_type()?;
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_intersection_type(&mut self) -> PResult<()> {
        eat!(self, '&');

        self.consume_flow_anon_function_without_parens()?;

        while eat!(self, '&') && !eof!(self) {
            self.consume_flow_anon_function_without_parens()?;
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_anon_function_without_parens(&mut self) -> PResult<()> {
        self.consume_flow_prefix_type()?;

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_prefix_type(&mut self) -> PResult<()> {
        if eat!(self, '?') {
            self.consume_flow_prefix_type()?;
        } else {
            self.consume_flow_postfix_type()?;
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_postfix_type(&mut self) -> PResult<()> {
        let start_pos = self.input.cur_pos();
        self.consume_flow_primary_type()?;

        while is_one_of!(self, '[', '?') && !self.input.had_line_break_before_cur() {
            let optional = eat!(self, '?');

            expect!(self, '[');

            if !optional && eat!(self, ']') {
            } else {
                let _index_type = self.consume_flow_type()?;

                expect!(self, ']');
            }
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_primary_type(&mut self) -> PResult<()> {
        let mut is_grouped_type = false;

        if is!(self, '{') {
            return self.consume_flow_object_type(false, false, true, false, true);
        }

        if is!(self, '[') {
            let ctx = Context {
                flow_no_anon_function_type: false,
                ..self.ctx()
            };
            self.with_ctx(ctx).consume_flow_tuple_type()?;
            return Ok(());
        }

        // TODO: BraceBarL

        if is!(self, '<') {
            self.consume_flow_type_param_decl()?;
            expect!(self, '(');

            self.consume_flow_type_params()?;

            expect!(self, ')');
            expect!(self, "=>");

            return self.consume_flow_type();
        }

        if eat!(self, '(') {
            // Check to see if this is actually a grouped type
            if !is!(self, ')') && !is!(self, "...") {
                if is!(self, "this")
                    || self
                        .input
                        .cur()
                        .map(token_is_identifier)
                        .unwrap_or_default()
                {
                    is_grouped_type = !peeked_is!(self, '?') && !peeked_is!(self, ':');
                } else {
                    is_grouped_type = true;
                }
            }

            let mut ty = None;

            if is_grouped_type {
                let ctx = Context {
                    flow_no_anon_function_type: false,
                    ..self.ctx()
                };
                ty = Some(self.with_ctx(ctx).consume_flow_type()?);

                // A `,` or a `) =>` means this is an anonymous function type

                if self.ctx().flow_no_anon_function_type
                    || !(is!(self, ',') || (is!(self, ')') && peeked_is!(self, "=>")))
                {
                    expect!(self, ')');
                    return Ok(());
                } else {
                    // Eat a comma if there is one
                    eat!(self, ',');
                }

                if ty.is_some() {
                    // tmp = this.flowParseFunctionTypeParams([
                    //     this.reinterpretTypeAsFunctionTypeParam(type),
                    // ]);
                } else {
                    self.consume_flow_function_type_params()?;
                }
            }

            self.consume_flow_function_type_params()?;

            expect!(self, ')');
            expect!(self, "=>");

            let _return_type = self.consume_flow_type()?;

            return Ok(());
        }

        if is_one_of!(self, Str, Num, BigInt, "true", "false", "null", "this", '*') {
            self.input.bump();
            return Ok(());
        }

        if is_one_of!(self, '+', '-') {
            self.input.bump();
            if is_one_of!(self, Num, BigInt) {
                self.input.bump();
                return Ok(());
            }
            unexpected!(self, "Numeric literal or BigInt literal");
        }

        if is!(self, "typeof") {
            return self.consume_flow_typeof_type();
        }

        if self.input.cur().map(token_is_keyword).unwrap_or_default() {
            // let _label = token_label_name(cur!(self, true));
            self.input.bump();
            return Ok(());
        } else if self
            .input
            .cur()
            .map(token_is_identifier)
            .unwrap_or_default()
        {
            if is_contextual!(self, "interface") {
                return self.consume_flow_inteface_type();
            }
            let ident = self.parse_ident_name()?;

            self.parse_flow_ident_to_type_ann(ident)?;

            return Ok(());
        }

        unexpected!(self, "primary flow type")
    }

    /// Ported from babel
    fn parse_flow_ident_to_type_ann(&mut self, ident: Ident) -> PResult<()> {
        match &*ident.sym {
            "any" | "bool" | "boolean" | "empty" | "mixed" | "number" | "string" | "symbol" => {
                Ok(())
            }

            _ => {
                self.consume_flow_generic_type()?;

                Ok(())
            }
        }
    }

    /// Ported from babel
    fn consume_flow_generic_type(&mut self) -> PResult<()> {
        self.consume_flow_qualified_type_identifier(None)?;

        if is!(self, '<') {
            self.consume_flow_type_param_instantiation()?;
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_type_param_instantiation(&mut self) -> PResult<()> {
        self.in_type().parse_with(|p| {
            expect!(p, '<');

            while !is!(p, '>') {
                p.consume_flow_type()?;

                if !is!(p, '>') {
                    expect!(p, ',');
                }
            }

            expect!(p, '>');

            Ok(())
        })
    }

    /// Ported from babel
    fn consume_flow_qualified_type_identifier(&mut self, id: Option<Ident>) -> PResult<()> {
        if id.is_none() {
            self.consume_flow_restricted_ident()?;
        }

        while eat!(self, '.') {
            self.consume_flow_restricted_ident()?;
        }

        Ok(())
    }

    fn consume_flow_restricted_ident(&mut self) -> PResult<()> {
        self.parse_ident_name()?;

        Ok(())
    }

    /// Ported from `flowParseFunctionTypeParams`
    fn consume_flow_function_type_params(&mut self) -> PResult<()> {
        if is!(self, "this") {
            self.consume_flow_function_type_param(true)?;

            if is!(self, ')') {
                expect!(self, ',');
            }
        }

        while !eof!(self) && !is!(self, ')') && !is!(self, "...") {
            self.consume_flow_function_type_param(false)?;

            if !is!(self, ')') {
                expect!(self, ',');
            }
        }

        if eat!(self, "...") {
            self.consume_flow_function_type_param(false)?;
        }

        Ok(())
    }

    /// Ported from `flowParseFunctionTypeParam`
    fn consume_flow_function_type_param(&mut self, first: bool) -> PResult<()> {
        let is_this = is!(self, "this");

        if peeked_is!(self, ':') || peeked_is!(self, '?') {
            if is_this && !first {
                self.emit_err(self.input.cur_span(), SyntaxError::FlowThisParamMustBeFirst);
            }

            let _name = self.parse_ident_name()?;

            if eat!(self, '?') && is_this {
                self.emit_err(
                    self.input.cur_span(),
                    SyntaxError::FlowThisParamCannotBeOptional,
                );
            }

            self.consume_flow_type_init(None)?;
        } else {
            self.consume_flow_type()?;
        }

        Ok(())
    }

    fn consume_flow_type_params(&mut self) -> PResult<()> {
        todo!("consume_flow_type_params")
    }

    fn consume_flow_inteface_type(&mut self) -> PResult<()> {
        todo!("consume_flow_inteface_type")
    }

    /// Ported from `flowParseTypeofType`
    fn consume_flow_typeof_type(&mut self) -> PResult<()> {
        assert_and_bump!(self, "typeof");

        let _arguemnt = self.consume_flow_primary_type()?;

        Ok(())
    }

    fn consume_flow_object_type(
        &mut self,
        allow_static: bool,
        allow_exact: bool,
        allow_spread: bool,
        allow_proto: bool,
        allow_inexact: bool,
    ) -> PResult<()> {
        self.in_type().parse_with(|p| {
            // TODO: 'BraceBarL'
            todo!("consume_flow_object_type")
        })
    }

    /// Ported from `flowParseTupleType`
    fn consume_flow_tuple_type(&mut self) -> PResult<()> {
        expect!(self, '[');

        self.consume_flow_type()?;

        while !eof!(self) && !is!(self, ']') {
            self.consume_flow_type()?;

            if is!(self, ']') {
                break;
            }
            expect!(self, ',');
        }

        expect!(self, ']');

        Ok(())
    }

    /// Ported from `flowParseTypeInitialiser`
    fn consume_flow_type_init(&mut self, token: Option<TokenKind>) -> PResult<()> {
        self.in_type().parse_with(|p| {
            match token {
                Some(delim) => {
                    let token = cur!(p, true);
                    if token.kind() == delim {
                        p.input.bump();
                    } else {
                        p.emit_err(
                            p.input.cur_span(),
                            SyntaxError::Unexpected {
                                expected: "end delimiter of type annotation",
                                got: format!("{delim:?}"),
                            },
                        );
                        return Ok(());
                    }
                }
                None => {
                    expect!(p, ':');
                }
            }

            p.consume_flow_type()?;

            Ok(())
        })
    }

    pub(super) fn may_consume_flow_expr_stmt(&mut self, ident: Ident) -> PResult<()> {
        let start = self.input.cur_pos();

        match &*ident.sym {
            "declare" => {
                self.consume_flow_declare(start)?;
            }

            "opaque" => {
                self.consume_flow_opaque_type(start)?;
            }

            _ => {}
        }

        Ok(())
    }

    fn consume_flow_declare(&mut self, start: BytePos) -> PResult<()> {
        eat!(self, "export");

        if is!(self, "class") {
            let class_start = self.input.cur_pos();
            self.parse_class_decl(start, class_start, vec![], false)?;
            return Ok(());
        }

        if is!(self, "function") {
            self.parse_fn_decl(vec![])?;
            return Ok(());
        }

        if is!(self, "opaque") {
            self.consume_flow_opaque_type(start)?;
            return Ok(());
        }

        if is!(self, "type") {
            self.consume_flow_type_alias()?;
            return Ok(());
        }

        Ok(())
    }

    fn consume_flow_opaque_type(&mut self, start: BytePos) -> PResult<()> {
        if is!(self, "type") {
            self.consume_flow_type_alias()?;
            return Ok(());
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_type_alias(&mut self) -> PResult<()> {
        assert_and_bump!(self, "type");

        let _ident = self.parse_flow_restricted_ident(false, true)?;

        if is!(self, '<') {
            self.consume_flow_type_param_decl()?;
        }

        self.consume_flow_type_init(Some(tok!('=').kind()))?;
        expect!(self, ';');

        Ok(())
    }
}

fn token_is_identifier(cur: &Token) -> bool {
    matches!(cur, Token::Word(Word::Ident(..)))
}

fn token_is_keyword(cur: &Token) -> bool {
    matches!(cur, Token::Word(Word::Keyword(..)))
}
