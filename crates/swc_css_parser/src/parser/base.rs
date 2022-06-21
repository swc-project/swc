use swc_common::Span;
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{BlockContentsGrammar, Ctx, RuleContext},
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
            if is_one_of!(self, EOF, "}") {
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

                            let span = self.input.cur_span()?;
                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                let token = self.input.bump()?;

                                tokens.extend(token);

                                if is!(self, ";") {
                                    let token = self.input.bump()?;

                                    tokens.extend(token);

                                    break;
                                }
                            }

                            rules.push(Rule::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            }));
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
        // Create a new qualified rule with its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let mut prelude = QualifiedRulePrelude::Invalid(Tokens {
            span: Default::default(),
            tokens: vec![],
        });

        // Repeatedly consume the next input token:
        loop {
            // <EOF-token>
            // This is a parse error. Return nothing.
            // But we return for error recovery blocks
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
                        block_contents_grammar: BlockContentsGrammar::StyleBlock,
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
                    let state = self.input.state();

                    prelude = match self.parse() {
                        Ok(selector_list) => QualifiedRulePrelude::SelectorList(selector_list),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span()?;
                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, "{") {
                                if is!(self, ";") {
                                    let span = self.input.cur_span()?;

                                    return Err(Error::new(span, ErrorKind::UnexpectedChar(';')));
                                }

                                let token = self.input.bump()?;

                                tokens.extend(token);
                            }

                            QualifiedRulePrelude::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            })
                        }
                    };
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
                    rules.push(StyleBlock::AtRule(self.parse()?));
                }
                // <ident-token>
                // Initialize a temporary list initially filled with the current input token. As
                // long as the next input token is anything other than a <semicolon-token> or
                // <EOF-token>, consume a component value and append it to the temporary list.
                // Consume a declaration from the temporary list. If anything was returned, append
                // it to decls.
                tok!("ident") => {
                    let state = self.input.state();
                    let prop = match self.parse() {
                        Ok(v) => StyleBlock::Declaration(v),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span()?;
                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                let token = self.input.bump()?;

                                tokens.extend(token);

                                if is!(self, ";") {
                                    let token = self.input.bump()?;

                                    tokens.extend(token);

                                    break;
                                }
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
                    let qualified_rule = match self.parse() {
                        Ok(v) => StyleBlock::QualifiedRule(v),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let span = self.input.cur_span()?;
                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                let token = self.input.bump()?;

                                tokens.extend(token);

                                if is!(self, ";") {
                                    let token = self.input.bump()?;

                                    tokens.extend(token);

                                    break;
                                }
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
                    while !is_one_of!(self, EOF, "}") {
                        tokens.extend(self.input.bump()?);

                        if is!(self, ";") {
                            let token = self.input.bump()?;

                            tokens.extend(token);

                            break;
                        }
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

        // TODO refactor me
        if self.ctx.block_contents_grammar != BlockContentsGrammar::NoGrammar {
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
                _ => match self.ctx.block_contents_grammar {
                    BlockContentsGrammar::NoGrammar => {
                        let component_value = self.parse()?;

                        simple_block.value.push(component_value);
                    }
                    BlockContentsGrammar::StyleBlock => {
                        let style_blocks: Vec<StyleBlock> = self.parse()?;
                        let style_blocks: Vec<ComponentValue> = style_blocks
                            .into_iter()
                            .map(ComponentValue::StyleBlock)
                            .collect();

                        simple_block.value.extend(style_blocks);
                    }
                    // TODO improve grammar validation
                    BlockContentsGrammar::RuleList | BlockContentsGrammar::Stylesheet => {
                        let rule_list = self.parse_rule_list(RuleContext {
                            is_top_level: false,
                        })?;
                        let rule_list: Vec<ComponentValue> =
                            rule_list.into_iter().map(ComponentValue::Rule).collect();

                        simple_block.value.extend(rule_list);
                    }
                    BlockContentsGrammar::DeclarationList => {
                        let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                        let declaration_list: Vec<ComponentValue> = declaration_list
                            .into_iter()
                            .map(ComponentValue::DeclarationOrAtRule)
                            .collect();

                        simple_block.value.extend(declaration_list);
                    }
                    BlockContentsGrammar::DeclarationValue => {
                        let state = self.input.state();
                        let parsed = self.parse();
                        let value = match parsed {
                            Ok(value) => {
                                self.input.skip_ws()?;

                                value
                            }
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

                        simple_block.value.push(value);
                    }
                },
            }
        }

        simple_block.span = span!(self, span.lo);

        Ok(simple_block)
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
                        let token = self.input.bump()?;

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
                self.input.skip_ws()?;

                let span = self.input.cur_span()?;

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
                            block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                            ..self.ctx
                        };
                        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

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

impl<I> Parse<Vec<DeclarationOrAtRule>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationOrAtRule>> {
        let mut declarations = vec![];

        loop {
            // TODO: remove `}`
            if is_one_of!(self, EOF, "}") {
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
                    declarations.push(DeclarationOrAtRule::AtRule(self.parse()?));
                }
                tok!("ident") => {
                    let state = self.input.state();
                    let span = self.input.cur_span()?;
                    let prop = match self.parse() {
                        Ok(v) => DeclarationOrAtRule::Declaration(v),
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let mut tokens = vec![];

                            while !is_one_of!(self, EOF, "}") {
                                let token = self.input.bump()?;

                                tokens.extend(token);

                                if is!(self, ";") {
                                    let token = self.input.bump()?;

                                    tokens.extend(token);

                                    break;
                                }
                            }

                            DeclarationOrAtRule::Invalid(Tokens {
                                span: span!(self, span.lo),
                                tokens,
                            })
                        }
                    };

                    declarations.push(prop);
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
                    while !is_one_of!(self, EOF, "}") {
                        tokens.extend(self.input.bump()?);

                        if is!(self, ";") {
                            let token = self.input.bump()?;

                            tokens.extend(token);

                            break;
                        }
                    }

                    declarations.push(DeclarationOrAtRule::Invalid(Tokens {
                        span: span!(self, span.lo),
                        tokens,
                    }));
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
        let span = self.input.cur_span()?;

        self.input.skip_ws()?;

        // 1. Consume the next input token. Create a new declaration with its name set
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
        self.input.skip_ws()?;

        // 2. If the next input token is anything other than a <colon-token>, this is a
        // parse error. Return nothing. Otherwise, consume the next input token.
        expect!(self, ":");

        // 3. While the next input token is a <whitespace-token>, consume the next input
        // token.
        self.input.skip_ws()?;

        let mut end = self.input.cur_span()?.hi;
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
                        self.input.skip_ws()?;

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
