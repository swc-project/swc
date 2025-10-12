use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    buffer::Buffer,
    class_and_fn::parse_fn_decl,
    expr::parse_assignment_expr,
    is_directive::IsDirective,
    pat::parse_binding_pat_or_ident,
    typescript::{try_parse_ts_type_ann, ts_look_ahead},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            class_and_fn::{parse_async_fn_decl, parse_class_decl, parse_decorators},
            eof_error,
            expr::{parse_await_expr, parse_bin_op_recursively, parse_for_head_prefix},
            ident::{parse_binding_ident, parse_label_ident},
            pat::reparse_expr_as_pat,
            pat_type::PatType,
            typescript::{
                parse_ts_enum_decl, parse_ts_expr_stmt, parse_ts_interface_decl, parse_ts_type,
                parse_ts_type_alias_decl,
            },
            TokenAndSpan,
        },
    },
    error::{Error, SyntaxError},
};

#[allow(clippy::enum_variant_names)]
pub enum TempForHead {
    For {
        init: Option<VarDeclOrExpr>,
        test: Option<Box<Expr>>,
        update: Option<Box<Expr>>,
    },
    ForIn {
        left: ForHead,
        right: Box<Expr>,
    },
    ForOf {
        left: ForHead,
        right: Box<Expr>,
    },
}

fn parse_normal_for_head<'a, P: Parser<'a>>(
    p: &mut P,
    init: Option<VarDeclOrExpr>,
) -> PResult<TempForHead> {
    let test = if p.input_mut().eat(&P::Token::SEMI) {
        None
    } else {
        let test = p.allow_in_expr(|p| p.parse_expr()).map(Some)?;
        p.input_mut().eat(&P::Token::SEMI);
        test
    };

    let update = if p.input().is(&P::Token::RPAREN) {
        None
    } else {
        p.allow_in_expr(|p| p.parse_expr()).map(Some)?
    };

    Ok(TempForHead::For { init, test, update })
}

fn parse_for_each_head<'a, P: Parser<'a>>(p: &mut P, left: ForHead) -> PResult<TempForHead> {
    let is_of = p.input().cur().is_of();
    p.bump();
    if is_of {
        let right = p.allow_in_expr(parse_assignment_expr)?;
        Ok(TempForHead::ForOf { left, right })
    } else {
        if let ForHead::UsingDecl(d) = &left {
            p.emit_err(d.span, SyntaxError::UsingDeclNotAllowedForForInLoop)
        }
        let right = p.allow_in_expr(|p| p.parse_expr())?;
        Ok(TempForHead::ForIn { left, right })
    }
}

pub fn parse_return_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::RETURN);

    let arg = if p.is_general_semi() {
        None
    } else {
        p.allow_in_expr(|p| p.parse_expr()).map(Some)?
    };
    p.expect_general_semi()?;
    let stmt = Ok(ReturnStmt {
        span: p.span(start),
        arg,
    }
    .into());

    if !p.ctx().contains(Context::InFunction) && !p.input().syntax().allow_return_outside_function()
    {
        p.emit_err(p.span(start), SyntaxError::ReturnNotAllowed);
    }

    stmt
}

fn parse_var_declarator<'a, P: Parser<'a>>(
    p: &mut P,
    for_loop: bool,
    kind: VarDeclKind,
) -> PResult<VarDeclarator> {
    let start = p.cur_pos();

    let is_let_or_const = matches!(kind, VarDeclKind::Let | VarDeclKind::Const);

    let mut name = parse_binding_pat_or_ident(p, is_let_or_const)?;

    let definite = if p.input().syntax().typescript() {
        match name {
            Pat::Ident(..) => p.input_mut().eat(&P::Token::BANG),
            _ => false,
        }
    } else {
        false
    };

    // Typescript extension
    if p.input().syntax().typescript() && p.input().is(&P::Token::COLON) {
        let type_annotation = try_parse_ts_type_ann(p)?;
        match name {
            Pat::Array(ArrayPat {
                ref mut type_ann, ..
            })
            | Pat::Ident(BindingIdent {
                ref mut type_ann, ..
            })
            | Pat::Object(ObjectPat {
                ref mut type_ann, ..
            })
            | Pat::Rest(RestPat {
                ref mut type_ann, ..
            }) => {
                *type_ann = type_annotation;
            }
            _ => unreachable!("invalid syntax: Pat: {:?}", name),
        }
    }

    //FIXME: This is wrong. Should check in/of only on first loop.
    let cur = p.input().cur();
    let init = if !for_loop || !(cur.is_in() || cur.is_of()) {
        if p.input_mut().eat(&P::Token::EQUAL) {
            let expr = parse_assignment_expr(p)?;
            let expr = p.verify_expr(expr)?;

            Some(expr)
        } else {
            // Destructuring bindings require initializers, but
            // typescript allows `declare` vars not to have initializers.
            if p.ctx().contains(Context::InDeclare) {
                None
            } else if kind == VarDeclKind::Const
                && !for_loop
                && !p.ctx().contains(Context::InDeclare)
            {
                p.emit_err(
                    p.span(start),
                    SyntaxError::ConstDeclarationsRequireInitialization,
                );

                None
            } else {
                match name {
                    Pat::Ident(..) => None,
                    _ => {
                        syntax_error!(p, p.span(start), SyntaxError::PatVarWithoutInit)
                    }
                }
            }
        }
    } else {
        // e.g. for(let a;;)
        None
    };

    Ok(VarDeclarator {
        span: p.span(start),
        name,
        init,
        definite,
    })
}

pub fn parse_var_stmt<'a, P: Parser<'a>>(p: &mut P, for_loop: bool) -> PResult<Box<VarDecl>> {
    let start = p.cur_pos();
    let t = p.input().cur();
    let kind = if t.is_const() {
        VarDeclKind::Const
    } else if t.is_let() {
        VarDeclKind::Let
    } else if t.is_var() {
        VarDeclKind::Var
    } else {
        unreachable!()
    };
    p.bump();
    let var_span = p.span(start);
    let should_include_in = kind != VarDeclKind::Var || !for_loop;

    if p.syntax().typescript() && for_loop {
        let cur = p.input().cur();
        let res: PResult<bool> = if cur.is_in() || cur.is_of() {
            ts_look_ahead(p, |p| {
                //
                if !p.input_mut().eat(&P::Token::OF) && !p.input_mut().eat(&P::Token::IN) {
                    return Ok(false);
                }

                parse_assignment_expr(p)?;
                expect!(p, &P::Token::RPAREN);

                Ok(true)
            })
        } else {
            Ok(false)
        };

        match res {
            Ok(true) => {
                let pos = var_span.hi();
                let span = Span::new_with_checked(pos, pos);
                p.emit_err(span, SyntaxError::TS1123);

                return Ok(Box::new(VarDecl {
                    span: p.span(start),
                    kind,
                    declare: false,
                    decls: Vec::new(),
                    ..Default::default()
                }));
            }
            Err(..) => {}
            _ => {}
        }
    }

    let mut decls = Vec::with_capacity(4);
    loop {
        // Handle
        //      var a,;
        //
        // NewLine is ok
        if p.input().is(&P::Token::SEMI) {
            let prev_span = p.input().prev_span();
            let span = if prev_span == var_span {
                Span::new_with_checked(prev_span.hi, prev_span.hi)
            } else {
                prev_span
            };
            p.emit_err(span, SyntaxError::TS1009);
            break;
        }

        let decl = if should_include_in {
            p.do_inside_of_context(Context::IncludeInExpr, |p| {
                parse_var_declarator(p, for_loop, kind)
            })
        } else {
            parse_var_declarator(p, for_loop, kind)
        }?;

        decls.push(decl);

        if !p.input_mut().eat(&P::Token::COMMA) {
            break;
        }
    }

    if !for_loop && !p.eat_general_semi() {
        p.emit_err(p.input().cur_span(), SyntaxError::TS1005);

        let _ = p.parse_expr();

        while !p.eat_general_semi() {
            p.bump();

            if p.input().cur().is_error() {
                break;
            }
        }
    }

    Ok(Box::new(VarDecl {
        span: p.span(start),
        declare: false,
        kind,
        decls,
        ..Default::default()
    }))
}

pub fn parse_using_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    is_await: bool,
) -> PResult<Option<Box<UsingDecl>>> {
    // using
    // reader = init()

    // is two statements
    if p.input_mut().has_linebreak_between_cur_and_peeked() {
        return Ok(None);
    }

    if !p.peek_is_ident_ref() {
        return Ok(None);
    }

    p.assert_and_bump(&P::Token::USING);

    let mut decls = Vec::new();
    loop {
        // Handle
        //      var a,;
        //
        // NewLine is ok
        if p.input().is(&P::Token::SEMI) {
            let span = p.input().prev_span();
            p.emit_err(span, SyntaxError::TS1009);
            break;
        }

        decls.push(parse_var_declarator(p, false, VarDeclKind::Var)?);
        if !p.input_mut().eat(&P::Token::COMMA) {
            break;
        }
    }

    if !p.syntax().explicit_resource_management() {
        p.emit_err(p.span(start), SyntaxError::UsingDeclNotEnabled);
    }

    if !p.ctx().contains(Context::AllowUsingDecl) {
        p.emit_err(p.span(start), SyntaxError::UsingDeclNotAllowed);
    }

    for decl in &decls {
        match decl.name {
            Pat::Ident(..) => {}
            _ => {
                p.emit_err(p.span(start), SyntaxError::InvalidNameInUsingDecl);
            }
        }

        if decl.init.is_none() {
            p.emit_err(p.span(start), SyntaxError::InitRequiredForUsingDecl);
        }
    }

    p.expect_general_semi()?;

    Ok(Some(Box::new(UsingDecl {
        span: p.span(start),
        is_await,
        decls,
    })))
}

pub fn parse_for_head<'a, P: Parser<'a>>(p: &mut P) -> PResult<TempForHead> {
    // let strict = p.ctx().contains(Context::Strict);

    let cur = p.input().cur();
    if cur.is_const()
        || cur.is_var()
        || (p.input().is(&P::Token::LET) && peek!(p).map_or(false, |v| v.follows_keyword_let()))
    {
        let decl = parse_var_stmt(p, true)?;

        let cur = p.input().cur();
        if cur.is_of() || cur.is_in() {
            if decl.decls.len() != 1 {
                for d in decl.decls.iter().skip(1) {
                    p.emit_err(d.name.span(), SyntaxError::TooManyVarInForInHead);
                }
            } else {
                if (p.ctx().contains(Context::Strict) || p.input().is(&P::Token::OF))
                    && decl.decls[0].init.is_some()
                {
                    p.emit_err(
                        decl.decls[0].name.span(),
                        SyntaxError::VarInitializerInForInHead,
                    );
                }

                if p.syntax().typescript() {
                    let type_ann = match decl.decls[0].name {
                        Pat::Ident(ref v) => Some(&v.type_ann),
                        Pat::Array(ref v) => Some(&v.type_ann),
                        Pat::Rest(ref v) => Some(&v.type_ann),
                        Pat::Object(ref v) => Some(&v.type_ann),
                        _ => None,
                    };

                    if let Some(type_ann) = type_ann {
                        if type_ann.is_some() {
                            p.emit_err(decl.decls[0].name.span(), SyntaxError::TS2483);
                        }
                    }
                }
            }

            return parse_for_each_head(p, ForHead::VarDecl(decl));
        }

        expect!(p, &P::Token::SEMI);
        return parse_normal_for_head(p, Some(VarDeclOrExpr::VarDecl(decl)));
    }

    if p.input_mut().eat(&P::Token::SEMI) {
        return parse_normal_for_head(p, None);
    }

    let start = p.cur_pos();
    let init = p.disallow_in_expr(parse_for_head_prefix)?;

    let mut is_using_decl = false;
    let mut is_await_using_decl = false;

    if p.input().syntax().explicit_resource_management() {
        // using foo
        let mut maybe_using_decl = init.is_ident_ref_to("using");
        let mut maybe_await_using_decl = false;

        // await using foo
        if !maybe_using_decl
            && init
                .as_await_expr()
                .filter(|e| e.arg.is_ident_ref_to("using"))
                .is_some()
        {
            maybe_using_decl = true;
            maybe_await_using_decl = true;
        }

        if maybe_using_decl
            && !p.input().is(&P::Token::OF)
            && (peek!(p).is_some_and(|peek| peek.is_of() || peek.is_in()))
        {
            is_using_decl = maybe_using_decl;
            is_await_using_decl = maybe_await_using_decl;
        }
    }

    if is_using_decl {
        let name = parse_binding_ident(p, false)?;
        let decl = VarDeclarator {
            name: name.into(),
            span: p.span(start),
            init: None,
            definite: false,
        };

        let pat = Box::new(UsingDecl {
            span: p.span(start),
            is_await: is_await_using_decl,
            decls: vec![decl],
        });

        let cur = p.input().cur();
        if cur.is_error() {
            let err = p.input_mut().expect_error_token_and_bump();
            return Err(err);
        } else if cur.is_eof() {
            return Err(eof_error(p));
        }

        return parse_for_each_head(p, ForHead::UsingDecl(pat));
    }

    // for (a of b)
    let cur = p.input().cur();
    if cur.is_of() || cur.is_in() {
        let is_in = p.input().is(&P::Token::IN);

        let pat = reparse_expr_as_pat(p, PatType::AssignPat, init)?;

        // for ({} in foo) is invalid
        if p.input().syntax().typescript() && is_in {
            match pat {
                Pat::Ident(..) => {}
                Pat::Expr(..) => {}
                ref v => p.emit_err(v.span(), SyntaxError::TS2491),
            }
        }

        return parse_for_each_head(p, ForHead::Pat(Box::new(pat)));
    }

    expect!(p, &P::Token::SEMI);

    let init = p.verify_expr(init)?;
    parse_normal_for_head(p, Some(VarDeclOrExpr::Expr(init)))
}

fn parse_for_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::FOR);
    let await_start = p.cur_pos();
    let await_token = if p.input_mut().eat(&P::Token::AWAIT) {
        Some(p.span(await_start))
    } else {
        None
    };
    expect!(p, &P::Token::LPAREN);

    let head = p.do_inside_of_context(Context::ForLoopInit, |p| {
        if await_token.is_some() {
            p.do_inside_of_context(Context::ForAwaitLoopInit, parse_for_head)
        } else {
            p.do_outside_of_context(Context::ForAwaitLoopInit, parse_for_head)
        }
    })?;

    expect!(p, &P::Token::RPAREN);

    let body = p
        .do_inside_of_context(
            Context::IsBreakAllowed.union(Context::IsContinueAllowed),
            |p| p.do_outside_of_context(Context::TopLevel, parse_stmt),
        )
        .map(Box::new)?;

    let span = p.span(start);
    Ok(match head {
        TempForHead::For { init, test, update } => {
            if let Some(await_token) = await_token {
                syntax_error!(p, await_token, SyntaxError::AwaitForStmt);
            }

            ForStmt {
                span,
                init,
                test,
                update,
                body,
            }
            .into()
        }
        TempForHead::ForIn { left, right } => {
            if let Some(await_token) = await_token {
                syntax_error!(p, await_token, SyntaxError::AwaitForStmt);
            }

            ForInStmt {
                span,
                left,
                right,
                body,
            }
            .into()
        }
        TempForHead::ForOf { left, right } => ForOfStmt {
            span,
            is_await: await_token.is_some(),
            left,
            right,
            body,
        }
        .into(),
    })
}

pub fn parse_stmt<'a>(p: &mut impl Parser<'a>) -> PResult<Stmt> {
    trace_cur!(p, parse_stmt);
    parse_stmt_like(p, false, handle_import_export)
}

/// Utility function used to parse large if else statements iteratively.
///
/// THis function is recursive, but it is very cheap so stack overflow will
/// not occur.
fn adjust_if_else_clause<'a, P: Parser<'a>>(p: &mut P, cur: &mut IfStmt, alt: Box<Stmt>) {
    cur.span = p.span(cur.span.lo);

    if let Some(Stmt::If(prev_alt)) = cur.alt.as_deref_mut() {
        adjust_if_else_clause(p, prev_alt, alt)
    } else {
        debug_assert_eq!(cur.alt, None);
        cur.alt = Some(alt);
    }
}

fn parse_if_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<IfStmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::IF);
    let if_token = p.input().prev_span();

    expect!(p, &P::Token::LPAREN);

    let test = p
        .do_outside_of_context(Context::IgnoreElseClause, |p| {
            p.allow_in_expr(|p| p.parse_expr())
        })
        .map_err(|err| {
            Error::new(
                err.span(),
                SyntaxError::WithLabel {
                    inner: Box::new(err),
                    span: if_token,
                    note: "Tried to parse the condition for an if statement",
                },
            )
        })?;

    expect!(p, &P::Token::RPAREN);

    let cons = {
        // Prevent stack overflow
        crate::maybe_grow(256 * 1024, 1024 * 1024, || {
            // // Annex B
            // if !p.ctx().contains(Context::Strict) && p.input().is(&P::Token::FUNCTION) {
            //     // TODO: report error?
            // }
            p.do_outside_of_context(
                Context::IgnoreElseClause.union(Context::TopLevel),
                parse_stmt,
            )
            .map(Box::new)
        })?
    };

    // We parse `else` branch iteratively, to avoid stack overflow
    // See https://github.com/swc-project/swc/pull/3961

    let alt = if p.ctx().contains(Context::IgnoreElseClause) {
        None
    } else {
        let mut cur = None;

        let last = loop {
            if !p.input_mut().eat(&P::Token::ELSE) {
                break None;
            }

            if !p.input().is(&P::Token::IF) {
                // As we eat `else` above, we need to parse statement once.
                let last = p.do_outside_of_context(
                    Context::IgnoreElseClause.union(Context::TopLevel),
                    parse_stmt,
                )?;
                break Some(last);
            }

            // We encountered `else if`

            let alt = p.do_inside_of_context(Context::IgnoreElseClause, parse_if_stmt)?;

            match &mut cur {
                Some(cur) => {
                    adjust_if_else_clause(p, cur, Box::new(alt.into()));
                }
                _ => {
                    cur = Some(alt);
                }
            }
        };

        match cur {
            Some(mut cur) => {
                if let Some(last) = last {
                    adjust_if_else_clause(p, &mut cur, Box::new(last));
                }
                Some(cur.into())
            }
            _ => last,
        }
    }
    .map(Box::new);

    let span = p.span(start);
    Ok(IfStmt {
        span,
        test,
        cons,
        alt,
    })
}

fn parse_throw_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::THROW);

    if p.input().had_line_break_before_cur() {
        // TODO: Suggest throw arg;
        syntax_error!(p, SyntaxError::LineBreakInThrow);
    }

    let arg = p.allow_in_expr(|p| p.parse_expr())?;
    p.expect_general_semi()?;

    let span = p.span(start);
    Ok(ThrowStmt { span, arg }.into())
}

fn parse_with_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    if p.syntax().typescript() {
        let span = p.input().cur_span();
        p.emit_err(span, SyntaxError::TS2410);
    }

    {
        let span = p.input().cur_span();
        p.emit_strict_mode_err(span, SyntaxError::WithInStrict);
    }

    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::WITH);

    expect!(p, &P::Token::LPAREN);
    let obj = p.allow_in_expr(|p| p.parse_expr())?;
    expect!(p, &P::Token::RPAREN);

    let body = p
        .do_inside_of_context(Context::InFunction, |p| {
            p.do_outside_of_context(Context::TopLevel, parse_stmt)
        })
        .map(Box::new)?;

    let span = p.span(start);
    Ok(WithStmt { span, obj, body }.into())
}

fn parse_while_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::WHILE);

    expect!(p, &P::Token::LPAREN);
    let test = p.allow_in_expr(|p| p.parse_expr())?;
    expect!(p, &P::Token::RPAREN);

    let body = p
        .do_inside_of_context(
            Context::IsBreakAllowed.union(Context::IsContinueAllowed),
            |p| p.do_outside_of_context(Context::TopLevel, parse_stmt),
        )
        .map(Box::new)?;

    let span = p.span(start);
    Ok(WhileStmt { span, test, body }.into())
}

/// It's optional since es2019
fn parse_catch_param<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<Pat>> {
    if p.input_mut().eat(&P::Token::LPAREN) {
        let mut pat = parse_binding_pat_or_ident(p, false)?;

        let type_ann_start = p.cur_pos();

        if p.syntax().typescript() && p.input_mut().eat(&P::Token::COLON) {
            let ty = p.do_inside_of_context(Context::InType, parse_ts_type)?;
            // p.emit_err(ty.span(), SyntaxError::TS1196);

            match &mut pat {
                Pat::Ident(BindingIdent { type_ann, .. })
                | Pat::Array(ArrayPat { type_ann, .. })
                | Pat::Rest(RestPat { type_ann, .. })
                | Pat::Object(ObjectPat { type_ann, .. }) => {
                    *type_ann = Some(Box::new(TsTypeAnn {
                        span: p.span(type_ann_start),
                        type_ann: ty,
                    }));
                }
                Pat::Assign(..) => {}
                Pat::Invalid(_) => {}
                Pat::Expr(_) => {}
                #[cfg(swc_ast_unknown)]
                _ => {}
            }
        }
        expect!(p, &P::Token::RPAREN);
        Ok(Some(pat))
    } else {
        Ok(None)
    }
}

fn parse_do_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::DO);

    let body = p
        .do_inside_of_context(
            Context::IsBreakAllowed.union(Context::IsContinueAllowed),
            |p| p.do_outside_of_context(Context::TopLevel, parse_stmt),
        )
        .map(Box::new)?;

    expect!(p, &P::Token::WHILE);
    expect!(p, &P::Token::LPAREN);

    let test = p.allow_in_expr(|p| p.parse_expr())?;

    expect!(p, &P::Token::RPAREN);

    // We *may* eat semicolon.
    let _ = p.eat_general_semi();

    let span = p.span(start);

    Ok(DoWhileStmt { span, test, body }.into())
}

fn parse_labelled_stmt<'a, P: Parser<'a>>(p: &mut P, l: Ident) -> PResult<Stmt> {
    p.do_inside_of_context(Context::IsBreakAllowed, |p| {
        p.do_outside_of_context(Context::AllowUsingDecl, |p| {
            let start = l.span.lo();

            let mut errors = Vec::new();
            for lb in &p.state().labels {
                if l.sym == *lb {
                    errors.push(Error::new(
                        l.span,
                        SyntaxError::DuplicateLabel(l.sym.clone()),
                    ));
                }
            }
            p.state_mut().labels.push(l.sym.clone());

            let body = Box::new(if p.input().is(&P::Token::FUNCTION) {
                let f = parse_fn_decl(p, Vec::new())?;
                if let Decl::Fn(FnDecl { function, .. }) = &f {
                    if p.ctx().contains(Context::Strict) {
                        p.emit_err(function.span, SyntaxError::LabelledFunctionInStrict)
                    }
                    if function.is_generator || function.is_async {
                        p.emit_err(function.span, SyntaxError::LabelledGeneratorOrAsync)
                    }
                }

                f.into()
            } else {
                p.do_outside_of_context(Context::TopLevel, parse_stmt)?
            });

            for err in errors {
                p.emit_error(err);
            }

            {
                let pos = p.state().labels.iter().position(|v| v == &l.sym);
                if let Some(pos) = pos {
                    p.state_mut().labels.remove(pos);
                }
            }

            Ok(LabeledStmt {
                span: p.span(start),
                label: l,
                body,
            }
            .into())
        })
    })
}

pub fn parse_block<'a, P: Parser<'a>>(p: &mut P, allow_directives: bool) -> PResult<BlockStmt> {
    let start = p.cur_pos();

    expect!(p, &P::Token::LBRACE);

    let stmts = p.do_outside_of_context(Context::TopLevel, |p| {
        parse_stmt_block_body(p, allow_directives, Some(&P::Token::RBRACE))
    })?;

    let span = p.span(start);
    Ok(BlockStmt {
        span,
        stmts,
        ctxt: Default::default(),
    })
}

fn parse_finally_block<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<BlockStmt>> {
    Ok(if p.input_mut().eat(&P::Token::FINALLY) {
        parse_block(p, false).map(Some)?
    } else {
        None
    })
}

fn parse_catch_clause<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<CatchClause>> {
    let start = p.cur_pos();
    Ok(if p.input_mut().eat(&P::Token::CATCH) {
        let param = parse_catch_param(p)?;
        parse_block(p, false)
            .map(|body| CatchClause {
                span: p.span(start),
                param,
                body,
            })
            .map(Some)?
    } else {
        None
    })
}

fn parse_try_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();
    p.assert_and_bump(&P::Token::TRY);

    let block = parse_block(p, false)?;

    let catch_start = p.cur_pos();
    let handler = parse_catch_clause(p)?;
    let finalizer = parse_finally_block(p)?;

    if handler.is_none() && finalizer.is_none() {
        p.emit_err(
            Span::new_with_checked(catch_start, catch_start),
            SyntaxError::TS1005,
        );
    }

    let span = p.span(start);
    Ok(TryStmt {
        span,
        block,
        handler,
        finalizer,
    }
    .into())
}

fn parse_switch_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let switch_start = p.cur_pos();

    p.assert_and_bump(&P::Token::SWITCH);

    expect!(p, &P::Token::LPAREN);
    let discriminant = p.allow_in_expr(|p| p.parse_expr())?;
    expect!(p, &P::Token::RPAREN);

    let mut cases = Vec::new();
    let mut span_of_previous_default = None;

    expect!(p, &P::Token::LBRACE);

    p.do_inside_of_context(Context::IsBreakAllowed, |p| {
        while {
            let cur = p.input().cur();
            cur.is_case() || cur.is_default()
        } {
            let mut cons = Vec::new();
            let is_case = p.input().is(&P::Token::CASE);
            let case_start = p.cur_pos();
            p.bump();
            let test = if is_case {
                p.allow_in_expr(|p| p.parse_expr()).map(Some)?
            } else {
                if let Some(previous) = span_of_previous_default {
                    syntax_error!(p, SyntaxError::MultipleDefault { previous });
                }
                span_of_previous_default = Some(p.span(case_start));

                None
            };
            expect!(p, &P::Token::COLON);

            while {
                let cur = p.input().cur();
                !(cur.is_case() || cur.is_default() || cur.is_rbrace())
            } {
                cons.push(p.do_outside_of_context(Context::TopLevel, parse_stmt_list_item)?);
            }

            cases.push(SwitchCase {
                span: Span::new_with_checked(case_start, p.input().prev_span().hi),
                test,
                cons,
            });
        }

        Ok(())
    })?;

    // eof or rbrace
    expect!(p, &P::Token::RBRACE);

    Ok(SwitchStmt {
        span: p.span(switch_start),
        discriminant,
        cases,
    }
    .into())
}

/// Parse a statement and maybe a declaration.
pub fn parse_stmt_list_item<'a>(p: &mut impl Parser<'a>) -> PResult<Stmt> {
    trace_cur!(p, parse_stmt_list_item);
    parse_stmt_like(p, true, handle_import_export)
}

/// Parse a statement, declaration or module item.
pub fn parse_stmt_like<'a, P: Parser<'a>, Type: IsDirective + From<Stmt>>(
    p: &mut P,
    include_decl: bool,
    handle_import_export: impl Fn(&mut P, Vec<Decorator>) -> PResult<Type>,
) -> PResult<Type> {
    trace_cur!(p, parse_stmt_like);

    debug_tracing!(p, "parse_stmt_like");

    let start = p.cur_pos();
    let decorators = if p.input().get_cur().token() == &P::Token::AT {
        parse_decorators(p, true)?
    } else {
        vec![]
    };

    let cur = p.input().cur();
    if cur.is_import() || cur.is_export() {
        return handle_import_export(p, decorators);
    }

    p.do_outside_of_context(Context::WillExpectColonForCond, |p| {
        p.do_inside_of_context(Context::AllowUsingDecl, |p| {
            parse_stmt_internal(p, start, include_decl, decorators)
        })
    })
    .map(From::from)
}

fn handle_import_export<'a, P: Parser<'a>>(p: &mut P, _: Vec<Decorator>) -> PResult<Stmt> {
    let start = p.cur_pos();
    if p.input().is(&P::Token::IMPORT) && peek!(p).is_some_and(|peek| peek.is_lparen()) {
        let expr = p.parse_expr()?;

        p.eat_general_semi();

        return Ok(ExprStmt {
            span: p.span(start),
            expr,
        }
        .into());
    }

    if p.input().is(&P::Token::IMPORT) && peek!(p).is_some_and(|peek| peek.is_dot()) {
        let expr = p.parse_expr()?;

        p.eat_general_semi();

        return Ok(ExprStmt {
            span: p.span(start),
            expr,
        }
        .into());
    }

    syntax_error!(p, SyntaxError::ImportExportInScript);
}

/// `parseStatementContent`
fn parse_stmt_internal<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    include_decl: bool,
    decorators: Vec<Decorator>,
) -> PResult<Stmt> {
    trace_cur!(p, parse_stmt_internal);

    let is_typescript = p.input().syntax().typescript();

    if is_typescript
        && p.input().is(&P::Token::CONST)
        && peek!(p).is_some_and(|peek| peek.is_enum())
    {
        p.assert_and_bump(&P::Token::CONST);
        p.assert_and_bump(&P::Token::ENUM);
        return parse_ts_enum_decl(p, start, true)
            .map(Decl::from)
            .map(Stmt::from);
    }

    let top_level = p.ctx().contains(Context::TopLevel);

    let cur = p.input().cur().clone();

    if cur.is_await() && (include_decl || top_level) {
        if top_level {
            p.mark_found_module_item();
            if !p.ctx().contains(Context::CanBeModule) {
                p.emit_err(p.input().cur_span(), SyntaxError::TopLevelAwaitInScript);
            }
        }

        if peek!(p).is_some_and(|peek| peek.is_using()) {
            let eaten_await = Some(p.input().cur_pos());
            p.assert_and_bump(&P::Token::AWAIT);
            let v = parse_using_decl(p, start, true)?;
            if let Some(v) = v {
                return Ok(v.into());
            }

            let expr = parse_await_expr(p, eaten_await)?;
            let expr = p.allow_in_expr(|p| parse_bin_op_recursively(p, expr, 0))?;
            p.eat_general_semi();

            let span = p.span(start);
            return Ok(ExprStmt { span, expr }.into());
        }
    } else if cur.is_break() || cur.is_continue() {
        let is_break = p.input().is(&P::Token::BREAK);
        p.bump();
        let label = if p.eat_general_semi() {
            None
        } else {
            let i = parse_label_ident(p).map(Some)?;
            p.expect_general_semi()?;
            i
        };
        let span = p.span(start);
        if is_break {
            if label.is_some() && !p.state().labels.contains(&label.as_ref().unwrap().sym) {
                p.emit_err(span, SyntaxError::TS1116);
            } else if !p.ctx().contains(Context::IsBreakAllowed) {
                p.emit_err(span, SyntaxError::TS1105);
            }
        } else if !p.ctx().contains(Context::IsContinueAllowed) {
            p.emit_err(span, SyntaxError::TS1115);
        } else if label.is_some() && !p.state().labels.contains(&label.as_ref().unwrap().sym) {
            p.emit_err(span, SyntaxError::TS1107);
        }
        return Ok(if is_break {
            BreakStmt { span, label }.into()
        } else {
            ContinueStmt { span, label }.into()
        });
    } else if cur.is_debugger() {
        p.bump();
        p.expect_general_semi()?;
        return Ok(DebuggerStmt {
            span: p.span(start),
        }
        .into());
    } else if cur.is_do() {
        return parse_do_stmt(p);
    } else if cur.is_for() {
        return parse_for_stmt(p);
    } else if cur.is_function() {
        if !include_decl {
            p.emit_err(p.input().cur_span(), SyntaxError::DeclNotAllowed);
        }
        return parse_fn_decl(p, decorators).map(Stmt::from);
    } else if cur.is_class() {
        if !include_decl {
            p.emit_err(p.input().cur_span(), SyntaxError::DeclNotAllowed);
        }
        return parse_class_decl(p, start, start, decorators, false).map(Stmt::from);
    } else if cur.is_if() {
        return parse_if_stmt(p).map(Stmt::If);
    } else if cur.is_return() {
        return parse_return_stmt(p);
    } else if cur.is_switch() {
        return parse_switch_stmt(p);
    } else if cur.is_throw() {
        return parse_throw_stmt(p);
    } else if cur.is_catch() {
        // Error recovery
        let span = p.input().cur_span();
        p.emit_err(span, SyntaxError::TS1005);

        let _ = parse_catch_clause(p);
        let _ = parse_finally_block(p);

        return Ok(ExprStmt {
            span,
            expr: Invalid { span }.into(),
        }
        .into());
    } else if cur.is_finally() {
        // Error recovery
        let span = p.input().cur_span();
        p.emit_err(span, SyntaxError::TS1005);

        let _ = parse_finally_block(p);

        return Ok(ExprStmt {
            span,
            expr: Invalid { span }.into(),
        }
        .into());
    } else if cur.is_try() {
        return parse_try_stmt(p);
    } else if cur.is_with() {
        return parse_with_stmt(p);
    } else if cur.is_while() {
        return parse_while_stmt(p);
    } else if cur.is_var() || (cur.is_const() && include_decl) {
        let v = parse_var_stmt(p, false)?;
        return Ok(v.into());
    } else if cur.is_let() && include_decl {
        // 'let' can start an identifier reference.
        let is_keyword = match peek!(p) {
            Some(t) => t.follows_keyword_let(),
            _ => false,
        };

        if is_keyword {
            let v = parse_var_stmt(p, false)?;
            return Ok(v.into());
        }
    } else if cur.is_using() && include_decl {
        let v = parse_using_decl(p, start, false)?;
        if let Some(v) = v {
            return Ok(v.into());
        }
    } else if cur.is_interface()
        && is_typescript
        && peek!(p).is_some_and(|peek| peek.is_word())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        let start = p.input().cur_pos();
        p.bump();
        return Ok(parse_ts_interface_decl(p, start)?.into());
    } else if cur.is_type()
        && is_typescript
        && peek!(p).is_some_and(|peek| peek.is_word())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        let start = p.input().cur_pos();
        p.bump();
        return Ok(parse_ts_type_alias_decl(p, start)?.into());
    } else if cur.is_enum()
        && is_typescript
        && peek!(p).is_some_and(|peek| peek.is_word())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        let start = p.input().cur_pos();
        p.bump();
        return Ok(parse_ts_enum_decl(p, start, false)?.into());
    } else if cur.is_lbrace() {
        return p
            .do_inside_of_context(Context::AllowUsingDecl, |p| parse_block(p, false))
            .map(Stmt::Block);
    } else if cur.is_semi() {
        p.bump();
        return Ok(EmptyStmt {
            span: p.span(start),
        }
        .into());
    }

    // Handle async function foo() {}
    if p.input().is(&P::Token::ASYNC)
        && peek!(p).is_some_and(|peek| peek.is_function())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        return parse_async_fn_decl(p, decorators).map(From::from);
    }

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    let expr = p.allow_in_expr(|p| p.parse_expr())?;

    let expr = match *expr {
        Expr::Ident(ident) => {
            if p.input_mut().eat(&P::Token::COLON) {
                return parse_labelled_stmt(p, ident);
            }
            ident.into()
        }
        _ => p.verify_expr(expr)?,
    };
    if let Expr::Ident(ref ident) = *expr {
        if &*ident.sym == "interface" && p.input().had_line_break_before_cur() {
            p.emit_strict_mode_err(
                ident.span,
                SyntaxError::InvalidIdentInStrict(ident.sym.clone()),
            );

            p.eat_general_semi();

            return Ok(ExprStmt {
                span: p.span(start),
                expr,
            }
            .into());
        }

        if p.input().syntax().typescript() {
            if let Some(decl) = parse_ts_expr_stmt(p, decorators, ident.clone())? {
                return Ok(decl.into());
            }
        }
    }

    if p.syntax().typescript() {
        if let Expr::Ident(ref i) = *expr {
            match &*i.sym {
                "public" | "static" | "abstract" => {
                    if p.input_mut().eat(&P::Token::INTERFACE) {
                        p.emit_err(i.span, SyntaxError::TS2427);
                        return parse_ts_interface_decl(p, start)
                            .map(Decl::from)
                            .map(Stmt::from);
                    }
                }
                _ => {}
            }
        }
    }

    if p.eat_general_semi() {
        Ok(ExprStmt {
            span: p.span(start),
            expr,
        }
        .into())
    } else {
        let cur = p.input().cur();
        if cur.is_bin_op() {
            p.emit_err(p.input().cur_span(), SyntaxError::TS1005);
            let expr = parse_bin_op_recursively(p, expr, 0)?;
            return Ok(ExprStmt {
                span: p.span(start),
                expr,
            }
            .into());
        }

        syntax_error!(
            p,
            SyntaxError::ExpectedSemiForExprStmt { expr: expr.span() }
        );
    }
}

pub fn parse_stmt_block_body<'a, P: Parser<'a>>(
    p: &mut P,
    allow_directives: bool,
    end: Option<&P::Token>,
) -> PResult<Vec<Stmt>> {
    parse_block_body(p, allow_directives, end, handle_import_export)
}

pub(super) fn parse_block_body<'a, P: Parser<'a>, Type: IsDirective + From<Stmt>>(
    p: &mut P,
    allow_directives: bool,
    end: Option<&P::Token>,
    handle_import_export: impl Fn(&mut P, Vec<Decorator>) -> PResult<Type>,
) -> PResult<Vec<Type>> {
    trace_cur!(p, parse_block_body);

    let mut stmts = Vec::with_capacity(8);

    let has_strict_directive = allow_directives
        && (p
            .input()
            .cur()
            .is_str_raw_content("\"use strict\"", p.input())
            || p.input()
                .cur()
                .is_str_raw_content("'use strict'", p.input()));

    let parse_stmts = |p: &mut P, stmts: &mut Vec<Type>| -> PResult<()> {
        let is_stmt_start = |p: &mut P| {
            let cur = p.input().cur();
            match end {
                Some(end) => {
                    if cur.is_eof() {
                        let eof_text = p.input_mut().dump_cur();
                        p.emit_err(
                            p.input().cur_span(),
                            SyntaxError::Expected(format!("{end:?}"), eof_text),
                        );
                        false
                    } else {
                        cur != end
                    }
                }
                None => !cur.is_eof(),
            }
        };
        while is_stmt_start(p) {
            let stmt = parse_stmt_like(p, true, &handle_import_export)?;
            stmts.push(stmt);
        }
        Ok(())
    };

    if has_strict_directive {
        p.do_inside_of_context(Context::Strict, |p| parse_stmts(p, &mut stmts))?;
    } else {
        parse_stmts(p, &mut stmts)?;
    };

    if !p.input().cur().is_eof() && end.is_some() {
        p.bump();
    }

    Ok(stmts)
}
