use swc_common::Span;
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, Grammar, RuleContext},
    Parse,
};

impl<I> Parse<Stylesheet> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Stylesheet> {
        let start = self.input.cur_span()?;
        let rules = self.parse_rule_list(RuleContext { is_top_level: true })?;

        let last = self.input.last_pos()?;

        Ok(Stylesheet {
            span: Span::new(start.lo, last, Default::default()),
            rules,
        })
    }
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_rule_list(&mut self, ctx: RuleContext) -> PResult<Vec<Rule>> {
        // Create an initially empty list of rules.
        let mut rules = vec![];

        // Repeatedly consume the next input token:
        loop {
            // TODO: remove `}`
            // <EOF-token>
            // Return the list of rules.
            if is!(self, EOF) || is!(self, "}") {
                return Ok(rules);
            }

            match cur!(self) {
                // <whitespace-token>
                // Do nothing.
                tok!(" ") => {
                    self.input.skip_ws()?;
                }
                // <CDO-token>
                // <CDC-token>
                tok!("<!--") | tok!("-->") => {
                    // If the top-level flag is set, do nothing.
                    if ctx.is_top_level {
                        bump!(self);

                        continue;
                    }

                    // Otherwise, reconsume the current input token. Consume a qualified rule. If
                    // anything is returned, append it to the list of rules.
                    rules.push(Rule::QualifiedRule(self.parse()?));
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the returned
                // value to the list of rules.
                tok!("@") => {
                    rules.push(Rule::AtRule(self.parse_at_rule(Default::default())?));
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
                            if is!(self, "}") {
                                self.errors.push(err);
                                self.input.reset(&state);

                                let start_pos = self.input.cur_span()?.lo;

                                let mut tokens = vec![];

                                while !is_one_of!(self, EOF, "}") {
                                    tokens.extend(self.input.bump()?);
                                }

                                rules.push(Rule::Invalid(Tokens {
                                    span: span!(self, start_pos),
                                    tokens,
                                }));
                            } else {
                                return Err(err);
                            }
                        }
                    };
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
        let span = self.input.cur_span()?;
        let mut prelude = SelectorList {
            span: Default::default(),
            children: vec![],
        };

        // Repeatedly consume the next input token:
        loop {
            // <EOF-token>
            // Return the list of rules.
            if is!(self, EOF) {
                let span = self.input.cur_span()?;

                return Err(Error::new(span, ErrorKind::Eof));
            }

            match cur!(self) {
                // <{-token>
                // Consume a simple block and assign it to the qualified rule’s block. Return the
                // qualified rule.
                tok!("{") => {
                    let ctx = Ctx {
                        grammar: Grammar::StyleBlock,
                        ..self.ctx
                    };
                    let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                    return Ok(QualifiedRule {
                        span: span!(self, span.lo),
                        prelude,
                        block,
                    });
                }
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the qualified rule’s prelude.
                _ => {
                    prelude = self.parse()?;
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
                    self.input.skip_ws()?;
                }
                // <semicolon-token>
                // Do nothing.
                tok!(";") => {
                    bump!(self);
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the result to
                // rules.
                tok!("@") => {
                    rules.push(StyleBlock::AtRule(self.parse_at_rule(Default::default())?));
                }
                // <ident-token>
                // Initialize a temporary list initially filled with the current input token. As
                // long as the next input token is anything other than a <semicolon-token> or
                // <EOF-token>, consume a component value and append it to the temporary list.
                // Consume a declaration from the temporary list. If anything was returned, append
                // it to decls.
                tok!("ident") => {
                    let state = self.input.state();
                    let span = self.input.cur_span()?;
                    let prop = match self.parse().map(StyleBlock::Declaration) {
                        Ok(v) => v,
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, ";", "}") {
                                tokens.extend(self.input.bump()?);
                            }

                            StyleBlock::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            })
                        }
                    };

                    declarations.push(prop);
                }

                // <delim-token> with a value of "&" (U+0026 AMPERSAND)
                // Reconsume the current input token. Consume a qualified rule. If anything was
                // returned, append it to rules.
                tok!("&") => {
                    let state = self.input.state();
                    let span = self.input.cur_span()?;
                    let qualified_rule = match self.parse() {
                        Ok(v) => StyleBlock::QualifiedRule(v),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, ";", "}") {
                                tokens.extend(self.input.bump()?);
                            }

                            StyleBlock::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            })
                        }
                    };

                    rules.push(qualified_rule);
                }

                // TODO refactor me
                tok!("}") => {
                    break;
                }

                // anything else
                // This is a parse error. Reconsume the current input token. As long as the next
                // input token is anything other than a <semicolon-token> or <EOF-token>, consume a
                // component value and throw away the returned value.
                _ => {
                    let span = self.input.cur_span()?;

                    self.errors.push(Error::new(
                        span,
                        ErrorKind::Expected(
                            "whitespace, semicolon, EOF, at-keyword or ident token",
                        ),
                    ));

                    let mut tokens = vec![];

                    // TODO fix me
                    while !is_one_of!(self, EOF, ";", "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    declarations.push(StyleBlock::Invalid(Tokens {
                        span: span!(self, span.lo),
                        tokens,
                    }));
                }
            }
        }

        declarations.extend(rules);

        Ok(declarations)
    }
}

impl<I> Parse<SimpleBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SimpleBlock> {
        let span = self.input.cur_span()?;
        let name = match cur!(self) {
            tok!("{") => {
                bump!(self);

                '{'
            }
            tok!("(") => {
                bump!(self);

                '('
            }
            tok!("[") => {
                bump!(self);

                '['
            }
            _ => {
                unreachable!();
            }
        };
        // Create a simple block with its associated token set to the current input
        // token and with its value initially set to an empty list.
        let mut simple_block = SimpleBlock {
            span: Default::default(),
            name,
            value: vec![],
        };

        // TODO refactor me
        if self.ctx.grammar != Grammar::NoGrammar {
            self.input.skip_ws()?;
        }

        // Repeatedly consume the next input token and process it as follows:
        loop {
            // <EOF-token>
            // This is a parse error. Return the block.
            if is!(self, EOF) {
                let span = self.input.cur_span()?;

                self.errors.push(Error::new(span, ErrorKind::Eof));

                break;
            }

            match cur!(self) {
                // ending token
                // Return the block.
                tok!("]") if name == '[' => {
                    bump!(self);

                    break;
                }
                tok!(")") if name == '(' => {
                    bump!(self);

                    break;
                }
                tok!("}") if name == '{' => {
                    bump!(self);

                    break;
                }
                // anything else
                // Reconsume the current input token. Consume a component value and append it to the
                // value of the block.
                _ => match self.ctx.grammar {
                    Grammar::NoGrammar => {
                        let component_value = self.parse_component_value()?;

                        simple_block
                            .value
                            .push(ComponentValue::Value(component_value));
                    }
                    Grammar::StyleBlock => {
                        let style_blocks: Vec<StyleBlock> = self.parse()?;
                        let style_blocks: Vec<ComponentValue> = style_blocks
                            .into_iter()
                            .map(ComponentValue::StyleBlock)
                            .collect();

                        simple_block.value.extend(style_blocks);
                    }
                    // TODO improve grammar validation
                    Grammar::RuleList | Grammar::Stylesheet => {
                        let rule_list = self.parse_rule_list(RuleContext {
                            is_top_level: false,
                        })?;
                        let rule_list: Vec<ComponentValue> =
                            rule_list.into_iter().map(ComponentValue::Rule).collect();

                        simple_block.value.extend(rule_list);
                    }
                    Grammar::DeclarationList => {
                        let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                        let declaration_list: Vec<ComponentValue> = declaration_list
                            .into_iter()
                            .map(ComponentValue::DeclarationOrAtRule)
                            .collect();

                        simple_block.value.extend(declaration_list);
                    }
                    Grammar::DeclarationValue => {
                        let state = self.input.state();
                        let parsed = self.parse_one_value_inner();
                        let value = match parsed {
                            Ok(value) => {
                                self.input.skip_ws()?;

                                value
                            }
                            Err(err) => {
                                self.errors.push(err);
                                self.input.reset(&state);

                                self.parse_component_value()?
                            }
                        };

                        simple_block.value.push(ComponentValue::Value(value));
                    }
                },
            }
        }

        simple_block.span = span!(self, span.lo);

        Ok(simple_block)
    }
}

impl<I> Parse<Vec<DeclarationOrAtRule>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationOrAtRule>> {
        let mut declarations = vec![];

        loop {
            if is!(self, EOF) {
                return Ok(declarations);
            }

            match cur!(self) {
                tok!(" ") => {
                    self.input.skip_ws()?;
                }
                tok!(";") => {
                    bump!(self);
                }
                tok!("@") => {
                    declarations.push(DeclarationOrAtRule::AtRule(
                        self.parse_at_rule(Default::default())?,
                    ));
                }
                tok!("ident") => {
                    let state = self.input.state();
                    let span = self.input.cur_span()?;
                    let prop = match self.parse().map(DeclarationOrAtRule::Declaration) {
                        Ok(v) => v,
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, ";", "}") {
                                tokens.extend(self.input.bump()?);
                            }

                            DeclarationOrAtRule::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            })
                        }
                    };

                    declarations.push(prop);
                }

                // TODO refactor me
                tok!("}") => {
                    break;
                }

                // anything else
                _ => {
                    let span = self.input.cur_span()?;

                    self.errors.push(Error::new(
                        span,
                        ErrorKind::Expected(
                            "whitespace, semicolon, EOF, at-keyword or ident token",
                        ),
                    ));

                    let mut tokens = vec![];

                    // TODO fix me
                    while !is_one_of!(self, EOF, ";", "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    declarations.push(DeclarationOrAtRule::Invalid(Tokens {
                        span: span!(self, span.lo),
                        tokens,
                    }));
                }
            }
        }

        Ok(declarations)
    }
}

impl<I> Parse<Declaration> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Declaration> {
        let span = self.input.cur_span()?;

        self.input.skip_ws()?;

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

        self.input.skip_ws()?;

        expect!(self, ":");

        self.input.skip_ws()?;

        let mut end = self.input.cur_span()?.hi;
        let mut value = vec![];

        if !is!(self, EOF) {
            match is_dashed_ident {
                true => {
                    value.extend(self.parse_declaration_value()?);
                }
                false => {
                    loop {
                        // TODO fix me
                        self.input.skip_ws()?;

                        // TODO fix me
                        if is_one_of!(self, EOF, "!", ";", "}", ")") {
                            break;
                        }

                        let state = self.input.state();
                        let parsed = self.parse_one_value_inner();
                        let value_or_token = match parsed {
                            Ok(value) => value,
                            Err(err) => {
                                self.errors.push(err);
                                self.input.reset(&state);

                                self.parse_component_value()?
                            }
                        };

                        value.push(value_or_token);
                        end = self.input.last_pos()?;
                    }
                }
            }
        }

        self.input.skip_ws()?;

        let important = if is!(self, "!") {
            let important_flag = self.parse()?;

            end = self.input.last_pos()?;

            Some(important_flag)
        } else {
            None
        };

        self.input.skip_ws()?;

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
        let span = self.input.cur_span()?;

        expect!(self, "!");

        self.input.skip_ws()?;

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
