#![recursion_limit = "1024"]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::nonminimal_bool)]
#![allow(non_local_definitions)]

use std::{borrow::Cow, fmt::Write, io, ops::Deref, str};

use ascii::AsciiChar;
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

pub trait Node: Spanned {
    fn emit_with<W, S>(&self, e: &mut Emitter<'_, W, S>) -> Result
    where
        W: WriteJs,
        S: SourceMapper + SourceMapperExt;
}
impl<N: Node> Node for Box<N> {
    #[inline]
    fn emit_with<W, S>(&self, e: &mut Emitter<'_, W, S>) -> Result
    where
        W: WriteJs,
        S: SourceMapper + SourceMapperExt,
    {
        (**self).emit_with(e)
    }
}
impl<N: Node> Node for &N {
    #[inline]
    fn emit_with<W, S>(&self, e: &mut Emitter<'_, W, S>) -> Result
    where
        W: WriteJs,
        S: SourceMapper + SourceMapperExt,
    {
        (**self).emit_with(e)
    }
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

    #[emitter]
    fn emit_member_expr(&mut self, node: &MemberExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        let mut needs_2dots_for_property_access = false;

        match &*node.obj {
            Expr::New(new) => {
                self.emit_new(new, false)?;
            }
            Expr::Lit(Lit::Num(num)) => {
                needs_2dots_for_property_access = self.emit_num_lit_internal(num, true)?;
            }
            _ => {
                emit!(node.obj);
            }
        }

        match &node.prop {
            MemberProp::Computed(computed) => emit!(computed),
            MemberProp::Ident(ident) => {
                if needs_2dots_for_property_access {
                    if node.prop.span().lo() >= BytePos(2) {
                        self.emit_leading_comments(node.prop.span().lo() - BytePos(2), false)?;
                    }
                    punct!(".");
                }
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(".");
                emit!(ident);
            }
            MemberProp::PrivateName(private) => {
                if needs_2dots_for_property_access {
                    if node.prop.span().lo() >= BytePos(2) {
                        self.emit_leading_comments(node.prop.span().lo() - BytePos(2), false)?;
                    }
                    punct!(".");
                }
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(".");
                emit!(private);
            }
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_super_expr(&mut self, node: &SuperPropExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.obj);

        match &node.prop {
            SuperProp::Computed(computed) => emit!(computed),
            SuperProp::Ident(i) => {
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(".");
                emit!(i);
            }
        }
    }

    #[emitter]
    fn emit_arrow_expr(&mut self, node: &ArrowExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        let space = !self.cfg.minify
            || match node.params.as_slice() {
                [Pat::Ident(_)] => true,
                _ => false,
            };

        if node.is_async {
            keyword!("async");
            if space {
                space!();
            } else {
                formatting_space!();
            }
        }
        if node.is_generator {
            punct!("*")
        }

        let parens = !self.cfg.minify
            || match node.params.as_slice() {
                [Pat::Ident(i)] => self.has_trailing_comment(i.span),
                _ => true,
            };

        emit!(node.type_params);

        if parens {
            punct!("(");
        }

        self.emit_list(node.span, Some(&node.params), ListFormat::CommaListElements)?;
        if parens {
            punct!(")");
        }

        if let Some(ty) = &node.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
            formatting_space!();
        }

        punct!("=>");
        emit!(node.body);
    }

    #[emitter]
    fn emit_meta_prop_expr(&mut self, node: &MetaPropExpr) -> Result {
        if self.comments.is_some() {
            self.emit_leading_comments_of_span(node.span(), false)?;
        }

        srcmap!(node, true);

        match node.kind {
            MetaPropKind::ImportMeta => keyword!("import.meta"),

            MetaPropKind::NewTarget => keyword!("new.target"),
        }
    }

    /// Prints operator and right node of a binary expression.
    #[inline(never)]
    fn emit_bin_expr_trailing(&mut self, node: &BinExpr) -> Result {
        // let indent_before_op = needs_indention(node, &node.left, node.op);
        // let indent_after_op = needs_indention(node, node.op, &node.right);
        let is_kwd_op = match node.op {
            op!("in") | op!("instanceof") => true,
            _ => false,
        };

        let need_pre_space = if self.cfg.minify {
            if is_kwd_op {
                node.left.ends_with_alpha_num()
            } else {
                // space is mandatory to avoid outputting -->
                match *node.left {
                    Expr::Update(UpdateExpr {
                        prefix: false, op, ..
                    }) => matches!(
                        (op, node.op),
                        (op!("--"), op!(">") | op!(">>") | op!(">>>") | op!(">="))
                    ),
                    _ => false,
                }
            }
        } else {
            is_kwd_op
                || match *node.left {
                    Expr::Update(UpdateExpr { prefix: false, .. }) => true,
                    _ => false,
                }
        };
        if need_pre_space {
            space!(self);
        } else {
            formatting_space!(self);
        }
        operator!(self, node.op.as_str());

        let need_post_space = if self.cfg.minify {
            if is_kwd_op {
                node.right.starts_with_alpha_num()
            } else if node.op == op!("/") {
                let span = node.right.span();

                span.is_pure()
                    || self
                        .comments
                        .map_or(false, |comments| comments.has_leading(node.right.span().lo))
            } else {
                require_space_before_rhs(&node.right, &node.op)
            }
        } else {
            is_kwd_op
                || match *node.right {
                    Expr::Unary(..) | Expr::Update(UpdateExpr { prefix: true, .. }) => true,
                    _ => false,
                }
        };
        if need_post_space {
            space!(self);
        } else {
            formatting_space!(self);
        }
        emit!(self, node.right);

        Ok(())
    }

    #[emitter]
    fn emit_private_method(&mut self, n: &PrivateMethod) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        if n.is_static {
            keyword!("static");
            space!();
        }
        match n.kind {
            MethodKind::Method => {
                if n.function.is_async {
                    keyword!("async");
                    space!();
                }
                if n.function.is_generator {
                    punct!("*");
                }

                emit!(n.key);
            }
            MethodKind::Getter => {
                keyword!("get");
                space!();

                emit!(n.key);
            }
            MethodKind::Setter => {
                keyword!("set");
                space!();

                emit!(n.key);
            }
        }

        self.emit_fn_trailing(&n.function)?;
    }

    #[emitter]
    fn emit_bool(&mut self, n: &Bool) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.value {
            keyword!(n.span, "true")
        } else {
            keyword!(n.span, "false")
        }
    }

    #[emitter]
    fn emit_class_method(&mut self, n: &ClassMethod) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_leading_comments_of_span(n.key.span(), false)?;

        srcmap!(n, true);

        for d in &n.function.decorators {
            emit!(d);
        }

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");

            let starts_with_alpha_num = match n.kind {
                MethodKind::Method => {
                    if n.function.is_async {
                        true
                    } else if n.function.is_generator {
                        false
                    } else {
                        n.key.starts_with_alpha_num()
                    }
                }
                MethodKind::Getter => true,
                MethodKind::Setter => true,
            };

            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }
        }

        if n.is_abstract {
            keyword!("abstract");
            space!()
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        match n.kind {
            MethodKind::Method => {
                if n.function.is_async {
                    keyword!("async");
                    space!();
                }
                if n.function.is_generator {
                    punct!("*");
                }

                emit!(n.key);
            }
            MethodKind::Getter => {
                keyword!("get");

                if n.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(n.key);
            }
            MethodKind::Setter => {
                keyword!("set");

                if n.key.starts_with_alpha_num() {
                    space!();
                } else {
                    formatting_space!()
                }

                emit!(n.key);
            }
        }

        if n.is_optional {
            punct!("?");
        }

        if let Some(type_params) = &n.function.type_params {
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(
            n.function.span,
            Some(&n.function.params),
            ListFormat::CommaListElements,
        )?;

        punct!(")");

        if let Some(ty) = &n.function.return_type {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        if let Some(body) = &n.function.body {
            formatting_space!();
            emit!(body);
        } else {
            formatting_semi!()
        }
    }

    #[emitter]
    fn emit_private_prop(&mut self, n: &PrivateProp) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        if n.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(n.key);

        if n.is_optional {
            punct!("?");
        }

        if let Some(type_ann) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(value) = &n.value {
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

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_class_prop(&mut self, n: &ClassProp) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;
        srcmap!(n, true);

        for dec in &n.decorators {
            emit!(dec)
        }

        if n.declare {
            keyword!("declare");
            space!();
        }

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_abstract {
            keyword!("abstract");
            space!()
        }

        if n.is_override {
            keyword!("override");
            space!()
        }

        if n.readonly {
            keyword!("readonly");
            space!()
        }

        emit!(n.key);

        if n.is_optional {
            punct!("?");
        }

        if let Some(ty) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(ty);
        }

        if let Some(v) = &n.value {
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

        srcmap!(n, false);
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

    #[emitter]

    fn emit_class_constructor(&mut self, n: &Constructor) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        self.emit_accessibility(n.accessibility)?;

        keyword!("constructor");
        punct!("(");
        self.emit_list(n.span(), Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(body) = &n.body {
            emit!(body);
        } else {
            formatting_semi!();
        }
    }

    #[emitter]
    fn emit_static_block(&mut self, n: &StaticBlock) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("static");
        emit!(n.body);

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_prop_name(&mut self, node: &PropName) -> Result {
        match node {
            PropName::Ident(ident) => {
                // TODO: Use write_symbol when ident is a symbol.
                self.emit_leading_comments_of_span(ident.span, false)?;

                // Source map
                self.wr.commit_pending_semi()?;

                srcmap!(ident, true);

                if self.cfg.ascii_only {
                    if self.wr.can_ignore_invalid_unicodes() {
                        self.wr.write_symbol(
                            DUMMY_SP,
                            &get_ascii_only_ident(&ident.sym, true, self.cfg.target),
                        )?;
                    } else {
                        self.wr.write_symbol(
                            DUMMY_SP,
                            &get_ascii_only_ident(
                                &handle_invalid_unicodes(&ident.sym),
                                true,
                                self.cfg.target,
                            ),
                        )?;
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

    #[emitter]
    fn emit_computed_prop_name(&mut self, n: &ComputedPropName) -> Result {
        srcmap!(n, true);

        punct!("[");
        emit!(n.expr);
        punct!("]");

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_cond_expr(&mut self, node: &CondExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.test);
        formatting_space!();
        punct!("?");
        formatting_space!();
        emit!(node.cons);
        formatting_space!();
        punct!(":");
        formatting_space!();
        emit!(node.alt);
    }

    #[emitter]
    fn emit_fn_expr(&mut self, n: &FnExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(n, true);

        if n.function.is_async {
            keyword!("async");
            space!();
            keyword!("function");
        } else {
            keyword!("function");
        }

        if n.function.is_generator {
            punct!("*");
        }
        if let Some(ref i) = n.ident {
            space!();
            emit!(i);
        }

        self.emit_fn_trailing(&n.function)?;
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

    #[emitter]
    fn emit_block_stmt_or_expr(&mut self, node: &BlockStmtOrExpr) -> Result {
        match node {
            BlockStmtOrExpr::BlockStmt(block) => {
                self.emit_block_stmt_inner(block, true)?;
            }
            BlockStmtOrExpr::Expr(expr) => {
                self.wr.increase_indent()?;
                emit!(expr);
                self.wr.decrease_indent()?;
            }
        }
    }

    #[emitter]
    fn emit_this_expr(&mut self, node: &ThisExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        keyword!(node.span, "this");
    }

    #[emitter]
    fn emit_tpl_lit(&mut self, node: &Tpl) -> Result {
        debug_assert!(node.quasis.len() == node.exprs.len() + 1);

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("`");

        for i in 0..(node.quasis.len() + node.exprs.len()) {
            if i % 2 == 0 {
                emit!(node.quasis[i / 2]);
            } else {
                punct!("${");
                emit!(node.exprs[i / 2]);
                punct!("}");
            }
        }

        punct!("`");

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_quasi(&mut self, node: &TplElement) -> Result {
        let raw = node.raw.replace("\r\n", "\n").replace('\r', "\n");
        if self.cfg.minify || (self.cfg.ascii_only && !node.raw.is_ascii()) {
            let v = get_template_element_from_raw(&raw, self.cfg.ascii_only);
            let span = node.span();

            let mut last_offset_gen = 0;
            let mut last_offset_origin = 0;
            for ((offset_gen, _), mat) in v
                .match_indices('\n')
                .zip(NEW_LINE_TPL_REGEX.find_iter(&raw))
            {
                // If the string starts with a newline char, then adding a mark is redundant.
                // This catches both "no newlines" and "newline after several chars".
                if offset_gen != 0 {
                    self.wr
                        .add_srcmap(span.lo + BytePos(last_offset_origin as u32))?;
                }

                self.wr
                    .write_str_lit(DUMMY_SP, &v[last_offset_gen..=offset_gen])?;
                last_offset_gen = offset_gen + 1;
                last_offset_origin = mat.end();
            }
            self.wr
                .add_srcmap(span.lo + BytePos(last_offset_origin as u32))?;
            self.wr.write_str_lit(DUMMY_SP, &v[last_offset_gen..])?;
            self.wr.add_srcmap(span.hi)?;
        } else {
            self.wr.write_str_lit(node.span(), &raw)?;
        }
    }

    #[emitter]
    fn emit_tagged_tpl_lit(&mut self, node: &TaggedTpl) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if let Expr::New(new) = &*node.tag {
            self.emit_new(new, false)?;
        } else {
            emit!(node.tag);
        }

        emit!(node.type_params);
        self.emit_template_for_tagged_template(&node.tpl)?;

        srcmap!(node, false);
    }

    fn emit_template_for_tagged_template(&mut self, node: &Tpl) -> Result {
        debug_assert!(node.quasis.len() == node.exprs.len() + 1);

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(self, node, true);

        punct!(self, "`");

        for i in 0..(node.quasis.len() + node.exprs.len()) {
            if i % 2 == 0 {
                self.emit_template_element_for_tagged_template(&node.quasis[i / 2])?;
            } else {
                punct!(self, "${");
                emit!(self, node.exprs[i / 2]);
                punct!(self, "}");
            }
        }

        punct!(self, "`");

        srcmap!(self, node, false);

        Ok(())
    }

    fn emit_template_element_for_tagged_template(&mut self, node: &TplElement) -> Result {
        srcmap!(self, node, true);

        self.wr.write_str_lit(DUMMY_SP, &node.raw)?;

        srcmap!(self, node, false);

        Ok(())
    }

    #[emitter]
    fn emit_unary_expr(&mut self, n: &UnaryExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        let need_formatting_space = match n.op {
            op!("typeof") | op!("void") | op!("delete") => {
                keyword!(n.op.as_str());

                true
            }
            op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~") => {
                punct!(n.op.as_str());
                false
            }
        };

        if should_emit_whitespace_before_operand(n) {
            space!();
        } else if need_formatting_space {
            formatting_space!();
        }

        emit!(n.arg);
    }

    #[emitter]
    fn emit_update_expr(&mut self, node: &UpdateExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if node.prefix {
            operator!(node.op.as_str());
            //TODO: Check if we should use should_emit_whitespace_before_operand
            emit!(node.arg);
        } else {
            emit!(node.arg);
            operator!(node.op.as_str());
        }
    }

    #[emitter]
    fn emit_yield_expr(&mut self, node: &YieldExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("yield");
        if node.delegate {
            operator!("*");
        }

        if let Some(ref arg) = node.arg {
            let need_paren = node
                .arg
                .as_deref()
                .map(|expr| self.has_leading_comment(expr))
                .unwrap_or(false);
            if need_paren {
                punct!("(")
            } else if !node.delegate && arg.starts_with_alpha_num() {
                space!()
            } else {
                formatting_space!()
            }

            emit!(node.arg);
            if need_paren {
                punct!(")")
            }
        }
    }

    fn emit_expr_or_spreads(
        &mut self,
        parent_node: Span,
        nodes: &[ExprOrSpread],
        format: ListFormat,
    ) -> Result {
        self.emit_list(parent_node, Some(nodes), format)
    }

    #[emitter]
    fn emit_await_expr(&mut self, n: &AwaitExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("await");
        space!();

        emit!(&n.arg);
    }

    #[emitter]
    fn emit_paren_expr(&mut self, node: &ParenExpr) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("(");
        emit!(node.expr);

        srcmap!(node, false, true);
        punct!(")");
    }

    #[emitter]
    fn emit_private_name(&mut self, n: &PrivateName) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        punct!("#");
        self.emit_ident_like(n.span, &n.name, false)?;

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_binding_ident(&mut self, ident: &BindingIdent) -> Result {
        self.emit_ident_like(ident.span, &ident.sym, ident.optional)?;

        if let Some(ty) = &ident.type_ann {
            punct!(":");
            formatting_space!();
            emit!(ty);
        }

        // Call emitList directly since it could be an array of
        // TypeParameterDeclarations _or_ type arguments

        // emitList(node, node.typeArguments, ListFormat::TypeParameters);
    }

    #[emitter]
    fn emit_ident(&mut self, ident: &Ident) -> Result {
        self.emit_ident_like(ident.span, &ident.sym, ident.optional)?;
    }

    #[emitter]
    fn emit_ident_name(&mut self, ident: &IdentName) -> Result {
        self.emit_ident_like(ident.span, &ident.sym, false)?;
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

/// Patterns
impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    fn emit_param(&mut self, node: &Param) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        self.emit_list(node.span, Some(&node.decorators), ListFormat::Decorators)?;

        emit!(node.pat);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_pat(&mut self, node: &Pat) -> Result {
        match node {
            Pat::Array(ref n) => emit!(n),
            Pat::Assign(ref n) => emit!(n),
            Pat::Expr(ref n) => emit!(n),
            Pat::Ident(ref n) => emit!(n),
            Pat::Object(ref n) => emit!(n),
            Pat::Rest(ref n) => emit!(n),
            Pat::Invalid(n) => emit!(n),
        }

        if self.comments.is_some() {
            self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        }
    }

    #[emitter]
    fn emit_rest_pat(&mut self, node: &RestPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        punct!(node.dot3_token, "...");
        emit!(node.arg);

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_prop_or_spread(&mut self, node: &PropOrSpread) -> Result {
        match *node {
            PropOrSpread::Prop(ref n) => emit!(n),
            PropOrSpread::Spread(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_spread_element(&mut self, node: &SpreadElement) -> Result {
        if self.comments.is_some() {
            self.emit_leading_comments_of_span(node.span(), false)?;
        }

        srcmap!(node, true);

        punct!("...");
        emit!(node.expr);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_assign_target(&mut self, node: &AssignTarget) -> Result {
        match *node {
            AssignTarget::Simple(ref n) => emit!(n),
            AssignTarget::Pat(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_simple_assign_target(&mut self, node: &SimpleAssignTarget) -> Result {
        match node {
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

    #[emitter]
    fn emit_assign_target_pat(&mut self, node: &AssignTargetPat) -> Result {
        match node {
            AssignTargetPat::Array(n) => emit!(n),
            AssignTargetPat::Object(n) => emit!(n),
            AssignTargetPat::Invalid(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_array_pat(&mut self, node: &ArrayPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("[");

        let mut format = ListFormat::ArrayBindingPatternElements;

        if let Some(None) = node.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        self.emit_list(node.span(), Some(&node.elems), format)?;
        punct!("]");
        if node.optional {
            punct!("?");
        }

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_assign_pat(&mut self, node: &AssignPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.left);
        formatting_space!();
        punct!("=");
        formatting_space!();
        emit!(node.right);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_pat(&mut self, node: &ObjectPat) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);
        punct!("{");

        self.emit_list(
            node.span(),
            Some(&node.props),
            ListFormat::ObjectBindingPatternElements | ListFormat::CanSkipTrailingComma,
        )?;

        punct!("}");

        if node.optional {
            punct!("?");
        }

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_pat_prop(&mut self, node: &ObjectPatProp) -> Result {
        match *node {
            ObjectPatProp::KeyValue(ref node) => emit!(node),
            ObjectPatProp::Assign(ref node) => emit!(node),
            ObjectPatProp::Rest(ref node) => emit!(node),
        }
    }

    #[emitter]
    fn emit_object_kv_pat(&mut self, node: &KeyValuePatProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        punct!(":");
        formatting_space!();
        emit!(node.value);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_assign_pat(&mut self, node: &AssignPatProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        if let Some(value) = &node.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(value);
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_for_head(&mut self, node: &ForHead) -> Result {
        match node {
            ForHead::Pat(n) => emit!(n),
            ForHead::VarDecl(n) => emit!(n),
            ForHead::UsingDecl(n) => emit!(n),
        }
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
        emitter.emit_leading_comments_of_span(self.span(), false)?;
        let key_span = self.key.span();
        let value_span = self.value.span();
        if !key_span.is_dummy() {
            emitter.wr.add_srcmap(key_span.lo)?;
        }
        emit!(self.key);
        if !key_span.is_dummy() && value_span.is_dummy() {
            emitter.wr.add_srcmap(key_span.hi)?;
        }
        punct!(":");
        formatting_space!();
        if key_span.is_dummy() && !value_span.is_dummy() {
            emitter.wr.add_srcmap(value_span.lo)?;
        }
        emit!(self.value);
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
