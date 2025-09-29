use swc_atoms::atom;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    buffer::Buffer,
    expr::{parse_args, parse_assignment_expr},
    has_use_strict,
    ident::{parse_binding_ident, parse_opt_binding_ident, parse_private_name},
    is_constructor,
    output_type::OutputType,
    pat::parse_formal_params,
    stmt::parse_block,
    typescript::{parse_ts_modifier, parse_ts_type_args, try_parse_ts_type_ann},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            expr::parse_subscripts,
            ident::parse_ident,
            is_invalid_class_name::IsInvalidClassName,
            is_not_this,
            is_simple_param_list::IsSimpleParameterList,
            pat::{parse_constructor_params, parse_unique_formal_params},
            typescript::{
                parse_ts_heritage_clause, parse_ts_type_ann, parse_ts_type_or_type_predicate_ann,
                parse_ts_type_params, try_parse_ts_index_signature, try_parse_ts_type_params,
            },
        },
    },
    error::SyntaxError,
    TokenContext,
};

struct MakeMethodArgs {
    start: BytePos,
    accessibility: Option<Accessibility>,
    is_abstract: bool,
    static_token: Option<Span>,
    decorators: Vec<Decorator>,
    is_optional: bool,
    is_override: bool,
    key: Key,
    kind: MethodKind,
    is_async: bool,
    is_generator: bool,
}

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
    let type_args = if p.input().syntax().typescript() && p.input().is(&P::Token::LESS) {
        let ret = parse_ts_type_args(p)?;
        p.assert_and_bump(&P::Token::GREATER);
        Some(ret)
    } else {
        None
    };

    if type_args.is_none() && !p.input().is(&P::Token::LPAREN) {
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

    while p.input().is(&P::Token::AT) {
        decorators.push(parse_decorator(p)?);
    }
    if decorators.is_empty() {
        return Ok(decorators);
    }

    if p.input().is(&P::Token::EXPORT) {
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
    } else if !p.input().is(&P::Token::CLASS) {
        // syntax_error!(p, p.span(start),
        // SyntaxError::InvalidLeadingDecorator)
    }

    Ok(decorators)
}

fn parse_decorator<'a, P: Parser<'a>>(p: &mut P) -> PResult<Decorator> {
    let start = p.cur_pos();
    trace_cur!(p, parse_decorator);

    p.assert_and_bump(&P::Token::AT);

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
    let super_class = p.parse_lhs_expr()?;
    match *super_class {
        Expr::TsInstantiation(TsInstantiation {
            expr, type_args, ..
        }) => Ok((expr, Some(type_args))),
        _ => {
            // We still need to parse TS type arguments,
            // because in some cases "super class" returned by `parse_lhs_expr`
            // may not include `TsExprWithTypeArgs`
            // but it's a super class with type params, for example, in JSX.
            if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
                let ret = parse_ts_type_args(p)?;
                p.assert_and_bump(&P::Token::GREATER);
                Ok((super_class, Some(ret)))
            } else {
                Ok((super_class, None))
            }
        }
    }
}

pub fn is_class_method<'a, P: Parser<'a>>(p: &mut P) -> bool {
    let cur = p.input().cur();
    cur == &P::Token::LPAREN
        || (p.input().syntax().typescript() && (cur.is_less() || cur.is_jsx_tag_start()))
}

pub fn is_class_property<'a, P: Parser<'a>>(p: &mut P, asi: bool) -> bool {
    let cur = p.input().cur();
    (p.input().syntax().typescript() && (cur.is_bang() || cur.is_colon()))
        || (cur.is_equal() || cur.is_rbrace())
        || if asi {
            p.is_general_semi()
        } else {
            p.input().is(&P::Token::SEMI)
        }
}

pub fn parse_class_prop_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<Key> {
    if p.input().is(&P::Token::HASH) {
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
    let f = |p: &mut P| {
        let type_params = if p.syntax().typescript() {
            p.in_type(|p| {
                trace_cur!(p, parse_fn_args_body__type_params);

                Ok(if p.input().is(&P::Token::LESS) {
                    Some(parse_ts_type_params(p, false, true)?)
                } else if p.input().is(&P::Token::JSX_TAG_START) {
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

        let parse_args_with_generator_ctx = |p: &mut P| {
            if is_generator {
                p.do_inside_of_context(Context::InGenerator, parse_args)
            } else {
                p.do_outside_of_context(Context::InGenerator, parse_args)
            }
        };

        let params = p.do_inside_of_context(Context::InParameters, |p| {
            p.do_outside_of_context(Context::InFunction, |p| {
                if is_async {
                    p.do_inside_of_context(Context::InAsync, parse_args_with_generator_ctx)
                } else {
                    p.do_outside_of_context(Context::InAsync, parse_args_with_generator_ctx)
                }
            })
        })?;

        expect!(p, &P::Token::RPAREN);

        // typescript extension
        let return_type = if p.syntax().typescript() && p.input().is(&P::Token::COLON) {
            parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON).map(Some)?
        } else {
            None
        };

        let body: Option<_> = parse_fn_block_body(
            p,
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
    };

    let f_with_generator_ctx = |p: &mut P| {
        if is_generator {
            p.do_inside_of_context(Context::InGenerator, f)
        } else {
            p.do_outside_of_context(Context::InGenerator, f)
        }
    };

    if is_async {
        p.do_inside_of_context(Context::InAsync, f_with_generator_ctx)
    } else {
        p.do_outside_of_context(Context::InAsync, f_with_generator_ctx)
    }
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
    p.assert_and_bump(&P::Token::FUNCTION);
    let is_async = start_of_async.is_some();

    let is_generator = p.input_mut().eat(&P::Token::MUL);

    let ident = if is_fn_expr {
        let f_with_generator_context = |p: &mut P| {
            if is_generator {
                p.do_inside_of_context(Context::InGenerator, |p| {
                    parse_maybe_opt_binding_ident(p, is_ident_required, false)
                })
            } else {
                p.do_outside_of_context(Context::InGenerator, |p| {
                    parse_maybe_opt_binding_ident(p, is_ident_required, false)
                })
            }
        };

        p.do_outside_of_context(
            Context::AllowDirectSuper.union(Context::InClassField),
            |p| {
                if is_async {
                    p.do_inside_of_context(Context::InAsync, f_with_generator_context)
                } else {
                    p.do_outside_of_context(Context::InAsync, f_with_generator_context)
                }
            },
        )?
    } else {
        // function declaration does not change context for `BindingIdentifier`.
        p.do_outside_of_context(
            Context::AllowDirectSuper.union(Context::InClassField),
            |p| parse_maybe_opt_binding_ident(p, is_ident_required, false),
        )?
    };

    p.do_outside_of_context(
        Context::AllowDirectSuper
            .union(Context::InClassField)
            .union(Context::WillExpectColonForCond),
        |p| {
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
        },
    )
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
    parse_class(p, start, class_start, decorators, is_abstract)
}

pub fn parse_class_expr<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<Box<Expr>> {
    parse_class(p, start, start, decorators, false)
}

pub fn parse_default_class<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    class_start: BytePos,
    decorators: Vec<Decorator>,
    is_abstract: bool,
) -> PResult<ExportDefaultDecl> {
    parse_class(p, start, class_start, decorators, is_abstract)
}

fn make_method<'a, P: Parser<'a>, F>(
    p: &mut P,
    parse_args: F,
    MakeMethodArgs {
        start,
        accessibility,
        is_abstract,
        static_token,
        decorators,
        is_optional,
        is_override,
        key,
        kind,
        is_async,
        is_generator,
    }: MakeMethodArgs,
) -> PResult<ClassMember>
where
    F: FnOnce(&mut P) -> PResult<Vec<Param>>,
{
    trace_cur!(p, make_method);

    let is_static = static_token.is_some();
    let function = p.do_inside_of_context(Context::AllowDirectSuper, |p| {
        p.do_outside_of_context(Context::InClassField, |p| {
            parse_fn_args_body(p, decorators, start, parse_args, is_async, is_generator)
        })
    })?;

    match kind {
        MethodKind::Getter | MethodKind::Setter
            if p.input().syntax().typescript() && p.input().target() == EsVersion::Es3 =>
        {
            p.emit_err(key.span(), SyntaxError::TS1056);
        }
        _ => {}
    }

    match key {
        Key::Private(key) => {
            let span = p.span(start);
            if accessibility.is_some() {
                p.emit_err(span.with_hi(key.span_hi()), SyntaxError::TS18010);
            }

            Ok(PrivateMethod {
                span,

                accessibility,
                is_abstract,
                is_optional,
                is_override,

                is_static,
                key,
                function,
                kind,
            }
            .into())
        }
        Key::Public(key) => {
            let span = p.span(start);
            if is_abstract && function.body.is_some() {
                p.emit_err(span, SyntaxError::TS1245)
            }
            Ok(ClassMethod {
                span,

                accessibility,
                is_abstract,
                is_optional,
                is_override,

                is_static,
                key,
                function,
                kind,
            }
            .into())
        }
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }
}

pub fn parse_fn_block_or_expr_body<'a, P: Parser<'a>>(
    p: &mut P,
    is_async: bool,
    is_generator: bool,
    is_arrow_function: bool,
    is_simple_parameter_list: bool,
) -> PResult<Box<BlockStmtOrExpr>> {
    parse_fn_body(
        p,
        is_async,
        is_generator,
        is_arrow_function,
        is_simple_parameter_list,
        |p, is_simple_parameter_list| {
            if p.input().is(&P::Token::LBRACE) {
                parse_block(p, false)
                    .map(|block_stmt| {
                        if !is_simple_parameter_list {
                            if let Some(span) = has_use_strict(&block_stmt) {
                                p.emit_err(span, SyntaxError::IllegalLanguageModeDirective);
                            }
                        }
                        BlockStmtOrExpr::BlockStmt(block_stmt)
                    })
                    .map(Box::new)
            } else {
                parse_assignment_expr(p)
                    .map(BlockStmtOrExpr::Expr)
                    .map(Box::new)
            }
        },
    )
}

fn parse_fn_body<'a, P: Parser<'a>, T>(
    p: &mut P,
    is_async: bool,
    is_generator: bool,
    is_arrow_function: bool,
    is_simple_parameter_list: bool,
    f: impl FnOnce(&mut P, bool) -> PResult<T>,
) -> PResult<T> {
    if p.ctx().contains(Context::InDeclare)
        && p.syntax().typescript()
        && p.input().is(&P::Token::LBRACE)
    {
        //            p.emit_err(
        //                p.ctx().span_of_fn_name.expect("we are not in function"),
        //                SyntaxError::TS1183,
        //            );
        p.emit_err(p.input().cur_span(), SyntaxError::TS1183);
    }

    let f_with_generator_context = |p: &mut P| {
        let f_with_inside_non_arrow_fn_scope = |p: &mut P| {
            let f_with_new_state = |p: &mut P| {
                let mut p = p.with_state(crate::common::parser::state::State::default());
                f(&mut p, is_simple_parameter_list)
            };

            if is_arrow_function && !p.ctx().contains(Context::InsideNonArrowFunctionScope) {
                p.do_outside_of_context(Context::InsideNonArrowFunctionScope, f_with_new_state)
            } else {
                p.do_inside_of_context(Context::InsideNonArrowFunctionScope, f_with_new_state)
            }
        };

        if is_generator {
            p.do_inside_of_context(Context::InGenerator, f_with_inside_non_arrow_fn_scope)
        } else {
            p.do_outside_of_context(Context::InGenerator, f_with_inside_non_arrow_fn_scope)
        }
    };

    p.do_inside_of_context(Context::InFunction, |p| {
        p.do_outside_of_context(
            Context::InStaticBlock
                .union(Context::IsBreakAllowed)
                .union(Context::IsContinueAllowed)
                .union(Context::TopLevel),
            |p| {
                if is_async {
                    p.do_inside_of_context(Context::InAsync, f_with_generator_context)
                } else {
                    p.do_outside_of_context(Context::InAsync, f_with_generator_context)
                }
            },
        )
    })
}

pub(super) fn parse_fn_block_body<'a, P: Parser<'a>>(
    p: &mut P,
    is_async: bool,
    is_generator: bool,
    is_arrow_function: bool,
    is_simple_parameter_list: bool,
) -> PResult<Option<BlockStmt>> {
    parse_fn_body(
        p,
        is_async,
        is_generator,
        is_arrow_function,
        is_simple_parameter_list,
        |p, is_simple_parameter_list| {
            // allow omitting body and allow placing `{` on next line
            if p.input().syntax().typescript()
                && !p.input().is(&P::Token::LBRACE)
                && p.eat_general_semi()
            {
                return Ok(None);
            }
            p.allow_in_expr(|p| parse_block(p, true)).map(|block_stmt| {
                if !is_simple_parameter_list {
                    if let Some(span) = has_use_strict(&block_stmt) {
                        p.emit_err(span, SyntaxError::IllegalLanguageModeDirective);
                    }
                }
                Some(block_stmt)
            })
        },
    )
}

fn make_property<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
    accessibility: Option<Accessibility>,
    key: Key,
    is_static: bool,
    accessor_token: Option<Span>,
    is_optional: bool,
    readonly: bool,
    declare: bool,
    is_abstract: bool,
    is_override: bool,
) -> PResult<ClassMember> {
    if is_constructor(&key) {
        syntax_error!(p, key.span(), SyntaxError::PropertyNamedConstructor);
    }
    if key.is_private() {
        if declare {
            p.emit_err(
                key.span(),
                SyntaxError::PrivateNameModifier(atom!("declare")),
            )
        }
        if is_abstract {
            p.emit_err(
                key.span(),
                SyntaxError::PrivateNameModifier(atom!("abstract")),
            )
        }
    }
    let definite =
        p.input().syntax().typescript() && !is_optional && p.input_mut().eat(&P::Token::BANG);

    let type_ann = try_parse_ts_type_ann(p)?;

    p.do_inside_of_context(Context::IncludeInExpr.union(Context::InClassField), |p| {
        let value = if p.input().is(&P::Token::EQUAL) {
            p.assert_and_bump(&P::Token::EQUAL);
            Some(parse_assignment_expr(p)?)
        } else {
            None
        };

        if !p.eat_general_semi() {
            p.emit_err(p.input().cur_span(), SyntaxError::TS1005);
        }

        if accessor_token.is_some() {
            return Ok(ClassMember::AutoAccessor(AutoAccessor {
                span: p.span(start),
                key,
                value,
                type_ann,
                is_static,
                decorators,
                accessibility,
                is_abstract,
                is_override,
                definite,
            }));
        }

        Ok(match key {
            Key::Private(key) => {
                let span = p.span(start);
                if accessibility.is_some() {
                    p.emit_err(span.with_hi(key.span_hi()), SyntaxError::TS18010);
                }

                PrivateProp {
                    span: p.span(start),
                    key,
                    value,
                    is_static,
                    decorators,
                    accessibility,
                    is_optional,
                    is_override,
                    readonly,
                    type_ann,
                    definite,
                    ctxt: Default::default(),
                }
                .into()
            }
            Key::Public(key) => {
                let span = p.span(start);
                if is_abstract && value.is_some() {
                    p.emit_err(span, SyntaxError::TS1267)
                }
                ClassProp {
                    span,
                    key,
                    value,
                    is_static,
                    decorators,
                    accessibility,
                    is_abstract,
                    is_optional,
                    is_override,
                    readonly,
                    declare,
                    definite,
                    type_ann,
                }
                .into()
            }
            #[cfg(swc_ast_unknown)]
            _ => unreachable!(),
        })
    })
}

fn parse_static_block<'a, P: Parser<'a>>(p: &mut P, start: BytePos) -> PResult<ClassMember> {
    let body = p.do_inside_of_context(
        Context::InStaticBlock
            .union(Context::InClassField)
            .union(Context::AllowUsingDecl),
        |p| parse_block(p, false),
    )?;

    let span = p.span(start);
    Ok(StaticBlock { span, body }.into())
}

fn parse_class_member_with_is_static<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    declare_token: Option<Span>,
    accessibility: Option<Accessibility>,
    static_token: Option<Span>,
    accessor_token: Option<Span>,
    decorators: Vec<Decorator>,
) -> PResult<ClassMember> {
    let mut is_static = static_token.is_some();

    let mut is_abstract = false;
    let mut is_override = false;
    let mut readonly = None;
    let mut modifier_span = None;
    let declare = declare_token.is_some();
    while let Some(modifier) = if p.input().syntax().typescript() {
        parse_ts_modifier(p, &["abstract", "readonly", "override", "static"], true)?
    } else {
        None
    } {
        modifier_span = Some(p.input().prev_span());
        match modifier {
            "abstract" => {
                if is_abstract {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1030(atom!("abstract")),
                    );
                } else if is_override {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1029(atom!("abstract"), atom!("override")),
                    );
                }
                is_abstract = true;
            }
            "override" => {
                if is_override {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1030(atom!("override")),
                    );
                } else if readonly.is_some() {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1029(atom!("override"), atom!("readonly")),
                    );
                } else if declare {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1243(atom!("override"), atom!("declare")),
                    );
                } else if !p.ctx().contains(Context::HasSuperClass) {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS4112);
                }
                is_override = true;
            }
            "readonly" => {
                let readonly_span = p.input().prev_span();
                if readonly.is_some() {
                    p.emit_err(readonly_span, SyntaxError::TS1030(atom!("readonly")));
                } else {
                    readonly = Some(readonly_span);
                }
            }
            "static" => {
                if is_override {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1029(atom!("static"), atom!("override")),
                    );
                }

                is_static = true;
            }
            _ => {}
        }
    }

    let accessor_token = accessor_token.or_else(|| {
        if p.syntax().auto_accessors() && readonly.is_none() {
            let start = p.cur_pos();
            if !peek!(p).is_some_and(|cur| cur.is_lparen())
                && p.input_mut().eat(&P::Token::ACCESSOR)
            {
                Some(p.span(start))
            } else {
                None
            }
        } else {
            None
        }
    });

    if is_static && p.input().is(&P::Token::LBRACE) {
        if let Some(span) = declare_token {
            p.emit_err(span, SyntaxError::TS1184);
        }
        if accessibility.is_some() {
            p.emit_err(p.input().cur_span(), SyntaxError::TS1184);
        }
        return parse_static_block(p, start);
    }
    if p.input().is(&P::Token::STATIC) && peek!(p).is_some_and(|cur| cur.is_lbrace()) {
        // For "readonly", "abstract" and "override"
        if let Some(span) = modifier_span {
            p.emit_err(span, SyntaxError::TS1184);
        }
        if let Some(span) = static_token {
            p.emit_err(span, SyntaxError::TS1184);
        }
        p.bump(); // consume "static"
        return parse_static_block(p, start);
    }

    if p.input().syntax().typescript() && !is_abstract && !is_override && accessibility.is_none() {
        let idx = try_parse_ts_index_signature(p, start, readonly.is_some(), is_static)?;
        if let Some(idx) = idx {
            return Ok(idx.into());
        }
    }

    if p.input_mut().eat(&P::Token::MUL) {
        // generator method
        let key = parse_class_prop_name(p)?;
        if readonly.is_some() {
            p.emit_err(p.span(start), SyntaxError::ReadOnlyMethod);
        }
        if is_constructor(&key) {
            p.emit_err(p.span(start), SyntaxError::GeneratorConstructor);
        }

        return make_method(
            p,
            parse_unique_formal_params,
            MakeMethodArgs {
                start,
                decorators,
                is_async: false,
                is_generator: true,
                accessibility,
                is_abstract,
                is_override,
                is_optional: false,
                static_token,
                key,
                kind: MethodKind::Method,
            },
        );
    }

    trace_cur!(p, parse_class_member_with_is_static__normal_class_member);
    let key = if readonly.is_some() && (p.input().cur().is_bang() || p.input().cur().is_colon()) {
        Key::Public(PropName::Ident(IdentName::new(
            atom!("readonly"),
            readonly.unwrap(),
        )))
    } else {
        parse_class_prop_name(p)?
    };
    let is_optional = p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);

    if is_class_method(p) {
        // handle a(){} / get(){} / set(){} / async(){}

        trace_cur!(p, parse_class_member_with_is_static__normal_class_method);

        if let Some(token) = declare_token {
            p.emit_err(token, SyntaxError::TS1031)
        }

        if readonly.is_some() {
            syntax_error!(p, p.span(start), SyntaxError::ReadOnlyMethod);
        }
        let is_constructor = is_constructor(&key);

        if is_constructor {
            if p.syntax().typescript() && is_override {
                p.emit_err(p.span(start), SyntaxError::TS1089(atom!("override")));
            }

            if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
                let start = p.cur_pos();
                if peek!(p).is_some_and(|cur| cur.is_less()) {
                    p.assert_and_bump(&P::Token::LESS);
                    let start2 = p.cur_pos();
                    p.assert_and_bump(&P::Token::GREATER);

                    p.emit_err(p.span(start), SyntaxError::TS1098);
                    p.emit_err(p.span(start2), SyntaxError::TS1092);
                } else {
                    let type_params = try_parse_ts_type_params(p, false, true)?;

                    if let Some(type_params) = type_params {
                        for param in type_params.params {
                            p.emit_err(param.span(), SyntaxError::TS1092);
                        }
                    }
                }
            }

            expect!(p, &P::Token::LPAREN);
            let params = parse_constructor_params(p)?;
            expect!(p, &P::Token::RPAREN);

            if p.syntax().typescript() && p.input().is(&P::Token::COLON) {
                let start = p.cur_pos();
                let type_ann = parse_ts_type_ann(p, true, start)?;

                p.emit_err(type_ann.type_ann.span(), SyntaxError::TS1093);
            }

            let body: Option<_> =
                parse_fn_block_body(p, false, false, false, params.is_simple_parameter_list())?;

            if body.is_none() {
                for param in params.iter() {
                    if param.is_ts_param_prop() {
                        p.emit_err(param.span(), SyntaxError::TS2369)
                    }
                }
            }

            if p.syntax().typescript() && body.is_none() {
                // Declare constructors cannot have assignment pattern in parameters
                for param in &params {
                    // TODO: Search deeply for assignment pattern using a Visitor

                    let span = match *param {
                        ParamOrTsParamProp::Param(ref param) => match param.pat {
                            Pat::Assign(ref p) => Some(p.span()),
                            _ => None,
                        },
                        ParamOrTsParamProp::TsParamProp(TsParamProp {
                            param: TsParamPropParam::Assign(ref p),
                            ..
                        }) => Some(p.span()),
                        _ => None,
                    };

                    if let Some(span) = span {
                        p.emit_err(span, SyntaxError::TS2371)
                    }
                }
            }

            if let Some(static_token) = static_token {
                p.emit_err(static_token, SyntaxError::TS1089(atom!("static")))
            }

            if let Some(span) = modifier_span {
                if is_abstract {
                    p.emit_err(span, SyntaxError::TS1242);
                }
            }

            return Ok(ClassMember::Constructor(Constructor {
                span: p.span(start),
                accessibility,
                key: match key {
                    Key::Public(key) => key,
                    _ => unreachable!("is_constructor() returns false for PrivateName"),
                },
                is_optional,
                params,
                body,
                ..Default::default()
            }));
        } else {
            return make_method(
                p,
                parse_formal_params,
                MakeMethodArgs {
                    start,
                    is_optional,
                    accessibility,
                    decorators,
                    is_abstract,
                    is_override,
                    static_token,
                    kind: MethodKind::Method,
                    key,
                    is_async: false,
                    is_generator: false,
                },
            );
        }
    }

    let is_next_line_generator =
        p.input_mut().had_line_break_before_cur() && p.input().is(&P::Token::MUL);
    let getter_or_setter_ident = match key {
        // `get\n*` is an uninitialized property named 'get' followed by a generator.
        Key::Public(PropName::Ident(ref i))
            if (i.sym == "get" || i.sym == "set")
                && !is_class_property(p, /* asi */ false)
                && !is_next_line_generator =>
        {
            Some(i)
        }
        _ => None,
    };

    if getter_or_setter_ident.is_none() && is_class_property(p, /* asi */ true) {
        return make_property(
            p,
            start,
            decorators,
            accessibility,
            key,
            is_static,
            accessor_token,
            is_optional,
            readonly.is_some(),
            declare,
            is_abstract,
            is_override,
        );
    }

    if match key {
        Key::Public(PropName::Ident(ref i)) => i.sym == "async",
        _ => false,
    } && !p.input_mut().had_line_break_before_cur()
    {
        // handle async foo(){}

        if p.input().syntax().typescript() && parse_ts_modifier(p, &["override"], false)?.is_some()
        {
            is_override = true;
            p.emit_err(
                p.input().prev_span(),
                SyntaxError::TS1029(atom!("override"), atom!("async")),
            );
        }

        let is_generator = p.input_mut().eat(&P::Token::MUL);
        let key = parse_class_prop_name(p)?;
        if is_constructor(&key) {
            syntax_error!(p, key.span(), SyntaxError::AsyncConstructor)
        }
        if readonly.is_some() {
            syntax_error!(p, p.span(start), SyntaxError::ReadOnlyMethod);
        }

        // handle async foo(){}
        let is_optional = is_optional
            || p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
        return make_method(
            p,
            parse_unique_formal_params,
            MakeMethodArgs {
                start,
                static_token,
                key,
                is_abstract,
                accessibility,
                is_optional,
                is_override,
                decorators,
                kind: MethodKind::Method,
                is_async: true,
                is_generator,
            },
        );
    }

    if let Some(i) = getter_or_setter_ident {
        let key_span = key.span();

        // handle get foo(){} / set foo(v){}
        let key = parse_class_prop_name(p)?;

        if readonly.is_some() {
            p.emit_err(key_span, SyntaxError::GetterSetterCannotBeReadonly);
        }

        if is_constructor(&key) {
            p.emit_err(key_span, SyntaxError::ConstructorAccessor);
        }

        return match &*i.sym {
            "get" => make_method(
                p,
                |p| {
                    let params = parse_formal_params(p)?;

                    if params.iter().any(is_not_this) {
                        p.emit_err(key_span, SyntaxError::GetterParam);
                    }

                    Ok(params)
                },
                MakeMethodArgs {
                    decorators,
                    start,
                    is_abstract,
                    is_async: false,
                    is_generator: false,
                    is_optional,
                    is_override,
                    accessibility,
                    static_token,
                    key,
                    kind: MethodKind::Getter,
                },
            ),
            "set" => make_method(
                p,
                |p| {
                    let params = parse_formal_params(p)?;

                    if params.iter().filter(|p| is_not_this(p)).count() != 1 {
                        p.emit_err(key_span, SyntaxError::SetterParam);
                    }

                    if !params.is_empty() {
                        if let Pat::Rest(..) = params[0].pat {
                            p.emit_err(params[0].pat.span(), SyntaxError::RestPatInSetter);
                        }
                    }

                    Ok(params)
                },
                MakeMethodArgs {
                    decorators,
                    start,
                    is_optional,
                    is_abstract,
                    is_override,
                    is_async: false,
                    is_generator: false,
                    accessibility,
                    static_token,
                    key,
                    kind: MethodKind::Setter,
                },
            ),
            _ => unreachable!(),
        };
    }

    unexpected!(p, "* for generator, private key, identifier or async")
}

fn parse_class_member<'a, P: Parser<'a>>(p: &mut P) -> PResult<ClassMember> {
    trace_cur!(p, parse_class_member);

    let start = p.cur_pos();
    let decorators = parse_decorators(p, false)?;
    let declare = p.syntax().typescript() && p.input_mut().eat(&P::Token::DECLARE);
    let accessibility = if p.input().syntax().typescript() {
        parse_access_modifier(p)?
    } else {
        None
    };
    // Allow `private declare`.
    let declare = declare || p.syntax().typescript() && p.input_mut().eat(&P::Token::DECLARE);

    let declare_token = if declare {
        // Handle declare(){}
        if is_class_method(p) {
            let key = Key::Public(PropName::Ident(IdentName::new(
                atom!("declare"),
                p.span(start),
            )));
            let is_optional =
                p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
            return make_method(
                p,
                parse_unique_formal_params,
                MakeMethodArgs {
                    start,
                    accessibility,
                    decorators,
                    is_abstract: false,
                    is_optional,
                    is_override: false,
                    is_async: false,
                    is_generator: false,
                    static_token: None,
                    key,
                    kind: MethodKind::Method,
                },
            );
        } else if is_class_property(p, /* asi */ true)
            || (p.syntax().typescript() && p.input().is(&P::Token::QUESTION))
        {
            // Property named `declare`

            let key = Key::Public(PropName::Ident(IdentName::new(
                atom!("declare"),
                p.span(start),
            )));
            let is_optional =
                p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
            return make_property(
                p,
                start,
                decorators,
                accessibility,
                key,
                false,
                None,
                is_optional,
                false,
                false,
                false,
                false,
            );
        } else {
            Some(p.span(start))
        }
    } else {
        None
    };

    let static_token = {
        let start = p.cur_pos();
        if p.input_mut().eat(&P::Token::STATIC) {
            Some(p.span(start))
        } else {
            None
        }
    };

    let accessor_token = if p.syntax().auto_accessors() {
        let start = p.cur_pos();
        if p.input_mut().eat(&P::Token::ACCESSOR) {
            Some(p.span(start))
        } else {
            None
        }
    } else {
        None
    };

    if let Some(accessor_token) = accessor_token {
        // Handle accessor(){}
        if is_class_method(p) {
            let key = Key::Public(PropName::Ident(IdentName::new(
                atom!("accessor"),
                accessor_token,
            )));
            let is_optional =
                p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
            return make_method(
                p,
                parse_unique_formal_params,
                MakeMethodArgs {
                    start,
                    accessibility,
                    decorators,
                    is_abstract: false,
                    is_optional,
                    is_override: false,
                    is_async: false,
                    is_generator: false,
                    static_token,
                    key,
                    kind: MethodKind::Method,
                },
            );
        } else if is_class_property(p, /* asi */ true)
            || (p.syntax().typescript() && p.input().is(&P::Token::QUESTION))
        {
            // Property named `accessor`

            let key = Key::Public(PropName::Ident(IdentName::new(
                atom!("accessor"),
                accessor_token,
            )));
            let is_optional =
                p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
            let is_static = static_token.is_some();
            return make_property(
                p,
                start,
                decorators,
                accessibility,
                key,
                is_static,
                None,
                is_optional,
                false,
                declare,
                false,
                false,
            );
        }
    }

    if let Some(static_token) = static_token {
        // Handle static(){}
        if is_class_method(p) {
            let key = Key::Public(PropName::Ident(IdentName::new(
                atom!("static"),
                static_token,
            )));
            let is_optional =
                p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
            return make_method(
                p,
                parse_unique_formal_params,
                MakeMethodArgs {
                    start,
                    accessibility,
                    decorators,
                    is_abstract: false,
                    is_optional,
                    is_override: false,
                    is_async: false,
                    is_generator: false,
                    static_token: None,
                    key,
                    kind: MethodKind::Method,
                },
            );
        } else if is_class_property(p, /* asi */ false)
            || (p.syntax().typescript() && p.input().is(&P::Token::QUESTION))
        {
            // Property named `static`

            // Avoid to parse
            //   static
            //   {}
            let is_parsing_static_blocks = p.input().is(&P::Token::LBRACE);
            if !is_parsing_static_blocks {
                let key = Key::Public(PropName::Ident(IdentName::new(
                    atom!("static"),
                    static_token,
                )));
                let is_optional =
                    p.input().syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION);
                return make_property(
                    p,
                    start,
                    decorators,
                    accessibility,
                    key,
                    false,
                    accessor_token,
                    is_optional,
                    false,
                    declare,
                    false,
                    false,
                );
            }
        } else {
            // TODO: error if static contains escape
        }
    }

    parse_class_member_with_is_static(
        p,
        start,
        declare_token,
        accessibility,
        static_token,
        accessor_token,
        decorators,
    )
}

fn parse_class_body<'a, P: Parser<'a>>(p: &mut P) -> PResult<Vec<ClassMember>> {
    let mut elems = Vec::with_capacity(32);
    let mut has_constructor_with_body = false;
    while !p.input().is(&P::Token::RBRACE) {
        if p.input_mut().eat(&P::Token::SEMI) {
            let span = p.input().prev_span();
            debug_assert!(span.lo <= span.hi);
            elems.push(ClassMember::Empty(EmptyStmt { span }));
            continue;
        }
        let elem = p.do_inside_of_context(Context::AllowDirectSuper, parse_class_member)?;

        if !p.ctx().contains(Context::InDeclare) {
            if let ClassMember::Constructor(Constructor {
                body: Some(..),
                span,
                ..
            }) = elem
            {
                if has_constructor_with_body {
                    p.emit_err(span, SyntaxError::DuplicateConstructor);
                }
                has_constructor_with_body = true;
            }
        }
        elems.push(elem);
    }
    Ok(elems)
}

pub fn parse_class<'a, T>(
    p: &mut impl Parser<'a>,
    start: BytePos,
    class_start: BytePos,
    decorators: Vec<Decorator>,
    is_abstract: bool,
) -> PResult<T>
where
    T: OutputType,
{
    let (ident, mut class) = p.do_inside_of_context(Context::InClass, |p| {
        parse_class_inner(p, start, class_start, decorators, T::IS_IDENT_REQUIRED)
    })?;

    if is_abstract {
        class.is_abstract = true
    } else {
        for member in class.body.iter() {
            match member {
                ClassMember::ClassProp(ClassProp {
                    is_abstract: true,
                    span,
                    ..
                })
                | ClassMember::Method(ClassMethod {
                    span,
                    is_abstract: true,
                    ..
                }) => p.emit_err(*span, SyntaxError::TS1244),
                _ => (),
            }
        }
    }

    match T::finish_class(p.span(start), ident, class) {
        Ok(v) => Ok(v),
        Err(kind) => syntax_error!(p, kind),
    }
}

/// Not generic
fn parse_class_inner<'a, P: Parser<'a>>(
    p: &mut P,
    _start: BytePos,
    class_start: BytePos,
    decorators: Vec<Decorator>,
    is_ident_required: bool,
) -> PResult<(Option<Ident>, Box<Class>)> {
    p.strict_mode(|p| {
        expect!(p, &P::Token::CLASS);

        let ident = parse_maybe_opt_binding_ident(p, is_ident_required, true)?;
        if p.input().syntax().typescript() {
            if let Some(span) = ident.invalid_class_name() {
                p.emit_err(span, SyntaxError::TS2414);
            }
        }

        let type_params = if p.input().syntax().typescript() {
            try_parse_ts_type_params(p, true, true)?
        } else {
            None
        };

        let (mut super_class, mut super_type_params) = if p.input_mut().eat(&P::Token::EXTENDS) {
            let (super_class, super_type_params) = parse_super_class(p)?;

            if p.syntax().typescript() && p.input_mut().eat(&P::Token::COMMA) {
                let exprs = parse_ts_heritage_clause(p)?;

                for e in &exprs {
                    p.emit_err(e.span(), SyntaxError::TS1174);
                }
            }

            (Some(super_class), super_type_params)
        } else {
            (None, None)
        };

        // Handle TS1172
        if p.input_mut().eat(&P::Token::EXTENDS) {
            p.emit_err(p.input().prev_span(), SyntaxError::TS1172);

            parse_super_class(p)?;
        };

        let implements =
            if p.input().syntax().typescript() && p.input_mut().eat(&P::Token::IMPLEMENTS) {
                parse_ts_heritage_clause(p)?
            } else {
                Vec::with_capacity(4)
            };

        {
            // Handle TS1175
            if p.input().syntax().typescript() && p.input_mut().eat(&P::Token::IMPLEMENTS) {
                p.emit_err(p.input().prev_span(), SyntaxError::TS1175);

                parse_ts_heritage_clause(p)?;
            }
        }

        // Handle TS1173
        if p.input().syntax().typescript() && p.input_mut().eat(&P::Token::EXTENDS) {
            p.emit_err(p.input().prev_span(), SyntaxError::TS1173);

            let (sc, type_params) = parse_super_class(p)?;

            if super_class.is_none() {
                super_class = Some(sc);
                if type_params.is_some() {
                    super_type_params = type_params;
                }
            }
        }

        expect!(p, &P::Token::LBRACE);

        let body = if super_class.is_some() {
            p.do_inside_of_context(Context::HasSuperClass, parse_class_body)?
        } else {
            p.do_outside_of_context(Context::HasSuperClass, parse_class_body)?
        };

        if p.input().cur().is_eof() {
            let eof_text = p.input_mut().dump_cur();
            p.emit_err(
                p.input().cur_span(),
                SyntaxError::Expected(format!("{:?}", P::Token::RBRACE), eof_text),
            );
        } else {
            expect!(p, &P::Token::RBRACE);
        }

        let span = p.span(class_start);
        Ok((
            ident,
            Box::new(Class {
                span,
                decorators,
                is_abstract: false,
                type_params,
                super_class,
                super_type_params,
                body,
                implements,
                ..Default::default()
            }),
        ))
    })
}
