use std::ops::{Deref, DerefMut};

use swc_common::{Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_css_ast::*;

use super::{
    input::{Input, InputType, ParserInput},
    Ctx, PResult, Parse, Parser,
};
use super::{input::ParserInput, Ctx, PResult, Parse, Parser};
use crate::{parser::input::ListOfComponentValuesInput, Error};

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

    pub(super) fn try_to_parse_legacy_nesting(&mut self) -> Option<QualifiedRule> {
        let state = self.input.state();
        let qualified_rule = self
            .with_ctx(Ctx {
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
