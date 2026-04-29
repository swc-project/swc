//! Flow-specific post-processing that runs alongside [`crate::typescript`]
//! when the input was parsed with `swc_ecma_parser::Syntax::Flow`.
//!
//! Flow source files opt in to type checking through a leading
//! `// @flow` (or `/* @flow */`) pragma comment. Once Flow type syntax has
//! been stripped, the pragma is misleading and should not survive into the
//! generated JavaScript. This module mirrors the default behavior of
//! `@babel/plugin-transform-flow-strip-types`, which removes the pragma
//! unless the consumer explicitly opts out.

use swc_atoms::Atom;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos, Spanned,
};
use swc_ecma_ast::{Module, Pass, Script};
use swc_ecma_visit::{visit_mut_pass, VisitMut};

/// Remove `@flow` and `@noflow` pragma comments from the leading comments of
/// the program.
///
/// For line comments that are just a pragma (`// @flow`) the whole comment is
/// dropped. For block/JSDoc comments with other content, only the pragma
/// lines are removed so copyright banners and other annotations survive the
/// transform. If a block comment is reduced to empty whitespace after pragma
/// removal, it is dropped as well.
///
/// The pass visits the module/script span and the first body item because
/// parsers attach leading comments at either position depending on whether a
/// shebang or empty prefix is present.
pub fn flow_pragma_strip<C>(comments: C) -> impl Pass
where
    C: Comments,
{
    visit_mut_pass(FlowPragmaStrip { comments })
}

struct FlowPragmaStrip<C>
where
    C: Comments,
{
    comments: C,
}

impl<C> FlowPragmaStrip<C>
where
    C: Comments,
{
    fn strip_at(&self, pos: BytePos) {
        let Some(existing) = self.comments.take_leading(pos) else {
            return;
        };

        let mut kept: Vec<Comment> = Vec::with_capacity(existing.len());
        for mut cmt in existing {
            if let Some(new_text) = strip_flow_pragma(cmt.kind, &cmt.text) {
                if is_empty_comment_body(&new_text) {
                    continue;
                }
                cmt.text = Atom::new(new_text);
            }
            kept.push(cmt);
        }

        if !kept.is_empty() {
            self.comments.add_leading_comments(pos, kept);
        }
    }
}

impl<C> VisitMut for FlowPragmaStrip<C>
where
    C: Comments,
{
    fn visit_mut_module(&mut self, n: &mut Module) {
        self.strip_at(n.span.lo);
        if let Some(first) = n.body.first() {
            self.strip_at(first.span_lo());
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.strip_at(n.span.lo);
        if let Some(first) = n.body.first() {
            self.strip_at(first.span_lo());
        }
    }
}

/// Remove `@flow` / `@noflow` pragma lines from the comment body.
///
/// Returns `Some(new_text)` when the comment contained at least one pragma
/// line, or `None` when the comment is untouched. Accepted pragma forms
/// mirror `babel-plugin-transform-flow-strip-types`:
///  - `@flow`, `@flow strict`, `@flow strict-local`, `@flow weak`
///  - `@noflow`
///
/// For line comments the entire body is dropped when a pragma is detected.
/// For block/JSDoc comments only the pragma lines are removed, so unrelated
/// content such as copyright banners is preserved.
fn strip_flow_pragma(kind: CommentKind, text: &str) -> Option<String> {
    match kind {
        CommentKind::Line => {
            if line_has_pragma(text) {
                Some(String::new())
            } else {
                None
            }
        }
        CommentKind::Block => strip_pragma_lines(text),
    }
}

fn line_has_pragma(line: &str) -> bool {
    let line = line.trim();
    let line = line.trim_start_matches('*').trim_start();

    is_valid_flow_pragma(line)
}

/// Walks the body of a block comment, dropping any line that is just a Flow
/// pragma.
fn strip_pragma_lines(text: &str) -> Option<String> {
    let mut stripped = false;
    let mut out = String::with_capacity(text.len());

    for raw in text.split_inclusive('\n') {
        if line_has_pragma(raw) {
            stripped = true;
            continue;
        }
        out.push_str(raw);
    }

    if stripped {
        Some(out)
    } else {
        None
    }
}

fn is_valid_flow_pragma(line: &str) -> bool {
    if line == "@noflow" {
        return true;
    }

    let Some(rest) = line.strip_prefix("@flow") else {
        return false;
    };

    matches!(rest.trim(), "" | "strict" | "strict-local" | "weak")
}

/// Returns true when the remaining block comment body has no non-whitespace
/// content other than JSDoc `*` decorations. Used to drop comments that have
/// been reduced to an empty `/** */` by pragma removal.
fn is_empty_comment_body(text: &str) -> bool {
    text.lines()
        .all(|line| line.trim().trim_start_matches('*').trim().is_empty())
}

#[cfg(test)]
mod tests {
    use swc_common::comments::CommentKind;

    use super::{is_empty_comment_body, line_has_pragma, strip_flow_pragma};

    #[test]
    fn line_pragma_detection() {
        assert!(line_has_pragma(" @flow"));
        assert!(line_has_pragma(" @flow strict"));
        assert!(line_has_pragma(" @flow strict-local"));
        assert!(line_has_pragma(" @flow weak"));
        assert!(line_has_pragma(" @noflow"));
        assert!(line_has_pragma(" * @flow"));

        assert!(!line_has_pragma(" Copyright 2024"));
        assert!(!line_has_pragma(" see @flowtype documentation"));
        assert!(!line_has_pragma(" @flowtype something"));
        assert!(!line_has_pragma(" @flow migration notes"));
        assert!(!line_has_pragma(" @flow strictly"));
        assert!(!line_has_pragma(" @flow strict local"));
        assert!(!line_has_pragma(" @license MIT"));
    }

    #[test]
    fn line_comment_fully_stripped() {
        assert_eq!(
            strip_flow_pragma(CommentKind::Line, " @flow").as_deref(),
            Some("")
        );
        assert_eq!(
            strip_flow_pragma(CommentKind::Line, " @flow strict").as_deref(),
            Some("")
        );
        assert_eq!(
            strip_flow_pragma(CommentKind::Line, " @noflow").as_deref(),
            Some("")
        );
        assert!(strip_flow_pragma(CommentKind::Line, " Copyright 2024").is_none());
    }

    #[test]
    fn block_comment_keeps_surrounding_lines() {
        let input = "*\n * Copyright 2024\n * @flow\n * @format\n ";
        let out = strip_flow_pragma(CommentKind::Block, input).expect("should strip");
        assert!(!out.contains("@flow"));
        assert!(out.contains("Copyright 2024"));
        assert!(out.contains("@format"));
    }

    #[test]
    fn block_comment_becomes_empty() {
        let input = " @flow ";
        let out = strip_flow_pragma(CommentKind::Block, input).expect("should strip");
        assert!(is_empty_comment_body(&out));
    }

    #[test]
    fn jsdoc_comment_becomes_empty() {
        let input = "*\n * @flow\n ";
        let out = strip_flow_pragma(CommentKind::Block, input).expect("should strip");
        assert!(is_empty_comment_body(&out));
    }

    #[test]
    fn block_comment_without_pragma_untouched() {
        assert!(strip_flow_pragma(CommentKind::Block, "*\n * @license MIT\n ").is_none());
    }

    #[test]
    fn is_empty_comment_body_ignores_jsdoc_stars() {
        assert!(is_empty_comment_body(""));
        assert!(is_empty_comment_body("*\n * \n "));
        assert!(!is_empty_comment_body("*\n * Copyright\n "));
    }
}
