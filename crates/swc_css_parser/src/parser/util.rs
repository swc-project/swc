use std::ops::{Deref, DerefMut};

use swc_css_ast::*;

use super::{input::ParserInput, Ctx, PResult, Parse, Parser};

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

    pub(super) fn try_parse_legacy_nested_qualified_rule(&mut self) -> Option<Box<QualifiedRule>> {
        if !self.config.legacy_nesting {
            return None;
        }

        let state = self.input.state();

        let ctx = Ctx {
            is_trying_nested_selector: true,
            ..self.ctx
        };

        let span = self.input.cur_span();

        let nested = self.with_ctx(ctx).parse_as::<Box<QualifiedRule>>();

        let mut nested = match nested {
            Ok(v) => v,
            Err(_) => {
                self.input.reset(&state);
                return None;
            }
        };

        match &mut nested.prelude {
            QualifiedRulePrelude::ListOfComponentValues(_) => {
                self.input.reset(&state);

                return None;
            }
            QualifiedRulePrelude::SelectorList(s) => {
                for s in s.children.iter_mut() {
                    if s.children.iter().any(|s| match s {
                        ComplexSelectorChildren::CompoundSelector(s) => {
                            s.nesting_selector.is_some()
                        }
                        _ => false,
                    }) {
                        continue;
                    }

                    s.children.insert(
                        0,
                        ComplexSelectorChildren::CompoundSelector(CompoundSelector {
                            span,
                            nesting_selector: Some(NestingSelector { span }),
                            type_selector: Default::default(),
                            subclass_selectors: Default::default(),
                        }),
                    );
                    s.children.insert(
                        1,
                        ComplexSelectorChildren::Combinator(Combinator {
                            span,
                            value: CombinatorValue::Descendant,
                        }),
                    );
                }
            }
        }

        Some(nested)
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
