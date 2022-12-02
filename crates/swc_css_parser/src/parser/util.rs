use std::ops::{Deref, DerefMut};

use swc_atoms::js_word;
use swc_common::{Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_css_ast::*;

use super::{
    input::{Input, InputType, ParserInput},
    Ctx, Error, PResult, Parse, Parser,
};
use crate::{error::ErrorKind, parser::BlockContentsGrammar};

impl<I> Parser<I>
where
    I: ParserInput,
{
    /// Original context is restored when returned guard is dropped.
    #[inline]
    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<I> {
        let orig_ctx = self.ctx;

        self.ctx = ctx;

        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    #[inline]
    pub(super) fn parse_as<T>(&mut self) -> PResult<T>
    where
        Self: Parse<T>,
    {
        self.parse()
    }

    pub(super) fn try_parse<Ret>(
        &mut self,
        op: impl FnOnce(&mut Parser<I>) -> PResult<Ret>,
    ) -> Option<Ret> {
        let mut parser = self.clone();

        match op(&mut parser) {
            Ok(v) => {
                *self = parser;
                Some(v)
            }
            Err(..) => None,
        }
    }

    pub(super) fn create_locv(&self, children: Vec<ComponentValue>) -> ListOfComponentValues {
        let span = match (children.first(), children.last()) {
            (Some(first), Some(last)) => {
                Span::new(first.span_lo(), last.span_hi(), SyntaxContext::empty())
            }
            _ => DUMMY_SP,
        };

        ListOfComponentValues { span, children }
    }

    pub(super) fn parse_according_to_grammar<T>(
        &mut self,
        list_of_component_values: &ListOfComponentValues,
        op: impl FnOnce(&mut Parser<Input>) -> PResult<T>,
    ) -> PResult<T> {
        let lexer = Input::new(InputType::ListOfComponentValues(list_of_component_values));
        let mut parser = Parser::new(lexer, self.config);
        let res = op(&mut parser.with_ctx(self.ctx));

        self.errors.extend(parser.take_errors());

        res
    }

    pub(super) fn canonicalize_at_rule_prelude(&mut self, mut at_rule: AtRule) -> PResult<AtRule> {
        let normalized_at_rule_name = match &at_rule.name {
            AtRuleName::Ident(Ident { value, .. }) => value.to_ascii_lowercase(),
            AtRuleName::DashedIdent(_) => return Ok(at_rule),
        };

        let list_of_component_values = match at_rule.prelude {
            Some(at_rule_prelude) => match *at_rule_prelude {
                AtRulePrelude::ListOfComponentValues(list_of_component_values) => {
                    list_of_component_values
                }
                _ => {
                    unreachable!();
                }
            },
            _ => {
                unreachable!();
            }
        };

        at_rule.prelude = match self
            .parse_according_to_grammar(&list_of_component_values, |parser| {
                parser.parse_at_rule_prelude(&normalized_at_rule_name)
            }) {
            Ok(at_rule_prelude) => match at_rule_prelude {
                Some(AtRulePrelude::LayerPrelude(LayerPrelude::NameList(name_list)))
                    if name_list.name_list.len() > 1 && at_rule.block.is_some() =>
                {
                    self.errors.push(Error::new(
                        name_list.span,
                        ErrorKind::Expected("only one name"),
                    ));

                    Some(Box::new(AtRulePrelude::ListOfComponentValues(
                        list_of_component_values,
                    )))
                }
                None if *normalized_at_rule_name == js_word!("layer")
                    && at_rule.block.is_none() =>
                {
                    self.errors.push(Error::new(
                        at_rule.span,
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

        Ok(at_rule)
    }

    pub(super) fn canonicalize_at_rule_block(&mut self, mut at_rule: AtRule) -> PResult<AtRule> {
        let normalized_at_rule_name = match &at_rule.name {
            AtRuleName::Ident(Ident { value, .. }) => value.to_ascii_lowercase(),
            AtRuleName::DashedIdent(_) => return Ok(at_rule),
        };

        let mut block = match at_rule.block {
            Some(simple_block) => simple_block,
            _ => {
                unreachable!();
            }
        };

        let list_of_component_values = self.create_locv(block.value);

        block.value = match self.parse_according_to_grammar(&list_of_component_values, |parser| {
            parser.parse_at_rule_block(&normalized_at_rule_name)
        }) {
            Ok(block_contents) => block_contents,
            Err(err) => {
                if *err.kind() != ErrorKind::Ignore {
                    self.errors.push(err);
                }

                list_of_component_values.children
            }
        };

        at_rule.block = Some(block);

        Ok(at_rule)
    }

    pub(super) fn canonicalize_qualified_rule_prelude(
        &mut self,
        mut qualified_rule: QualifiedRule,
    ) -> PResult<QualifiedRule> {
        let list_of_component_values = match qualified_rule.prelude {
            QualifiedRulePrelude::ListOfComponentValues(list_of_component_values) => {
                list_of_component_values
            }
            _ => {
                unreachable!();
            }
        };

        qualified_rule.prelude = if self.ctx.in_keyframes_at_rule {
            QualifiedRulePrelude::ListOfComponentValues(list_of_component_values)
        } else if self.ctx.mixed_with_declarations {
            match self.parse_according_to_grammar::<RelativeSelectorList>(
                &list_of_component_values,
                |parser| parser.parse(),
            ) {
                Ok(relative_selector_list) => {
                    QualifiedRulePrelude::RelativeSelectorList(relative_selector_list)
                }
                Err(err) => {
                    self.errors.push(err);

                    QualifiedRulePrelude::ListOfComponentValues(list_of_component_values)
                }
            }
        } else {
            match self
                .parse_according_to_grammar::<SelectorList>(&list_of_component_values, |parser| {
                    parser.parse()
                }) {
                Ok(selector_list) => QualifiedRulePrelude::SelectorList(selector_list),
                Err(err) => {
                    self.errors.push(err);

                    QualifiedRulePrelude::ListOfComponentValues(list_of_component_values)
                }
            }
        };

        Ok(qualified_rule)
    }

    pub(super) fn canonicalize_qualified_rule_block(
        &mut self,
        mut qualified_rule: QualifiedRule,
    ) -> PResult<QualifiedRule> {
        qualified_rule.block.value = match self.ctx.block_contents_grammar {
            BlockContentsGrammar::RuleList if self.ctx.in_keyframes_at_rule => self
                .parse_according_to_grammar(
                    &self.create_locv(qualified_rule.block.value),
                    |parser| {
                        parser
                            .with_ctx(Ctx {
                                block_contents_grammar: BlockContentsGrammar::DeclarationList,
                                ..parser.ctx
                            })
                            .parse_as::<Vec<DeclarationOrAtRule>>()
                    },
                )?
                .into_iter()
                .map(ComponentValue::DeclarationOrAtRule)
                .collect(),
            _ => self
                .parse_according_to_grammar(
                    &self.create_locv(qualified_rule.block.value),
                    |parser| {
                        parser
                            .with_ctx(Ctx {
                                block_contents_grammar: BlockContentsGrammar::StyleBlock,
                                ..parser.ctx
                            })
                            .parse_as::<Vec<StyleBlock>>()
                    },
                )?
                .into_iter()
                .map(ComponentValue::StyleBlock)
                .collect(),
        };

        Ok(qualified_rule)
    }

    pub(super) fn canonicalize_function_value(
        &mut self,
        mut function: Function,
    ) -> PResult<Function> {
        let function_name = function.name.value.to_ascii_lowercase();
        let locv = self.create_locv(function.value);

        function.value = match self.parse_according_to_grammar(&locv, |parser| {
            parser.parse_function_values(&function_name)
        }) {
            Ok(values) => values,
            Err(err) => {
                if *err.kind() != ErrorKind::Ignore {
                    self.errors.push(err);
                }

                locv.children
            }
        };

        Ok(function)
    }

    pub(super) fn canonicalize_declaration_value(
        &mut self,
        mut declaration: Declaration,
    ) -> PResult<Declaration> {
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

        Ok(declaration)
    }

    pub(super) fn try_to_parse_legacy_nesting(&mut self) -> Option<QualifiedRule> {
        let state = self.input.state();
        let qualified_rule = self
            .with_ctx(Ctx {
                block_contents_grammar: BlockContentsGrammar::StyleBlock,
                mixed_with_declarations: true,
                ..self.ctx
            })
            .parse_as::<QualifiedRule>();

        match qualified_rule {
            Ok(qualified_rule) => Some(qualified_rule),
            _ => {
                self.input.reset(&state);

                None
            }
        }
    }

    pub(super) fn try_to_parse_declaration_in_parens(&mut self) -> Option<Declaration> {
        let mut temporary_list = ListOfComponentValues {
            span: Default::default(),
            children: vec![],
        };

        while !is_one_of!(self, ")", EOF) {
            let component_value = match self.parse_as::<ComponentValue>() {
                Ok(component_value) => component_value,
                Err(_) => return None,
            };

            temporary_list.children.push(component_value);
        }

        match self
            .parse_according_to_grammar::<Declaration>(&temporary_list, |parser| parser.parse_as())
        {
            Ok(decl) => Some(decl),
            Err(_) => None,
        }
    }

    pub(super) fn parse_declaration_from_temporary_list(
        &mut self,
        temporary_list: &ListOfComponentValues,
    ) -> PResult<Declaration> {
        self.parse_according_to_grammar::<Declaration>(temporary_list, |parser| parser.parse_as())
    }

    // The <declaration-value> production matches any sequence of one or more
    // tokens, so long as the sequence does not contain <bad-string-token>,
    // <bad-url-token>, unmatched <)-token>, <]-token>, or <}-token>, or top-level
    // <semicolon-token> tokens or <delim-token> tokens with a value of "!". It
    // represents the entirety of what a valid declaration can have as its value.
    pub(super) fn validate_declaration_value(
        &mut self,
        component_value: &ComponentValue,
    ) -> PResult<()> {
        match component_value {
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::BadString { .. },
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("bad string in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::BadUrl { .. },
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("bad url in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::RParen,
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("')' in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::RBracket,
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("']' in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::RBrace,
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("'}' in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::Semi,
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("';' in declaration value"),
                ));
            }
            ComponentValue::PreservedToken(TokenAndSpan {
                span,
                token: Token::Delim { value: '!' },
            }) => {
                return Err(Error::new(
                    *span,
                    ErrorKind::Unexpected("'!' in declaration value"),
                ));
            }
            _ => {}
        }

        Ok(())
    }
}

pub(super) struct WithCtx<'w, I: 'w + ParserInput> {
    inner: &'w mut Parser<I>,
    orig_ctx: Ctx,
}

impl<'w, I: ParserInput> Deref for WithCtx<'w, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<'w, I: ParserInput> DerefMut for WithCtx<'w, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<'w, I: ParserInput> Drop for WithCtx<'w, I> {
    fn drop(&mut self) {
        self.inner.ctx = self.orig_ctx;
    }
}
