use std::ops::DerefMut;

use swc_common::{BytePos, Spanned};
use swc_ecma_ast::{
    Accessibility, CallExpr, Callee, Decl, Decorator, ExportDefaultDecl, Expr, Function, Ident,
    Key, Param, Pat, TsInstantiation, TsTypeParamInstantiation,
};

use super::{
    buffer::Buffer,
    expr::{parse_args, parse_lhs_expr},
    ident::{parse_binding_ident, parse_opt_binding_ident, parse_private_name},
    output_type::OutputType,
    pat::parse_formal_params,
    typescript::{parse_ts_modifier, parse_ts_type_args},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            expr::parse_subscripts,
            ident::parse_ident,
            is_simple_param_list::IsSimpleParameterList,
            typescript::{parse_ts_type_or_type_predicate_ann, parse_ts_type_params},
        },
    },
    error::SyntaxError,
    TokenContext,
};

/// If `required` is `true`, this never returns `None`.
pub fn parse_maybe_opt_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    required: bool,
    disallow_let: bool,
) -> PResult<Option<Ident>> {
    if required {
        parse_binding_ident(p, disallow_let).map(|v| v.id).map(Some)
    } else {
        parse_opt_binding_ident(p, disallow_let).map(|v| v.map(|v| v.id))
    }
}

fn parse_maybe_decorator_args<'a, P: Parser<'a>>(p: &mut P, expr: Box<Expr>) -> PResult<Box<Expr>> {
    let type_args = if p.input().syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
        Some(parse_ts_type_args(p)?)
    } else {
        None
    };

    if type_args.is_none() && !p.input_mut().is(&P::Token::LPAREN) {
        return Ok(expr);
    }

    let args = parse_args(p, false)?;
    Ok(CallExpr {
        span: p.span(expr.span_lo()),
        callee: Callee::Expr(expr),
        args,
        ..Default::default()
    }
    .into())
}

pub fn parse_decorators<'a, P: Parser<'a>>(
    p: &mut P,
    allow_export: bool,
) -> PResult<Vec<Decorator>> {
    if !p.syntax().decorators() {
        return Ok(Vec::new());
    }
    trace_cur!(p, parse_decorators);

    let mut decorators = Vec::new();
    let start = p.cur_pos();

    while p.input_mut().is(&P::Token::AT) {
        decorators.push(parse_decorator(p)?);
    }
    if decorators.is_empty() {
        return Ok(decorators);
    }

    if p.input_mut().is(&P::Token::EXPORT) {
        if !p.ctx().contains(Context::InClass)
            && !p.ctx().contains(Context::InFunction)
            && !allow_export
        {
            syntax_error!(p, p.input().cur_span(), SyntaxError::ExportNotAllowed);
        }

        if !p.ctx().contains(Context::InClass)
            && !p.ctx().contains(Context::InFunction)
            && !p.syntax().decorators_before_export()
        {
            syntax_error!(p, p.span(start), SyntaxError::DecoratorOnExport);
        }
    } else if !p.input_mut().is(&P::Token::CLASS) {
        // syntax_error!(p, p.span(start),
        // SyntaxError::InvalidLeadingDecorator)
    }

    Ok(decorators)
}

fn parse_decorator<'a, P: Parser<'a>>(p: &mut P) -> PResult<Decorator> {
    let start = p.cur_pos();
    trace_cur!(p, parse_decorator);

    p.assert_and_bump(&P::Token::AT)?;

    let expr = if p.input_mut().eat(&P::Token::LPAREN) {
        let expr = p.parse_expr()?;
        expect!(p, &P::Token::RPAREN);
        expr
    } else {
        let expr = parse_ident(p, false, false).map(Expr::from).map(Box::new)?;

        parse_subscripts(p, Callee::Expr(expr), false, true)?
    };

    let expr = parse_maybe_decorator_args(p, expr)?;

    Ok(Decorator {
        span: p.span(start),
        expr,
    })
}

pub fn parse_access_modifier<'a>(p: &mut impl Parser<'a>) -> PResult<Option<Accessibility>> {
    Ok(
        parse_ts_modifier(p, &["public", "protected", "private", "in", "out"], false)?.and_then(
            |s| match s {
                "public" => Some(Accessibility::Public),
                "protected" => Some(Accessibility::Protected),
                "private" => Some(Accessibility::Private),
                other => {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1274(other.into()));
                    None
                }
            },
        ),
    )
}

pub fn parse_super_class<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<(Box<Expr>, Option<Box<TsTypeParamInstantiation>>)> {
    let super_class = parse_lhs_expr(p)?;
    match *super_class {
        Expr::TsInstantiation(TsInstantiation {
            expr, type_args, ..
        }) => Ok((expr, Some(type_args))),
        _ => {
            // We still need to parse TS type arguments,
            // because in some cases "super class" returned by `parse_lhs_expr`
            // may not include `TsExprWithTypeArgs`
            // but it's a super class with type params, for example, in JSX.
            if p.syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
                Ok((super_class, parse_ts_type_args(p).map(Some)?))
            } else {
                Ok((super_class, None))
            }
        }
    }
}

pub fn is_class_method<'a, P: Parser<'a>>(p: &mut P) -> bool {
    p.input_mut().is(&P::Token::LPAREN)
        || (p.input().syntax().typescript() && p.input_mut().is(&P::Token::LESS))
        || (p.input().syntax().typescript() && p.input_mut().is(&P::Token::JSX_TAG_START))
}

pub fn is_class_property<'a, P: Parser<'a>>(p: &mut P, asi: bool) -> bool {
    (p.input().syntax().typescript()
        && p.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_bang() || cur.is_colon()))
        || p.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_equal() || cur.is_rbrace())
        || if asi {
            p.is_general_semi()
        } else {
            p.input_mut().is(&P::Token::SEMI)
        }
}

pub fn parse_class_prop_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<Key> {
    if p.input_mut().is(&P::Token::HASH) {
        let name = parse_private_name(p)?;
        if name.name == "constructor" {
            p.emit_err(name.span, SyntaxError::PrivateConstructor);
        }
        Ok(Key::Private(name))
    } else {
        p.parse_prop_name().map(Key::Public)
    }
}

/// `parse_args` closure should not eat '(' or ')'.
pub fn parse_fn_args_body<'a, P: Parser<'a>, F>(
    p: &mut P,
    decorators: Vec<Decorator>,
    start: BytePos,
    parse_args: F,
    is_async: bool,
    is_generator: bool,
) -> PResult<Box<Function>>
where
    F: FnOnce(&mut P) -> PResult<Vec<Param>>,
{
    trace_cur!(p, parse_fn_args_body);
    // let prev_in_generator = p.ctx().in_generator;
    let mut ctx = p.ctx();
    ctx.set(Context::InAsync, is_async);
    ctx.set(Context::InGenerator, is_generator);

    p.with_ctx(ctx).parse_with(|p| {
        let type_params = if p.syntax().typescript() {
            p.in_type().parse_with(|p| {
                trace_cur!(p, parse_fn_args_body__type_params);

                Ok(if p.input_mut().is(&P::Token::LESS) {
                    Some(parse_ts_type_params(p, false, true)?)
                } else if p.input_mut().is(&P::Token::JSX_TAG_START) {
                    debug_assert_eq!(
                        p.input().token_context().current(),
                        Some(TokenContext::JSXOpeningTag)
                    );
                    p.input_mut().token_context_mut().pop();
                    debug_assert_eq!(
                        p.input().token_context().current(),
                        Some(TokenContext::JSXExpr)
                    );
                    p.input_mut().token_context_mut().pop();

                    Some(parse_ts_type_params(p, false, true)?)
                } else {
                    None
                })
            })?
        } else {
            None
        };

        expect!(p, &P::Token::LPAREN);

        let mut arg_ctx = (p.ctx() | Context::InParameters) & !Context::InFunction;
        arg_ctx.set(Context::InAsync, is_async);
        arg_ctx.set(Context::InGenerator, is_generator);
        let params = p.with_ctx(arg_ctx).parse_with(|p| parse_args(p))?;

        expect!(p, &P::Token::RPAREN);

        // typescript extension
        let return_type = if p.syntax().typescript() && p.input_mut().is(&P::Token::COLON) {
            parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON).map(Some)?
        } else {
            None
        };

        let body: Option<_> = p.parse_fn_block_body(
            is_async,
            is_generator,
            false,
            params.is_simple_parameter_list(),
        )?;

        if p.syntax().typescript() && body.is_none() {
            // Declare functions cannot have assignment pattern in parameters
            for param in &params {
                // TODO: Search deeply for assignment pattern using a Visitor

                let span = match &param.pat {
                    Pat::Assign(ref p) => Some(p.span()),
                    _ => None,
                };

                if let Some(span) = span {
                    p.emit_err(span, SyntaxError::TS2371)
                }
            }
        }

        Ok(Box::new(Function {
            span: p.span(start),
            decorators,
            type_params,
            params,
            body,
            is_async,
            is_generator,
            return_type,
            ctxt: Default::default(),
        }))
    })
}

pub fn parse_async_fn_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    let start = p.cur_pos();
    expect!(p, &P::Token::ASYNC);
    parse_fn(p, None, Some(start), Vec::new())
}

/// Parse function expression
pub fn parse_fn_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    parse_fn(p, None, None, Vec::new())
}

pub fn parse_async_fn_decl<'a, P: Parser<'a>>(
    p: &mut P,
    decorators: Vec<Decorator>,
) -> PResult<Decl> {
    let start = p.cur_pos();
    expect!(p, &P::Token::ASYNC);
    parse_fn(p, None, Some(start), decorators)
}

pub fn parse_fn_decl<'a, P: Parser<'a>>(p: &mut P, decorators: Vec<Decorator>) -> PResult<Decl> {
    parse_fn(p, None, None, decorators)
}

pub fn parse_default_async_fn<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<ExportDefaultDecl> {
    let start_of_async = p.cur_pos();
    expect!(p, &P::Token::ASYNC);
    parse_fn(p, Some(start), Some(start_of_async), decorators)
}

pub fn parse_default_fn<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<ExportDefaultDecl> {
    parse_fn(p, Some(start), None, decorators)
}

fn parse_fn_inner<'a, P: Parser<'a>>(
    p: &mut P,
    _start_of_output_type: Option<BytePos>,
    start_of_async: Option<BytePos>,
    decorators: Vec<Decorator>,
    is_fn_expr: bool,
    is_ident_required: bool,
) -> PResult<(Option<Ident>, Box<Function>)> {
    let start = start_of_async.unwrap_or_else(|| p.cur_pos());
    p.assert_and_bump(&P::Token::FUNCTION)?;
    let is_async = start_of_async.is_some();

    let is_generator = p.input_mut().eat(&P::Token::MUL);

    let ident = if is_fn_expr {
        let mut ctx = p.ctx() & !Context::AllowDirectSuper & !Context::InClassField;
        ctx.set(Context::InAsync, is_async);
        ctx.set(Context::InGenerator, is_generator);

        parse_maybe_opt_binding_ident(p.with_ctx(ctx).deref_mut(), is_ident_required, false)?
    } else {
        // function declaration does not change context for `BindingIdentifier`.
        parse_maybe_opt_binding_ident(
            p.with_ctx(p.ctx() & !Context::AllowDirectSuper & !Context::InClassField)
                .deref_mut(),
            is_ident_required,
            false,
        )?
    };

    p.with_ctx(
        p.ctx()
            & !Context::AllowDirectSuper
            & !Context::InClassField
            & !Context::WillExpectColonForCond,
    )
    .parse_with(|p| {
        let f = parse_fn_args_body(
            p,
            decorators,
            start,
            parse_formal_params,
            is_async,
            is_generator,
        )?;

        if is_fn_expr && f.body.is_none() {
            unexpected!(p, "{");
        }

        Ok((ident, f))
    })
}

fn parse_fn<'a, P: Parser<'a>, T>(
    p: &mut P,
    start_of_output_type: Option<BytePos>,
    start_of_async: Option<BytePos>,
    decorators: Vec<Decorator>,
) -> PResult<T>
where
    T: OutputType,
{
    let start = start_of_async.unwrap_or_else(|| p.cur_pos());
    let (ident, f) = parse_fn_inner(
        p,
        start_of_output_type,
        start_of_async,
        decorators,
        T::is_fn_expr(),
        T::IS_IDENT_REQUIRED,
    )?;

    match T::finish_fn(p.span(start_of_output_type.unwrap_or(start)), ident, f) {
        Ok(v) => Ok(v),
        Err(kind) => syntax_error!(p, kind),
    }
}

pub fn parse_class_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    class_start: BytePos,
    decorators: Vec<Decorator>,
    is_abstract: bool,
) -> PResult<Decl> {
    p.parse_class(start, class_start, decorators, is_abstract)
}

pub fn parse_class_expr<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<Box<Expr>> {
    p.parse_class(start, start, decorators, false)
}

pub fn parse_default_class<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    class_start: BytePos,
    decorators: Vec<Decorator>,
    is_abstract: bool,
) -> PResult<ExportDefaultDecl> {
    p.parse_class(start, class_start, decorators, is_abstract)
}
