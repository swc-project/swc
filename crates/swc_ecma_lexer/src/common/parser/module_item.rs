use swc_atoms::atom;
use swc_common::Span;
use swc_ecma_ast::*;

use super::{
    buffer::Buffer,
    class_and_fn::{parse_default_async_fn, parse_default_fn, parse_fn_decl},
    expr::parse_assignment_expr,
    ident::{parse_ident, parse_ident_name, parse_module_export_name},
    stmt::{parse_block_body, parse_stmt_like, parse_var_stmt},
    typescript::{parse_ts_import_equals_decl, try_parse_ts_declare, try_parse_ts_export_decl},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            class_and_fn::{
                parse_async_fn_decl, parse_class_decl, parse_decorators, parse_default_class,
            },
            eof_error,
            expr::parse_str_lit,
            ident::parse_binding_ident,
            object::parse_object_expr,
            typescript::{parse_ts_enum_decl, parse_ts_interface_decl},
        },
    },
    error::SyntaxError,
};

fn handle_import_export<'a, P: Parser<'a>>(
    p: &mut P,
    decorators: Vec<Decorator>,
) -> PResult<ModuleItem> {
    if !p
        .ctx()
        .intersects(Context::TopLevel.union(Context::TsModuleBlock))
    {
        syntax_error!(p, SyntaxError::NonTopLevelImportExport);
    }

    let decl = if p.input().is(&P::Token::IMPORT) {
        parse_import(p)?
    } else if p.input().is(&P::Token::EXPORT) {
        parse_export(p, decorators).map(ModuleItem::from)?
    } else {
        unreachable!(
            "handle_import_export should not be called if current token isn't import nor export"
        )
    };

    Ok(decl)
}

pub fn parse_module_item_block_body<'a, P: Parser<'a>>(
    p: &mut P,
    allow_directives: bool,
    end: Option<&P::Token>,
) -> PResult<Vec<ModuleItem>> {
    parse_block_body(p, allow_directives, end, handle_import_export)
}

/// Parses `from 'foo.js' with {};` or `from 'foo.js' assert {};`
fn parse_from_clause_and_semi<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<(Box<Str>, Option<Box<ObjectLit>>)> {
    expect!(p, &P::Token::FROM);

    let cur = p.input().cur();
    let src = if cur.is_str() {
        Box::new(parse_str_lit(p))
    } else {
        unexpected!(p, "a string literal")
    };
    let with = if p.input().syntax().import_attributes()
        && !p.input().had_line_break_before_cur()
        && (p.input_mut().eat(&P::Token::ASSERT) || p.input_mut().eat(&P::Token::WITH))
    {
        match parse_object_expr(p)? {
            Expr::Object(v) => Some(Box::new(v)),
            _ => unreachable!(),
        }
    } else {
        None
    };
    p.expect_general_semi()?;
    Ok((src, with))
}

fn parse_named_export_specifier<'a, P: Parser<'a>>(
    p: &mut P,
    type_only: bool,
) -> PResult<ExportNamedSpecifier> {
    let start = p.cur_pos();

    let mut is_type_only = false;

    let orig = match parse_module_export_name(p)? {
        ModuleExportName::Ident(orig_ident) => {
            // Handle:
            // `export { type xx }`
            // `export { type xx as yy }`
            // `export { type as }`
            // `export { type as as }`
            // `export { type as as as }`
            if p.syntax().typescript() && orig_ident.sym == "type" && p.input().cur().is_word() {
                let possibly_orig = parse_ident_name(p).map(Ident::from)?;
                if possibly_orig.sym == "as" {
                    // `export { type as }`
                    if !p.input().cur().is_word() {
                        if type_only {
                            p.emit_err(orig_ident.span, SyntaxError::TS2207);
                        }

                        return Ok(ExportNamedSpecifier {
                            span: p.span(start),
                            orig: ModuleExportName::Ident(possibly_orig),
                            exported: None,
                            is_type_only: true,
                        });
                    }

                    let maybe_as = parse_ident_name(p).map(Ident::from)?;
                    if maybe_as.sym == "as" {
                        if p.input().cur().is_word() {
                            // `export { type as as as }`
                            // `export { type as as foo }`
                            let exported = parse_ident_name(p).map(Ident::from)?;

                            if type_only {
                                p.emit_err(orig_ident.span, SyntaxError::TS2207);
                            }

                            debug_assert!(start <= orig_ident.span.hi());
                            return Ok(ExportNamedSpecifier {
                                span: Span::new_with_checked(start, orig_ident.span.hi()),
                                orig: ModuleExportName::Ident(possibly_orig),
                                exported: Some(ModuleExportName::Ident(exported)),
                                is_type_only: true,
                            });
                        } else {
                            // `export { type as as }`
                            return Ok(ExportNamedSpecifier {
                                span: Span::new_with_checked(start, orig_ident.span.hi()),
                                orig: ModuleExportName::Ident(orig_ident),
                                exported: Some(ModuleExportName::Ident(maybe_as)),
                                is_type_only: false,
                            });
                        }
                    } else {
                        // `export { type as xxx }`
                        return Ok(ExportNamedSpecifier {
                            span: Span::new_with_checked(start, orig_ident.span.hi()),
                            orig: ModuleExportName::Ident(orig_ident),
                            exported: Some(ModuleExportName::Ident(maybe_as)),
                            is_type_only: false,
                        });
                    }
                } else {
                    // `export { type xx }`
                    // `export { type xx as yy }`
                    if type_only {
                        p.emit_err(orig_ident.span, SyntaxError::TS2207);
                    }

                    is_type_only = true;
                    ModuleExportName::Ident(possibly_orig)
                }
            } else {
                ModuleExportName::Ident(orig_ident)
            }
        }
        module_export_name => module_export_name,
    };

    let exported = if p.input_mut().eat(&P::Token::AS) {
        Some(parse_module_export_name(p)?)
    } else {
        None
    };

    Ok(ExportNamedSpecifier {
        span: p.span(start),
        orig,
        exported,
        is_type_only,
    })
}

fn parse_imported_binding<'a>(p: &mut impl Parser<'a>) -> PResult<Ident> {
    Ok(
        p.do_outside_of_context(Context::InAsync.union(Context::InGenerator), |p| {
            parse_binding_ident(p, false)
        })?
        .into(),
    )
}

fn parse_imported_default_binding<'a>(p: &mut impl Parser<'a>) -> PResult<Ident> {
    parse_imported_binding(p)
}

/// Parse `foo`, `foo2 as bar` in `import { foo, foo2 as bar }`
fn parse_import_specifier<'a, P: Parser<'a>>(
    p: &mut P,
    type_only: bool,
) -> PResult<ImportSpecifier> {
    let start = p.cur_pos();
    match parse_module_export_name(p)? {
        ModuleExportName::Ident(mut orig_name) => {
            let mut is_type_only = false;
            // Handle:
            // `import { type xx } from 'mod'`
            // `import { type xx as yy } from 'mod'`
            // `import { type as } from 'mod'`
            // `import { type as as } from 'mod'`
            // `import { type as as as } from 'mod'`
            if p.syntax().typescript() && orig_name.sym == "type" && p.input().cur().is_word() {
                let possibly_orig_name = parse_ident_name(p).map(Ident::from)?;
                if possibly_orig_name.sym == "as" {
                    // `import { type as } from 'mod'`
                    if !p.input().cur().is_word() {
                        if p.ctx().is_reserved_word(&possibly_orig_name.sym) {
                            syntax_error!(
                                p,
                                possibly_orig_name.span,
                                SyntaxError::ReservedWordInImport
                            )
                        }

                        if type_only {
                            p.emit_err(orig_name.span, SyntaxError::TS2206);
                        }

                        return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                            span: p.span(start),
                            local: possibly_orig_name,
                            imported: None,
                            is_type_only: true,
                        }));
                    }

                    let maybe_as: Ident = parse_binding_ident(p, false)?.into();
                    if maybe_as.sym == "as" {
                        if p.input().cur().is_word() {
                            // `import { type as as as } from 'mod'`
                            // `import { type as as foo } from 'mod'`
                            let local: Ident = parse_binding_ident(p, false)?.into();

                            if type_only {
                                p.emit_err(orig_name.span, SyntaxError::TS2206);
                            }

                            return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                span: Span::new_with_checked(start, orig_name.span.hi()),
                                local,
                                imported: Some(ModuleExportName::Ident(possibly_orig_name)),
                                is_type_only: true,
                            }));
                        } else {
                            // `import { type as as } from 'mod'`
                            return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                span: Span::new_with_checked(start, maybe_as.span.hi()),
                                local: maybe_as,
                                imported: Some(ModuleExportName::Ident(orig_name)),
                                is_type_only: false,
                            }));
                        }
                    } else {
                        // `import { type as xxx } from 'mod'`
                        return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                            span: Span::new_with_checked(start, orig_name.span.hi()),
                            local: maybe_as,
                            imported: Some(ModuleExportName::Ident(orig_name)),
                            is_type_only: false,
                        }));
                    }
                } else {
                    // `import { type xx } from 'mod'`
                    // `import { type xx as yy } from 'mod'`
                    if type_only {
                        p.emit_err(orig_name.span, SyntaxError::TS2206);
                    }

                    orig_name = possibly_orig_name;
                    is_type_only = true;
                }
            }

            if p.input_mut().eat(&P::Token::AS) {
                let local: Ident = parse_binding_ident(p, false)?.into();
                return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: Span::new_with_checked(start, local.span.hi()),
                    local,
                    imported: Some(ModuleExportName::Ident(orig_name)),
                    is_type_only,
                }));
            }

            // Handle difference between
            //
            // 'ImportedBinding'
            // 'IdentifierName' as 'ImportedBinding'
            if p.ctx().is_reserved_word(&orig_name.sym) {
                syntax_error!(p, orig_name.span, SyntaxError::ReservedWordInImport)
            }

            let local = orig_name;
            Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                span: p.span(start),
                local,
                imported: None,
                is_type_only,
            }))
        }
        ModuleExportName::Str(orig_str) => {
            if p.input_mut().eat(&P::Token::AS) {
                let local: Ident = parse_binding_ident(p, false)?.into();
                Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: Span::new_with_checked(start, local.span.hi()),
                    local,
                    imported: Some(ModuleExportName::Str(orig_str)),
                    is_type_only: false,
                }))
            } else {
                syntax_error!(
                    p,
                    orig_str.span,
                    SyntaxError::ImportBindingIsString(orig_str.value.to_string_lossy().into())
                )
            }
        }

        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }
}

fn parse_export<'a, P: Parser<'a>>(
    p: &mut P,
    mut decorators: Vec<Decorator>,
) -> PResult<ModuleDecl> {
    if !p.ctx().contains(Context::Module) && p.ctx().contains(Context::TopLevel) {
        // Switch to module mode
        let ctx = p.ctx() | Context::Module | Context::Strict;
        p.set_ctx(ctx);
    }

    let start = p.cur_pos();
    p.assert_and_bump(&P::Token::EXPORT);

    let cur = p.input().cur();
    if cur.is_eof() {
        return Err(eof_error(p));
    }

    let after_export_start = p.cur_pos();

    // "export declare" is equivalent to just "export".
    let declare = p.input().syntax().typescript() && p.input_mut().eat(&P::Token::DECLARE);

    if declare {
        // TODO: Remove
        if let Some(decl) = try_parse_ts_declare(p, after_export_start, decorators.clone())? {
            return Ok(ExportDecl {
                span: p.span(start),
                decl,
            }
            .into());
        }
    }

    if p.input().syntax().typescript() {
        let cur = p.input().cur();
        if cur.is_word() {
            let sym = cur.clone().take_word(p.input()).unwrap();
            // TODO: remove clone
            if let Some(decl) = try_parse_ts_export_decl(p, decorators.clone(), sym) {
                return Ok(ExportDecl {
                    span: p.span(start),
                    decl,
                }
                .into());
            }
        }

        if p.input_mut().eat(&P::Token::IMPORT) {
            let is_type_only =
                p.input().is(&P::Token::TYPE) && peek!(p).is_some_and(|p| p.is_word());

            if is_type_only {
                p.assert_and_bump(&P::Token::TYPE);
            }

            let id = parse_ident_name(p)?;

            // export import A = B
            return parse_ts_import_equals_decl(
                p,
                start,
                id.into(),
                /* is_export */ true,
                is_type_only,
            )
            .map(From::from);
        }

        if p.input_mut().eat(&P::Token::EQUAL) {
            // `export = x;`
            let expr = p.parse_expr()?;
            p.expect_general_semi()?;
            return Ok(TsExportAssignment {
                span: p.span(start),
                expr,
            }
            .into());
        }

        if p.input_mut().eat(&P::Token::AS) {
            // `export as namespace A;`
            // See `parseNamespaceExportDeclaration` in TypeScript's own parser
            expect!(p, &P::Token::NAMESPACE);
            let id = parse_ident(p, false, false)?;
            p.expect_general_semi()?;
            return Ok(TsNamespaceExportDecl {
                span: p.span(start),
                id,
            }
            .into());
        }
    }

    let ns_export_specifier_start = p.cur_pos();

    let type_only = p.input().syntax().typescript() && p.input_mut().eat(&P::Token::TYPE);

    // Some("default") if default is exported from 'src'
    let mut export_default = None;

    if !type_only && p.input_mut().eat(&P::Token::DEFAULT) {
        if p.input().is(&P::Token::AT) {
            let start = p.cur_pos();
            let after_decorators = parse_decorators(p, false)?;

            if !decorators.is_empty() {
                syntax_error!(p, p.span(start), SyntaxError::TS8038);
            }

            decorators = after_decorators;
        }

        if p.input().syntax().typescript() {
            if p.input().is(&P::Token::ABSTRACT)
                && peek!(p).is_some_and(|cur| cur.is_class())
                && !p.input_mut().has_linebreak_between_cur_and_peeked()
            {
                let class_start = p.cur_pos();
                p.assert_and_bump(&P::Token::ABSTRACT);
                let cur = p.input().cur();
                if cur.is_error() {
                    let err = p.input_mut().expect_error_token_and_bump();
                    return Err(err);
                }

                return parse_default_class(p, start, class_start, decorators, true)
                    .map(ModuleDecl::ExportDefaultDecl);
            }
            if p.input().is(&P::Token::ABSTRACT) && peek!(p).is_some_and(|cur| cur.is_interface()) {
                p.emit_err(p.input().cur_span(), SyntaxError::TS1242);
                p.assert_and_bump(&P::Token::ABSTRACT);
            }

            if p.input().is(&P::Token::INTERFACE) {
                let interface_start = p.cur_pos();
                p.assert_and_bump(&P::Token::INTERFACE);
                let decl = parse_ts_interface_decl(p, interface_start).map(DefaultDecl::from)?;
                return Ok(ExportDefaultDecl {
                    span: p.span(start),
                    decl,
                }
                .into());
            }
        }

        if p.input().is(&P::Token::CLASS) {
            let class_start = p.cur_pos();
            let decl = parse_default_class(p, start, class_start, decorators, false)?;
            return Ok(decl.into());
        } else if p.input().is(&P::Token::ASYNC)
            && peek!(p).is_some_and(|cur| cur.is_function())
            && !p.input_mut().has_linebreak_between_cur_and_peeked()
        {
            let decl = parse_default_async_fn(p, start, decorators)?;
            return Ok(decl.into());
        } else if p.input().is(&P::Token::FUNCTION) {
            let decl = parse_default_fn(p, start, decorators)?;
            return Ok(decl.into());
        } else if p.input().syntax().export_default_from()
            && ((p.input().is(&P::Token::FROM) && peek!(p).is_some_and(|peek| peek.is_str()))
                || (p.input().is(&P::Token::COMMA)
                    && (peek!(p).is_some_and(|peek| peek.is_star() || peek.is_lbrace()))))
        {
            export_default = Some(Ident::new_no_ctxt(atom!("default"), p.input().prev_span()))
        } else {
            let expr = p.allow_in_expr(parse_assignment_expr)?;
            p.expect_general_semi()?;
            return Ok(ExportDefaultExpr {
                span: p.span(start),
                expr,
            }
            .into());
        }
    }

    if p.input().is(&P::Token::AT) {
        let start = p.cur_pos();
        let after_decorators = parse_decorators(p, false)?;

        if !decorators.is_empty() {
            syntax_error!(p, p.span(start), SyntaxError::TS8038);
        }

        decorators = after_decorators;
    }

    let decl = if !type_only && p.input().is(&P::Token::CLASS) {
        let class_start = p.cur_pos();
        parse_class_decl(p, start, class_start, decorators, false)?
    } else if !type_only
        && p.input().is(&P::Token::ASYNC)
        && peek!(p).is_some_and(|cur| cur.is_function())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        parse_async_fn_decl(p, decorators)?
    } else if !type_only && p.input().is(&P::Token::FUNCTION) {
        parse_fn_decl(p, decorators)?
    } else if !type_only
        && p.input().syntax().typescript()
        && p.input().is(&P::Token::CONST)
        && peek!(p).is_some_and(|cur| cur.is_enum())
    {
        let enum_start = p.cur_pos();
        p.assert_and_bump(&P::Token::CONST);
        p.assert_and_bump(&P::Token::ENUM);
        return parse_ts_enum_decl(p, enum_start, /* is_const */ true)
            .map(Decl::from)
            .map(|decl| {
                ExportDecl {
                    span: p.span(start),
                    decl,
                }
                .into()
            });
    } else if !type_only
        && (p.input().is(&P::Token::VAR)
            || p.input().is(&P::Token::CONST)
            || (p.input().is(&P::Token::LET))
                && peek!(p).map(|t| t.follows_keyword_let()).unwrap_or(false))
    {
        parse_var_stmt(p, false).map(Decl::Var)?
    } else {
        // ```javascript
        // export foo, * as bar, { baz } from "mod"; // *
        // export      * as bar, { baz } from "mod"; // *
        // export foo,           { baz } from "mod"; // *
        // export foo, * as bar          from "mod"; // *
        // export foo                    from "mod"; // *
        // export      * as bar          from "mod"; //
        // export                { baz } from "mod"; //
        // export                { baz }           ; //
        // export      *                 from "mod"; //
        // ```

        // export default
        // export foo
        let default = match export_default {
            Some(default) => Some(default),
            None => {
                if p.input().syntax().export_default_from() && p.input().cur().is_word() {
                    Some(parse_ident(p, false, false)?)
                } else {
                    None
                }
            }
        };

        if default.is_none()
            && p.input().is(&P::Token::MUL)
            && !peek!(p).is_some_and(|cur| cur.is_as())
        {
            p.assert_and_bump(&P::Token::MUL);

            // improve error message for `export * from foo`
            let (src, with) = parse_from_clause_and_semi(p)?;
            return Ok(ExportAll {
                span: p.span(start),
                src,
                type_only,
                with,
            }
            .into());
        }

        let mut specifiers = Vec::new();

        let mut has_default = false;
        let mut has_ns = false;

        if let Some(default) = default {
            has_default = true;
            specifiers.push(ExportSpecifier::Default(ExportDefaultSpecifier {
                exported: default,
            }))
        }

        // export foo, * as bar
        //           ^
        if !specifiers.is_empty()
            && p.input().is(&P::Token::COMMA)
            && peek!(p).is_some_and(|cur| cur.is_star())
        {
            p.assert_and_bump(&P::Token::COMMA);

            has_ns = true;
        }
        // export     * as bar
        //            ^
        else if specifiers.is_empty() && p.input().is(&P::Token::MUL) {
            has_ns = true;
        }

        if has_ns {
            p.assert_and_bump(&P::Token::MUL);
            expect!(p, &P::Token::AS);
            let name = parse_module_export_name(p)?;
            specifiers.push(ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                span: p.span(ns_export_specifier_start),
                name,
            }));
        }

        if has_default || has_ns {
            if p.input().is(&P::Token::FROM) {
                let (src, with) = parse_from_clause_and_semi(p)?;
                return Ok(NamedExport {
                    span: p.span(start),
                    specifiers,
                    src: Some(src),
                    type_only,
                    with,
                }
                .into());
            } else if !p.input().syntax().export_default_from() {
                // emit error
                expect!(p, &P::Token::FROM);
            }

            expect!(p, &P::Token::COMMA);
        }

        expect!(p, &P::Token::LBRACE);

        while !p.input().is(&P::Token::RBRACE) {
            let specifier = parse_named_export_specifier(p, type_only)?;
            specifiers.push(ExportSpecifier::Named(specifier));

            if p.input().is(&P::Token::RBRACE) {
                break;
            } else {
                expect!(p, &P::Token::COMMA);
            }
        }
        expect!(p, &P::Token::RBRACE);

        let opt = if p.input().is(&P::Token::FROM) {
            Some(parse_from_clause_and_semi(p)?)
        } else {
            for s in &specifiers {
                match s {
                    ExportSpecifier::Default(default) => {
                        p.emit_err(
                            default.exported.span,
                            SyntaxError::ExportExpectFrom(default.exported.sym.clone()),
                        );
                    }
                    ExportSpecifier::Namespace(namespace) => {
                        let export_name = match &namespace.name {
                            ModuleExportName::Ident(i) => i.sym.clone(),
                            ModuleExportName::Str(s) => s.value.to_string_lossy().into(),
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!(),
                        };
                        p.emit_err(namespace.span, SyntaxError::ExportExpectFrom(export_name));
                    }
                    ExportSpecifier::Named(named) => match &named.orig {
                        ModuleExportName::Ident(id) if id.is_reserved() => {
                            p.emit_err(id.span, SyntaxError::ExportExpectFrom(id.sym.clone()));
                        }
                        ModuleExportName::Str(s) => {
                            p.emit_err(s.span, SyntaxError::ExportBindingIsString);
                        }
                        _ => {}
                    },
                    #[cfg(swc_ast_unknown)]
                    _ => (),
                }
            }

            p.eat_general_semi();

            None
        };
        let (src, with) = match opt {
            Some(v) => (Some(v.0), v.1),
            None => (None, None),
        };
        return Ok(NamedExport {
            span: p.span(start),
            specifiers,
            src,
            type_only,
            with,
        }
        .into());
    };

    Ok(ExportDecl {
        span: p.span(start),
        decl,
    }
    .into())
}

fn parse_import<'a, P: Parser<'a>>(p: &mut P) -> PResult<ModuleItem> {
    let start = p.cur_pos();

    if peek!(p).is_some_and(|cur| cur.is_dot()) {
        let expr = p.parse_expr()?;

        p.eat_general_semi();

        return Ok(ExprStmt {
            span: p.span(start),
            expr,
        }
        .into());
    }

    if peek!(p).is_some_and(|cur| cur.is_lparen()) {
        let expr = p.parse_expr()?;

        p.eat_general_semi();

        return Ok(ExprStmt {
            span: p.span(start),
            expr,
        }
        .into());
    }

    // It's now import statement

    if !p.ctx().contains(Context::Module) {
        // Switch to module mode
        let ctx = p.ctx() | Context::Module | Context::Strict;
        p.set_ctx(ctx);
    }

    expect!(p, &P::Token::IMPORT);

    // Handle import 'mod.js'
    if p.input().cur().is_str() {
        let src = Box::new(parse_str_lit(p));
        let with = if p.input().syntax().import_attributes()
            && !p.input().had_line_break_before_cur()
            && (p.input_mut().eat(&P::Token::ASSERT) || p.input_mut().eat(&P::Token::WITH))
        {
            match parse_object_expr(p)? {
                Expr::Object(v) => Some(Box::new(v)),
                _ => unreachable!(),
            }
        } else {
            None
        };
        p.eat_general_semi();
        return Ok(ImportDecl {
            span: p.span(start),
            src,
            specifiers: Vec::new(),
            type_only: false,
            with,
            phase: Default::default(),
        }
        .into());
    }

    let mut type_only = false;
    let mut phase = ImportPhase::Evaluation;
    let mut specifiers = Vec::with_capacity(4);

    'import_maybe_ident: {
        if p.is_ident_ref() {
            let mut local = parse_imported_default_binding(p)?;

            if p.input().syntax().typescript() && local.sym == "type" {
                let cur = p.input().cur();
                if cur.is_lbrace() || cur.is_star() {
                    type_only = true;
                    break 'import_maybe_ident;
                }

                if p.is_ident_ref() {
                    if !p.input().is(&P::Token::FROM) || peek!(p).is_some_and(|cur| cur.is_from()) {
                        type_only = true;
                        local = parse_imported_default_binding(p)?;
                    } else if peek!(p).is_some_and(|cur| cur.is_equal()) {
                        type_only = true;
                        local = parse_ident_name(p).map(From::from)?;
                    }
                }
            }

            if p.input().syntax().typescript() && p.input().is(&P::Token::EQUAL) {
                return parse_ts_import_equals_decl(p, start, local, false, type_only)
                    .map(ModuleDecl::from)
                    .map(ModuleItem::from);
            }

            if matches!(&*local.sym, "source" | "defer") {
                let new_phase = match &*local.sym {
                    "source" => ImportPhase::Source,
                    "defer" => ImportPhase::Defer,
                    _ => unreachable!(),
                };

                let cur = p.input().cur();
                if cur.is_lbrace() || cur.is_star() {
                    phase = new_phase;
                    break 'import_maybe_ident;
                }

                if p.is_ident_ref() && !p.input().is(&P::Token::FROM)
                    || peek!(p).is_some_and(|cur| cur.is_from())
                {
                    // For defer phase, we expect only namespace imports, so break here
                    // and let the subsequent code handle validation
                    if new_phase == ImportPhase::Defer {
                        break 'import_maybe_ident;
                    }
                    phase = new_phase;
                    local = parse_imported_default_binding(p)?;
                }
            }

            //TODO: Better error reporting
            if !p.input().is(&P::Token::FROM) {
                expect!(p, &P::Token::COMMA);
            }
            specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                span: local.span,
                local,
            }));
        }
    }

    {
        let import_spec_start = p.cur_pos();
        // Namespace imports are not allowed in source phase.
        if phase != ImportPhase::Source && p.input_mut().eat(&P::Token::MUL) {
            expect!(p, &P::Token::AS);
            let local = parse_imported_binding(p)?;
            specifiers.push(ImportSpecifier::Namespace(ImportStarAsSpecifier {
                span: p.span(import_spec_start),
                local,
            }));
            // Named imports are only allowed in evaluation phase.
        } else if phase == ImportPhase::Evaluation && p.input_mut().eat(&P::Token::LBRACE) {
            while !p.input().is(&P::Token::RBRACE) {
                specifiers.push(parse_import_specifier(p, type_only)?);

                if p.input().is(&P::Token::RBRACE) {
                    break;
                } else {
                    expect!(p, &P::Token::COMMA);
                }
            }
            expect!(p, &P::Token::RBRACE);
        }
    }

    let src = {
        expect!(p, &P::Token::FROM);
        if p.input().cur().is_str() {
            Box::new(parse_str_lit(p))
        } else {
            unexpected!(p, "a string literal")
        }
    };

    let with = if p.input().syntax().import_attributes()
        && !p.input().had_line_break_before_cur()
        && (p.input_mut().eat(&P::Token::ASSERT) || p.input_mut().eat(&P::Token::WITH))
    {
        match parse_object_expr(p)? {
            Expr::Object(v) => Some(Box::new(v)),
            _ => unreachable!(),
        }
    } else {
        None
    };

    p.expect_general_semi()?;

    Ok(ImportDecl {
        span: p.span(start),
        specifiers,
        src,
        type_only,
        with,
        phase,
    }
    .into())
}

pub fn parse_module_item<'a>(p: &mut impl Parser<'a>) -> PResult<ModuleItem> {
    p.do_inside_of_context(Context::TopLevel, |p| {
        parse_stmt_like(p, true, handle_import_export)
    })
}
