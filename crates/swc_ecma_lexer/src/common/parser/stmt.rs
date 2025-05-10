use std::ops::DerefMut;

use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    buffer::Buffer,
    expr::parse_assignment_expr,
    pat::parse_binding_pat_or_ident,
    typescript::{try_parse_ts_type_ann, ts_look_ahead},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            expr::parse_for_head_prefix, ident::parse_binding_ident, pat::reparse_expr_as_pat,
            pat_type::PatType, typescript::parse_ts_type,
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
        let test = p.include_in_expr(true).parse_expr().map(Some)?;
        p.input_mut().eat(&P::Token::SEMI);
        test
    };

    let update = if p.input_mut().is(&P::Token::RPAREN) {
        None
    } else {
        p.include_in_expr(true).parse_expr().map(Some)?
    };

    Ok(TempForHead::For { init, test, update })
}

fn parse_for_each_head<'a, P: Parser<'a>>(p: &mut P, left: ForHead) -> PResult<TempForHead> {
    let is_of = p.bump().is_of();
    if is_of {
        let right = parse_assignment_expr(p.include_in_expr(true).deref_mut())?;
        Ok(TempForHead::ForOf { left, right })
    } else {
        if let ForHead::UsingDecl(d) = &left {
            p.emit_err(d.span, SyntaxError::UsingDeclNotAllowedForForInLoop)
        }
        let right = p.include_in_expr(true).parse_expr()?;
        Ok(TempForHead::ForIn { left, right })
    }
}

pub fn parse_return_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    let stmt = p.parse_with(|p| {
        p.assert_and_bump(&P::Token::RETURN)?;

        let arg = if p.is_general_semi() {
            None
        } else {
            p.include_in_expr(true).parse_expr().map(Some)?
        };
        p.expect_general_semi()?;
        Ok(ReturnStmt {
            span: p.span(start),
            arg,
        }
        .into())
    });

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
    if p.input().syntax().typescript() && p.input_mut().is(&P::Token::COLON) {
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
    let init = if !for_loop
        || !p
            .input_mut()
            .cur()
            .is_some_and(|cur| cur.is_in() || cur.is_of())
    {
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
    let t = p.bump();
    let kind = if t.is_const() {
        VarDeclKind::Const
    } else if t.is_let() {
        VarDeclKind::Let
    } else if t.is_var() {
        VarDeclKind::Var
    } else {
        unreachable!()
    };
    let var_span = p.span(start);
    let should_include_in = kind != VarDeclKind::Var || !for_loop;

    if p.syntax().typescript() && for_loop {
        let res = if p
            .input_mut()
            .cur()
            .is_some_and(|cur| cur.is_in() || cur.is_of())
        {
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
                let span = Span::new(pos, pos);
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
        let ctx = if should_include_in {
            p.ctx() | Context::IncludeInExpr
        } else {
            p.ctx()
        };

        // Handle
        //      var a,;
        //
        // NewLine is ok
        if p.input_mut().is(&P::Token::SEMI) || eof!(p) {
            let prev_span = p.input().prev_span();
            let span = if prev_span == var_span {
                Span::new(prev_span.hi, prev_span.hi)
            } else {
                prev_span
            };
            p.emit_err(span, SyntaxError::TS1009);
            break;
        }

        decls.push(parse_var_declarator(
            p.with_ctx(ctx).deref_mut(),
            for_loop,
            kind,
        )?);

        if !p.input_mut().eat(&P::Token::COMMA) {
            break;
        }
    }

    if !for_loop && !p.eat_general_semi() {
        p.emit_err(p.input().cur_span(), SyntaxError::TS1005);

        let _ = p.parse_expr();

        while !p.eat_general_semi() {
            p.bump();

            if p.input_mut().cur().is_some_and(|cur| cur.is_error()) {
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
    let _ = cur!(p, false);
    if p.input_mut().has_linebreak_between_cur_and_peeked() {
        return Ok(None);
    }

    if !p.peek_is_ident_ref() {
        return Ok(None);
    }

    p.assert_and_bump(&P::Token::USING)?;

    let mut decls = Vec::new();
    loop {
        // Handle
        //      var a,;
        //
        // NewLine is ok
        if p.input_mut().is(&P::Token::SEMI) || eof!(p) {
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

    if p.input_mut()
        .cur()
        .is_some_and(|cur| cur.is_const() || cur.is_var())
        || (p.input_mut().is(&P::Token::LET) && peek!(p).map_or(false, |v| v.follows_keyword_let()))
    {
        let decl = parse_var_stmt(p, true)?;

        if p.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_of() || cur.is_in())
        {
            if decl.decls.len() != 1 {
                for d in decl.decls.iter().skip(1) {
                    p.emit_err(d.name.span(), SyntaxError::TooManyVarInForInHead);
                }
            } else {
                if (p.ctx().contains(Context::Strict) || p.input_mut().is(&P::Token::OF))
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
    let init = parse_for_head_prefix(p.include_in_expr(false).deref_mut())?;

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
            && !p.input_mut().is(&P::Token::OF)
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

        cur!(p, true);

        return parse_for_each_head(p, ForHead::UsingDecl(pat));
    }

    // for (a of b)
    if p.input_mut()
        .cur()
        .is_some_and(|cur| cur.is_of() || cur.is_in())
    {
        let is_in = p.input_mut().is(&P::Token::IN);

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

pub fn parse_for_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::FOR)?;
    let await_start = p.cur_pos();
    let await_token = if p.input_mut().eat(&P::Token::AWAIT) {
        Some(p.span(await_start))
    } else {
        None
    };
    expect!(p, &P::Token::LPAREN);

    let mut ctx = p.ctx() | Context::ForLoopInit;
    ctx.set(Context::ForAwaitLoopInit, await_token.is_some());

    let head = parse_for_head(p.with_ctx(ctx).deref_mut())?;
    expect!(p, &P::Token::RPAREN);
    let ctx = (p.ctx() | Context::IsBreakAllowed | Context::IsContinueAllowed) & !Context::TopLevel;
    let body = p.with_ctx(ctx).parse_stmt().map(Box::new)?;

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

pub fn parse_if_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<IfStmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::IF)?;
    let if_token = p.input().prev_span();

    expect!(p, &P::Token::LPAREN);

    let test = p
        .with_ctx(p.ctx() & !Context::IgnoreElseClause)
        .include_in_expr(true)
        .parse_expr()
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
            // Annex B
            if !p.ctx().contains(Context::Strict) && p.input_mut().is(&P::Token::FUNCTION) {
                // TODO: report error?
            }
            p.with_ctx(p.ctx() & !Context::IgnoreElseClause & !Context::TopLevel)
                .parse_stmt()
                .map(Box::new)
        })?
    };

    // We parse `else` branch iteratively, to avoid stack overflow
    // See https://github.com/swc-project/swc/pull/3961

    let alt = if p.ctx().contains(Context::IgnoreElseClause) {
        None
    } else {
        let mut cur = None;

        let ctx = p.ctx() | Context::IgnoreElseClause;

        let last = loop {
            if !p.input_mut().eat(&P::Token::ELSE) {
                break None;
            }

            if !p.input_mut().is(&P::Token::IF) {
                let ctx = p.ctx() & !Context::IgnoreElseClause & !Context::TopLevel;

                // As we eat `else` above, we need to parse statement once.
                let last = p.with_ctx(ctx).parse_stmt()?;
                break Some(last);
            }

            // We encountered `else if`

            let alt = parse_if_stmt(p.with_ctx(ctx).deref_mut())?;

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

pub fn parse_throw_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::THROW)?;

    if p.input_mut().had_line_break_before_cur() {
        // TODO: Suggest throw arg;
        syntax_error!(p, SyntaxError::LineBreakInThrow);
    }

    let arg = p.include_in_expr(true).parse_expr()?;
    p.expect_general_semi()?;

    let span = p.span(start);
    Ok(ThrowStmt { span, arg }.into())
}

pub fn parse_with_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    if p.syntax().typescript() {
        let span = p.input().cur_span();
        p.emit_err(span, SyntaxError::TS2410);
    }

    {
        let span = p.input().cur_span();
        p.emit_strict_mode_err(span, SyntaxError::WithInStrict);
    }

    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::WITH)?;

    expect!(p, &P::Token::LPAREN);
    let obj = p.include_in_expr(true).parse_expr()?;
    expect!(p, &P::Token::RPAREN);

    let ctx = (p.ctx() | Context::InFunction) & !Context::TopLevel;
    let body = p.with_ctx(ctx).parse_stmt().map(Box::new)?;

    let span = p.span(start);
    Ok(WithStmt { span, obj, body }.into())
}

pub fn parse_while_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::WHILE)?;

    expect!(p, &P::Token::LPAREN);
    let test = p.include_in_expr(true).parse_expr()?;
    expect!(p, &P::Token::RPAREN);

    let ctx = (p.ctx() | Context::IsBreakAllowed | Context::IsContinueAllowed) & !Context::TopLevel;
    let body = p.with_ctx(ctx).parse_stmt().map(Box::new)?;

    let span = p.span(start);
    Ok(WhileStmt { span, test, body }.into())
}

/// It's optional since es2019
pub fn parse_catch_param<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<Pat>> {
    if p.input_mut().eat(&P::Token::LPAREN) {
        let mut pat = parse_binding_pat_or_ident(p, false)?;

        let type_ann_start = p.cur_pos();

        if p.syntax().typescript() && p.input_mut().eat(&P::Token::COLON) {
            let ctx = p.ctx() | Context::InType;

            let ty = parse_ts_type(p.with_ctx(ctx).deref_mut())?;
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
            }
        }
        expect!(p, &P::Token::RPAREN);
        Ok(Some(pat))
    } else {
        Ok(None)
    }
}

pub fn parse_do_stmt<'a, P: Parser<'a>>(p: &mut P) -> PResult<Stmt> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::DO)?;

    let ctx = (p.ctx() | Context::IsBreakAllowed | Context::IsContinueAllowed) & !Context::TopLevel;
    let body = p.with_ctx(ctx).parse_stmt().map(Box::new)?;
    expect!(p, &P::Token::WHILE);
    expect!(p, &P::Token::LPAREN);
    let test = p.include_in_expr(true).parse_expr()?;
    expect!(p, &P::Token::RPAREN);
    // We *may* eat semicolon.
    let _ = p.eat_general_semi();

    let span = p.span(start);

    Ok(DoWhileStmt { span, test, body }.into())
}
