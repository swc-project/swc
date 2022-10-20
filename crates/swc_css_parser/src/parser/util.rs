use std::ops::{Deref, DerefMut};

use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::{input::ParserInput, Ctx, PResult, Parse, Parser};
use crate::{Tokens, TokensInput};

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

    pub fn parse_according_to_grammar<'a, T>(&mut self, tokens: &'a Tokens) -> PResult<T>
    where
        Parser<TokensInput<'a>>: Parse<T>,
    {
        let lexer = TokensInput::new(tokens);
        let mut parser = Parser::new(lexer, self.config);

        parser.parse()
    }

    pub(super) fn legacy_nested_selector_list_to_modern_selector_list(
        &mut self,
        mut selector_list: SelectorList,
    ) -> PResult<SelectorList> {
        for s in selector_list.children.iter_mut() {
            if s.children.iter().any(|s| match s {
                ComplexSelectorChildren::CompoundSelector(s) => s.nesting_selector.is_some(),
                _ => false,
            }) {
                continue;
            }

            s.children.insert(
                0,
                ComplexSelectorChildren::CompoundSelector(CompoundSelector {
                    span: DUMMY_SP,
                    nesting_selector: Some(NestingSelector { span: DUMMY_SP }),
                    type_selector: Default::default(),
                    subclass_selectors: Default::default(),
                }),
            );
            s.children.insert(
                1,
                ComplexSelectorChildren::Combinator(Combinator {
                    span: DUMMY_SP,
                    value: CombinatorValue::Descendant,
                }),
            );
        }

        Ok(selector_list)
    }

    pub(super) fn legacy_relative_selector_list_to_modern_selector_list(
        &mut self,
        relative_selector_list: RelativeSelectorList,
    ) -> PResult<SelectorList> {
        let mut selector_list = SelectorList {
            span: relative_selector_list.span,
            children: Vec::with_capacity(relative_selector_list.children.len()),
        };

        for relative_selector in relative_selector_list.children.into_iter() {
            let mut complex_selector = relative_selector.selector.clone();

            complex_selector.children.insert(
                0,
                ComplexSelectorChildren::CompoundSelector(CompoundSelector {
                    span: DUMMY_SP,
                    nesting_selector: Some(NestingSelector { span: DUMMY_SP }),
                    type_selector: Default::default(),
                    subclass_selectors: Default::default(),
                }),
            );

            match relative_selector.combinator {
                Some(combinator) => {
                    complex_selector
                        .children
                        .insert(1, ComplexSelectorChildren::Combinator(combinator));
                }
                _ => {
                    complex_selector.children.insert(
                        1,
                        ComplexSelectorChildren::Combinator(Combinator {
                            span: DUMMY_SP,
                            value: CombinatorValue::Descendant,
                        }),
                    );
                }
            }

            selector_list.children.push(complex_selector);
        }

        Ok(selector_list)
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
