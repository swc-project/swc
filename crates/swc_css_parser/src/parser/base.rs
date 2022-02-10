use swc_common::Span;
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, RuleContext},
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
                        self.input.bump()?;

                        continue;
                    }

                    // Otherwise, reconsume the current input token. Consume a qualified rule. If
                    // anything is returned, append it to the list of rules.
                    rules.push(self.parse()?);
                }
                // <at-keyword-token>
                // Reconsume the current input token. Consume an at-rule, and append the returned
                // value to the list of rules.
                Token::AtKeyword { .. } => {
                    rules.push(Rule::AtRule(self.parse_at_rule(Default::default())?));
                }
                // anything else
                // Reconsume the current input token. Consume a qualified rule. If anything is
                // returned, append it to the list of rules.
                _ => {
                    rules.push(self.parse()?);
                }
            }
        }
    }
}

impl<I> Parse<Rule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Rule> {
        let start_pos = self.input.cur_span()?.lo;
        let start_state = self.input.state();

        let prelude = self.parse();
        let prelude = match prelude {
            Ok(v) => v,
            Err(err) => {
                self.input.skip_ws()?;
                if is!(self, "}") {
                    self.errors.push(err);
                    self.input.reset(&start_state);

                    let mut tokens = vec![];
                    while !is_one_of!(self, EOF, "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    return Ok(Rule::Invalid(Tokens {
                        span: span!(self, start_pos),
                        tokens,
                    }));
                } else {
                    return Err(err);
                }
            }
        };

        let block = self.parse()?;
        let span = span!(self, start_pos);

        Ok(Rule::QualifiedRule(QualifiedRule {
            span,
            prelude,
            block,
        }))
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
        self.input.skip_ws()?;

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
                _ => {
                    let state = self.input.state();
                    let ctx = Ctx {
                        // TODO refactor me
                        allow_operation_in_value: name == '(',
                        ..self.ctx
                    };
                    let parsed = self.with_ctx(ctx).parse_one_value_inner();
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

                    simple_block.value.push(value);
                }
            }
        }

        simple_block.span = span!(self, span.lo);

        Ok(simple_block)
    }
}

impl<I> Parse<Block> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Block> {
        let start = self.input.cur_span()?.lo;

        expect!(self, "{");

        self.input.skip_ws()?;

        let value = self.parse()?;

        expect!(self, "}");

        let span = span!(self, start);

        Ok(Block { span, value })
    }
}

impl<I> Parse<Vec<DeclarationBlockItem>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationBlockItem>> {
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
                Token::AtKeyword { .. } => {
                    declarations.push(DeclarationBlockItem::AtRule(
                        self.parse_at_rule(Default::default())?,
                    ));
                }
                Token::Ident { .. } => {
                    let state = self.input.state();
                    let span = self.input.cur_span()?;
                    let prop = match self.parse().map(DeclarationBlockItem::Declaration) {
                        Ok(v) => v,
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, ";", "}") {
                                tokens.extend(self.input.bump()?);
                            }

                            DeclarationBlockItem::Invalid(Tokens {
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

                    while !is_one_of!(self, EOF, ";") {
                        tokens.extend(self.input.bump()?);
                    }

                    declarations.push(DeclarationBlockItem::Invalid(Tokens {
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
                    let tokens = Value::Tokens(self.parse_declaration_value()?);

                    value.push(tokens);
                }
                false => {
                    let ctx = Ctx {
                        allow_operation_in_value: false,
                        recover_from_property_value: true,
                        ..self.ctx
                    };
                    let (parsed_value, parsed_last_pos) =
                        self.with_ctx(ctx).parse_property_values()?;

                    value.extend(parsed_value);
                    end = parsed_last_pos;
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
