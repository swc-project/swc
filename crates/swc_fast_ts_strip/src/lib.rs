use std::{cell::RefCell, rc::Rc};

use anyhow::{Context, Error};
use serde::{Deserialize, Serialize};
use swc_allocator::maybe::vec::Vec;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    source_map::DefaultSourceMapGenConfig,
    sync::Lrc,
    BytePos, FileName, Mark, SourceMap, Span, Spanned,
};
use swc_ecma_ast::{
    ArrayPat, ArrowExpr, AutoAccessor, BindingIdent, Class, ClassDecl, ClassMethod, ClassProp,
    Constructor, Decl, DefaultDecl, DoWhileStmt, EsVersion, ExportAll, ExportDecl,
    ExportDefaultDecl, ExportSpecifier, FnDecl, ForInStmt, ForOfStmt, ForStmt, GetterProp, IfStmt,
    ImportDecl, ImportSpecifier, NamedExport, ObjectPat, Param, Pat, PrivateMethod, PrivateProp,
    Program, SetterProp, Stmt, TsAsExpr, TsConstAssertion, TsEnumDecl, TsExportAssignment,
    TsImportEqualsDecl, TsIndexSignature, TsInstantiation, TsModuleDecl, TsModuleName,
    TsNamespaceDecl, TsNonNullExpr, TsParamPropParam, TsSatisfiesExpr, TsTypeAliasDecl, TsTypeAnn,
    TsTypeAssertion, TsTypeParamDecl, TsTypeParamInstantiation, VarDeclarator, WhileStmt,
};
use swc_ecma_parser::{
    lexer::Lexer,
    token::{BinOpToken, IdentLike, KnownIdent, Token, TokenAndSpan, Word},
    Capturing, Parser, StringInput, Syntax, TsSyntax,
};
use swc_ecma_transforms_base::{
    fixer::fixer,
    helpers::{inject_helpers, Helpers, HELPERS},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_transforms_typescript::typescript;
use swc_ecma_visit::{Visit, VisitMutWith, VisitWith};
#[cfg(feature = "wasm-bindgen")]
use wasm_bindgen::prelude::*;

#[derive(Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default)]
    pub module: Option<bool>,
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default = "default_ts_syntax")]
    pub parser: TsSyntax,

    #[serde(default)]
    pub mode: Mode,

    #[serde(default)]
    pub transform: Option<typescript::Config>,

    #[serde(default)]
    pub source_map: bool,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_Options: &'static str = r#"
interface Options {
    module?: boolean;
    filename?: string;
    mode?: Mode;
    transform?; TransformConfig;
    sourceMap?: boolean;
}

interface TransformConfig {
    /**
     * @see https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax
     */
    verbatimModuleSyntax?: boolean;
    /**
     * Native class properties support
     */
    nativeClassProperties?: boolean;
    importNotUsedAsValues?: "remove" | "preserve";
    /**
     * Don't create `export {}`.
     * By default, strip creates `export {}` for modules to preserve module
     * context.
     * 
     * @see https://github.com/swc-project/swc/issues/1698
     */
    noEmptyExport?: boolean;
    importExportAssignConfig?: "Classic" | "Preserve" | "NodeNext" | "EsNext";
    /**
     * Disables an optimization that inlines TS enum member values
     * within the same module that assumes the enum member values
     * are never modified.
     * 
     * Defaults to false.
     */
    tsEnumIsMutable?: boolean;
}
"#;

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Mode {
    #[default]
    StripOnly,
    Transform,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_Mode: &'static str = r#"
type Mode = "strip-only" | "transform";
"#;

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    pub map: Option<String>,
}

#[cfg(feature = "wasm-bindgen")]
#[wasm_bindgen(typescript_custom_section)]
const Type_TransformOutput: &'static str = r#"
interface TransformOutput {
    code: string;
    map?: string;
}
"#;

pub fn operate(
    cm: &Lrc<SourceMap>,
    handler: &Handler,
    input: String,
    options: Options,
) -> Result<TransformOutput, Error> {
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

    let mut program = match program {
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

    match options.mode {
        Mode::StripOnly => {
            let mut tokens = RefCell::into_inner(Rc::try_unwrap(tokens).unwrap());

            tokens.sort_by_key(|t| t.span);

            // Strip typescript types
            let mut ts_strip = TsStrip::new(fm.src.clone(), tokens);
            program.visit_with(&mut ts_strip);

            let replacements = ts_strip.replacements;
            let overwrites = ts_strip.overwrites;

            if replacements.is_empty() && overwrites.is_empty() {
                return Ok(TransformOutput {
                    code: fm.src.to_string(),
                    map: Default::default(),
                });
            }

            let source = fm.src.clone();
            let mut code = fm.src.to_string().into_bytes();

            for r in replacements {
                let (start, end) = (r.0 .0 as usize - 1, r.1 .0 as usize - 1);

                for (i, c) in source[start..end].char_indices() {
                    let i = start + i;
                    match c {
                        // https://262.ecma-international.org/#sec-white-space
                        '\u{0009}' | '\u{0000B}' | '\u{000C}' | '\u{FEFF}' => continue,
                        // Space_Separator
                        '\u{0020}' | '\u{00A0}' | '\u{1680}' | '\u{2000}' | '\u{2001}'
                        | '\u{2002}' | '\u{2003}' | '\u{2004}' | '\u{2005}' | '\u{2006}'
                        | '\u{2007}' | '\u{2008}' | '\u{2009}' | '\u{200A}' | '\u{202F}'
                        | '\u{205F}' | '\u{3000}' => continue,
                        // https://262.ecma-international.org/#sec-line-terminators
                        '\u{000A}' | '\u{000D}' | '\u{2028}' | '\u{2029}' => continue,
                        _ => match c.len_utf8() {
                            1 => {
                                // Space 0020
                                code[i] = 0x20;
                            }
                            2 => {
                                // No-Break Space 00A0
                                code[i] = 0xc2;
                                code[i + 1] = 0xa0;
                            }
                            3 => {
                                // En Space 2002
                                code[i] = 0xe2;
                                code[i + 1] = 0x80;
                                code[i + 2] = 0x82;
                            }
                            4 => {
                                // We do not have a 4-byte space character in the Unicode standard.

                                // Space 0020
                                code[i] = 0x20;
                                // ZWNBSP FEFF
                                code[i + 1] = 0xef;
                                code[i + 2] = 0xbb;
                                code[i + 3] = 0xbf;
                            }
                            _ => unreachable!(),
                        },
                    }
                }
            }

            for (i, v) in overwrites {
                code[i.0 as usize - 1] = v;
            }

            let code = if cfg!(debug_assertions) {
                String::from_utf8(code)
                    .map_err(|_| anyhow::anyhow!("failed to convert to utf-8"))?
            } else {
                // SAFETY: We've already validated that the source is valid utf-8
                // and our operations are limited to character-level string replacements.
                unsafe { String::from_utf8_unchecked(code) }
            };

            Ok(TransformOutput {
                code,
                map: Default::default(),
            })
        }

        Mode::Transform => {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            HELPERS.set(&Helpers::new(false), || {
                program.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, true));

                program.visit_mut_with(&mut typescript::typescript(
                    options.transform.unwrap_or_default(),
                    unresolved_mark,
                    top_level_mark,
                ));

                program.visit_mut_with(&mut inject_helpers(unresolved_mark));

                program.visit_mut_with(&mut hygiene());

                program.visit_mut_with(&mut fixer(Some(&comments)));
            });

            let mut src = std::vec::Vec::new();
            let mut src_map_buf = if options.source_map {
                Some(Vec::new())
            } else {
                None
            };

            {
                let mut emitter = swc_ecma_codegen::Emitter {
                    cfg: swc_ecma_codegen::Config::default(),
                    comments: if options.source_map {
                        Some(&comments)
                    } else {
                        None
                    },
                    cm: cm.clone(),
                    wr: swc_ecma_codegen::text_writer::JsWriter::new(
                        cm.clone(),
                        "\n",
                        &mut src,
                        src_map_buf.as_mut(),
                    ),
                };

                emitter.emit_program(&program).unwrap();

                let map = src_map_buf
                    .map(|map| {
                        let map =
                            cm.build_source_map_with_config(&map, None, DefaultSourceMapGenConfig);

                        let mut s = std::vec::Vec::new();
                        map.to_writer(&mut s)
                            .context("failed to write source map")?;

                        String::from_utf8(s).context("source map was not utf8")
                    })
                    .transpose()?;

                Ok(TransformOutput {
                    code: String::from_utf8(src).context("generated code was not utf-8")?,
                    map,
                })
            }
        }
    }
}

struct TsStrip {
    src: Lrc<String>,

    /// Replaced with whitespace
    replacements: Vec<(BytePos, BytePos)>,

    // should be string, but we use u8 for only `)` usage.
    overwrites: Vec<(BytePos, u8)>,

    tokens: std::vec::Vec<TokenAndSpan>,
}

impl TsStrip {
    fn new(src: Lrc<String>, tokens: std::vec::Vec<TokenAndSpan>) -> Self {
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

    fn fix_asi(&mut self, span: Span) {
        let index = self.get_prev_token_index(span.lo);
        if index == 0 {
            // Skip if the token is the first token.
            return;
        }

        let TokenAndSpan {
            token: prev_token,
            span: prev_span,
            ..
        } = &self.tokens[index - 1];

        let index = self.get_prev_token_index(span.hi - BytePos(1));
        if index == self.tokens.len() - 1 {
            // Skip if the token is the last token.
            return;
        }

        let TokenAndSpan {
            token,
            had_line_break,
            ..
        } = &self.tokens[index + 1];

        if !*had_line_break {
            return;
        }

        // https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-asi-interesting-cases-in-statement-lists
        // Add a semicolon if the next token is `[`, `(`, `/`, `+`, `-` or backtick.
        match token {
            Token::LParen
            | Token::LBracket
            | Token::BackQuote
            | Token::BinOp(BinOpToken::Add | BinOpToken::Sub | BinOpToken::Div) => {
                if prev_token == &Token::Semi {
                    self.add_overwrite(prev_span.lo, b';');
                    return;
                }

                self.add_overwrite(span.lo, b';');
            }

            _ => {}
        }
    }

    fn fix_asi_in_expr(&mut self, span: Span) {
        let index = self.get_prev_token_index(span.hi - BytePos(1));
        if index == self.tokens.len() - 1 {
            return;
        }

        if let TokenAndSpan {
            // Only `(`, `[` and backtick affect ASI.
            token: Token::LParen | Token::LBracket | Token::BackQuote,
            had_line_break: true,
            ..
        } = &self.tokens[index + 1]
        {
            self.add_overwrite(span.lo, b';');
        }
    }

    fn strip_class_modifier(&mut self, mut start_pos: BytePos, key_pos: BytePos) {
        let mut index = self.get_next_token_index(start_pos);

        while start_pos < key_pos {
            let TokenAndSpan { token, span, .. } = &self.tokens[index];
            start_pos = span.hi;
            index += 1;

            let next = &self.tokens[index];

            if next.had_line_break {
                return;
            }

            // see ts_next_token_can_follow_modifier
            // class { public public() {} }
            if !matches!(
                next.token,
                Token::LBracket
                    | Token::LBrace
                    | Token::BinOp(BinOpToken::Mul)
                    | Token::DotDotDot
                    | Token::Hash
                    | Token::Word(_)
                    | Token::Str { .. }
                    | Token::Num { .. }
                    | Token::BigInt { .. }
            ) {
                return;
            }

            match token {
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Static))) => {
                    continue;
                }
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
                _ => {
                    return;
                }
            }
        }
    }

    fn strip_definite_mark(&mut self, index: usize) {
        self.strip_token(index, Token::Bang);
    }

    fn strip_optional_mark(&mut self, index: usize) {
        self.strip_token(index, Token::QuestionMark);
    }

    fn strip_token(&mut self, index: usize, expected: Token) {
        let TokenAndSpan { token, span, .. } = &self.tokens[index];
        debug_assert_eq!(*token, expected);

        self.add_replacement(*span);
    }
}

impl Visit for TsStrip {
    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        if n.definite {
            if let Some(id) = n.name.as_ident() {
                let mark_index = self.get_next_token_index(id.span.hi);
                self.strip_definite_mark(mark_index);
            };
        }

        n.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        if let Some(ret) = &n.return_type {
            self.add_replacement(ret.span);

            let r_paren = self.get_prev_token(ret.span.lo - BytePos(1));
            debug_assert_eq!(r_paren.token, Token::RParen);
            let arrow = self.get_next_token(ret.span.hi);
            debug_assert_eq!(arrow.token, Token::Arrow);
            let span = span(r_paren.span.lo, arrow.span.lo);

            let slice = self.get_src_slice(span);
            if slice
                .chars()
                .any(|c| matches!(c, '\u{000A}' | '\u{000D}' | '\u{2028}' | '\u{2029}'))
            {
                self.add_replacement(r_paren.span);

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
                //         ) =>
                //     1;
                // ```

                let mut pos = ret.span.hi - BytePos(1);
                while !self.src.as_bytes()[pos.0 as usize - 1].is_utf8_char_boundary() {
                    self.add_overwrite(pos, b' ');
                    pos = pos - BytePos(1);
                }

                self.add_overwrite(pos, b')');
            }
        }

        n.type_params.visit_with(self);
        n.params.visit_with(self);
        n.body.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        n.visit_children_with(self);

        if n.optional {
            let mark_index = if let Some(type_ann) = &n.type_ann {
                self.get_prev_token_index(type_ann.span.lo - BytePos(1))
            } else {
                self.get_next_token_index(n.span.hi)
            };

            self.strip_optional_mark(mark_index);
        }
    }

    fn visit_class(&mut self, n: &Class) {
        if n.is_abstract {
            let mark_pos = n.decorators.last().map_or(n.span.lo, |d| d.span.hi);
            let r#abstract = self.get_next_token_index(mark_pos);

            self.strip_token(
                r#abstract,
                Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Abstract))),
            )
        }

        if !n.implements.is_empty() {
            let implements =
                self.get_prev_token(n.implements.first().unwrap().span.lo - BytePos(1));
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

    fn visit_constructor(&mut self, n: &Constructor) {
        if n.body.is_none() {
            self.add_replacement(n.span);
            return;
        }

        self.strip_class_modifier(n.span.lo, n.key.span_lo());

        n.visit_children_with(self);
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        if n.function.body.is_none() || n.is_abstract {
            self.add_replacement(n.span);
            return;
        }

        // @foo public m(): void {}
        let start_pos = n
            .function
            .decorators
            .last()
            .map_or(n.span.lo, |d| d.span.hi);

        self.strip_class_modifier(start_pos, n.key.span_lo());

        if n.is_optional {
            let mark_index = self.get_next_token_index(n.key.span_hi());
            self.strip_optional_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        if n.declare || n.is_abstract {
            self.add_replacement(n.span);
            return;
        }

        let start_pos = n.decorators.last().map_or(n.span.lo, |d| d.span.hi);

        self.strip_class_modifier(start_pos, n.key.span_lo());

        if n.is_optional {
            let mark_index = self.get_next_token_index(n.key.span_hi());
            self.strip_optional_mark(mark_index);
        }
        if n.definite {
            let mark_index = self.get_next_token_index(n.key.span_hi());
            self.strip_definite_mark(mark_index);
        }

        if n.value.is_none() && n.key.as_ident().filter(|k| k.sym == "static").is_some() {
            if let Some(type_ann) = &n.type_ann {
                self.add_overwrite(type_ann.span.lo, b';');
            }
        }

        n.visit_children_with(self);
    }

    fn visit_private_method(&mut self, n: &PrivateMethod) {
        let start_pos = n
            .function
            .decorators
            .last()
            .map_or(n.span.lo, |d| d.span.hi);

        self.strip_class_modifier(start_pos, n.key.span.lo);

        if n.is_optional {
            let mark_index = self.get_next_token_index(n.key.span.hi);
            self.strip_optional_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_private_prop(&mut self, n: &PrivateProp) {
        let start_pos = n.decorators.last().map_or(n.span.lo, |d| d.span.hi);

        self.strip_class_modifier(start_pos, n.key.span.lo);

        if n.is_optional {
            let mark_index = self.get_next_token_index(n.key.span.hi);
            self.strip_optional_mark(mark_index);
        }

        if n.definite {
            let mark_index = self.get_next_token_index(n.key.span.hi);
            self.strip_definite_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_auto_accessor(&mut self, n: &AutoAccessor) {
        if n.is_abstract {
            self.add_replacement(n.span);
            return;
        }

        let start_pos = n.decorators.last().map_or(n.span.lo, |d| d.span.hi);

        self.strip_class_modifier(start_pos, n.key.span_lo());

        if n.definite {
            let mark_index = self.get_next_token_index(n.key.span_hi());
            self.strip_definite_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_array_pat(&mut self, n: &ArrayPat) {
        if n.optional {
            let mark_index = if let Some(type_ann) = &n.type_ann {
                self.get_prev_token_index(type_ann.span.lo - BytePos(1))
            } else {
                self.get_next_token_index(n.span.hi)
            };
            self.strip_optional_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_object_pat(&mut self, n: &ObjectPat) {
        if n.optional {
            let mark_index = if let Some(type_ann) = &n.type_ann {
                self.get_prev_token_index(type_ann.span.lo - BytePos(1))
            } else {
                self.get_next_token_index(n.span.hi)
            };
            self.strip_optional_mark(mark_index);
        }

        n.visit_children_with(self);
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        if n.type_only {
            self.add_replacement(n.span);
            self.fix_asi(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        if n.decl.is_ts_declare() {
            self.add_replacement(n.span);
            self.fix_asi(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        if n.decl.is_ts_declare() {
            self.add_replacement(n.span);
            self.fix_asi(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_decl(&mut self, n: &Decl) {
        if n.is_ts_declare() {
            self.add_replacement(n.span());
            self.fix_asi(n.span());
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        if n.type_only {
            self.add_replacement(n.span);
            self.fix_asi(n.span);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_import_specifiers(&mut self, n: &[ImportSpecifier]) {
        for import in n {
            if let ImportSpecifier::Named(import) = import {
                if import.is_type_only {
                    let mut span = import.span;
                    let comma = self.get_next_token(import.span.hi);
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
            self.fix_asi(n.span);
            return;
        }

        for export in n.specifiers.iter() {
            if let ExportSpecifier::Named(e) = export {
                if e.is_type_only {
                    let mut span = e.span;
                    let comma = self.get_next_token(e.span.hi);
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
        let TokenAndSpan {
            token,
            span: as_span,
            ..
        } = self.get_next_token(n.expr.span_hi());
        debug_assert_eq!(
            token,
            &Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As)))
        );
        self.fix_asi_in_expr(span(as_span.lo, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span,
                "TypeScript export assignment is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_type_only {
            self.add_replacement(n.span);
            self.fix_asi(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span,
                "TypeScript import equals declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature) {
        self.add_replacement(n.span);
    }

    fn visit_ts_instantiation(&mut self, n: &TsInstantiation) {
        self.add_replacement(span(n.expr.span().hi, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        HANDLER.with(|handler| {
            handler.span_err(
                e.span,
                "TypeScript enum is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript namespace declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
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

        let TokenAndSpan {
            token,
            span: as_span,
            ..
        } = self.get_next_token(n.expr.span_hi());
        debug_assert_eq!(
            token,
            &Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Satisfies)))
        );
        self.fix_asi_in_expr(span(as_span.lo, n.span.hi));

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.add_replacement(n.span);
        self.fix_asi(n.span);
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.add_replacement(n.span);
    }

    /// We do not strip type assertion because it's not safe.
    ///
    /// See https://github.com/swc-project/swc/issues/9295
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span,
                "The angle-bracket syntax for type assertions, `<T>expr`, is not supported in \
                 type strip mode. Instead, use the 'as' syntax: `expr as T`.",
            );
        });

        n.expr.visit_children_with(self);
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.add_replacement(n.span);
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.add_replacement(span(n.span.lo, n.span.hi));
    }

    fn visit_if_stmt(&mut self, n: &IfStmt) {
        n.visit_children_with(self);

        if n.cons.is_ts_declare() {
            self.add_overwrite(n.cons.span_lo(), b';');
        }

        if let Some(alt) = &n.alt {
            if alt.is_ts_declare() {
                self.add_overwrite(alt.span_lo(), b';');
            }
        }
    }

    fn visit_for_stmt(&mut self, n: &ForStmt) {
        n.visit_children_with(self);

        if n.body.is_ts_declare() {
            self.add_overwrite(n.body.span_lo(), b';');
        }
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        n.visit_children_with(self);

        if n.body.is_ts_declare() {
            self.add_overwrite(n.body.span_lo(), b';');
        }
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        n.visit_children_with(self);

        if n.body.is_ts_declare() {
            self.add_overwrite(n.body.span_lo(), b';');
        }
    }

    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        n.visit_children_with(self);

        if n.body.is_ts_declare() {
            self.add_overwrite(n.body.span_lo(), b';');
        }
    }

    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        n.visit_children_with(self);

        if n.body.is_ts_declare() {
            self.add_overwrite(n.body.span_lo(), b';');
        }
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        let l_parern_index = self.get_next_token_index(n.key.span_hi());
        let l_parern = &self.tokens[l_parern_index];
        debug_assert_eq!(l_parern.token, Token::LParen);

        let r_parern_pos = n.type_ann.as_ref().map_or(n.body.span_lo(), |t| t.span.lo) - BytePos(1);
        let r_parern = self.get_prev_token(r_parern_pos);
        debug_assert_eq!(r_parern.token, Token::RParen);

        let span = span(l_parern.span.lo + BytePos(1), r_parern.span.hi - BytePos(1));
        self.add_replacement(span);

        n.visit_children_with(self);
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        if let Some(this_param) = &n.this_param {
            self.add_replacement(this_param.span());

            let comma = self.get_prev_token(n.param.span_lo() - BytePos(1));
            debug_assert_eq!(comma.token, Token::Comma);

            self.add_replacement(comma.span);
        }

        n.visit_children_with(self);
    }
}

trait IsTsDecl {
    fn is_ts_declare(&self) -> bool;
}

impl IsTsDecl for Decl {
    fn is_ts_declare(&self) -> bool {
        match self {
            Self::TsInterface { .. } | Self::TsTypeAlias(..) => true,

            Self::TsModule(module) => module.declare || matches!(module.id, TsModuleName::Str(..)),
            Self::TsEnum(ref r#enum) => r#enum.declare,

            Self::Var(ref var) => var.declare,
            Self::Fn(FnDecl { declare: true, .. })
            | Self::Class(ClassDecl { declare: true, .. }) => true,

            Self::Fn(FnDecl { function, .. }) => function.body.is_none(),

            _ => false,
        }
    }
}

impl IsTsDecl for Stmt {
    fn is_ts_declare(&self) -> bool {
        self.as_decl().map_or(false, IsTsDecl::is_ts_declare)
    }
}

impl IsTsDecl for DefaultDecl {
    fn is_ts_declare(&self) -> bool {
        match self {
            Self::Class(..) => false,
            DefaultDecl::Fn(r#fn) => r#fn.function.body.is_none(),
            DefaultDecl::TsInterfaceDecl(..) => true,
        }
    }
}

trait U8Helper {
    fn is_utf8_char_boundary(&self) -> bool;
}

impl U8Helper for u8 {
    // Copy from std::core::num::u8
    #[inline]
    fn is_utf8_char_boundary(&self) -> bool {
        // This is bit magic equivalent to: b < 128 || b >= 192
        (*self as i8) >= -0x40
    }
}

fn span(lo: BytePos, hi: BytePos) -> Span {
    Span::new(lo, hi)
}
