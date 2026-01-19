//! JSX pragma parsing utilities.
//!
//! This module provides utilities for parsing JSX pragma from comments
//! and expressions.

use swc_atoms::Atom;
use swc_common::{
    comments::{Comment, CommentKind},
    sync::Lrc,
    Mark, SourceMap, Span, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_expr, Syntax};

/// Parses a pragma expression like "React.createElement" into an AST Expr.
pub fn parse_expr_for_jsx(
    cm: &Lrc<SourceMap>,
    name: &str,
    src: impl AsRef<str>,
    top_level_mark: Mark,
) -> Box<Expr> {
    let src_str = src.as_ref();
    let fm = cm.new_source_file(
        Lrc::new(swc_common::FileName::Internal(format!("{name}.js"))),
        src_str.to_string(),
    );

    let mut errors = vec![];
    let result = parse_file_as_expr(
        &fm,
        Syntax::default(),
        Default::default(),
        None,
        &mut errors,
    );

    match result {
        Ok(mut expr) => {
            apply_mark(&mut expr, top_level_mark);
            expr
        }
        Err(_) => {
            // If parsing fails, return an identifier
            Box::new(Expr::Ident(Ident::new(
                src_str.into(),
                DUMMY_SP,
                SyntaxContext::empty().apply_mark(top_level_mark),
            )))
        }
    }
}

fn apply_mark(expr: &mut Expr, mark: Mark) {
    match expr {
        Expr::Ident(ident) => {
            ident.ctxt = ident.ctxt.apply_mark(mark);
        }
        Expr::Member(member) => {
            apply_mark(&mut member.obj, mark);
        }
        _ => {}
    }
}

/// JSX directive options parsed from comments.
///
/// These are parsed from comments like:
/// ```js
/// /** @jsx h */
/// /** @jsxFrag Fragment */
/// /** @jsxRuntime classic */
/// /** @jsxImportSource preact */
/// ```
#[derive(Debug, Default, Clone)]
pub struct JsxDirectives {
    /// Parsed pragma expression (e.g., `React.createElement`)
    pub pragma: Option<Box<Expr>>,

    /// Parsed pragma fragment expression (e.g., `React.Fragment`)
    pub pragma_frag: Option<Box<Expr>>,

    /// Runtime mode (`classic` or `automatic`)
    pub runtime: Option<String>,

    /// Import source for automatic runtime
    pub import_source: Option<String>,
}

impl JsxDirectives {
    /// Parse JSX directives from leading comments.
    pub fn from_comments<'a>(
        cm: &Lrc<SourceMap>,
        span: Span,
        comments: impl IntoIterator<Item = &'a Comment>,
        top_level_mark: Mark,
    ) -> Self {
        let mut directives = JsxDirectives::default();

        for comment in comments {
            if comment.kind != CommentKind::Block {
                continue;
            }

            for line in comment.text.lines() {
                let line = line.trim().trim_start_matches('*').trim();

                if let Some(pragma) = line.strip_prefix("@jsx ") {
                    let pragma = pragma.trim();
                    directives.pragma =
                        Some(parse_expr_for_jsx(cm, "@jsx", pragma, top_level_mark));
                }

                if let Some(pragma_frag) = line.strip_prefix("@jsxFrag ") {
                    let pragma_frag = pragma_frag.trim();
                    directives.pragma_frag = Some(parse_expr_for_jsx(
                        cm,
                        "@jsxFrag",
                        pragma_frag,
                        top_level_mark,
                    ));
                }

                if line.contains("@jsxRuntime classic") {
                    directives.runtime = Some("classic".to_string());
                }

                if line.contains("@jsxRuntime automatic") {
                    directives.runtime = Some("automatic".to_string());
                }

                if let Some(source) = line.strip_prefix("@jsxImportSource ") {
                    directives.import_source = Some(source.trim().to_string());
                    directives.runtime = Some("automatic".to_string());
                }
            }
        }

        directives
    }
}
