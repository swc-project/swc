use std::{cell::RefCell, rc::Rc};

use anyhow::Error;
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span, Spanned,
};
use swc_ecma_ast::{
    ArrowExpr, BindingIdent, Class, ClassDecl, ClassMethod, ClassProp, EsVersion, ExportAll,
    ExportDecl, ExportSpecifier, FnDecl, ImportDecl, ImportSpecifier, NamedExport, Param, Pat,
    Program, TsAsExpr, TsConstAssertion, TsEnumDecl, TsExportAssignment, TsImportEqualsDecl,
    TsIndexSignature, TsInstantiation, TsInterfaceDecl, TsModuleDecl, TsModuleName,
    TsNamespaceDecl, TsNonNullExpr, TsParamPropParam, TsSatisfiesExpr, TsTypeAliasDecl, TsTypeAnn,
    TsTypeAssertion, TsTypeParamDecl, TsTypeParamInstantiation, VarDecl,
};
use swc_ecma_parser::{
    lexer::Lexer,
    token::{IdentLike, KnownIdent, Token, TokenAndSpan, Word},
    Capturing, Parser, StringInput, Syntax, TsSyntax,
};
use swc_ecma_visit::{Visit, VisitWith};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default)]
    pub module: Option<bool>,
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default = "default_ts_syntax")]
    pub parser: TsSyntax,
}

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

pub fn operate(
    cm: &Lrc<SourceMap>,
    handler: &Handler,
    input: String,
    options: Options,
) -> Result<String, Error> {
    let filename = options
        .filename
        .map_or(FileName::Anon, |f| FileName::Real(f.into()));

    let fm = cm.new_source_file(filename.into(), input);

    let syntax = Syntax::Typescript(options.parser);
    let target = EsVersion::latest();

    let comments = SingleThreadedComments::default();

    let lexer = Capturing::new(Lexer::new(
        syntax,
        target,
        StringInput::from(&*fm),
        Some(&comments),
    ));
    let tokens = lexer.tokens().clone();

    let mut parser = Parser::new_from(lexer);

    let program = match options.module {
        Some(true) => parser.parse_module().map(Program::Module),
        Some(false) => parser.parse_script().map(Program::Script),
        None => parser.parse_program(),
    };
    let errors = parser.take_errors();

    let program = match program {
        Ok(program) => program,
        Err(err) => {
            err.into_diagnostic(handler).emit();

            for e in errors {
                e.into_diagnostic(handler).emit();
            }

            return Err(anyhow::anyhow!("failed to parse"));
        }
    };

    if !errors.is_empty() {
        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        return Err(anyhow::anyhow!("failed to parse"));
    }

    drop(parser);
    let mut tokens = RefCell::into_inner(Rc::try_unwrap(tokens).unwrap());

    tokens.sort_by_key(|t| t.span);

    // Strip typescript types
    let mut ts_strip = TsStrip::new(fm.src.clone(), tokens);
    program.visit_with(&mut ts_strip);

    let replacements = ts_strip.replacements;
    let overwrites = ts_strip.overwrites;

    if replacements.is_empty() && overwrites.is_empty() {
        return Ok(fm.src.to_string());
    }

    let mut code = fm.src.to_string().into_bytes();

    for r in replacements {
        for c in &mut code[(r.0 .0 - 1) as usize..(r.1 .0 - 1) as usize] {
            if *c == b'\n' || *c == b'\r' {
                continue;
            }
            *c = b' ';
        }
    }

    for (i, v) in overwrites {
        code[i.0 as usize - 1] = v;
    }

    String::from_utf8(code).map_err(|_| anyhow::anyhow!("failed to convert to utf-8"))
}

struct TsStrip {
    src: Lrc<String>,

    /// Replaced with whitespace
    replacements: Vec<(BytePos, BytePos)>,

    // should be string, but we use u8 for only `)` usage.
    overwrites: Vec<(BytePos, u8)>,

    tokens: Vec<TokenAndSpan>,
}

impl TsStrip {
    fn new(src: Lrc<String>, tokens: Vec<TokenAndSpan>) -> Self {
        TsStrip {
            src,
            replacements: Default::default(),
            overwrites: Default::default(),
            tokens,
        }
    }
}

impl TsStrip {
    fn add_replacement(&mut self, span: Span) {
        self.replacements.push((span.lo, span.hi));
    }

    fn add_overwrite(&mut self, pos: BytePos, value: u8) {
        self.overwrites.push((pos, value));
    }

    fn get_src_slice(&self, span: Span) -> &str {
        &self.src[(span.lo.0 - 1) as usize..(span.hi.0 - 1) as usize]
    }

    fn get_next_token_index(&self, pos: BytePos) -> usize {
        let index = self.tokens.binary_search_by_key(&pos, |t| t.span.lo);
        match index {
            Ok(index) => index,
            Err(index) => index,
        }
    }

    fn get_next_token(&self, pos: BytePos) -> &TokenAndSpan {
        &self.tokens[self.get_next_token_index(pos)]
    }

    fn get_prev_token_index(&self, pos: BytePos) -> usize {
        let index = self.tokens.binary_search_by_key(&pos, |t| t.span.lo);
        match index {
            Ok(index) => index,
            Err(index) => index - 1,
        }
    }

    fn get_prev_token(&self, pos: BytePos) -> &TokenAndSpan {
        &self.tokens[self.get_prev_token_index(pos)]
    }
}

impl Visit for TsStrip {
    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        if let Some(ret) = &n.return_type {
            self.add_replacement(ret.span);

            let l_paren = self.get_prev_token(ret.span_lo() - BytePos(1));
            debug_assert_eq!(l_paren.token, Token::RParen);
            let arrow = self.get_next_token(ret.span_hi());
            debug_assert_eq!(arrow.token, Token::Arrow);
            let span = span(l_paren.span.lo, arrow.span.hi);

            let slice = self.get_src_slice(span).as_bytes();
            if slice.contains(&b'\n') {
                self.add_replacement(l_paren.span);

                // Instead of moving the arrow mark, we shift the right parenthesis to the next
                // line. This is because there might be a line break after the right
                // parenthesis, and we wish to preserve the alignment of each line.
                //
                // ```TypeScript
                // ()
                //     : any =>
                //     1;
                // ```
                //
                // ```TypeScript
                // (
                //          )=>
                //     1;
                // ```

                self.add_overwrite(ret.span_hi() - BytePos(1), b')');
            }
        }

        n.type_params.visit_with(self);
        n.params.visit_with(self);
        n.body.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        n.visit_children_with(self);

        if n.optional {
            // https://github.com/swc-project/swc/issues/8856
            // let optional_mark = self.get_next_token(n.id.span_hi());

            let optional_mark = self.get_next_token(n.span_lo() + BytePos(n.sym.len() as u32));
            debug_assert_eq!(optional_mark.token, Token::QuestionMark);

            self.add_replacement(optional_mark.span);
        }
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        if n.declare {
            self.add_replacement(n.span());
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_class(&mut self, n: &Class) {
        if n.is_abstract {
            let r#abstract = self.get_next_token(n.span_lo());
            debug_assert_eq!(
                r#abstract.token,
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Abstract)))
            );
            self.add_replacement(r#abstract.span);
        }

        if !n.implements.is_empty() {
            let implements =
                self.get_prev_token(n.implements.first().unwrap().span_lo() - BytePos(1));
            debug_assert_eq!(
                implements.token,
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Implements)))
            );

            let last = n.implements.last().unwrap();
            let span = span(implements.span.lo, last.span.hi);
            self.add_replacement(span);
        }

        n.visit_children_with(self);
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        if n.function.body.is_none() || n.is_abstract {
            self.add_replacement(n.span);
            return;
        }

        let key_pos = n.key.span_lo();
        let mut pos = n.span_lo();
        let mut index = self.get_next_token_index(pos);

        while pos < key_pos {
            let TokenAndSpan { token, span, .. } = &self.tokens[index];
            pos = span.hi;
            index += 1;
            match token {
                Token::Word(Word::Ident(IdentLike::Known(
                    KnownIdent::Public | KnownIdent::Protected | KnownIdent::Private,
                ))) => {
                    self.add_replacement(*span);
                }
                Token::Word(Word::Ident(IdentLike::Other(o))) if *o == "override" => {
                    self.add_replacement(*span);
                }
                _ => {}
            }
        }

        n.visit_children_with(self);
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        if n.declare || n.is_abstract {
            self.add_replacement(n.span);
            return;
        }

        let key_pos = n.key.span_lo();
        let mut pos = n.span_lo();
        let mut index = self.get_next_token_index(pos);

        while pos < key_pos {
            let TokenAndSpan { token, span, .. } = &self.tokens[index];
            pos = span.hi;
            index += 1;
            match token {
                Token::Word(Word::Ident(IdentLike::Known(
                    KnownIdent::Readonly
                    | KnownIdent::Public
                    | KnownIdent::Protected
                    | KnownIdent::Private,
                ))) => {
                    self.add_replacement(*span);
                }
                Token::Word(Word::Ident(IdentLike::Other(o))) if *o == "override" => {
                    self.add_replacement(*span);
                }
                _ => {}
            }
        }

        if n.is_optional {
            let optional_mark = self.get_next_token(n.key.span_hi());
            debug_assert_eq!(optional_mark.token, Token::QuestionMark);

            self.add_replacement(optional_mark.span);
        }

        if n.definite {
            let definite_mark = self.get_next_token(n.key.span_hi());
            debug_assert_eq!(definite_mark.token, Token::Bang);

            self.add_replacement(definite_mark.span);
        }

        n.visit_children_with(self);
    }

    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature) {
        self.add_replacement(n.span);
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        match n.decl {
            swc_ecma_ast::Decl::TsInterface(_)
            | swc_ecma_ast::Decl::TsTypeAlias(_)
            | swc_ecma_ast::Decl::TsEnum(_)
            | swc_ecma_ast::Decl::TsModule(_) => {
                self.add_replacement(n.span);
            }

            _ => {
                n.visit_children_with(self);
            }
        }
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        if n.function.body.is_none() {
            self.add_replacement(n.function.span);
            return;
        }
        n.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_import_specifiers(&mut self, n: &[ImportSpecifier]) {
        for import in n {
            if let ImportSpecifier::Named(import) = import {
                if import.is_type_only {
                    let mut span = import.span;
                    let comma = self.get_next_token(import.span_hi());
                    if comma.token == Token::Comma {
                        span = span.with_hi(comma.span.hi);
                    } else {
                        debug_assert_eq!(comma.token, Token::RBrace);
                    }
                    self.add_replacement(span);
                }
            }
        }
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.type_only {
            self.add_replacement(n.span);
            return;
        }

        for export in n.specifiers.iter() {
            if let ExportSpecifier::Named(e) = export {
                if e.is_type_only {
                    let mut span = e.span;
                    let comma = self.get_next_token(e.span_hi());
                    if comma.token == Token::Comma {
                        span = span.with_hi(comma.span.hi);
                    } else {
                        debug_assert_eq!(comma.token, Token::RBrace);
                    }
                    self.add_replacement(span);
                }
            }
        }
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_type_only {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span,
                "TypeScript import equals declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span,
                "TypeScript export assignment is not supported in strip-only mode",
            );
        });
    }

    fn visit_params(&mut self, n: &[Param]) {
        if let Some(p) = n.first().filter(|param| {
            matches!(
                &param.pat,
                Pat::Ident(id) if id.sym == "this"
            )
        }) {
            let mut span = p.span;

            let comma = self.get_next_token(span.hi);
            if comma.token == Token::Comma {
                span = span.with_hi(comma.span.hi);
            } else {
                debug_assert_eq!(comma.token, Token::RParen);
            }
            self.add_replacement(span);

            n[1..].visit_children_with(self);

            return;
        }

        n.visit_children_with(self);
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        if e.declare {
            self.add_replacement(e.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                e.span,
                "TypeScript enum is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_instantiation(&mut self, n: &TsInstantiation) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        if n.declare || matches!(n.id, TsModuleName::Str(..)) {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript namespace declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript module declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        self.add_replacement(span(n.span.hi - BytePos(1), n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript parameter property is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        self.add_replacement(span(n.span.lo, n.expr.span().lo));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.add_replacement(span(n.span.lo, n.span.hi));
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        n.visit_children_with(self);
    }
}

fn span(lo: BytePos, hi: BytePos) -> Span {
    Span::new(lo, hi)
}
