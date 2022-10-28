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
        // To consume a list of rules, given a top-level flag:

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
        let (normalized_at_rule_name, name) = if at_keyword_name.0.starts_with("--") {
            (
                at_keyword_name.0.to_ascii_lowercase(),
                AtRuleName::DashedIdent(DashedIdent {
                    span: Span::new(span.lo + BytePos(1), span.hi, Default::default()),
                    value: at_keyword_name.0,
                    raw: Some(at_keyword_name.1),
                }),
            )
        } else {
            (
                at_keyword_name.0.to_ascii_lowercase(),
                AtRuleName::Ident(Ident {
                    span: Span::new(span.lo + BytePos(1), span.hi, Default::default()),
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
                    span!(self, span.lo),
                    ErrorKind::EofButExpected("';' or '{'"),
                ));

                at_rule.span = span!(self, span.lo);

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
                                    span,
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
                    at_rule.span = span!(self, span.lo);

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
                    at_rule.span = span!(self, span.lo);

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
        // To consume a qualified rule:
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
                return Err(Error::new(
                    span!(self, span.lo),
                    ErrorKind::EofButExpected("'{'"),
                ));
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
        // To consume a declaration:

        // Consume the next input token. Create a new declaration with its name set
        // to the value of the current input token and its value initially set to an
        // empty list.
        let span = self.input.cur_span();
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
        let mut declaration = Declaration {
            span: Default::default(),
            name,
            value: vec![],
            important: None,
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

        // 4. As long as the next input token is anything other than an <EOF-token>,
        // consume a component value and append it to the declaration’s value.
        let mut last_whitespaces = (0, 0, 0);
        let mut exclamation_point_span = None;
        let mut important_ident = None;

        loop {
            // TODO fix me `)`, workaround
            if is_one_of!(self, EOF, ")") {
                break;
            }

            let component_value = self
                .with_ctx(Ctx {
                    block_contents_grammar: BlockContentsGrammar::NoGrammar,
                    ..self.ctx
                })
                .parse_as::<ComponentValue>()?;

            match &component_value {
                // Optimization for step 5
                ComponentValue::PreservedToken(
                    token_and_span @ TokenAndSpan {
                        token: Token::Ident { value, .. },
                        ..
                    },
                ) if exclamation_point_span.is_some()
                    && value.to_ascii_lowercase() == js_word!("important") =>
                {
                    important_ident = Some(token_and_span.clone());
                }
                ComponentValue::PreservedToken(TokenAndSpan {
                    span,
                    token: Token::Delim { value: '!', .. },
                    ..
                }) => {
                    exclamation_point_span = Some(span.clone());

                    if important_ident.is_some() {
                        important_ident = None;

                        last_whitespaces = (last_whitespaces.2, 0, 0);
                    }
                }
                // Optimization for step 6
                ComponentValue::PreservedToken(TokenAndSpan {
                    token: Token::WhiteSpace { .. },
                    ..
                }) => match (&exclamation_point_span, &important_ident) {
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
                },
                _ => {
                    last_whitespaces = (0, 0, 0);

                    if exclamation_point_span.is_some() {
                        important_ident = None;
                        exclamation_point_span = None;
                    }
                }
            }

            declaration.value.push(component_value);
        }

        // 5. If the last two non-<whitespace-token>s in the declaration’s value are a
        // <delim-token> with the value "!" followed by an <ident-token> with a value
        // that is an ASCII case-insensitive match for "important", remove them from the
        // declaration’s value and set the declaration’s important flag to true.
        if let (Some(exclamation_point_span), Some(important_ident)) =
            (exclamation_point_span, important_ident)
        {
            let span = Span::new(
                exclamation_point_span.lo,
                important_ident.span_hi(),
                Default::default(),
            );
            let value = match important_ident.token {
                Token::Ident { value, raw } => (value, raw),
                _ => {
                    unreachable!();
                }
            };
            let value = Ident {
                span: important_ident.span,
                value: value.0,
                raw: Some(value.1),
            };

            declaration.important = Some(ImportantFlag { span, value });
        }

        // 6. While the last token in the declaration’s value is a <whitespace-token>,
        // remove that token.
        let len = if declaration.important.is_some() {
            declaration.value.len()
                - (last_whitespaces.0 + last_whitespaces.1 + last_whitespaces.2 + 2)
        } else {
            declaration.value.len() - (last_whitespaces.0 + last_whitespaces.1 + last_whitespaces.2)
        };

        declaration.value.truncate(len);

        // Update span
        // TODO for commit history
        if let Some(important) = &declaration.important {
            declaration.span = Span::new(span.lo, important.span_hi(), Default::default());
        } else if let Some(last) = declaration.value.last() {
            declaration.span = Span::new(span.lo, last.span_hi(), Default::default());
        } else {
            declaration.span = span!(self, span.lo);
        }

        if is_dashed_ident {
            // Don't parse custom properties
            //
            // 7. Return the declaration.
            return Ok(declaration);
        }

        // Grammar parsing
        let locv = self.create_locv(declaration.value);

        declaration.value = match self.parse_according_to_grammar(&locv, |parser| {
            let mut values = vec![];

            loop {
                if is!(parser, EOF) {
                    break;
                }

                values.push(parser.parse_generic_value()?);
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

        // 7. Return the declaration.
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
                let function = self.parse()?;

                Ok(ComponentValue::Function(function))
            }
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
            value: vec![],
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
        let ident = match bump!(self) {
            Token::Function { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let function_name = &*ident.0.to_ascii_lowercase();
        let name = Ident {
            span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
            value: ident.0,
            raw: Some(ident.1),
        };

        let mut function = Function {
            span: Default::default(),
            name,
            value: vec![],
        };

        let mut with_error = false;

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
                _ => match self.ctx.block_contents_grammar {
                    BlockContentsGrammar::NoGrammar => {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        function.value.push(component_value);
                    }
                    _ => {
                        if with_error {
                            function.value.push(self.parse()?);
                        } else {
                            let state = self.input.state();
                            let values = self.parse_function_values(function_name);

                            match values {
                                Ok(values) => {
                                    function.value.extend(values);
                                }
                                Err(err) => {
                                    self.errors.push(err);
                                    self.input.reset(&state);

                                    with_error = true;

                                    function.value.push(self.parse()?);
                                }
                            }
                        }
                    }
                },
            }
        }

        function.span = span!(self, span.lo);

        return Ok(function);
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

        // Repeatedly consume a component value from input until an <EOF-token> is
        // returned, appending the returned values (except the final <EOF-token>) into a
        // list. Return the list.
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
