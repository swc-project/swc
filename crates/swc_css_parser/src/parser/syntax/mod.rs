use swc_common::{BytePos, Span, Spanned};
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{BlockContentsGrammar, Ctx},
    Parse,
};

impl<I> Parse<Stylesheet> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Stylesheet> {
        // Create a new stylesheet, with its location set to location (or null, if
        // location was not passed).
        let start = self.input.cur_span();

        // Consume a list of rules from input, with the top-level flag set, and set the
        // stylesheet’s value to the result.
        let rules = self
            .with_ctx(Ctx {
                is_top_level: true,
                ..self.ctx
            })
            .parse_as::<Vec<Rule>>()?;
        let last = self.input.last_pos();

        // Return the stylesheet.
        Ok(Stylesheet {
            span: Span::new(start.lo, last),
            rules,
        })
    }
}

impl<I> Parse<Vec<Rule>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Rule>> {
        // To consume a list of rules, given a top-level flag:

        // Create an initially empty list of rules.
        let mut rules = Vec::new();

        // Repeatedly consume the next input token:

        // Reset the `is_top_level` value
        let ctx = Ctx {
            is_top_level: false,
            ..self.ctx
        };
        loop {
            // <EOF-token>
            // Return the list of rules.
            if is!(self, EOF) {
                return Ok(rules);
            }

            match cur!(self) {
                // <whitespace-token>
                // Do nothing.
                tok!(" ") => {
                    self.input.skip_ws();
                }
                // <CDO-token>
                // <CDC-token>
                tok!("<!--") | tok!("-->") => {
                    // If the top-level flag is set, do nothing.
                    if self.ctx.is_top_level {
                        bump!(self);
                    }
                    // Otherwise, reconsume the current input token. Consume a qualified rule. If
                    // anything is returned, append it to the list of rules.
                    else {
                        let qualified_rule = self.with_ctx(ctx).parse_as::<Box<QualifiedRule>>()?;

                        rules.push(Rule::QualifiedRule(qualified_rule));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the returned
                // value to the list of rules.
                tok!("@") => {
                    let at_rule = self.with_ctx(ctx).parse_as::<Box<AtRule>>()?;

                    rules.push(Rule::AtRule(at_rule));
                }
                // anything else
                // Reconsume the current input token. Consume a qualified rule. If anything is
                // returned, append it to the list of rules.
                //
                // For better recovery we parse broken code into the list of component values and
                // append it to the list of rules.
                _ => {
                    let state = self.input.state();
                    let qualified_rule = self.with_ctx(ctx).parse_as::<Box<QualifiedRule>>();

                    match qualified_rule {
                        Ok(i) => rules.push(Rule::QualifiedRule(i)),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span();
                            let mut list_of_component_values = ListOfComponentValues {
                                span: Default::default(),
                                children: Vec::new(),
                            };

                            while !is_one_of!(self, EOF) {
                                let component_value =
                                    self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                                list_of_component_values.children.push(component_value);
                            }

                            list_of_component_values.span = span!(self, span.lo);

                            rules.push(Rule::ListOfComponentValues(Box::new(
                                list_of_component_values,
                            )));
                        }
                    };
                }
            }
        }
    }
}

impl<I> Parse<AtRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AtRule> {
        // To consume an at-rule:

        // Consume the next input token. Create a new at-rule with its name set to the
        // value of the current input token, its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let span = self.input.cur_span();
        let at_keyword_name = match bump!(self) {
            Token::AtKeyword { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let is_dashed_ident = at_keyword_name.0.starts_with("--");
        let name = if is_dashed_ident {
            AtRuleName::DashedIdent(DashedIdent {
                span: Span::new(span.lo + BytePos(1), span.hi),
                value: self.input.atom(&at_keyword_name.0[2..]),
                raw: Some(at_keyword_name.1),
            })
        } else {
            AtRuleName::Ident(Ident {
                span: Span::new(span.lo + BytePos(1), span.hi),
                value: at_keyword_name.0,
                raw: Some(at_keyword_name.1),
            })
        };
        let mut prelude = Vec::new();
        let mut at_rule = AtRule {
            span: Default::default(),
            name,
            prelude: None,
            block: None,
        };

        loop {
            // <EOF-token>
            // This is a parse error. Return the at-rule.
            if is!(self, EOF) {
                if prelude.is_empty() {
                    self.errors.push(Error::new(
                        span!(self, span.lo),
                        ErrorKind::EofButExpected("';' or '{'"),
                    ));

                    at_rule.span = span!(self, span.lo);

                    return Ok(at_rule);
                }

                at_rule.prelude = Some(Box::new(AtRulePrelude::ListOfComponentValues(
                    self.create_locv(prelude),
                )));
                at_rule.span = span!(self, span.lo);

                // Canonicalization against a grammar
                if !is_dashed_ident && self.ctx.need_canonicalize {
                    at_rule = self.canonicalize_at_rule_prelude(at_rule)?;
                }

                return Ok(at_rule);
            }

            match cur!(self) {
                // <semicolon-token>
                // Return the at-rule.
                tok!(";") => {
                    self.input.bump();

                    at_rule.prelude = Some(Box::new(AtRulePrelude::ListOfComponentValues(
                        self.create_locv(prelude),
                    )));
                    at_rule.span = span!(self, span.lo);

                    // Canonicalization against a grammar
                    if !is_dashed_ident && self.ctx.need_canonicalize {
                        at_rule = self.canonicalize_at_rule_prelude(at_rule)?;
                    }

                    return Ok(at_rule);
                }
                // <{-token>
                // Consume a simple block and assign it to the at-rule’s block. Return the at-rule.
                tok!("{") => {
                    let block = self.parse_as::<SimpleBlock>()?;

                    at_rule.prelude = Some(Box::new(AtRulePrelude::ListOfComponentValues(
                        self.create_locv(prelude),
                    )));
                    at_rule.block = Some(block);
                    at_rule.span = span!(self, span.lo);

                    // Canonicalization against a grammar
                    if !is_dashed_ident && self.ctx.need_canonicalize {
                        at_rule = self.canonicalize_at_rule_prelude(at_rule)?;
                        at_rule = self.canonicalize_at_rule_block(at_rule)?;
                    }

                    return Ok(at_rule);
                }
                // anything else
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the at-rule’s prelude.
                _ => {
                    let component_value = self.parse_as::<ComponentValue>()?;
                    prelude.push(component_value);
                }
            }
        }
    }
}

impl<I> Parse<QualifiedRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<QualifiedRule> {
        // To consume a qualified rule:

        // Create a new qualified rule with its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let span = self.input.cur_span();
        let mut prelude = Vec::new();

        // Repeatedly consume the next input token:
        loop {
            // <EOF-token>
            // This is a parse error. Return nothing.
            if is!(self, EOF) {
                return Err(Error::new(
                    span!(self, span.lo),
                    ErrorKind::EofButExpected("'{'"),
                ));
            }

            match cur!(self) {
                // <semicolon-token>
                // If mixed with declarations is true, this is a parse error; return nothing.
                // Otherwise, append a <semicolon-token> to the qualified rule’s prelude.
                tok!(";") => {
                    if self.ctx.mixed_with_declarations {
                        let span = self.input.cur_span();

                        return Err(Error::new(span, ErrorKind::Expected("'{'")));
                    } else {
                        let component_value = self.parse_as::<ComponentValue>()?;

                        prelude.push(component_value);
                    }
                }
                // <{-token>
                // Consume a simple block and assign it to the qualified rule’s block. Return the
                // qualified rule.
                tok!("{") => {
                    let block = self.parse_as::<SimpleBlock>()?;
                    let mut qualified_rule = QualifiedRule {
                        span: span!(self, span.lo),
                        prelude: QualifiedRulePrelude::ListOfComponentValues(
                            self.create_locv(prelude),
                        ),
                        block,
                    };

                    // Canonicalization against a grammar
                    if self.ctx.need_canonicalize {
                        qualified_rule =
                            self.canonicalize_qualified_rule_prelude(qualified_rule)?;
                        qualified_rule = self.canonicalize_qualified_rule_block(qualified_rule)?;
                    }

                    return Ok(qualified_rule);
                }
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the qualified rule’s prelude.
                _ => {
                    let component_value = self.parse_as::<ComponentValue>()?;

                    prelude.push(component_value);
                }
            }
        }
    }
}

impl<I> Parse<Vec<StyleBlock>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<StyleBlock>> {
        let mut declarations = Vec::new();
        let mut rules = Vec::new();

        loop {
            // <EOF-token>
            // Extend decls with rules, then return decls.
            if is!(self, EOF) {
                declarations.extend(rules);

                return Ok(declarations);
            }

            match cur!(self) {
                // <whitespace-token>
                // Do nothing.
                tok!(" ") => {
                    self.input.skip_ws();
                }
                // <semicolon-token>
                // Do nothing.
                tok!(";") => {
                    let token_and_span = self.input.bump().unwrap();

                    // For recovery mode
                    if let Some(StyleBlock::ListOfComponentValues(list_of_component_values)) =
                        declarations.last_mut()
                    {
                        list_of_component_values.span =
                            Span::new(list_of_component_values.span_lo(), token_and_span.span_hi());
                        list_of_component_values
                            .children
                            .push(ComponentValue::PreservedToken(Box::new(token_and_span)));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the result to
                // rules.
                tok!("@") => {
                    let at_rule = self.parse()?;

                    rules.push(StyleBlock::AtRule(Box::new(at_rule)));
                }
                // <ident-token>
                // <function-token>
                // <function>
                //
                // Reconsume the current input token. Initialize a temporary list, initially empty.
                // As long as the next input token is anything other than a <semicolon-token> or
                // <EOF-token>, consume a component value and append it to the temporary list.
                // Consume a declaration from the temporary list. If anything was returned, append
                // it to decls.
                tok!("ident") | tok!("function") => {
                    // Legacy nested parsing conflict with custom properties, but selectors can't
                    // start with `--`, so it is safe to ignore them.
                    //
                    // Constructions like `a { prop: {value}; }` still affected this problem, but
                    // `{`/`}` doesn't used in declarations
                    if self.config.legacy_nesting
                        && matches!(self.input.cur(), Some(Token::Ident { value, .. }) if !value.starts_with("--"))
                    {
                        if let Some(legacy_nested) = self.try_to_parse_legacy_nesting() {
                            rules.push(StyleBlock::QualifiedRule(Box::new(legacy_nested)));

                            continue;
                        }
                    }

                    let span = self.input.cur_span();
                    let mut temporary_list = ListOfComponentValues {
                        span: Default::default(),
                        children: Vec::new(),
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let component_value = self.parse_as::<ComponentValue>()?;

                        temporary_list.children.push(component_value);
                    }

                    let decl_or_list_of_component_values =
                        match self.parse_declaration_from_temporary_list(&temporary_list) {
                            Ok(decl) => StyleBlock::Declaration(Box::new(decl)),
                            Err(err) => {
                                self.errors.push(err);

                                temporary_list.span = span!(self, span.lo);

                                StyleBlock::ListOfComponentValues(Box::new(temporary_list))
                            }
                        };

                    declarations.push(decl_or_list_of_component_values);
                }
                // anything else
                // Reconsume the current input token. Consume a qualified rule, with mixed with
                // declarations set to true. If anything was returned, append it to rules.
                _ => {
                    let state = self.input.state();
                    let qualified_rule = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::StyleBlock,
                            mixed_with_declarations: true,
                            ..self.ctx
                        })
                        .parse_as::<Box<QualifiedRule>>();

                    match qualified_rule {
                        Ok(i) => rules.push(StyleBlock::QualifiedRule(i)),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span();

                            self.errors
                                .push(Error::new(span, ErrorKind::Unexpected("token")));

                            // For recovery mode
                            let mut list_of_component_values = ListOfComponentValues {
                                span: Default::default(),
                                children: Vec::new(),
                            };

                            while !is_one_of!(self, ";", EOF) {
                                let component_value = self.parse_as::<ComponentValue>()?;

                                list_of_component_values.children.push(component_value);
                            }

                            list_of_component_values.span = span!(self, span.lo);

                            declarations.push(StyleBlock::ListOfComponentValues(Box::new(
                                list_of_component_values,
                            )));
                        }
                    };
                }
            }
        }
    }
}

impl<I> Parse<Vec<DeclarationOrAtRule>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationOrAtRule>> {
        // Create an initially empty list of declarations.
        let mut declarations = Vec::new();

        // Repeatedly consume the next input token:
        loop {
            // <EOF-token>
            // Return the list of declarations.
            if is!(self, EOF) {
                return Ok(declarations);
            }

            match cur!(self) {
                // <whitespace-token>
                // Do nothing.
                tok!(" ") => {
                    self.input.skip_ws();
                }
                // <semicolon-token>
                // Do nothing.
                tok!(";") => {
                    let token_and_span = self.input.bump().unwrap();

                    // For recovery mode
                    if let Some(DeclarationOrAtRule::ListOfComponentValues(
                        list_of_component_values,
                    )) = declarations.last_mut()
                    {
                        list_of_component_values.span =
                            Span::new(list_of_component_values.span_lo(), token_and_span.span_hi());
                        list_of_component_values
                            .children
                            .push(ComponentValue::PreservedToken(Box::new(token_and_span)));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule. Append the returned rule
                // to the list of declarations.
                tok!("@") => {
                    let at_rule = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::DeclarationList,
                            ..self.ctx
                        })
                        .parse_as::<AtRule>()?;

                    declarations.push(DeclarationOrAtRule::AtRule(Box::new(at_rule)));
                }
                // <ident-token>
                // Initialize a temporary list initially filled with the current input token. As
                // long as the next input token is anything other than a <semicolon-token> or
                // <EOF-token>, consume a component value and append it to the temporary list.
                // Consume a declaration from the temporary list. If anything was returned, append
                // it to the list of declarations.
                tok!("ident") => {
                    let span = self.input.cur_span();
                    let mut temporary_list = ListOfComponentValues {
                        span: Default::default(),
                        children: Vec::new(),
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let component_value = self.parse_as::<ComponentValue>()?;

                        temporary_list.children.push(component_value);
                    }

                    let decl_or_list_of_component_values =
                        match self.parse_declaration_from_temporary_list(&temporary_list) {
                            Ok(decl) => DeclarationOrAtRule::Declaration(Box::new(decl)),
                            Err(err) => {
                                self.errors.push(err);

                                temporary_list.span = span!(self, span.lo);

                                DeclarationOrAtRule::ListOfComponentValues(Box::new(temporary_list))
                            }
                        };

                    declarations.push(decl_or_list_of_component_values);
                }
                // anything else
                // This is a parse error. Reconsume the current input token. As long as the next
                // input token is anything other than a <semicolon-token> or <EOF-token>, consume a
                // component value and throw away the returned value.
                //
                // We don't throw away the return value because of the recovery mode and return list
                // of components values in this case
                _ => {
                    let span = self.input.cur_span();

                    self.errors.push(Error::new(
                        span,
                        ErrorKind::Expected("whitespace, ';', '@', ident or EOF"),
                    ));

                    // For recovery mode
                    let mut list_of_component_values = ListOfComponentValues {
                        span: Default::default(),
                        children: Vec::new(),
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let component_value = self.parse_as::<ComponentValue>()?;

                        list_of_component_values.children.push(component_value);
                    }

                    list_of_component_values.span = span!(self, span.lo);

                    declarations.push(DeclarationOrAtRule::ListOfComponentValues(Box::new(
                        list_of_component_values,
                    )));
                }
            }
        }
    }
}

impl<I> Parse<Declaration> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Declaration> {
        // To consume a declaration:

        // Let decl be a new declaration, with an initially empty name and a value set
        // to an empty list.

        // TODO improve me
        // Consume a component value.
        // <ident-token>
        // Set decl’s name to the value of the <ident-token>.
        //
        // anything else
        // This is a parse error.
        //
        // While the next input token is anything but a <semicolon-token> or
        // <eof-token>, consume a component value and throw it away.
        //
        // Return nothing.
        let span = self.input.cur_span();
        let declaration_name = match cur!(self) {
            Token::Ident { value, .. } => value,
            _ => {
                return Err(Error::new(span, ErrorKind::Expected("ident")));
            }
        };
        let is_dashed_ident = declaration_name.starts_with("--");
        let name = if is_dashed_ident {
            let ident = self.parse()?;

            DeclarationName::DashedIdent(ident)
        } else {
            let ident: Ident = self.parse()?;

            DeclarationName::Ident(ident)
        };
        let mut declaration = Declaration {
            span: Default::default(),
            name,
            value: Vec::new(),
            important: None,
        };

        // 2. While the next input token is a <whitespace-token>, consume the next input
        // token.
        self.input.skip_ws();

        // 3. If the next input token is anything other than a <colon-token>, this is a
        // parse error. Return nothing. Otherwise, consume the next input token.
        expect!(self, ":");

        // 4. While the next input token is a <whitespace-token>, consume the next input
        // token.
        self.input.skip_ws();

        // 5. As long as the next input token is anything other than an <EOF-token>,
        // consume a component value and append it to the declaration’s value.
        let mut is_valid_to_canonicalize = true;
        let mut last_whitespaces = (0, 0, 0);
        let mut exclamation_point_span = None;
        let mut important_ident = None;

        loop {
            if is!(self, EOF) {
                break;
            }

            let component_value = self.parse_as::<ComponentValue>()?;

            match &component_value {
                // Optimization for step 6
                ComponentValue::PreservedToken(token_and_span)
                    if matches!(token_and_span.token, Token::Delim { value: '!', .. })
                        && (is!(self, " ") || is_case_insensitive_ident!(self, "important")) =>
                {
                    if let Some(span) = &exclamation_point_span {
                        is_valid_to_canonicalize = false;

                        self.errors.push(Error::new(
                            *span,
                            ErrorKind::Unexpected("'!' in declaration value"),
                        ));

                        important_ident = None;
                        last_whitespaces = (last_whitespaces.2, 0, 0);
                    }

                    exclamation_point_span = Some(token_and_span.span);
                }
                ComponentValue::PreservedToken(token_and_span)
                    if matches!(token_and_span.token, Token::WhiteSpace { .. }) =>
                {
                    match (&exclamation_point_span, &important_ident) {
                        (Some(_), Some(_)) => {
                            last_whitespaces.2 += 1;
                        }
                        (Some(_), None) => {
                            last_whitespaces.1 += 1;
                        }
                        (None, None) => {
                            last_whitespaces.0 += 1;
                        }
                        _ => {
                            unreachable!();
                        }
                    }
                }
                ComponentValue::PreservedToken(token_and_span)
                    if exclamation_point_span.is_some()
                        && matches!(
                            &token_and_span.token,
                            Token::Ident { value, .. } if matches_eq_ignore_ascii_case!(value, "important")
                        ) =>
                {
                    important_ident = Some(token_and_span.clone());
                }
                _ => {
                    if let Err(err) = self.validate_declaration_value(&component_value) {
                        is_valid_to_canonicalize = false;

                        self.errors.push(err);
                    }

                    last_whitespaces = (0, 0, 0);

                    if let Some(span) = &exclamation_point_span {
                        is_valid_to_canonicalize = false;

                        self.errors.push(Error::new(
                            *span,
                            ErrorKind::Unexpected("'!' in declaration value"),
                        ));

                        important_ident = None;
                        exclamation_point_span = None;
                    }
                }
            }

            declaration.value.push(component_value);
        }

        // 6. If the last two non-<whitespace-token>s in the declaration’s value are a
        // <delim-token> with the value "!" followed by an <ident-token> with a value
        // that is an ASCII case-insensitive match for "important", remove them from the
        // declaration’s value and set the declaration’s important flag to true.
        if let (Some(exclamation_point_span), Some(important_ident)) =
            (exclamation_point_span, important_ident)
        {
            let span = Span::new(exclamation_point_span.lo, important_ident.span_hi());
            let value = match important_ident.token {
                Token::Ident { value, raw, .. } => (value, raw),
                _ => {
                    unreachable!();
                }
            };
            let value = Ident {
                span: important_ident.span,
                value: value.0.to_ascii_lowercase(),
                raw: Some(value.1),
            };

            declaration.important = Some(ImportantFlag { span, value });
        }

        // 7. While the last token in the declaration’s value is a <whitespace-token>,
        // remove that token.
        let len = if declaration.important.is_some() {
            declaration.value.len()
                - (last_whitespaces.0 + last_whitespaces.1 + last_whitespaces.2 + 2)
        } else {
            declaration.value.len() - (last_whitespaces.0 + last_whitespaces.1 + last_whitespaces.2)
        };

        declaration.value.truncate(len);

        // Update span
        declaration.span = span!(self, span.lo);

        if is_dashed_ident {
            // Don't parse custom properties
            //
            // 8. Return the declaration.
            return Ok(declaration);
        }

        // Canonicalization against a grammar
        if is_valid_to_canonicalize && self.ctx.need_canonicalize {
            declaration = self.canonicalize_declaration_value(declaration)?;
        }

        // 8. Return the declaration.
        Ok(declaration)
    }
}

impl<I> Parse<ComponentValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ComponentValue> {
        match cur!(self) {
            // If the current input token is a <{-token>, <[-token>, or <(-token>, consume a
            // simple block and return it.
            tok!("[") | tok!("(") | tok!("{") => {
                let block = self.parse()?;

                Ok(ComponentValue::SimpleBlock(block))
            }
            // Otherwise, if the current input token is a <function-token>, consume a
            // function and return it.
            tok!("function") => {
                let function = self
                    .with_ctx({
                        Ctx {
                            // We canonize it later
                            need_canonicalize: false,
                            ..self.ctx
                        }
                    })
                    .parse_as::<Box<Function>>()?;

                Ok(ComponentValue::Function(function))
            }
            // Otherwise, return the current input token.
            _ => {
                let token_and_span = self.input.bump();

                match token_and_span {
                    Some(t) => Ok(ComponentValue::PreservedToken(Box::new(t))),
                    _ => {
                        unreachable!();
                    }
                }
            }
        }
    }
}

impl<I> Parse<SimpleBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SimpleBlock> {
        // To consume a simple block:

        // Create a simple block with its associated token set to the current input
        // token and with its value initially set to an empty list.
        let span = self.input.cur_span();
        let name = match cur!(self) {
            tok!("{") | tok!("(") | tok!("[") => self.input.bump().unwrap(),
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("'{', '(' or '[' token"),
                ));
            }
        };
        let mut simple_block = SimpleBlock {
            span: Default::default(),
            name,
            value: Vec::new(),
        };

        // Repeatedly consume the next input token and process it as follows:
        loop {
            // <EOF-token>
            // This is a parse error. Return the block.
            if is!(self, EOF) {
                let mirror = match &simple_block.name.token {
                    Token::LBracket => "']'",
                    Token::LParen => "')'",
                    Token::LBrace => "'}'",
                    _ => {
                        unreachable!();
                    }
                };

                self.errors.push(Error::new(
                    span!(self, span.lo),
                    ErrorKind::EofButExpected(mirror),
                ));

                break;
            }

            match cur!(self) {
                // ending token
                // Return the block.
                tok!("]") if simple_block.name.token == Token::LBracket => {
                    bump!(self);

                    break;
                }
                tok!(")") if simple_block.name.token == Token::LParen => {
                    bump!(self);

                    break;
                }
                tok!("}") if simple_block.name.token == Token::LBrace => {
                    bump!(self);

                    break;
                }
                // anything else
                // Reconsume the current input token. Consume a component value and append it to the
                // value of the block.
                _ => {
                    let component_value = self.parse()?;

                    simple_block.value.push(component_value);
                }
            }
        }

        simple_block.span = span!(self, span.lo);

        Ok(simple_block)
    }
}

impl<I> Parse<Function> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Function> {
        // Note: This algorithm assumes that the current input token has already been
        // checked to be a <function-token>.
        //
        // To consume a function:

        // Create a function with its name equal to the value of the current input token
        // and with its value initially set to an empty list.
        let span = self.input.cur_span();
        let function_name = match bump!(self) {
            Token::Function { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let is_dashed_ident = function_name.0.starts_with("--");
        let name = if is_dashed_ident {
            FunctionName::DashedIdent(DashedIdent {
                span: Span::new(span.lo, span.hi - BytePos(1)),
                value: self.input.atom(&function_name.0[2..]),
                raw: Some(function_name.1),
            })
        } else {
            FunctionName::Ident(Ident {
                span: Span::new(span.lo, span.hi - BytePos(1)),
                value: function_name.0,
                raw: Some(function_name.1),
            })
        };
        let mut function = Function {
            span: Default::default(),
            name,
            value: Vec::new(),
        };

        // Repeatedly consume the next input token and process it as follows:
        loop {
            // <EOF-token>
            // This is a parse error. Return the function.
            if is!(self, EOF) {
                self.errors.push(Error::new(
                    span!(self, span.lo),
                    ErrorKind::EofButExpected("')'"),
                ));

                break;
            }

            match cur!(self) {
                // <)-token>
                // Return the function.
                tok!(")") => {
                    bump!(self);

                    break;
                }
                // anything else
                // Reconsume the current input token. Consume a component value and append the
                // returned value to the function’s value.
                _ => {
                    let component_value = self.parse_as::<ComponentValue>()?;

                    function.value.push(component_value);
                }
            }
        }

        function.span = span!(self, span.lo);

        // Canonicalization against a grammar
        if !is_dashed_ident && self.ctx.need_canonicalize {
            function = self.canonicalize_function_value(function)?;
        }

        return Ok(function);
    }
}

impl<I> Parse<ListOfComponentValues> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ListOfComponentValues> {
        let span = self.input.cur_span();
        let mut children = Vec::new();

        // Repeatedly consume a component value from input until an <EOF-token> is
        // returned, appending the returned values (except the final <EOF-token>) into a
        // list. Return the list.
        loop {
            if is!(self, EOF) {
                break;
            }

            let components_value = self.parse_as::<ComponentValue>()?;

            children.push(components_value);
        }

        Ok(ListOfComponentValues {
            span: span!(self, span.lo),
            children,
        })
    }
}
