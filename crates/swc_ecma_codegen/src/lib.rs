#![recursion_limit = "1024"]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::nonminimal_bool)]
#![allow(non_local_definitions)]

use std::{borrow::Cow, fmt::Write, io, ops::Deref, str};

use ascii::AsciiChar;
use auto_impl::auto_impl;
use compact_str::{format_compact, CompactString};
use memchr::memmem::Finder;
use once_cell::sync::Lazy;
use swc_atoms::Atom;
use swc_common::{
    comments::{CommentKind, Comments},
    sync::Lrc,
    BytePos, SourceMap, SourceMapper, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::{emitter, node_impl};
use text_writer::SpannedWriteJs;

pub use self::config::Config;
use self::{text_writer::WriteJs, util::StartsWithAlphaNum};
use crate::util::EndsWithAlphaNum;

#[macro_use]
pub mod macros;
mod comments;
mod config;
mod decl;
mod expr;
mod jsx;
mod stmt;
#[cfg(test)]
mod tests;
pub mod text_writer;
mod typescript;
pub mod util;

pub type Result = io::Result<()>;

/// Generate a code from a syntax node using default options.
pub fn to_code_default(
    cm: Lrc<SourceMap>,
    comments: Option<&dyn Comments>,
    node: &impl Node,
) -> String {
    let mut buf = std::vec::Vec::new();
    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments,
            wr: text_writer::JsWriter::new(cm, "\n", &mut buf, None),
        };
        node.emit_with(&mut emitter).unwrap();
    }

    String::from_utf8(buf).expect("codegen generated non-utf8 output")
}

/// Generate a code from a syntax node using default options.
pub fn to_code_with_comments(comments: Option<&dyn Comments>, node: &impl Node) -> String {
    to_code_default(Default::default(), comments, node)
}

/// Generate a code from a syntax node using default options.
pub fn to_code(node: &impl Node) -> String {
    to_code_with_comments(None, node)
}

#[auto_impl(Box)]
pub trait Node: Spanned {
    fn emit_with<W, S>(&self, e: &mut Emitter<'_, W, S>) -> Result
    where
        W: WriteJs,
        S: SourceMapper + SourceMapperExt;

    fn adjust_span<W, S>(&mut self, emitter: &mut SpanWriter<'_, W, S>) -> Result
    where
        W: SpannedWriteJs,
        S: swc_common::SourceMapper + swc_ecma_ast::SourceMapperExt;
}

pub struct Emitter<'a, W, S: SourceMapper>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    pub cfg: config::Config,
    pub cm: Lrc<S>,
    pub comments: Option<&'a dyn Comments>,
    pub wr: W,
}

enum CowStr<'a> {
    Borrowed(&'a str),
    Owned(CompactString),
}

impl Deref for CowStr<'_> {
    type Target = str;

    fn deref(&self) -> &str {
        match self {
            CowStr::Borrowed(s) => s,
            CowStr::Owned(s) => s.as_str(),
        }
    }
}

fn replace_close_inline_script(raw: &str) -> CowStr {
    let chars = raw.as_bytes();
    let pattern_len = 8; // </script>

    let mut matched_indexes = chars
        .iter()
        .enumerate()
        .filter(|(index, byte)| {
            byte == &&b'<'
                && index + pattern_len < chars.len()
                && chars[index + 1..index + pattern_len].eq_ignore_ascii_case(b"/script")
                && matches!(
                    chars[index + pattern_len],
                    b'>' | b' ' | b'\t' | b'\n' | b'\x0C' | b'\r'
                )
        })
        .map(|(index, _)| index)
        .peekable();

    if matched_indexes.peek().is_none() {
        return CowStr::Borrowed(raw);
    }

    let mut result = CompactString::new(raw);

    for (offset, i) in matched_indexes.enumerate() {
        result.insert(i + 1 + offset, '\\');
    }

    CowStr::Owned(result)
}

static NEW_LINE_TPL_REGEX: Lazy<regex::Regex> = Lazy::new(|| regex::Regex::new(r"\\n|\n").unwrap());

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    /// `1.toString` is an invalid property access,
    /// should emit a dot after the literal if return true
    fn emit_num_lit_internal(
        &mut self,
        num: &Number,
        mut detect_dot: bool,
    ) -> std::result::Result<bool, io::Error> {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(num.span(), false)?;

        // Handle infinity
        if num.value.is_infinite() && num.raw.is_none() {
            if num.value.is_sign_negative() {
                self.wr.write_str_lit(num.span, "-")?;
            }
            self.wr.write_str_lit(num.span, "Infinity")?;

            return Ok(false);
        }

        let mut striped_raw = None;
        let mut value = String::default();

        srcmap!(self, num, true);

        if self.cfg.minify {
            if num.value.is_infinite() && num.raw.is_some() {
                self.wr.write_str_lit(DUMMY_SP, num.raw.as_ref().unwrap())?;
            } else {
                value = minify_number(num.value, &mut detect_dot);
                self.wr.write_str_lit(DUMMY_SP, &value)?;
            }
        } else {
            match &num.raw {
                Some(raw) => {
                    if raw.len() > 2 && self.cfg.target < EsVersion::Es2015 && {
                        let slice = &raw.as_bytes()[..2];
                        slice == b"0b" || slice == b"0o" || slice == b"0B" || slice == b"0O"
                    } {
                        if num.value.is_infinite() && num.raw.is_some() {
                            self.wr.write_str_lit(DUMMY_SP, num.raw.as_ref().unwrap())?;
                        } else {
                            value = num.value.to_string();
                            self.wr.write_str_lit(DUMMY_SP, &value)?;
                        }
                    } else if raw.len() > 2
                        && self.cfg.target < EsVersion::Es2021
                        && raw.contains('_')
                    {
                        let value = raw.replace('_', "");
                        self.wr.write_str_lit(DUMMY_SP, &value)?;

                        striped_raw = Some(value);
                    } else {
                        self.wr.write_str_lit(DUMMY_SP, raw)?;

                        if !detect_dot {
                            return Ok(false);
                        }

                        striped_raw = Some(raw.replace('_', ""));
                    }
                }
                _ => {
                    value = num.value.to_string();
                    self.wr.write_str_lit(DUMMY_SP, &value)?;
                }
            }
        }

        // fast return
        if !detect_dot {
            return Ok(false);
        }

        Ok(striped_raw
            .map(|raw| {
                if raw.bytes().all(|c| c.is_ascii_digit()) {
                    // Maybe legacy octal
                    // Do we really need to support pre es5?
                    let slice = raw.as_bytes();
                    if slice.len() >= 2 && slice[0] == b'0' {
                        return false;
                    }

                    return true;
                }

                false
            })
            .unwrap_or_else(|| {
                let bytes = value.as_bytes();

                if !bytes.contains(&b'.') && !bytes.contains(&b'e') {
                    return true;
                }

                false
            }))
    }

    /// Prints operator and right node of a binary expression.
    #[inline(never)]
    fn emit_bin_expr_trailing(&mut self, node: &BinExpr) -> Result {
        let is_kwd_op = match node.op {
            BinaryOp::In | BinaryOp::InstanceOf => true,
            _ => false,
        };

        let formatting_before_op = if is_kwd_op {
            space!(self);
            true
        } else {
            let is_close_to_right = false;

            if is_close_to_right {
                formatting_space!(self);
                false
            } else {
                formatting_space!(self);
                true
            }
        };

        if is_kwd_op {
            keyword!(self, node.op.as_str());
        } else {
            operator!(self, node.op.as_str());
        }

        if formatting_before_op {
            space!(self);
        } else {
            formatting_space!(self);
        }
        emit!(self, node.right);

        Ok(())
    }

    fn emit_accessibility(&mut self, n: Option<Accessibility>) -> Result {
        if let Some(a) = n {
            match a {
                Accessibility::Public => keyword!(self, "public"),
                Accessibility::Protected => keyword!(self, "protected"),
                Accessibility::Private => keyword!(self, "private"),
            }
            space!(self);
        }

        Ok(())
    }

    /// prints `(b){}` from `function a(b){}`
    #[emitter]
    fn emit_fn_trailing(&mut self, node: &Function) -> Result {
        if let Some(type_params) = &node.type_params {
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(node.span, Some(&node.params), ListFormat::CommaListElements)?;
        punct!(")");

        if let Some(ty) = &node.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        if let Some(body) = &node.body {
            formatting_space!();
            self.emit_block_stmt_inner(body, true)?;
        } else {
            semi!();
        }

        // srcmap!(node, false);
    }

    fn emit_template_element_for_tagged_template(&mut self, node: &TplElement) -> Result {
        srcmap!(self, node, true);

        self.wr.write_str_lit(DUMMY_SP, &node.raw)?;

        srcmap!(self, node, false);

        Ok(())
    }

    fn emit_expr_or_spreads(
        &mut self,
        parent_node: Span,
        nodes: &[ExprOrSpread],
        format: ListFormat,
    ) -> Result {
        self.emit_list(parent_node, Some(nodes), format)
    }

    fn emit_ident_like(&mut self, span: Span, sym: &Atom, optional: bool) -> Result {
        // TODO: Use write_symbol when ident is a symbol.
        self.emit_leading_comments_of_span(span, false)?;

        // Source map
        self.wr.commit_pending_semi()?;

        srcmap!(self, span, true);
        // TODO: span

        if self.cfg.ascii_only {
            if self.wr.can_ignore_invalid_unicodes() {
                self.wr
                    .write_symbol(DUMMY_SP, &get_ascii_only_ident(sym, false, self.cfg.target))?;
            } else {
                self.wr.write_symbol(
                    DUMMY_SP,
                    &get_ascii_only_ident(&handle_invalid_unicodes(sym), false, self.cfg.target),
                )?;
            }
        } else if self.wr.can_ignore_invalid_unicodes() {
            self.wr.write_symbol(DUMMY_SP, sym)?;
        } else {
            self.wr
                .write_symbol(DUMMY_SP, &handle_invalid_unicodes(sym))?;
        }

        if optional {
            punct!(self, "?");
        }

        // Call emitList directly since it could be an array of
        // TypeParameterDeclarations _or_ type arguments

        // emitList(node, node.typeArguments, ListFormat::TypeParameters);

        Ok(())
    }

    fn emit_list<N: Node>(
        &mut self,
        parent_node: Span,
        children: Option<&[N]>,
        format: ListFormat,
    ) -> Result {
        self.emit_list5(
            parent_node,
            children,
            format,
            0,
            children.map(|c| c.len()).unwrap_or(0),
        )
    }

    /// This method exists to reduce compile time.
    #[inline(never)]
    fn emit_first_of_list5(
        &mut self,
        parent_node: Span,
        children: Option<usize>,
        format: ListFormat,
        start: usize,
        count: usize,
    ) -> Option<Result> {
        if children.is_none() && format.contains(ListFormat::OptionalIfUndefined) {
            return Some(Ok(()));
        }

        let is_empty = children.is_none() || start > children.unwrap() || count == 0;
        if is_empty && format.contains(ListFormat::OptionalIfEmpty) {
            return Some(Ok(()));
        }

        if format.contains(ListFormat::BracketsMask) {
            if let Err(err) = self.wr.write_punct(None, format.opening_bracket()) {
                return Some(Err(err));
            }

            if is_empty {
                if let Err(err) = self.emit_trailing_comments_of_pos(
                    {
                        // TODO: children.lo()

                        parent_node.lo()
                    },
                    true,
                    false,
                ) {
                    return Some(Err(err));
                }
            }
        }

        None
    }

    /// This method exists to reduce compile time.
    #[inline(never)]
    fn emit_pre_child_for_list5(
        &mut self,
        parent_node: Span,
        format: ListFormat,
        previous_sibling: Option<Span>,
        child: Span,
        should_decrease_indent_after_emit: &mut bool,
        should_emit_intervening_comments: &mut bool,
    ) -> Result {
        // Write the delimiter if this is not the first node.
        if let Some(previous_sibling) = previous_sibling {
            // i.e
            //      function commentedParameters(
            //          /* Parameter a */
            //          a
            // /* End of parameter a */
            // -> this comment isn't considered to be trailing comment of parameter "a" due
            // to newline ,
            if format.contains(ListFormat::DelimitersMask)
                && previous_sibling.hi != parent_node.hi()
                && self.comments.is_some()
            {
                self.emit_leading_comments(previous_sibling.hi(), true)?;
            }

            self.write_delim(format)?;

            // Write either a line terminator or whitespace to separate the elements.

            if self.cm.should_write_separating_line_terminator(
                Some(previous_sibling),
                Some(child),
                format,
            ) {
                // If a synthesized node in a single-line list starts on a new
                // line, we should increase the indent.
                if (format & (ListFormat::LinesMask | ListFormat::Indented))
                    == ListFormat::SingleLine
                    && !self.cfg.minify
                {
                    self.wr.increase_indent()?;
                    *should_decrease_indent_after_emit = true;
                }

                if !self.cfg.minify {
                    self.wr.write_line()?;
                }
                *should_emit_intervening_comments = false;
            } else if format.contains(ListFormat::SpaceBetweenSiblings) {
                formatting_space!(self);
            }
        }

        Ok(())
    }

    /// This method exists to reduce compile time.
    #[inline(never)]
    fn emit_list_finisher_of_list5(
        &mut self,
        parent_node: Span,
        format: ListFormat,
        previous_sibling: Option<Span>,
        last_child: Option<Span>,
    ) -> Result {
        // Write a trailing comma, if requested.
        let has_trailing_comma = format.contains(ListFormat::ForceTrailingComma)
            || format.contains(ListFormat::AllowTrailingComma) && {
                if parent_node.is_dummy() {
                    false
                } else {
                    match self.cm.span_to_snippet(parent_node) {
                        Ok(snippet) => {
                            if snippet.len() < 3 {
                                false
                            } else {
                                let last_char = snippet.chars().last().unwrap();
                                snippet[..snippet.len() - last_char.len_utf8()]
                                    .trim()
                                    .ends_with(',')
                            }
                        }
                        _ => false,
                    }
                }
            };

        if has_trailing_comma
            && format.contains(ListFormat::CommaDelimited)
            && (!self.cfg.minify || !format.contains(ListFormat::CanSkipTrailingComma))
        {
            punct!(self, ",");
            formatting_space!(self);
        }

        {
            // Emit any trailing comment of the last element in the list
            // i.e
            //       var array = [...
            //          2
            //          /* end of element 2 */
            //       ];

            let emit_trailing_comments = {
                // TODO:
                //
                // !(getEmitFlags(previousSibling).contains(EmitFlags::NoTrailingComments))

                true
            };

            if let Some(previous_sibling) = previous_sibling {
                if format.contains(ListFormat::DelimitersMask)
                    && previous_sibling.hi() != parent_node.hi()
                    && emit_trailing_comments
                    && self.comments.is_some()
                {
                    self.emit_leading_comments(previous_sibling.hi(), true)?;
                }
            }
        }

        // Decrease the indent, if requested.
        if format.contains(ListFormat::Indented) && !self.cfg.minify {
            self.wr.decrease_indent()?;
        }

        // Write the closing line terminator or closing whitespace.
        if self
            .cm
            .should_write_closing_line_terminator(parent_node, last_child, format)
        {
            if !self.cfg.minify {
                self.wr.write_line()?;
            }
        } else if format.contains(ListFormat::SpaceBetweenBraces) && !self.cfg.minify {
            self.wr.write_space()?;
        }

        Ok(())
    }

    /// This method exists to reduce compile time.
    #[inline(never)]
    fn emit_last_of_list5(
        &mut self,
        parent_node: Span,
        is_empty: bool,
        format: ListFormat,
        _start: usize,
        _count: usize,
    ) -> Result {
        if format.contains(ListFormat::BracketsMask) {
            if is_empty {
                self.emit_leading_comments(
                    {
                        //TODO: children.hi()

                        parent_node.hi()
                    },
                    true,
                )?; // Emit leading comments within empty lists
            }
            self.wr.write_punct(None, format.closing_bracket())?;
        }

        Ok(())
    }

    fn emit_list5<N: Node>(
        &mut self,
        parent_node: Span,
        children: Option<&[N]>,
        format: ListFormat,
        start: usize,
        count: usize,
    ) -> Result {
        if let Some(result) =
            self.emit_first_of_list5(parent_node, children.map(|v| v.len()), format, start, count)
        {
            return result;
        }

        let is_empty = children.is_none() || start > children.unwrap().len() || count == 0;

        if is_empty {
            // Write a line terminator if the parent node was multi-line

            if format.contains(ListFormat::MultiLine) {
                if !self.cfg.minify {
                    self.wr.write_line()?;
                }
            } else if format.contains(ListFormat::SpaceBetweenBraces)
                && !(format.contains(ListFormat::NoSpaceIfEmpty))
                && !self.cfg.minify
            {
                self.wr.write_space()?;
            }
        } else {
            let children = children.unwrap();

            // Write the opening line terminator or leading whitespace.
            let may_emit_intervening_comments =
                !format.intersects(ListFormat::NoInterveningComments);
            let mut should_emit_intervening_comments = may_emit_intervening_comments;
            if self.cm.should_write_leading_line_terminator(
                parent_node,
                children.first().map(|v| v.span()),
                format,
            ) {
                if !self.cfg.minify {
                    self.wr.write_line()?;
                }
                should_emit_intervening_comments = false;
            } else if format.contains(ListFormat::SpaceBetweenBraces) && !self.cfg.minify {
                self.wr.write_space()?;
            }

            // Increase the indent, if requested.
            if format.contains(ListFormat::Indented) && !self.cfg.minify {
                self.wr.increase_indent()?;
            }

            // Emit each child.
            let mut previous_sibling: Option<Span> = None;
            let mut should_decrease_indent_after_emit = false;
            for i in 0..count {
                let child = &children[start + i];

                self.emit_pre_child_for_list5(
                    parent_node,
                    format,
                    previous_sibling,
                    child.span(),
                    &mut should_decrease_indent_after_emit,
                    &mut should_emit_intervening_comments,
                )?;

                child.emit_with(self)?;

                // Emit this child.
                if should_emit_intervening_comments {
                    if self.comments.is_some() {
                        let comment_range = child.comment_range();
                        self.emit_trailing_comments_of_pos(comment_range.hi(), false, true)?;
                    }
                } else {
                    should_emit_intervening_comments = may_emit_intervening_comments;
                }

                if should_decrease_indent_after_emit {
                    self.wr.decrease_indent()?;
                    should_decrease_indent_after_emit = false;
                }

                previous_sibling = Some(child.span());
            }

            self.emit_list_finisher_of_list5(
                parent_node,
                format,
                previous_sibling,
                children.last().map(|v| v.span()),
            )?;
        }

        // self.handlers.onAfterEmitNodeArray(children);

        self.emit_last_of_list5(parent_node, is_empty, format, start, count)?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        emit!(self.left);
        formatting_space!();
        operator!(self.op.as_str());
        formatting_space!();
        emit!(self.right);
    }
}

#[node_impl]
impl MacroNode for BinExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        {
            let mut left = Some(self);
            let mut lefts = Vec::new();
            while let Some(l) = left {
                lefts.push(l);

                match &*l.left {
                    Expr::Bin(b) => {
                        left = Some(b);
                    }
                    _ => break,
                }
            }

            let len = lefts.len();

            for (i, left) in lefts.into_iter().rev().enumerate() {
                if i == 0 {
                    emit!(left.left);
                }
                // Check if it's last
                if i + 1 != len {
                    emitter.emit_bin_expr_trailing(left).unwrap();
                }
            }
        }

        emitter.emit_bin_expr_trailing(self).unwrap();
    }
}

#[node_impl]
impl MacroNode for Decorator {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        punct!("@");
        emit!(self.expr);
        emitter.wr.write_line().unwrap();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ClassExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        for dec in &self.class.decorators {
            emit!(dec);
        }

        if self.class.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("class");

        if let Some(ref i) = self.ident {
            space!();
            emit!(i);
            emit!(self.class.type_params);
        }

        emitter.emit_class_trailing(&self.class).unwrap();
    }
}

#[node_impl]
impl MacroNode for Class {
    fn emit(&mut self, emitter: &mut Macro) {
        if self.super_class.is_some() {
            space!();
            keyword!("extends");

            {
                let starts_with_alpha_num =
                    self.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!();
                } else {
                    formatting_space!()
                }
            }
            emit!(self.super_class);
            emit!(self.super_type_params);
        }

        if !self.implements.is_empty() {
            space!();
            keyword!("implements");

            space!();

            emitter
                .emit_list(
                    self.span,
                    Some(&self.implements),
                    ListFormat::ClassHeritageClauses,
                )
                .unwrap();
        }

        formatting_space!();

        punct!("{");

        emitter
            .emit_list(self.span, Some(&self.body), ListFormat::ClassMembers)
            .unwrap();

        srcmap!(self, false, true);
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for ClassMember {
    fn emit(&mut self, emitter: &mut Macro) {
        match *self {
            ClassMember::Constructor(ref n) => emit!(n),
            ClassMember::ClassProp(ref n) => emit!(n),
            ClassMember::Method(ref n) => emit!(n),
            ClassMember::PrivateMethod(ref n) => emit!(n),
            ClassMember::PrivateProp(ref n) => emit!(n),
            ClassMember::TsIndexSignature(ref n) => emit!(n),
            ClassMember::Empty(ref n) => emit!(n),
            ClassMember::StaticBlock(ref n) => emit!(n),
            ClassMember::AutoAccessor(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for AutoAccessor {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)
            .unwrap();

        emitter.emit_accessibility(self.accessibility).unwrap();

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_abstract {
            keyword!("abstract");
            space!();
        }

        if self.is_override {
            keyword!("override");
            space!();
        }

        keyword!("accessor");
        space!();

        emit!(self.key);

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(init) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }

        semi!();
    }
}

#[node_impl]
impl MacroNode for Key {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            Key::Private(n) => emit!(n),
            Key::Public(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for Prop {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            Prop::Shorthand(ref n) => emit!(n),
            Prop::KeyValue(ref n) => emit!(n),
            Prop::Assign(ref n) => emit!(n),
            Prop::Getter(ref n) => emit!(n),
            Prop::Setter(ref n) => emit!(n),
            Prop::Method(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for KeyValueProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.key);
        punct!(":");
        formatting_space!();
        emit!(self.value);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for AssignProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        emit!(self.key);
        punct!("=");
        emit!(self.value);
    }
}

#[node_impl]
impl MacroNode for GetterProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("get");

        let starts_with_alpha_num = match self.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => self.key.starts_with_alpha_num(),
        };
        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }
        emit!(self.key);
        formatting_space!();
        punct!("(");
        punct!(")");
        formatting_space!();
        emit!(self.body);
    }
}

#[node_impl]
impl MacroNode for SetterProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        keyword!("set");

        let starts_with_alpha_num = match self.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => self.key.starts_with_alpha_num(),
        };

        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }

        emit!(self.key);
        formatting_space!();

        punct!("(");
        if let Some(this) = &self.this_param {
            emit!(this);
            punct!(",");

            formatting_space!();
        }

        emit!(self.param);

        punct!(")");

        emit!(self.body);
    }
}

#[node_impl]
impl MacroNode for MethodProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        if self.function.is_async {
            keyword!("async");
            space!();
        }

        if self.function.is_generator {
            punct!("*");
        }

        emit!(self.key);
        formatting_space!();
        // TODO
        emitter.emit_fn_trailing(&self.function)?;
    }
}

#[node_impl]
impl MacroNode for ObjectLit {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        punct!("{");

        let emit_new_line = !emitter.cfg.minify
            && !(self.props.is_empty() && is_empty_comments(&self.span(), &emitter.comments));

        if emit_new_line {
            emitter.wr.write_line()?;
        }

        let mut list_format =
            ListFormat::ObjectLiteralExpressionProperties | ListFormat::CanSkipTrailingComma;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        emitter.emit_list(self.span(), Some(&self.props), list_format)?;

        if emit_new_line {
            emitter.wr.write_line()?;
        }

        srcmap!(self, false, true);
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for PropOrSpread {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            PropOrSpread::Prop(ref n) => emit!(n),
            PropOrSpread::Spread(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for SpreadElement {
    fn emit(&mut self, emitter: &mut Macro) {
        if let Some(span) = self.dot3_token {
            emitter.emit_leading_comments_of_span(span, false)?;
        }

        srcmap!(self, true);

        punct!("...");
        emit!(self.expr);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ArrayLit {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        punct!("[");
        let mut format = ListFormat::ArrayLiteralExpressionElements;
        if let Some(None) = self.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        emitter.emit_list(self.span(), Some(&self.elems), format)?;
        punct!("]");

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ExprOrSpread {
    fn emit(&mut self, emitter: &mut Macro) {
        if let Some(span) = self.spread {
            emitter.emit_leading_comments_of_span(span, false)?;

            punct!("...");
        }

        emit!(self.expr);
    }
}

#[node_impl]
impl MacroNode for Program {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            Program::Module(m) => emit!(m),
            Program::Script(s) => emit!(s),
            // TODO: reenable once experimental_metadata breaking change is merged
            // _ => unreachable!(),
        }
    }
}

#[node_impl]
impl MacroNode for SuperPropExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.obj);

        match &self.prop {
            SuperProp::Computed(computed) => emit!(computed),
            SuperProp::Ident(i) => {
                if self.prop.span().lo() >= BytePos(1) {
                    emitter
                        .emit_leading_comments(self.prop.span().lo() - BytePos(1), false)
                        .unwrap();
                }
                punct!(".");
                emit!(i);
            }
        }
    }
}

#[node_impl]
impl MacroNode for ArrowExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        let space = !emitter.cfg.minify
            || match self.params.as_slice() {
                [Pat::Ident(_)] => true,
                _ => false,
            };

        if self.is_async {
            keyword!("async");
            if space {
                space!();
            } else {
                formatting_space!();
            }
        }
        if self.is_generator {
            punct!("*")
        }

        let parens = !emitter.cfg.minify
            || match self.params.as_slice() {
                [Pat::Ident(i)] => emitter.has_trailing_comment(i.span),
                _ => true,
            };

        emit!(self.type_params);

        if parens {
            punct!("(");
        }

        emitter
            .emit_list(self.span, Some(&self.params), ListFormat::CommaListElements)
            .unwrap();
        if parens {
            punct!(")");
        }

        if let Some(ty) = &self.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
            formatting_space!();
        }

        punct!("=>");
        emit!(self.body);
    }
}

#[node_impl]
impl MacroNode for MetaPropExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        if emitter.comments.is_some() {
            emitter
                .emit_leading_comments_of_span(self.span(), false)
                .unwrap();
        }

        srcmap!(self, true);

        match self.kind {
            MetaPropKind::ImportMeta => keyword!("import.meta"),

            MetaPropKind::NewTarget => keyword!("new.target"),
        }
    }
}

#[node_impl]
impl MacroNode for PrivateMethod {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        if self.is_static {
            keyword!("static");
            space!();
        }
        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!("async");
                    space!();
                }
                if self.function.is_generator {
                    punct!("*");
                }

                emit!(self.key);
            }
            MethodKind::Getter => {
                keyword!("get");
                space!();

                emit!(self.key);
            }
            MethodKind::Setter => {
                keyword!("set");
                space!();

                emit!(self.key);
            }
        }

        emitter.emit_fn_trailing(&self.function).unwrap();
    }
}

#[node_impl]
impl MacroNode for Bool {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        keyword!(if self.value { "true" } else { "false" });
    }
}

#[node_impl]
impl MacroNode for ClassMethod {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.key.span(), false)
            .unwrap();

        srcmap!(self, true);

        for d in &self.function.decorators {
            emit!(d);
        }

        emitter.emit_accessibility(self.accessibility).unwrap();

        if self.is_static {
            keyword!("static");

            let starts_with_alpha_num = match self.kind {
                MethodKind::Method => {
                    if self.function.is_async {
                        true
                    } else if self.function.is_generator {
                        false
                    } else {
                        self.key.starts_with_alpha_num()
                    }
                }
                MethodKind::Getter | MethodKind::Setter => true,
            };

            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }
        }

        if self.is_abstract {
            keyword!("abstract");
            space!()
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        match self.kind {
            MethodKind::Method => {
                if self.function.is_async {
                    keyword!("async");
                    space!();
                }
                if self.function.is_generator {
                    punct!("*");
                }

                emit!(self.key);
            }
            MethodKind::Getter => {
                keyword!("get");

                if self.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(self.key);
            }
            MethodKind::Setter => {
                keyword!("set");

                if self.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(self.key);
            }
        }

        if self.is_optional {
            punct!("?");
        }

        if let Some(type_params) = &self.function.type_params {
            emit!(type_params);
        }

        punct!("(");
        emitter
            .emit_list(
                self.function.span,
                Some(&self.function.params),
                ListFormat::CommaListElements,
            )
            .unwrap();

        punct!(")");

        if let Some(ty) = &self.function.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        if let Some(body) = &self.function.body {
            formatting_space!();
            emit!(body);
        } else {
            formatting_semi!()
        }
    }
}

#[node_impl]
impl MacroNode for StaticBlock {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        keyword!("static");
        emit!(self.body);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for PropName {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            PropName::Ident(ident) => {
                // TODO: Use write_symbol when ident is a symbol.
                emitter
                    .emit_leading_comments_of_span(ident.span, false)
                    .unwrap();

                // Source map
                emitter.wr.commit_pending_semi().unwrap();

                srcmap!(ident, true);

                if emitter.cfg.ascii_only {
                    if emitter.wr.can_ignore_invalid_unicodes() {
                        emitter
                            .wr
                            .write_symbol(
                                DUMMY_SP,
                                &get_ascii_only_ident(&ident.sym, true, emitter.cfg.target),
                            )
                            .unwrap();
                    } else {
                        emitter
                            .wr
                            .write_symbol(
                                DUMMY_SP,
                                &get_ascii_only_ident(
                                    &handle_invalid_unicodes(&ident.sym),
                                    true,
                                    emitter.cfg.target,
                                ),
                            )
                            .unwrap();
                    }
                } else {
                    emit!(ident);
                }
            }
            PropName::Str(ref n) => emit!(n),
            PropName::Num(ref n) => emit!(n),
            PropName::BigInt(ref n) => emit!(n),
            PropName::Computed(ref n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for ComputedPropName {
    fn emit(&mut self, emitter: &mut Macro) {
        srcmap!(self, true);

        punct!("[");
        emit!(self.expr);
        punct!("]");

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for CondExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.test);
        formatting_space!();
        punct!("?");
        formatting_space!();
        emit!(self.cons);
        formatting_space!();
        punct!(":");
        formatting_space!();
        emit!(self.alt);
    }
}

#[node_impl]
impl MacroNode for FnExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        emitter.wr.commit_pending_semi().unwrap();

        srcmap!(self, true);

        if self.function.is_async {
            keyword!("async");
            space!();
            keyword!("function");
        } else {
            keyword!("function");
        }

        if self.function.is_generator {
            punct!("*");
        }
        if let Some(ref i) = self.ident {
            space!();
            emit!(i);
        }

        emitter.emit_fn_trailing(&self.function).unwrap();
    }
}

#[node_impl]
impl MacroNode for BlockStmtOrExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            BlockStmtOrExpr::BlockStmt(block) => {
                emitter.emit_block_stmt_inner(block, true).unwrap();
            }
            BlockStmtOrExpr::Expr(expr) => {
                emitter.wr.increase_indent().unwrap();
                emit!(expr);
                emitter.wr.decrease_indent().unwrap();
            }
        }
    }
}

#[node_impl]
impl MacroNode for ThisExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        keyword!(self.span, "this");
    }
}

#[node_impl]
impl MacroNode for Tpl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        punct!("`");

        for i in 0..(self.quasis.len() + self.exprs.len()) {
            if i % 2 == 0 {
                emit!(self.quasis[i / 2]);
            } else {
                punct!("${");
                emit!(self.exprs[i / 2]);
                punct!("}");
            }
        }

        punct!("`");

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for TplElement {
    fn emit(&mut self, emitter: &mut Macro) {
        let raw = self.raw.replace("\r\n", "\n").replace('\r', "\n");
        if emitter.cfg.minify || (emitter.cfg.ascii_only && !self.raw.is_ascii()) {
            let v = get_template_element_from_raw(&raw, emitter.cfg.ascii_only);
            let span = self.span();

            let mut last_offset_gen = 0;

            for ((offset_gen, _), mat) in v
                .match_indices('\n')
                .zip(NEW_LINE_TPL_REGEX.find_iter(&raw))
            {
                // If the string starts with a newline char, then adding a mark is redundant.
                // This catches both "no newlines" and "newline after several chars".
                emitter
                    .wr
                    .write_str_lit(DUMMY_SP, &v[last_offset_gen..offset_gen])
                    .unwrap();
                emitter.wr.add_srcmap(mat.end()).unwrap();
                last_offset_gen = offset_gen + 1;
            }

            emitter
                .wr
                .write_str_lit(DUMMY_SP, &v[last_offset_gen..])
                .unwrap();
            emitter.wr.add_srcmap(span.hi).unwrap();
        } else {
            emitter.wr.write_str_lit(self.span(), &raw).unwrap();
        }
    }
}

#[node_impl]
impl MacroNode for TaggedTpl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        if let Expr::New(new) = &*self.tag {
            emitter.emit_new(new, false).unwrap();
        } else {
            emit!(self.tag);
        }

        emit!(self.type_params);
        emitter
            .emit_template_for_tagged_template(&self.tpl)
            .unwrap();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for UnaryExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        let need_formatting_space = match self.op {
            op!("typeof") | op!("void") | op!("delete") => {
                keyword!(self.op.as_str());

                true
            }
            op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~") => {
                punct!(self.op.as_str());
                false
            }
        };

        if should_emit_whitespace_before_operand(self) {
            space!();
        } else if need_formatting_space {
            formatting_space!();
        }

        emit!(self.arg);
    }
}

#[node_impl]
impl MacroNode for UpdateExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        if self.prefix {
            operator!(self.op.as_str());
            //TODO: Check if we should use should_emit_whitespace_before_operand
            emit!(self.arg);
        } else {
            emit!(self.arg);
            operator!(self.op.as_str());
        }
    }
}

#[node_impl]
impl MacroNode for YieldExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        keyword!("yield");
        if self.delegate {
            operator!("*");
        }

        if let Some(ref arg) = self.arg {
            let need_paren = node
                .arg
                .as_deref()
                .map(expr_precedence_cmp::needs_paren_in_yield)
                .unwrap_or(false);
            if need_paren {
                punct!("(")
            } else if !node.delegate && arg.starts_with_alpha_num() {
                space!()
            } else {
                formatting_space!()
            }

            emit!(self.arg);
            if need_paren {
                punct!(")")
            }
        }
    }
}

#[node_impl]
impl MacroNode for AwaitExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        keyword!("await");
        space!();

        emit!(&self.arg);
    }
}

#[node_impl]
impl MacroNode for ParenExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.wr.prevent_emit_paren().unwrap();

        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        punct!("(");
        emit!(self.expr);

        srcmap!(self, false, true);
        punct!(")");
    }
}

#[node_impl]
impl MacroNode for PrivateName {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        punct!("#");
        emitter
            .emit_ident_like(self.span, &self.name, false)
            .unwrap();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for BindingIdent {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_ident_like(self.span, &self.sym, self.optional)
            .unwrap();

        if let Some(ty) = &self.type_ann {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }
    }
}

#[node_impl]
impl MacroNode for Ident {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_ident_like(self.span, &self.sym, self.optional)
            .unwrap();
    }
}

#[node_impl]
impl MacroNode for IdentName {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_ident_like(self.span, &self.sym, false)
            .unwrap();
    }
}

#[node_impl]
impl MacroNode for Param {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emitter
            .emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)
            .unwrap();

        emit!(self.pat);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for Pat {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            Pat::Array(ref n) => emit!(n),
            Pat::Assign(ref n) => emit!(n),
            Pat::Expr(ref n) => emit!(n),
            Pat::Ident(ref n) => emit!(n),
            Pat::Object(ref n) => emit!(n),
            Pat::Rest(ref n) => emit!(n),
            Pat::Invalid(n) => emit!(n),
        }

        if emitter.comments.is_some() {
            emitter
                .emit_trailing_comments_of_pos(self.span().hi, true, true)
                .unwrap();
        }
    }
}

#[node_impl]
impl MacroNode for RestPat {
    fn emit(&mut self, emitter: &mut Macro) {
        punct!(self.dot3_token, "...");
        emit!(self.arg);

        if let Some(type_ann) = &self.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }
    }
}

#[node_impl]
impl MacroNode for AssignPatProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.key);
        punct!("=");
        emit!(self.value);
    }
}

#[node_impl]
impl MacroNode for ForHead {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            ForHead::Pat(n) => emit!(n),
            ForHead::VarDecl(n) => emit!(n),
            ForHead::UsingDecl(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for MemberExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        let mut needs_2dots_for_property_access = false;
        match &*self.obj {
            Expr::OptChain(e) => {
                emit!(e);
                needs_2dots_for_property_access = true;
            }
            _ => {
                emit!(self.obj);
            }
        }

        match &self.prop {
            MemberProp::Computed(computed) => emit!(computed),
            MemberProp::Ident(ident) => {
                if needs_2dots_for_property_access {
                    if self.prop.span().lo() >= BytePos(2) {
                        emitter
                            .emit_leading_comments(self.prop.span().lo() - BytePos(2), false)
                            .unwrap();
                    }
                    punct!(".");
                }
                if self.prop.span().lo() >= BytePos(1) {
                    emitter
                        .emit_leading_comments(self.prop.span().lo() - BytePos(1), false)
                        .unwrap();
                }
                punct!(".");
                emit!(ident);
            }
            MemberProp::PrivateName(private) => {
                if needs_2dots_for_property_access {
                    if self.prop.span().lo() >= BytePos(2) {
                        emitter
                            .emit_leading_comments(self.prop.span().lo() - BytePos(2), false)
                            .unwrap();
                    }
                    punct!(".");
                }
                if self.prop.span().lo() >= BytePos(1) {
                    emitter
                        .emit_leading_comments(self.prop.span().lo() - BytePos(1), false)
                        .unwrap();
                }
                punct!(".");
                emit!(private);
            }
        }

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for PrivateProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emitter.emit_accessibility(self.accessibility).unwrap();

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        if self.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(self.key);

        if self.is_optional {
            punct!("?");
        }

        if let Some(type_ann) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(value) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();

            if value.is_seq() {
                punct!("(");
                emit!(value);
                punct!(")");
            } else {
                emit!(value);
            }
        }

        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ClassProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();
        srcmap!(self, true);

        for dec in &self.decorators {
            emit!(dec)
        }

        if self.declare {
            keyword!("declare");
            space!();
        }

        emitter.emit_accessibility(self.accessibility).unwrap();

        if self.is_static {
            keyword!("static");
            space!();
        }

        if self.is_abstract {
            keyword!("abstract");
            space!()
        }

        if self.is_override {
            keyword!("override");
            space!()
        }

        if self.readonly {
            keyword!("readonly");
            space!()
        }

        emit!(self.key);

        if self.is_optional {
            punct!("?");
        }

        if let Some(ty) = &self.type_ann {
            if self.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(ty);
        }

        if let Some(v) = &self.value {
            formatting_space!();
            punct!("=");
            formatting_space!();

            if v.is_seq() {
                punct!("(");
                emit!(v);
                punct!(")");
            } else {
                emit!(v);
            }
        }

        semi!();

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for Constructor {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emitter.emit_accessibility(self.accessibility).unwrap();

        keyword!("constructor");
        punct!("(");
        emitter
            .emit_list(self.span(), Some(&self.params), ListFormat::Parameters)
            .unwrap();
        punct!(")");

        if let Some(body) = &self.body {
            emit!(body);
        } else {
            formatting_semi!();
        }
    }
}

#[node_impl]
impl MacroNode for ArrayPat {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        punct!("[");

        let mut format = ListFormat::ArrayBindingPatternElements;
        if self.elems.last().map(|v| v.is_none()).unwrap_or(false) {
            format |= ListFormat::ForceTrailingComma;
        }

        emitter
            .emit_list(self.span(), Some(&self.elems), format)
            .unwrap();
        punct!("]");
        if self.optional {
            punct!("?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for AssignPat {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.left);
        formatting_space!();
        punct!("=");
        formatting_space!();
        emit!(self.right);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ObjectPat {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);
        punct!("{");

        emitter
            .emit_list(
                self.span(),
                Some(&self.props),
                ListFormat::ObjectBindingPatternElements | ListFormat::CanSkipTrailingComma,
            )
            .unwrap();

        punct!("}");

        if self.optional {
            punct!("?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for ObjectPatProp {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            ObjectPatProp::KeyValue(ref node) => emit!(node),
            ObjectPatProp::Assign(ref node) => emit!(node),
            ObjectPatProp::Rest(ref node) => emit!(node),
        }
    }
}

#[node_impl]
impl MacroNode for KeyValuePatProp {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_span(self.span(), false)
            .unwrap();

        srcmap!(self, true);

        emit!(self.key);
        punct!(":");
        formatting_space!();
        emit!(self.value);

        srcmap!(self, false);
    }
}

#[node_impl]
impl MacroNode for SimpleAssignTarget {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            SimpleAssignTarget::Ident(n) => emit!(n),
            SimpleAssignTarget::Member(n) => emit!(n),
            SimpleAssignTarget::Invalid(n) => emit!(n),
            SimpleAssignTarget::SuperProp(n) => emit!(n),
            SimpleAssignTarget::Paren(n) => emit!(n),
            SimpleAssignTarget::OptChain(n) => emit!(n),
            SimpleAssignTarget::TsAs(n) => emit!(n),
            SimpleAssignTarget::TsNonNull(n) => emit!(n),
            SimpleAssignTarget::TsSatisfies(n) => emit!(n),
            SimpleAssignTarget::TsTypeAssertion(n) => emit!(n),
            SimpleAssignTarget::TsInstantiation(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for AssignTargetPat {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            AssignTargetPat::Array(n) => emit!(n),
            AssignTargetPat::Object(n) => emit!(n),
            AssignTargetPat::Invalid(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for AssignTarget {
    fn emit(&mut self, emitter: &mut Macro) {
        match *self {
            AssignTarget::Simple(ref n) => emit!(n),
            AssignTarget::Pat(ref n) => emit!(n),
        }
    }
}

impl Macro {
    fn emit_bin_expr_trailing(&mut self, node: &BinExpr) -> Result<(), anyhow::Error> {
        let is_kwd_op = match node.op {
            BinaryOp::In | BinaryOp::InstanceOf => true,
            _ => false,
        };

        let formatting_before_op = if is_kwd_op {
            space!();
            true
        } else {
            let is_close_to_right = false;

            if is_close_to_right {
                formatting_space!();
                false
            } else {
                formatting_space!();
                true
            }
        };

        if is_kwd_op {
            keyword!(node.op.as_str());
        } else {
            operator!(node.op.as_str());
        }

        if formatting_before_op {
            space!();
        } else {
            formatting_space!();
        }
        emit!(node.right);

        Ok(())
    }
}
