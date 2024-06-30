#![warn(unused)]

use swc_common::{BytePos, Span};
use swc_ecma_ast::{op, Ident};

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
        trace_cur!(self, consume_flow_type_param_decl);

        self.in_type().parse_with(|p| {
            if !(eat!(p, '<') || eat!(p, JSXTagStart)) {
                unexpected!(p, "< or JSXTagStart")
            }

            let mut first = true;
            let mut default_required = false;
            while first || !is!(p, '>') {
                trace_cur!(p, consume_flow_type_param_decl__loop);
                first = false;
                if is!(p, '>') {
                    break;
                }

                let tp = p.consume_flow_type_param(default_required)?;

                if tp.default {
                    default_required = true;
                }

                trace_cur!(p, consume_flow_type_param_decl__after_type_param);

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

    pub(super) fn consume_flow_variance(&mut self) -> PResult<Option<()>> {
        if eat!(self, '+') || eat!(self, '-') {
            return Ok(Some(()));
        }

        Ok(None)
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

    /// Ported from `flowParseRestrictedIdentifier`
    fn parse_flow_restricted_ident(&mut self, liberal: bool, declaration: bool) -> PResult<()> {
        let name = self.parse_ident_name()?;

        if declaration {
            self.check_flow_reserved_type(&name.sym, declaration)?;
        }

        Ok(())
    }

    fn check_flow_reserved_type(&mut self, word: &str, declaration: bool) -> PResult<()> {
        const RESERVED: &[&str] = &[
            "_",
            "any",
            "bool",
            "boolean",
            "empty",
            "extends",
            "false",
            "interface",
            "mixed",
            "null",
            "number",
            "static",
            "string",
            "true",
            "typeof",
            "void",
        ];

        if RESERVED.contains(&word) {
            let span = self.input.cur_span();
            self.emit_err(
                span,
                SyntaxError::FlowReservedWordInType { word: word.into() },
            );
        }

        Ok(())
    }

    pub(super) fn may_consume_flow_type_ann(&mut self) -> PResult<()> {
        if is!(self, ':') {
            self.consume_flow_type_ann()?;
        }

        Ok(())
    }

    pub(super) fn consume_flow_type_ann(&mut self) -> PResult<()> {
        expect!(self, ':');

        self.consume_flow_type()?;

        Ok(())
    }

    /// Ported from babel
    pub(super) fn consume_flow_type(&mut self) -> PResult<()> {
        trace_cur!(self, consume_flow_type);

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
        trace_cur!(self, consume_flow_primary_type);

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
                if self
                    .input
                    .cur()
                    .map(token_is_identifier)
                    .unwrap_or_default()
                    || is!(self, "this")
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

        // TODO(kdy1): Check if this is correct
        if eat!(self, "renders") {
            self.consume_flow_type()?;
            return Ok(());
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
        trace_cur!(self, parse_flow_ident_to_type_ann);

        match &*ident.sym {
            "any" | "bool" | "boolean" | "empty" | "mixed" | "number" | "string" | "symbol" => {
                Ok(())
            }

            _ => {
                self.consume_flow_generic_type(ident)?;

                Ok(())
            }
        }
    }

    /// Ported from babel
    fn consume_flow_generic_type(&mut self, id: Ident) -> PResult<()> {
        trace_cur!(self, consume_flow_generic_type);

        self.consume_flow_qualified_type_identifier(Some(id))?;

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

    /// Ported from `flowParseQualifiedTypeIdentifier`
    fn consume_flow_qualified_type_identifier(&mut self, id: Option<Ident>) -> PResult<()> {
        trace_cur!(self, consume_flow_qualified_type_identifier);

        if id.is_none() {
            self.consume_flow_restricted_ident()?;
        }

        while eat!(self, '.') {
            self.consume_flow_restricted_ident()?;
        }

        Ok(())
    }

    fn consume_flow_restricted_ident(&mut self) -> PResult<()> {
        trace_cur!(self, consume_flow_restricted_ident);

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

    /// Ported from `flowParseObjectType`
    fn consume_flow_object_type(
        &mut self,
        allow_static: bool,
        allow_exact: bool,
        allow_spread: bool,
        allow_proto: bool,
        allow_inexact: bool,
    ) -> PResult<()> {
        self.in_type().parse_with(|p| {
            let mut end_delim;
            let mut exact;
            let mut inexact = false;

            if allow_exact {
                todo!("consume_flow_object_type: allow_exact");
            } else {
                expect!(p, '{');
                end_delim = tok!('}');
                exact = false;
            }

            while !p.input.is(&end_delim) {
                let mut is_static = false;
                let mut proto_start_loc = None;
                let mut inexact_start_loc: Option<BytePos> = None;

                if allow_proto
                    && is_contextual!(p, "proto")
                    && !peeked_is!(p, ':')
                    && !peeked_is!(p, '?')
                {
                    bump!(p);
                    allow_static = false;
                    proto_start_loc = Some(p.input.cur_pos());
                }

                if allow_static && is_contextual!(p, "static") {
                    if !peeked_is!(p, ':') && !peeked_is!(p, '?') {
                        bump!(p);
                    }
                    is_static = true;
                }

                let variance = p.consume_flow_variance()?;

                if eat!(self, '[') {
                    if proto_start_loc.is_some() {
                        unexpected!(self, "[ after proto")
                    }

                    if eat!(self, '[') {
                        if variance.is_some() {
                            unexpected!(self, "[[ after variance")
                        }

                        self.consume_flow_object_type_interanl_slot((), is_static)?;
                    } else {
                        self.parse_flow_object_type_indexer((), is_static, variance)?
                    }
                } else if is_one_of!(self, '(', '<') {
                    if proto_start_loc.is_some() {
                        unexpected!(self, "( after proto")
                    }

                    if variance.is_some() {
                        unexpected!(self, "( after variance")
                    }

                    self.consume_flow_object_type_call_property((), is_static)?;
                } else {
                    // let mut kind = "init";

                    // if is_contextual!(self, "get") || is_contextual!(self, "set") {
                    //     if self
                    //         .input
                    //         .peek()
                    //         .map(token_is_literal_property_name)
                    //         .unwrap_or_default()
                    //     {
                    //         kind = bump!(self).value;
                    //     }
                    // }

                    todo!("consume_flow_object_type: kind");
                }

                self.consume_flow_object_type_semicolon()?;

                // if inexact_start_loc && !is!(self, '}') && !is!(self, "|}") {
                //     self.emit_err(
                //         inexact_start_loc,
                //         SyntaxError::FlowUnexpectedExplicitInexactInObject,
                //     )
                // }
            }

            if !self.input.eat(&end_delim) {
                unexpected!(self, "end delimiter of object type")
            }

            Ok(())
        })
    }

    /// Ported from `flowParseObjectTypeIndexer`
    fn parse_flow_object_type_indexer(
        &mut self,
        node: (),
        is_static: bool,
        variance: Option<()>,
    ) -> PResult<()> {
        // Note: bracketL has already been consumed
        if peeked_is!(self, ':') {
            self.consume_flow_object_property_key()?;
            self.consume_flow_type_init(None)?;
        } else {
            self.consume_flow_type()?;
        }

        expect!(self, ']');
        self.consume_flow_type_init(None)?;

        Ok(())
    }

    /// Ported from `flowParseObjectPropertyKey`
    fn consume_flow_object_property_key(&mut self) -> PResult<()> {
        if is_one_of!(self, Str, Num) {
            self.input.bump();
        } else {
            self.parse_ident_name()?
        }

        Ok(())
    }

    /// Ported from `flowParseTupleType`
    fn consume_flow_tuple_type(&mut self) -> PResult<()> {
        expect!(self, '[');

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

    /// Ported from `flowParseObjectTypeInternalSlot`
    fn consume_flow_object_type_interanl_slot(&mut self, node: (), is_static: bool) -> PResult<()> {
        // Note: both bracketL have already been consumed
        let id = self.consume_flow_object_property_key()?;

        expect!(self, ']');
        expect!(self, ']');

        if is_one_of!(self, '<', '(') {
            self.consume_flow_object_type_methodish(())?;
        } else {
            eat!(self, '?');

            let _value = self.consume_flow_type_init(None)?;
        }

        Ok(())
    }

    /// Ported from `flowParseTypeInitialiser`
    fn consume_flow_type_init(&mut self, token: Option<TokenKind>) -> PResult<()> {
        trace_cur!(self, consume_flow_type_init);

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

            "export" => {
                self.consume_flow_export(start)?;
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

        let ctx = Context {
            in_declare: true,
            ..self.ctx()
        };
        let mut p = self.with_ctx(ctx);

        if is!(p, "class") {
            let class_start = p.input.cur_pos();
            p.parse_class_decl(start, class_start, vec![], false)?;
            return Ok(());
        }

        if is!(p, "function") {
            p.parse_fn_decl(vec![])?;
            return Ok(());
        }

        if is!(p, "opaque") {
            p.consume_flow_opaque_type(start)?;
            return Ok(());
        }

        if is!(p, "type") {
            p.consume_flow_type_alias()?;
            return Ok(());
        }

        if is_one_of!(p, "var", "const", "let") {
            p.parse_var_stmt(false)?;
            return Ok(());
        }

        Ok(())
    }

    fn consume_flow_export(&mut self, start: BytePos) -> PResult<()> {
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
        assert_and_bump!(self, "opaque");

        if is!(self, "type") {
            self.consume_flow_type_alias()?;
            return Ok(());
        }

        Ok(())
    }

    /// Ported from babel
    fn consume_flow_type_alias(&mut self) -> PResult<()> {
        assert_and_bump!(self, "type");

        trace_cur!(self, consume_flow_type_alias);

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
