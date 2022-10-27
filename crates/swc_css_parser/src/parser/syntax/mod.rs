use swc_atoms::js_word;
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
        let start = self.input.cur_span();
        let rules = self
            .with_ctx(Ctx {
                is_top_level: true,
                ..self.ctx
            })
            .parse_as::<Vec<Rule>>()?;
        let last = self.input.last_pos();

        Ok(Stylesheet {
            span: Span::new(start.lo, last, Default::default()),
            rules,
        })
    }
}

impl<I> Parse<Vec<Rule>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Rule>> {
        // Create an initially empty list of rules.
        let mut rules = vec![];

        // Repeatedly consume the next input token:
        loop {
            // TODO: remove `}`
            // <EOF-token>
            // Return the list of rules.
            if is_one_of!(self, EOF, "}") {
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
                        rules.push(Rule::QualifiedRule(self.parse()?));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the returned
                // value to the list of rules.
                tok!("@") => {
                    rules.push(Rule::AtRule(self.parse()?));
                }
                // anything else
                // Reconsume the current input token. Consume a qualified rule. If anything is
                // returned, append it to the list of rules.
                _ => {
                    let state = self.input.state();
                    let qualified_rule = self.parse();

                    match qualified_rule {
                        Ok(i) => rules.push(Rule::QualifiedRule(i)),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span();
                            let mut children = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                if let Some(token_and_span) = self.input.bump() {
                                    children.push(ComponentValue::PreservedToken(token_and_span));
                                }

                                if is!(self, ";") {
                                    if let Some(token_and_span) = self.input.bump() {
                                        children
                                            .push(ComponentValue::PreservedToken(token_and_span));
                                    }

                                    break;
                                }
                            }

                            rules.push(Rule::ListOfComponentValues(Box::new(
                                ListOfComponentValues {
                                    span: span!(self, span.lo),
                                    children,
                                },
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
        // Consume the next input token. Create a new at-rule with its name set to the
        // value of the current input token, its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let at_rule_span = self.input.cur_span();
        let at_keyword_name = match bump!(self) {
            Token::AtKeyword { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let (normalized_at_rule_name, name) = if at_keyword_name.0.starts_with("--") {
            (
                at_keyword_name.0.to_ascii_lowercase(),
                AtRuleName::DashedIdent(DashedIdent {
                    span: Span::new(
                        at_rule_span.lo + BytePos(1),
                        at_rule_span.hi,
                        Default::default(),
                    ),
                    value: at_keyword_name.0,
                    raw: Some(at_keyword_name.1),
                }),
            )
        } else {
            (
                at_keyword_name.0.to_ascii_lowercase(),
                AtRuleName::Ident(Ident {
                    span: Span::new(
                        at_rule_span.lo + BytePos(1),
                        at_rule_span.hi,
                        Default::default(),
                    ),
                    value: at_keyword_name.0,
                    raw: Some(at_keyword_name.1),
                }),
            )
        };
        let mut prelude = vec![];
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
                self.errors.push(Error::new(
                    at_rule_span,
                    ErrorKind::EofButExpected("semicolon or curly block"),
                ));

                at_rule.span = span!(self, at_rule_span.lo);

                return Ok(at_rule);
            }

            match cur!(self) {
                // <semicolon-token>
                // Return the at-rule.
                tok!(";") => {
                    self.input.bump();

                    let list_of_component_values = self.create_locv(prelude);

                    at_rule.prelude = match self
                        .parse_according_to_grammar(&list_of_component_values, |parser| {
                            parser.parse_at_rule_prelude(&normalized_at_rule_name)
                        }) {
                        Ok(at_rule_prelude) => match at_rule_prelude {
                            None if normalized_at_rule_name == js_word!("layer") => {
                                self.errors.push(Error::new(
                                    at_rule_span,
                                    ErrorKind::Expected("at least one name"),
                                ));

                                Some(Box::new(AtRulePrelude::ListOfComponentValues(
                                    list_of_component_values,
                                )))
                            }
                            _ => at_rule_prelude.map(Box::new),
                        },
                        Err(err) => {
                            if *err.kind() != ErrorKind::Ignore {
                                self.errors.push(err);
                            }

                            if !list_of_component_values.children.is_empty() {
                                Some(Box::new(AtRulePrelude::ListOfComponentValues(
                                    list_of_component_values,
                                )))
                            } else {
                                None
                            }
                        }
                    };
                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(at_rule);
                }
                // <{-token>
                // Consume a simple block and assign it to the at-rule’s block. Return the at-rule.
                tok!("{") => {
                    let mut block = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        })
                        .parse_as::<SimpleBlock>()?;

                    let list_of_component_values = self.create_locv(prelude);

                    at_rule.prelude = match self
                        .parse_according_to_grammar(&list_of_component_values, |parser| {
                            parser.parse_at_rule_prelude(&normalized_at_rule_name)
                        }) {
                        Ok(at_rule_prelude) => match at_rule_prelude {
                            Some(AtRulePrelude::LayerPrelude(LayerPrelude::NameList(
                                name_list,
                            ))) if name_list.name_list.len() > 1 => {
                                self.errors.push(Error::new(
                                    name_list.span,
                                    ErrorKind::Expected("only one name"),
                                ));

                                Some(Box::new(AtRulePrelude::ListOfComponentValues(
                                    list_of_component_values,
                                )))
                            }
                            _ => at_rule_prelude.map(Box::new),
                        },
                        Err(err) => {
                            if *err.kind() != ErrorKind::Ignore {
                                self.errors.push(err);
                            }

                            if !list_of_component_values.children.is_empty() {
                                Some(Box::new(AtRulePrelude::ListOfComponentValues(
                                    list_of_component_values,
                                )))
                            } else {
                                None
                            }
                        }
                    };

                    at_rule.block = match self.parse_according_to_grammar(
                        &self.create_locv(block.value.clone()),
                        |parser| parser.parse_at_rule_block(&normalized_at_rule_name),
                    ) {
                        Ok(block_contents) => {
                            block.value = block_contents;

                            Some(block)
                        }
                        Err(err) => {
                            if *err.kind() != ErrorKind::Ignore {
                                self.errors.push(err);
                            }

                            Some(block)
                        }
                    };
                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(at_rule);
                }
                // anything else
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the at-rule’s prelude.
                _ => {
                    let component_value = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        })
                        .parse_as::<ComponentValue>()?;

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
        let create_prelude =
            |p: &mut Parser<I>, list: Vec<ComponentValue>| -> PResult<QualifiedRulePrelude> {
                let list_of_component_values = p.create_locv(list);

                if p.ctx.in_keyframes_at_rule {
                    Ok(QualifiedRulePrelude::ListOfComponentValues(
                        list_of_component_values,
                    ))
                } else {
                    match p.parse_according_to_grammar::<SelectorList>(
                        &list_of_component_values,
                        |parser| parser.parse(),
                    ) {
                        Ok(selector_list) => {
                            if p.ctx.is_trying_legacy_nesting {
                                let selector_list = p
                                    .legacy_nested_selector_list_to_modern_selector_list(
                                        selector_list,
                                    )?;

                                Ok(QualifiedRulePrelude::SelectorList(selector_list))
                            } else {
                                Ok(QualifiedRulePrelude::SelectorList(selector_list))
                            }
                        }
                        Err(err) => {
                            if p.ctx.is_trying_legacy_nesting {
                                match p.parse_according_to_grammar::<RelativeSelectorList>(
                                    &list_of_component_values,
                                    |parser| parser.parse(),
                                ) {
                                    Ok(relative_selector_list) => {
                                        let selector_list = p
                                            .legacy_relative_selector_list_to_modern_selector_list(
                                                relative_selector_list,
                                            )?;

                                        Ok(QualifiedRulePrelude::SelectorList(selector_list))
                                    }
                                    _ => Err(err),
                                }
                            } else {
                                p.errors.push(err);

                                Ok(QualifiedRulePrelude::ListOfComponentValues(
                                    list_of_component_values,
                                ))
                            }
                        }
                    }
                }
            };

        let span = self.input.cur_span();
        // Create a new qualified rule with its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let mut prelude = vec![];

        // Repeatedly consume the next input token:
        loop {
            // <EOF-token>
            // This is a parse error. Return nothing.
            if is!(self, EOF) {
                let span = self.input.cur_span();

                return Err(Error::new(span, ErrorKind::Eof));
            }

            match cur!(self) {
                // <{-token>
                // Consume a simple block and assign it to the qualified rule’s block. Return the
                // qualified rule.
                tok!("{") => {
                    let mut block = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        })
                        .parse_as::<SimpleBlock>()?;

                    block.value = match self.ctx.block_contents_grammar {
                        BlockContentsGrammar::DeclarationList => self
                            .parse_according_to_grammar(&self.create_locv(block.value), |parser| {
                                parser.parse_as::<Vec<DeclarationOrAtRule>>()
                            })?
                            .into_iter()
                            .map(ComponentValue::DeclarationOrAtRule)
                            .collect(),
                        _ => self
                            .parse_according_to_grammar(&self.create_locv(block.value), |parser| {
                                parser.parse_as::<Vec<StyleBlock>>()
                            })?
                            .into_iter()
                            .map(ComponentValue::StyleBlock)
                            .collect(),
                    };

                    return Ok(QualifiedRule {
                        span: span!(self, span.lo),
                        prelude: create_prelude(self, prelude)?,
                        block,
                    });
                }
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the qualified rule’s prelude.
                _ => {
                    let component_value = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        })
                        .parse_as::<ComponentValue>()?;

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
        let mut declarations = vec![];
        let mut rules = vec![];

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
                        list_of_component_values.span = Span::new(
                            list_of_component_values.span_lo(),
                            token_and_span.span_hi(),
                            Default::default(),
                        );
                        list_of_component_values
                            .children
                            .push(ComponentValue::PreservedToken(token_and_span));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the result to
                // rules.
                tok!("@") => {
                    let at_rule = self
                        .with_ctx(Ctx {
                            block_contents_grammar: BlockContentsGrammar::StyleBlock,
                            ..self.ctx
                        })
                        .parse_as::<AtRule>()?;

                    rules.push(StyleBlock::AtRule(Box::new(at_rule)));
                }
                // <ident-token>
                // Initialize a temporary list initially filled with the current input token. As
                // long as the next input token is anything other than a <semicolon-token> or
                // <EOF-token>, consume a component value and append it to the temporary list.
                // Consume a declaration from the temporary list. If anything was returned, append
                // it to decls.
                tok!("ident") => {
                    if self.config.legacy_nesting {
                        if let Some(legacy_nested) = self.try_to_parse_legacy_nesting() {
                            rules.push(StyleBlock::QualifiedRule(Box::new(legacy_nested)));

                            continue;
                        }
                    }

                    let span = self.input.cur_span();
                    let mut temporary_list = ListOfComponentValues {
                        span: Default::default(),
                        children: vec![],
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        temporary_list.children.push(component_value);
                    }

                    let decl_or_list_of_component_values = match self
                        .parse_according_to_grammar::<Declaration>(&temporary_list, |parser| {
                            parser.parse_as()
                        }) {
                        Ok(decl) => StyleBlock::Declaration(Box::new(decl)),
                        Err(err) => {
                            self.errors.push(err);

                            temporary_list.span = span!(self, span.lo);

                            StyleBlock::ListOfComponentValues(temporary_list)
                        }
                    };

                    declarations.push(decl_or_list_of_component_values);
                }
                // <delim-token> with a value of "&" (U+0026 AMPERSAND)
                // Reconsume the current input token. Consume a qualified rule. If anything was
                // returned, append it to rules.
                tok!("&") => {
                    let state = self.input.state();
                    let qualified_rule = match self.parse() {
                        Ok(v) => StyleBlock::QualifiedRule(v),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span();
                            let mut children = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                if let Some(token_and_span) = self.input.bump() {
                                    children.push(ComponentValue::PreservedToken(token_and_span));
                                }

                                if is!(self, ";") {
                                    if let Some(token_and_span) = self.input.bump() {
                                        children
                                            .push(ComponentValue::PreservedToken(token_and_span));
                                    }

                                    break;
                                }
                            }

                            StyleBlock::ListOfComponentValues(ListOfComponentValues {
                                span: span!(self, span.lo),
                                children,
                            })
                        }
                    };

                    rules.push(qualified_rule);
                }

                // anything else
                // This is a parse error. Reconsume the current input token. As long as the next
                // input token is anything other than a <semicolon-token> or <EOF-token>, consume a
                // component value and throw away the returned value.
                _ => {
                    if self.config.legacy_nesting {
                        if let Some(legacy_nested) = self.try_to_parse_legacy_nesting() {
                            rules.push(StyleBlock::QualifiedRule(Box::new(legacy_nested)));

                            continue;
                        }
                    }

                    let span = self.input.cur_span();

                    self.errors.push(Error::new(
                        span,
                        ErrorKind::Expected(
                            "whitespace, semicolon, EOF, at-keyword, '&' or ident token",
                        ),
                    ));

                    // For recovery mode
                    let mut list_of_component_values = ListOfComponentValues {
                        span: Default::default(),
                        children: vec![],
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        list_of_component_values.children.push(component_value);
                    }

                    list_of_component_values.span = span!(self, span.lo);

                    declarations.push(StyleBlock::ListOfComponentValues(list_of_component_values));
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
        let mut declarations = vec![];

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
                        list_of_component_values.span = Span::new(
                            list_of_component_values.span_lo(),
                            token_and_span.span_hi(),
                            Default::default(),
                        );
                        list_of_component_values
                            .children
                            .push(ComponentValue::PreservedToken(token_and_span));
                    }
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule. Append the returned rule
                // to the list of declarations.
                tok!("@") => {
                    declarations.push(DeclarationOrAtRule::AtRule(self.parse()?));
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
                        children: vec![],
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        temporary_list.children.push(component_value);
                    }

                    let decl_or_list_of_component_values = match self
                        .parse_according_to_grammar::<Declaration>(&temporary_list, |parser| {
                            parser.parse_as()
                        }) {
                        Ok(decl) => DeclarationOrAtRule::Declaration(Box::new(decl)),
                        Err(err) => {
                            self.errors.push(err);

                            temporary_list.span = span!(self, span.lo);

                            DeclarationOrAtRule::ListOfComponentValues(temporary_list)
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
                        ErrorKind::Expected(
                            "whitespace, semicolon, EOF, at-keyword or ident token",
                        ),
                    ));

                    // For recovery mode
                    let mut list_of_component_values = ListOfComponentValues {
                        span: Default::default(),
                        children: vec![],
                    };

                    while !is_one_of!(self, ";", EOF) {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        list_of_component_values.children.push(component_value);
                    }

                    list_of_component_values.span = span!(self, span.lo);

                    declarations.push(DeclarationOrAtRule::ListOfComponentValues(
                        list_of_component_values,
                    ));
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
        let span = self.input.cur_span();

        // Consume the next input token. Create a new declaration with its name set
        // to the value of the current input token and its value initially set to an
        // empty list.
        let is_dashed_ident = match cur!(self) {
            Token::Ident { value, .. } => value.starts_with("--"),
            _ => {
                return Err(Error::new(span, ErrorKind::Expected("Ident")));
            }
        };

        let name = if is_dashed_ident {
            DeclarationName::DashedIdent(self.parse()?)
        } else {
            DeclarationName::Ident(self.parse()?)
        };

        // 1. While the next input token is a <whitespace-token>, consume the next input
        // token.
        self.input.skip_ws();

        // 2. If the next input token is anything other than a <colon-token>, this is a
        // parse error. Return nothing. Otherwise, consume the next input token.
        expect!(self, ":");

        // 3. While the next input token is a <whitespace-token>, consume the next input
        // token.
        self.input.skip_ws();

        let mut end = self.input.cur_span().hi;
        let mut value = vec![];

        // 4. As long as the next input token is anything other than an <EOF-token>,
        // consume a component value and append it to the declaration’s value.
        if !is!(self, EOF) {
            match is_dashed_ident {
                true => {
                    value.extend(self.parse_declaration_value()?);
                }
                false => {
                    loop {
                        // TODO fix me
                        self.input.skip_ws();

                        // TODO fix me
                        if is_one_of!(self, EOF, "!", ";", "}", ")") {
                            break;
                        }

                        let state = self.input.state();
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                            ..self.ctx
                        };
                        let parsed = self.with_ctx(ctx).parse_as::<ComponentValue>();
                        let value_or_token = match parsed {
                            Ok(value) => value,
                            Err(err) => {
                                self.errors.push(err);
                                self.input.reset(&state);

                                let ctx = Ctx {
                                    block_contents_grammar: BlockContentsGrammar::NoGrammar,
                                    ..self.ctx
                                };

                                self.with_ctx(ctx).parse_as::<ComponentValue>()?
                            }
                        };

                        value.push(value_or_token);
                        end = self.input.last_pos();
                    }
                }
            }

            match value.last() {
                Some(ComponentValue::PreservedToken(TokenAndSpan {
                    span,
                    token: Token::BadUrl { .. },
                    ..
                }))
                | Some(ComponentValue::PreservedToken(TokenAndSpan {
                    span,
                    token: Token::BadString { .. },
                    ..
                })) => {
                    return Err(Error::new(
                        *span,
                        ErrorKind::Unexpected("token in <declaration-value>"),
                    ));
                }
                _ => {}
            };
        }

        // 5. If the last two non-<whitespace-token>s in the declaration’s value are a
        // <delim-token> with the value "!" followed by an <ident-token> with a value
        // that is an ASCII case-insensitive match for "important", remove them from the
        // declaration’s value and set the declaration’s important flag to true.
        self.input.skip_ws();

        let important = if is!(self, "!") {
            let important_flag = self.parse()?;

            end = self.input.last_pos();

            Some(important_flag)
        } else {
            None
        };

        // 6. While the last token in the declaration’s value is a <whitespace-token>,
        // remove that token.
        self.input.skip_ws();

        // 7. Return the declaration.
        Ok(Declaration {
            span: Span::new(span.lo, end, Default::default()),
            name,
            value,
            important,
        })
    }
}

impl<I> Parse<ImportantFlag> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ImportantFlag> {
        let span = self.input.cur_span();

        expect!(self, "!");

        self.input.skip_ws();

        let ident: Ident = self.parse()?;

        if &*ident.value.to_ascii_lowercase() != "important" {
            return Err(Error::new(span, ErrorKind::Expected("important")));
        }

        Ok(ImportantFlag {
            span: span!(self, span.lo),
            value: ident,
        })
    }
}

impl<I> Parse<ComponentValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ComponentValue> {
        match self.ctx.block_contents_grammar {
            BlockContentsGrammar::NoGrammar => {
                // Consume the next input token.
                match cur!(self) {
                    // If the current input token is a <{-token>, <[-token>, or <(-token>, consume a
                    // simple block and return it.
                    tok!("[") | tok!("(") | tok!("{") => {
                        let block = self.parse()?;

                        Ok(ComponentValue::SimpleBlock(block))
                    }
                    // Otherwise, if the current input token is a <function-token>, consume a
                    // function and return it.
                    tok!("function") => Ok(ComponentValue::Function(self.parse()?)),
                    // Otherwise, return the current input token.
                    _ => {
                        let token = self.input.bump();

                        match token {
                            Some(t) => Ok(ComponentValue::PreservedToken(t)),
                            _ => {
                                unreachable!();
                            }
                        }
                    }
                }
            }
            _ => {
                // TODO refactor me
                self.input.skip_ws();

                let span = self.input.cur_span();

                match cur!(self) {
                    tok!(",") | tok!("/") | tok!(";") => {
                        return Ok(ComponentValue::Delimiter(self.parse()?));
                    }

                    tok!("string") => {
                        return Ok(ComponentValue::Str(self.parse()?));
                    }

                    tok!("url") => {
                        return Ok(ComponentValue::Url(self.parse()?));
                    }

                    Token::Function { value, .. } => match &*value.to_ascii_lowercase() {
                        "url" | "src" => {
                            return Ok(ComponentValue::Url(self.parse()?));
                        }
                        "rgb" | "rgba" | "hsl" | "hsla" | "hwb" | "lab" | "lch" | "oklab"
                        | "oklch" | "color" | "device-cmyk" | "color-mix" | "color-contrast" => {
                            return Ok(ComponentValue::Color(self.parse()?));
                        }
                        _ => {
                            return Ok(ComponentValue::Function(self.parse()?));
                        }
                    },

                    tok!("percentage") => {
                        return Ok(ComponentValue::Percentage(self.parse()?));
                    }

                    tok!("dimension") => return Ok(ComponentValue::Dimension(self.parse()?)),

                    Token::Number { type_flag, .. } => {
                        if *type_flag == NumberType::Integer {
                            return Ok(ComponentValue::Integer(self.parse()?));
                        }

                        return Ok(ComponentValue::Number(self.parse()?));
                    }

                    Token::Ident { value, .. } => {
                        if value.starts_with("--") {
                            return Ok(ComponentValue::DashedIdent(self.parse()?));
                        } else if &*value.to_ascii_lowercase() == "u"
                            && peeked_is_one_of!(self, "+", "number", "dimension")
                        {
                            return Ok(ComponentValue::UnicodeRange(self.parse()?));
                        }

                        return Ok(ComponentValue::Ident(self.parse()?));
                    }

                    tok!("[") | tok!("(") | tok!("{") => {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };
                        let mut block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;
                        let locv = self.create_locv(block.value);

                        block.value = match self.parse_according_to_grammar(&locv, |parser| {
                            let mut values = vec![];

                            loop {
                                parser.input.skip_ws();

                                if is!(parser, EOF) {
                                    break;
                                }

                                let component_value = parser.parse()?;

                                values.push(component_value);
                            }

                            Ok(values)
                        }) {
                            Ok(values) => values,
                            Err(err) => {
                                if *err.kind() != ErrorKind::Ignore {
                                    self.errors.push(err);
                                }

                                locv.children
                            }
                        };

                        return Ok(ComponentValue::SimpleBlock(block));
                    }

                    tok!("#") => {
                        return Ok(ComponentValue::Color(self.parse()?));
                    }

                    _ => {}
                }

                Err(Error::new(span, ErrorKind::Expected("Declaration value")))
            }
        }
    }
}

impl<I> Parse<SimpleBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SimpleBlock> {
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
        // Create a simple block with its associated token set to the current input
        // token and with its value initially set to an empty list.
        let mut simple_block = SimpleBlock {
            span: Default::default(),
            name,
            value: vec![],
        };

        // Repeatedly consume the next input token and process it as follows:
        loop {
            // <EOF-token>
            // This is a parse error. Return the block.
            if is!(self, EOF) {
                let span = self.input.cur_span();

                self.errors.push(Error::new(span, ErrorKind::Eof));

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

impl<I> Parse<ListOfComponentValues> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ListOfComponentValues> {
        let span = self.input.cur_span();
        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::NoGrammar,
            ..self.ctx
        };
        let mut children = vec![];

        loop {
            if is!(self, EOF) {
                break;
            }

            let components_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

            children.push(components_value);
        }

        Ok(ListOfComponentValues {
            span: span!(self, span.lo),
            children,
        })
    }
}
