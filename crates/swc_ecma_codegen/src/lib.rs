#![recursion_limit = "1024"]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::nonminimal_bool)]
#![allow(non_local_definitions)]

use std::{borrow::Cow, fmt::Write, io, ops::Deref, str};

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
use swc_ecma_codegen_macros::node_impl;

pub use self::config::Config;
use self::{text_writer::WriteJs, util::StartsWithAlphaNum};
use crate::util::EndsWithAlphaNum;

#[macro_use]
pub mod macros;
mod class;
mod comments;
mod config;
mod decl;
mod expr;
mod jsx;
mod lit;
mod module_decls;
mod object;
mod pat;
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

static NEW_LINE_TPL_REGEX: Lazy<regex::Regex> = Lazy::new(|| regex::Regex::new(r"\\n|\n").unwrap());

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    pub fn emit_program(&mut self, node: &Program) -> Result {
        match *node {
            Program::Module(ref m) => emit!(m),
            Program::Script(ref s) => emit!(s),
            // TODO: reenable once experimental_metadata breaking change is merged
            // _ => unreachable!(),
        }
    }

    #[emitter]
    #[tracing::instrument(skip_all)]
    pub fn emit_module(&mut self, node: &Module) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        if node.body.is_empty() {
            srcmap!(emitter, node, true);
        }

        if let Some(ref shebang) = node.shebang {
            punct!(emitter, "#!");
            self.wr.write_str_lit(DUMMY_SP, shebang)?;
            self.wr.write_line()?;
        }
        for stmt in &node.body {
            emit!(stmt);
        }

        self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        if !self.cfg.omit_last_semi {
            self.wr.commit_pending_semi()?;
        }
    }

    #[emitter]
    #[tracing::instrument(skip_all)]
    pub fn emit_script(&mut self, node: &Script) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        if node.body.is_empty() {
            srcmap!(emitter, node, true);
        }

        if let Some(ref shebang) = node.shebang {
            punct!(emitter, "#!");
            self.wr.write_str_lit(DUMMY_SP, shebang)?;
            self.wr.write_line()?;
        }
        for stmt in &node.body {
            emit!(stmt);
        }

        self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        if !self.cfg.omit_last_semi {
            self.wr.commit_pending_semi()?;
        }
    }

    #[emitter]
    pub fn emit_module_item(&mut self, node: &ModuleItem) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;
        match *node {
            ModuleItem::Stmt(ref stmt) => emit!(stmt),
            ModuleItem::ModuleDecl(ref decl) => emit!(decl),
        }
        self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
    }

    fn emit_atom(&mut self, span: Span, value: &Atom) -> Result {
        self.wr.write_str_lit(span, value)?;

        Ok(())
    }

    #[emitter]
    fn emit_callee(&mut self, node: &Callee) -> Result {
        match *node {
            Callee::Expr(ref e) => {
                if let Expr::New(new) = &**e {
                    self.emit_new(new, false)?;
                } else {
                    emit!(e);
                }
            }
            Callee::Super(ref n) => emit!(n),
            Callee::Import(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_super(&mut self, node: &Super) -> Result {
        keyword!(emitter, node.span, "super");
    }

    #[emitter]
    fn emit_import_callee(&mut self, node: &Import) -> Result {
        keyword!(emitter, node.span, "import");
        match node.phase {
            ImportPhase::Source => {
                punct!(emitter, ".");
                keyword!(emitter, "source")
            }
            ImportPhase::Defer => {
                punct!(emitter, ".");
                keyword!(emitter, "defer")
            }
            _ => {}
        }
    }

    #[emitter]

    fn emit_expr(&mut self, node: &Expr) -> Result {
        match node {
            Expr::Array(ref n) => emit!(n),
            Expr::Arrow(ref n) => emit!(n),
            Expr::Assign(ref n) => emit!(n),
            Expr::Await(ref n) => emit!(n),
            Expr::Bin(ref n) => emit!(n),
            Expr::Call(ref n) => emit!(n),
            Expr::Class(ref n) => emit!(n),
            Expr::Cond(ref n) => emit!(n),
            Expr::Fn(ref n) => emit!(n),
            Expr::Ident(ref n) => emit!(n),
            Expr::Lit(ref n) => emit!(n),
            Expr::Member(ref n) => emit!(n),
            Expr::SuperProp(ref n) => emit!(n),
            Expr::MetaProp(ref n) => emit!(n),
            Expr::New(ref n) => emit!(n),
            Expr::Object(ref n) => emit!(n),
            Expr::Paren(ref n) => emit!(n),
            Expr::Seq(ref n) => emit!(n),
            Expr::TaggedTpl(ref n) => emit!(n),
            Expr::This(ref n) => emit!(n),
            Expr::Tpl(ref n) => emit!(n),
            Expr::Unary(ref n) => emit!(n),
            Expr::Update(ref n) => emit!(n),
            Expr::Yield(ref n) => emit!(n),
            Expr::PrivateName(ref n) => emit!(n),

            Expr::JSXMember(ref n) => emit!(n),
            Expr::JSXNamespacedName(ref n) => emit!(n),
            Expr::JSXEmpty(ref n) => emit!(n),
            Expr::JSXElement(ref n) => emit!(n),
            Expr::JSXFragment(ref n) => emit!(n),

            Expr::TsAs(ref n) => emit!(n),
            Expr::TsNonNull(ref n) => emit!(n),
            Expr::TsTypeAssertion(ref n) => emit!(n),
            Expr::TsConstAssertion(ref n) => emit!(n),
            Expr::TsInstantiation(ref n) => emit!(n),
            Expr::OptChain(ref n) => emit!(n),
            Expr::Invalid(ref n) => emit!(n),
            Expr::TsSatisfies(n) => {
                emit!(n)
            }
        }

        if self.comments.is_some() {
            self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        }
    }

    #[emitter]
    fn emit_opt_chain(&mut self, n: &OptChainExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match &*n.base {
            OptChainBase::Member(ref e) => {
                if let Expr::New(new) = &*e.obj {
                    self.emit_new(new, false)?;
                } else {
                    emit!(e.obj);
                }
                if n.optional {
                    punct!(emitter, "?.");
                } else if !e.prop.is_computed() {
                    punct!(emitter, ".");
                }

                match &e.prop {
                    MemberProp::Computed(computed) => emit!(computed),
                    MemberProp::Ident(i) => emit!(i),
                    MemberProp::PrivateName(p) => emit!(p),
                }
            }
            OptChainBase::Call(ref e) => {
                debug_assert!(!e.callee.is_new());
                emit!(e.callee);

                if n.optional {
                    punct!(emitter, "?.");
                }

                punct!(emitter, "(");
                self.emit_expr_or_spreads(n.span(), &e.args, ListFormat::CallExpressionArguments)?;
                punct!(emitter, ")");
            }
        }
    }

    #[emitter]
    fn emit_invalid(&mut self, n: &Invalid) -> Result {
        self.emit_leading_comments_of_span(n.span, false)?;

        self.wr.write_str_lit(n.span, "<invalid>")?;
    }

    #[emitter]
    fn emit_call_expr(&mut self, node: &CallExpr) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        emit!(node.callee);

        if let Some(type_args) = &node.type_args {
            emit!(type_args);
        }

        punct!(emitter, "(");
        self.emit_expr_or_spreads(node.span(), &node.args, ListFormat::CallExpressionArguments)?;
        punct!(emitter, ")");

        // srcmap!(emitter,node, false);
    }

    fn emit_new(&mut self, node: &NewExpr, should_ignore_empty_args: bool) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, self, node, true);

        keyword!(emitter, self, "new");

        let starts_with_alpha_num = node.callee.starts_with_alpha_num();

        if starts_with_alpha_num {
            space!(self);
        } else {
            formatting_space!(self);
        }
        emit!(self, node.callee);

        if let Some(type_args) = &node.type_args {
            emit!(self, type_args);
        }

        if let Some(ref args) = node.args {
            if !(self.cfg.minify && args.is_empty() && should_ignore_empty_args) {
                punct!(emitter, self, "(");
                self.emit_expr_or_spreads(node.span(), args, ListFormat::NewExpressionArguments)?;
                punct!(emitter, self, ")");
            }
        }

        // srcmap!(emitter,self, node, false);

        // if it's false, it means it doesn't come from emit_expr,
        // we need to compensate that
        if !should_ignore_empty_args && self.comments.is_some() {
            self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;
        }

        Ok(())
    }

    #[emitter]
    fn emit_new_expr(&mut self, node: &NewExpr) -> Result {
        self.emit_new(node, true)?;
    }

    #[emitter]
    fn emit_member_expr(&mut self, node: &MemberExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

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
                    punct!(emitter, ".");
                }
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(ident);
            }
            MemberProp::PrivateName(private) => {
                if needs_2dots_for_property_access {
                    if node.prop.span().lo() >= BytePos(2) {
                        self.emit_leading_comments(node.prop.span().lo() - BytePos(2), false)?;
                    }
                    punct!(emitter, ".");
                }
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(private);
            }
        }

        srcmap!(emitter, node, false);
    }

    #[emitter]
    fn emit_super_expr(&mut self, node: &SuperPropExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        emit!(node.obj);

        match &node.prop {
            SuperProp::Computed(computed) => emit!(computed),
            SuperProp::Ident(i) => {
                if node.prop.span().lo() >= BytePos(1) {
                    self.emit_leading_comments(node.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(i);
            }
        }
    }

    #[emitter]
    fn emit_arrow_expr(&mut self, node: &ArrowExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        let space = !self.cfg.minify
            || match node.params.as_slice() {
                [Pat::Ident(_)] => true,
                _ => false,
            };

        if node.is_async {
            keyword!(emitter, "async");
            if space {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
        }
        if node.is_generator {
            punct!(emitter, "*")
        }

        let parens = !self.cfg.minify
            || match node.params.as_slice() {
                [Pat::Ident(i)] => self.has_trailing_comment(i.span),
                _ => true,
            };

        emit!(node.type_params);

        if parens {
            punct!(emitter, "(");
        }

        self.emit_list(node.span, Some(&node.params), ListFormat::CommaListElements)?;
        if parens {
            punct!(emitter, ")");
        }

        if let Some(ty) = &node.return_type {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(ty);
            formatting_space!(emitter);
        }

        punct!(emitter, "=>");
        emit!(node.body);
    }

    #[emitter]
    fn emit_meta_prop_expr(&mut self, node: &MetaPropExpr) -> Result {
        if self.comments.is_some() {
            self.emit_leading_comments_of_span(node.span(), false)?;
        }

        srcmap!(emitter, node, true);

        match node.kind {
            MetaPropKind::ImportMeta => keyword!(emitter, "import.meta"),

            MetaPropKind::NewTarget => keyword!(emitter, "new.target"),
        }
    }

    #[emitter]
    fn emit_seq_expr(&mut self, node: &SeqExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        let mut first = true;
        //TODO: Indention
        for e in &node.exprs {
            if first {
                first = false
            } else {
                punct!(emitter, ",");
                formatting_space!(emitter);
            }

            emit!(e);
        }
    }

    #[emitter]
    fn emit_assign_expr(&mut self, node: &AssignExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        emit!(node.left);
        formatting_space!(emitter);
        operator!(node.op.as_str());
        formatting_space!(emitter);
        emit!(node.right);
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
    fn emit_bin_expr(&mut self, node: &BinExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        {
            let mut left = Some(node);
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
                    self.emit_bin_expr_trailing(left)?;
                }
            }
        }

        self.emit_bin_expr_trailing(node)?;
    }

    #[emitter]
    fn emit_decorator(&mut self, node: &Decorator) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        punct!(emitter, "@");
        emit!(node.expr);
        self.wr.write_line()?;

        srcmap!(emitter, node, false);
    }

    #[emitter]
    fn emit_cond_expr(&mut self, node: &CondExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        emit!(node.test);
        formatting_space!(emitter);
        punct!(emitter, "?");
        formatting_space!(emitter);
        emit!(node.cons);
        formatting_space!(emitter);
        punct!(emitter, ":");
        formatting_space!(emitter);
        emit!(node.alt);
    }

    #[emitter]
    fn emit_fn_expr(&mut self, n: &FnExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(emitter, n, true);

        if n.function.is_async {
            keyword!(emitter, "async");
            space!(emitter);
            keyword!(emitter, "function");
        } else {
            keyword!(emitter, "function");
        }

        if n.function.is_generator {
            punct!(emitter, "*");
        }
        if let Some(ref i) = n.ident {
            space!(emitter);
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

        punct!(emitter, "(");
        self.emit_list(node.span, Some(&node.params), ListFormat::CommaListElements)?;
        punct!(emitter, ")");

        if let Some(ty) = &node.return_type {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(ty);
        }

        if let Some(body) = &node.body {
            formatting_space!(emitter);
            self.emit_block_stmt_inner(body, true)?;
        } else {
            semi!(emitter);
        }

        // srcmap!(emitter,node, false);
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

        keyword!(emitter, node.span, "this");
    }

    #[emitter]
    fn emit_tpl_lit(&mut self, node: &Tpl) -> Result {
        debug_assert!(node.quasis.len() == node.exprs.len() + 1);

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        punct!(emitter, "`");

        for i in 0..(node.quasis.len() + node.exprs.len()) {
            if i % 2 == 0 {
                emit!(node.quasis[i / 2]);
            } else {
                punct!(emitter, "${");
                emit!(node.exprs[i / 2]);
                punct!(emitter, "}");
            }
        }

        punct!(emitter, "`");

        srcmap!(emitter, node, false);
    }

    #[emitter]
    fn emit_quasi(&mut self, node: &TplElement) -> Result {
        let raw = node.raw.replace("\r\n", "\n").replace('\r', "\n");
        if self.cfg.minify || (self.cfg.ascii_only && !node.raw.is_ascii()) {
            let v = get_template_element_from_raw(
                &raw,
                self.cfg.ascii_only,
                self.cfg.reduce_escaped_newline,
            );
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

        srcmap!(emitter, node, true);

        if let Expr::New(new) = &*node.tag {
            self.emit_new(new, false)?;
        } else {
            emit!(node.tag);
        }

        emit!(node.type_params);
        self.emit_template_for_tagged_template(&node.tpl)?;

        srcmap!(emitter, node, false);
    }

    fn emit_template_for_tagged_template(&mut self, node: &Tpl) -> Result {
        debug_assert!(node.quasis.len() == node.exprs.len() + 1);

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, self, node, true);

        punct!(emitter, self, "`");

        for i in 0..(node.quasis.len() + node.exprs.len()) {
            if i % 2 == 0 {
                self.emit_template_element_for_tagged_template(&node.quasis[i / 2])?;
            } else {
                punct!(emitter, self, "${");
                emit!(self, node.exprs[i / 2]);
                punct!(emitter, self, "}");
            }
        }

        punct!(emitter, self, "`");

        srcmap!(emitter, self, node, false);

        Ok(())
    }

    fn emit_template_element_for_tagged_template(&mut self, node: &TplElement) -> Result {
        srcmap!(emitter, self, node, true);

        self.wr.write_str_lit(DUMMY_SP, &node.raw)?;

        srcmap!(emitter, self, node, false);

        Ok(())
    }

    #[emitter]
    fn emit_unary_expr(&mut self, n: &UnaryExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        let need_formatting_space = match n.op {
            op!("typeof") | op!("void") | op!("delete") => {
                keyword!(emitter, n.op.as_str());

                true
            }
            op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~") => {
                punct!(emitter, n.op.as_str());
                false
            }
        };

        if should_emit_whitespace_before_operand(n) {
            space!(emitter);
        } else if need_formatting_space {
            formatting_space!(emitter);
        }

        emit!(n.arg);
    }

    #[emitter]
    fn emit_update_expr(&mut self, node: &UpdateExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

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

        srcmap!(emitter, node, true);

        keyword!(emitter, "yield");
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
                punct!(emitter, "(")
            } else if !node.delegate && arg.starts_with_alpha_num() {
                space!(emitter)
            } else {
                formatting_space!(emitter)
            }

            emit!(node.arg);
            if need_paren {
                punct!(emitter, ")")
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
    fn emit_expr_or_spread(&mut self, node: &ExprOrSpread) -> Result {
        if let Some(span) = node.spread {
            self.emit_leading_comments_of_span(span, false)?;

            punct!(emitter, "...");
        }

        emit!(node.expr);
    }

    #[emitter]
    fn emit_await_expr(&mut self, n: &AwaitExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "await");
        space!(emitter);

        emit!(&n.arg);
    }

    #[emitter]
    fn emit_array_lit(&mut self, node: &ArrayLit) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        punct!(emitter, "[");
        let mut format = ListFormat::ArrayLiteralExpressionElements;
        if let Some(None) = node.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        self.emit_list(node.span(), Some(&node.elems), format)?;
        punct!(emitter, "]");

        srcmap!(emitter, node, false);
    }

    #[emitter]
    fn emit_paren_expr(&mut self, node: &ParenExpr) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        punct!(emitter, "(");
        emit!(node.expr);

        srcmap!(emitter, node, false, true);
        punct!(emitter, ")");
    }

    #[emitter]
    fn emit_private_name(&mut self, n: &PrivateName) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        punct!(emitter, "#");
        self.emit_ident_like(n.span, &n.name, false)?;

        srcmap!(emitter, n, false);
    }

    #[emitter]
    fn emit_binding_ident(&mut self, ident: &BindingIdent) -> Result {
        self.emit_ident_like(ident.span, &ident.sym, ident.optional)?;

        if let Some(ty) = &ident.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);
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

        srcmap!(emitter, self, span, true);
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
            punct!(emitter, self, "?");
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
            punct!(emitter, self, ",");
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

/// Statements
impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    fn emit_stmt(&mut self, node: &Stmt) -> Result {
        match node {
            Stmt::Expr(ref e) => emit!(e),
            Stmt::Block(ref e) => {
                emit!(e);
                return Ok(());
            }
            Stmt::Empty(ref e) => emit!(e),
            Stmt::Debugger(ref e) => emit!(e),
            Stmt::With(ref e) => emit!(e),
            Stmt::Return(ref e) => emit!(e),
            Stmt::Labeled(ref e) => emit!(e),
            Stmt::Break(ref e) => emit!(e),
            Stmt::Continue(ref e) => emit!(e),
            Stmt::If(ref e) => emit!(e),
            Stmt::Switch(ref e) => emit!(e),
            Stmt::Throw(ref e) => emit!(e),
            Stmt::Try(ref e) => emit!(e),
            Stmt::While(ref e) => emit!(e),
            Stmt::DoWhile(ref e) => emit!(e),
            Stmt::For(ref e) => emit!(e),
            Stmt::ForIn(ref e) => emit!(e),
            Stmt::ForOf(ref e) => emit!(e),
            Stmt::Decl(Decl::Var(e)) => {
                emit!(e);
                semi!(emitter);
            }
            Stmt::Decl(e @ Decl::Using(..)) => {
                emit!(e);
                semi!(emitter);
            }
            Stmt::Decl(ref e) => emit!(e),
        }
        if self.comments.is_some() {
            self.emit_trailing_comments_of_pos(node.span().hi(), true, true)?;
        }

        if !self.cfg.minify {
            self.wr.write_line()?;
        }
    }

    #[emitter]

    fn emit_expr_stmt(&mut self, e: &ExprStmt) -> Result {
        self.emit_leading_comments_of_span(e.span, false)?;

        emit!(e.expr);

        semi!(emitter);
    }

    #[emitter]

    fn emit_block_stmt(&mut self, node: &BlockStmt) -> Result {
        self.emit_block_stmt_inner(node, false)?;
    }

    fn emit_block_stmt_inner(&mut self, node: &BlockStmt, skip_first_src_map: bool) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        if !skip_first_src_map {
            srcmap!(emitter, self, node, true);
        }
        punct!(emitter, self, "{");

        let emit_new_line = !self.cfg.minify
            && !(node.stmts.is_empty() && is_empty_comments(&node.span(), &self.comments));

        let mut list_format = ListFormat::MultiLineBlockStatements;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        self.emit_list(node.span(), Some(&node.stmts), list_format)?;

        self.emit_leading_comments_of_span(node.span(), true)?;

        srcmap!(emitter, self, node, false, true);
        punct!(emitter, self, "}");

        Ok(())
    }

    #[emitter]
    fn emit_empty_stmt(&mut self, node: &EmptyStmt) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        self.wr.write_punct(None, ";")?;
    }

    #[emitter]
    fn emit_debugger_stmt(&mut self, node: &DebuggerStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        keyword!(emitter, node.span, "debugger");
        semi!(emitter);
    }

    #[emitter]
    fn emit_with_stmt(&mut self, node: &WithStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(emitter, node, true);

        keyword!(emitter, "with");
        formatting_space!(emitter);

        punct!(emitter, "(");
        emit!(node.obj);
        punct!(emitter, ")");

        emit!(node.body);
    }

    fn has_trailing_comment(&self, span: Span) -> bool {
        if let Some(cmt) = self.comments {
            let hi = span.hi;

            if cmt.has_trailing(hi) {
                return true;
            }
        }

        false
    }

    fn simple_assign_target_has_leading_comment(&self, arg: &SimpleAssignTarget) -> bool {
        match arg {
            SimpleAssignTarget::Ident(i) => {
                span_has_leading_comment(self.comments.as_ref().unwrap(), i.span)
            }
            SimpleAssignTarget::Member(m) => {
                if self.has_leading_comment(&m.obj) {
                    return true;
                }

                false
            }

            SimpleAssignTarget::SuperProp(m) => {
                if span_has_leading_comment(self.comments.as_ref().unwrap(), m.span) {
                    return true;
                }

                false
            }

            _ => false,
        }
    }

    fn has_leading_comment(&self, arg: &Expr) -> bool {
        let cmt = if let Some(cmt) = self.comments {
            if span_has_leading_comment(cmt, arg.span()) {
                return true;
            }

            cmt
        } else {
            return false;
        };

        match arg {
            Expr::Call(c) => {
                let has_leading = match &c.callee {
                    Callee::Super(callee) => span_has_leading_comment(cmt, callee.span),
                    Callee::Import(callee) => span_has_leading_comment(cmt, callee.span),
                    Callee::Expr(callee) => self.has_leading_comment(callee),
                };

                if has_leading {
                    return true;
                }
            }

            Expr::Member(m) => {
                if self.has_leading_comment(&m.obj) {
                    return true;
                }
            }

            Expr::SuperProp(m) => {
                if span_has_leading_comment(cmt, m.span) {
                    return true;
                }
            }

            Expr::Bin(e) => {
                if self.has_leading_comment(&e.left) {
                    return true;
                }
            }

            Expr::Cond(e) => {
                if self.has_leading_comment(&e.test) {
                    return true;
                }
            }

            Expr::Seq(e) => {
                if let Some(e) = e.exprs.first() {
                    if self.has_leading_comment(e) {
                        return true;
                    }
                }
            }

            Expr::Assign(e) => {
                let lo = e.span.lo;

                if cmt.has_leading(lo) {
                    return true;
                }

                let has_leading = match &e.left {
                    AssignTarget::Simple(e) => self.simple_assign_target_has_leading_comment(e),

                    AssignTarget::Pat(p) => match p {
                        AssignTargetPat::Array(a) => span_has_leading_comment(cmt, a.span),
                        AssignTargetPat::Object(o) => span_has_leading_comment(cmt, o.span),
                        AssignTargetPat::Invalid(..) => false,
                    },
                };

                if has_leading {
                    return true;
                }
            }

            Expr::OptChain(e) => match &*e.base {
                OptChainBase::Member(m) => {
                    if self.has_leading_comment(&m.obj) {
                        return true;
                    }
                }
                OptChainBase::Call(c) => {
                    if self.has_leading_comment(&c.callee) {
                        return true;
                    }
                }
            },

            _ => {}
        }

        false
    }

    #[emitter]
    fn emit_return_stmt(&mut self, n: &ReturnStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span, false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "return");

        if let Some(arg) = n.arg.as_deref() {
            let need_paren = n
                .arg
                .as_deref()
                .map(|expr| self.has_leading_comment(expr))
                .unwrap_or(false);
            if need_paren {
                punct!(emitter, "(");
            } else if arg.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(arg);
            if need_paren {
                punct!(emitter, ")");
            }
        }

        semi!(emitter);
    }

    #[emitter]
    fn emit_labeled_stmt(&mut self, node: &LabeledStmt) -> Result {
        self.wr.commit_pending_semi()?;

        emit!(node.label);

        // TODO: Comment
        punct!(emitter, ":");
        formatting_space!(emitter);

        emit!(node.body);
    }

    #[emitter]
    fn emit_break_stmt(&mut self, n: &BreakStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "break");

        if let Some(ref label) = n.label {
            space!(emitter);
            emit!(label);
        }

        semi!(emitter);
    }

    #[emitter]
    fn emit_continue_stmt(&mut self, n: &ContinueStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "continue");

        if let Some(ref label) = n.label {
            space!(emitter);
            emit!(label);
        }

        semi!(emitter);
    }

    #[emitter]
    fn emit_if_stmt(&mut self, n: &IfStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "if");

        formatting_space!(emitter);
        punct!(emitter, "(");
        emit!(n.test);
        punct!(emitter, ")");
        formatting_space!(emitter);

        let is_cons_block = match *n.cons {
            Stmt::Block(..) => true,
            _ => false,
        };

        emit!(n.cons);

        if let Some(ref alt) = n.alt {
            if is_cons_block {
                formatting_space!(emitter);
            }
            keyword!(emitter, "else");
            if alt.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
            emit!(alt);
        }
    }

    #[emitter]
    fn emit_switch_stmt(&mut self, n: &SwitchStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "switch");

        punct!(emitter, "(");
        emit!(n.discriminant);
        punct!(emitter, ")");

        punct!(emitter, "{");
        self.emit_list(n.span(), Some(&n.cases), ListFormat::CaseBlockClauses)?;

        srcmap!(emitter, n, false, true);
        punct!(emitter, "}");
    }

    #[emitter]
    fn emit_catch_clause(&mut self, n: &CatchClause) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "catch");

        formatting_space!(emitter);

        if let Some(param) = &n.param {
            punct!(emitter, "(");
            emit!(param);
            punct!(emitter, ")");
        }

        formatting_space!(emitter);

        emit!(n.body);
    }

    #[emitter]
    fn emit_switch_case(&mut self, n: &SwitchCase) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        if let Some(ref test) = n.test {
            keyword!(emitter, "case");

            let starts_with_alpha_num = test.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(test);
        } else {
            keyword!(emitter, "default");
        }

        let emit_as_single_stmt = n.cons.len() == 1 && {
            // treat synthesized nodes as located on the same line for emit purposes
            n.is_synthesized()
                || n.cons[0].is_synthesized()
                || self
                    .cm
                    .is_on_same_line(n.span().lo(), n.cons[0].span().lo())
        };

        let mut format = ListFormat::CaseOrDefaultClauseStatements;
        if emit_as_single_stmt {
            punct!(emitter, ":");
            space!(emitter);
            format &= !(ListFormat::MultiLine | ListFormat::Indented);
        } else {
            punct!(emitter, ":");
        }
        self.emit_list(n.span(), Some(&n.cons), format)?;
    }

    #[emitter]
    fn emit_throw_stmt(&mut self, n: &ThrowStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "throw");

        {
            let need_paren = self.has_leading_comment(&n.arg);
            if need_paren {
                punct!(emitter, "(");
            } else if n.arg.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(n.arg);
            if need_paren {
                punct!(emitter, ")");
            }
        }
        semi!(emitter);
    }

    #[emitter]

    fn emit_try_stmt(&mut self, n: &TryStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "try");

        formatting_space!(emitter);
        emit!(n.block);

        if let Some(ref catch) = n.handler {
            formatting_space!(emitter);
            emit!(catch);
        }

        if let Some(ref finally) = n.finalizer {
            formatting_space!(emitter);
            keyword!(emitter, "finally");
            // space!(emitter);
            emit!(finally);
        }
    }

    #[emitter]
    fn emit_while_stmt(&mut self, node: &WhileStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        keyword!(emitter, "while");

        punct!(emitter, "(");
        emit!(node.test);
        punct!(emitter, ")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_do_while_stmt(&mut self, node: &DoWhileStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(emitter, node, true);

        keyword!(emitter, "do");
        if node.body.starts_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter)
        }
        emit!(node.body);

        keyword!(emitter, "while");

        formatting_space!(emitter);

        punct!(emitter, "(");
        emit!(node.test);
        punct!(emitter, ")");

        if self.cfg.target <= EsVersion::Es5 {
            semi!(emitter);
        }

        srcmap!(emitter, node, false);
    }

    #[emitter]
    fn emit_for_stmt(&mut self, n: &ForStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "for");

        punct!(emitter, "(");
        opt!(n.init);
        self.wr.write_punct(None, ";")?;
        opt_leading_space!(n.test);
        self.wr.write_punct(None, ";")?;
        opt_leading_space!(n.update);
        punct!(emitter, ")");

        emit!(n.body);
    }

    #[emitter]
    fn emit_for_in_stmt(&mut self, n: &ForInStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "for");

        punct!(emitter, "(");
        emit!(n.left);

        if n.left.ends_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }
        keyword!(emitter, "in");

        {
            let starts_with_alpha_num = n.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter)
            }
            emit!(n.right);
        }

        punct!(emitter, ")");

        emit!(n.body);
    }

    #[emitter]
    fn emit_for_of_stmt(&mut self, n: &ForOfStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(emitter, n, true);

        keyword!(emitter, "for");

        if n.is_await {
            space!(emitter);
            keyword!(emitter, "await");
        }
        formatting_space!(emitter);
        punct!(emitter, "(");
        emit!(n.left);
        if n.left.ends_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }
        keyword!(emitter, "of");

        {
            let starts_with_alpha_num = n.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter)
            }
            emit!(n.right);
        }
        punct!(emitter, ")");
        emit!(n.body);
    }

    #[emitter]
    pub fn emit_module_export_name(&mut self, node: &ModuleExportName) -> Result {
        match *node {
            ModuleExportName::Ident(ref ident) => emit!(ident),
            ModuleExportName::Str(ref s) => emit!(s),
        }
    }
}

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    fn write_delim(&mut self, f: ListFormat) -> Result {
        match f & ListFormat::DelimitersMask {
            ListFormat::None => {}
            ListFormat::CommaDelimited => self.wr.write_punct(None, ",")?,
            ListFormat::BarDelimited => {
                if !self.cfg.minify {
                    self.wr.write_space()?;
                }
                self.wr.write_punct(None, "|")?;
            }
            ListFormat::AmpersandDelimited => {
                if !self.cfg.minify {
                    self.wr.write_space()?;
                }
                self.wr.write_punct(None, "&")?;
            }
            _ => unreachable!(),
        }

        Ok(())
    }

    #[emitter]
    fn emit_var_decl_or_expr(&mut self, node: &VarDeclOrExpr) -> Result {
        match *node {
            VarDeclOrExpr::Expr(ref node) => emit!(node),
            VarDeclOrExpr::VarDecl(ref node) => emit!(node),
        }
    }
}

/// In some cases, we need to emit a space between the operator and the operand.
/// One obvious case is when the operator is an identifier, like delete or
/// typeof. We also need to do this for plus and minus expressions in certain
/// cases. Specifically, consider the following two cases (parens are just for
/// clarity of exposition, and not part of the source code):
///
///  (+(+1))
///  (+(++1))
///
/// We need to emit a space in both cases. In the first case, the absence of a
/// space will make the resulting expression a prefix increment operation. And
/// in the second, it will make the resulting expression a prefix increment
/// whose operand is a plus expression - (++(+x)) The same is true of minus of
/// course.
fn should_emit_whitespace_before_operand(node: &UnaryExpr) -> bool {
    match *node {
        UnaryExpr {
            op: op!("void"), ..
        }
        | UnaryExpr {
            op: op!("typeof"), ..
        }
        | UnaryExpr {
            op: op!("delete"), ..
        } => return node.arg.starts_with_alpha_num(),
        _ => {}
    }

    match &*node.arg {
        Expr::Update(UpdateExpr {
            op: op!("++"),
            prefix: true,
            ..
        })
        | Expr::Unary(UnaryExpr {
            op: op!(unary, "+"),
            ..
        }) if node.op == op!(unary, "+") => true,
        Expr::Update(UpdateExpr {
            op: op!("--"),
            prefix: true,
            ..
        })
        | Expr::Unary(UnaryExpr {
            op: op!(unary, "-"),
            ..
        }) if node.op == op!(unary, "-") => true,

        Expr::Lit(Lit::Num(v)) if v.value.is_sign_negative() && node.op == op!(unary, "-") => true,

        _ => false,
    }
}

impl<N> Node for Option<N>
where
    N: Node,
{
    fn emit_with<W, S>(&self, e: &mut Emitter<'_, W, S>) -> Result
    where
        W: WriteJs,
        S: SourceMapper + SourceMapperExt,
    {
        match *self {
            Some(ref n) => n.emit_with(e),
            None => Ok(()),
        }
    }
}

fn get_template_element_from_raw(
    s: &str,
    ascii_only: bool,
    reduce_escaped_newline: bool,
) -> String {
    fn read_escaped(
        radix: u32,
        len: Option<usize>,
        buf: &mut String,
        iter: impl Iterator<Item = char>,
    ) {
        let mut v = 0;
        let mut pending = None;

        for (i, c) in iter.enumerate() {
            if let Some(len) = len {
                if i == len {
                    pending = Some(c);
                    break;
                }
            }

            match c.to_digit(radix) {
                None => {
                    pending = Some(c);
                    break;
                }
                Some(d) => {
                    v = v * radix + d;
                }
            }
        }

        match radix {
            16 => {
                match v {
                    0 => match pending {
                        Some('1'..='9') => write!(buf, "\\x00").unwrap(),
                        _ => write!(buf, "\\0").unwrap(),
                    },
                    1..=15 => write!(buf, "\\x0{:x}", v).unwrap(),
                    // '\x20'..='\x7e'
                    32..=126 => {
                        let c = char::from_u32(v);

                        match c {
                            Some(c) => write!(buf, "{}", c).unwrap(),
                            _ => {
                                unreachable!()
                            }
                        }
                    }
                    // '\x10'..='\x1f'
                    // '\u{7f}'..='\u{ff}'
                    _ => {
                        write!(buf, "\\x{:x}", v).unwrap();
                    }
                }
            }

            _ => unreachable!(),
        }

        if let Some(pending) = pending {
            buf.push(pending);
        }
    }

    let mut buf = String::with_capacity(s.len());
    let mut iter = s.chars().peekable();

    let mut is_dollar_prev = false;

    while let Some(c) = iter.next() {
        let unescape = match c {
            '\\' => match iter.next() {
                Some(c) => match c {
                    'n' => {
                        if reduce_escaped_newline {
                            Some('\n')
                        } else {
                            buf.push('\\');
                            buf.push('n');

                            None
                        }
                    }
                    't' => Some('\t'),
                    'x' => {
                        read_escaped(16, Some(2), &mut buf, &mut iter);

                        None
                    }
                    // TODO handle `\u1111` and `\u{1111}` too
                    // Source - https://github.com/eslint/eslint/blob/main/lib/rules/no-useless-escape.js
                    '\u{2028}' | '\u{2029}' => None,
                    // `\t` and `\h` are special cases, because they can be replaced on real
                    // characters `\xXX` can be replaced on character
                    '\\' | 'r' | 'v' | 'b' | 'f' | 'u' | '\r' | '\n' | '`' | '0'..='7' => {
                        buf.push('\\');
                        buf.push(c);

                        None
                    }
                    '$' if iter.peek() == Some(&'{') => {
                        buf.push('\\');
                        buf.push('$');

                        None
                    }
                    '{' if is_dollar_prev => {
                        buf.push('\\');
                        buf.push('{');

                        is_dollar_prev = false;

                        None
                    }
                    _ => Some(c),
                },
                None => Some('\\'),
            },
            _ => Some(c),
        };

        match unescape {
            Some(c @ '$') => {
                is_dollar_prev = true;

                buf.push(c);
            }
            Some('\x00') => {
                let next = iter.peek();

                match next {
                    Some('1'..='9') => buf.push_str("\\x00"),
                    _ => buf.push_str("\\0"),
                }
            }
            // Octal doesn't supported in template literals, except in tagged templates, but
            // we don't use this for tagged templates, they are printing as is
            Some('\u{0008}') => buf.push_str("\\b"),
            Some('\u{000c}') => buf.push_str("\\f"),
            Some('\n') => buf.push('\n'),
            // `\r` is impossible here, because it was removed on parser stage
            Some('\u{000b}') => buf.push_str("\\v"),
            Some('\t') => buf.push('\t'),
            // Print `"` and `'` without quotes
            Some(c @ '\x20'..='\x7e') => {
                buf.push(c);
            }
            Some(c @ '\u{7f}'..='\u{ff}') => {
                let _ = write!(buf, "\\x{:x}", c as u8);
            }
            Some('\u{2028}') => {
                buf.push_str("\\u2028");
            }
            Some('\u{2029}') => {
                buf.push_str("\\u2029");
            }
            Some('\u{FEFF}') => {
                buf.push_str("\\uFEFF");
            }
            // TODO(kdy1): Surrogate pairs
            Some(c) => {
                if !ascii_only || c.is_ascii() {
                    buf.push(c);
                } else {
                    buf.extend(c.escape_unicode().map(|c| {
                        if c == 'u' {
                            c
                        } else {
                            c.to_ascii_uppercase()
                        }
                    }));
                }
            }
            None => {}
        }
    }

    buf
}

fn get_ascii_only_ident(sym: &str, may_need_quote: bool, target: EsVersion) -> CowStr {
    if sym.is_ascii() {
        return CowStr::Borrowed(sym);
    }

    let mut first = true;
    let mut buf = CompactString::with_capacity(sym.len() + 8);
    let mut iter = sym.chars().peekable();
    let mut need_quote = false;

    while let Some(c) = iter.next() {
        match c {
            '\x00' => {
                if may_need_quote {
                    need_quote = true;
                    let _ = write!(buf, "\\x00");
                } else {
                    let _ = write!(buf, "\\u0000");
                }
            }
            '\u{0008}' => buf.push_str("\\b"),
            '\u{000c}' => buf.push_str("\\f"),
            '\n' => buf.push_str("\\n"),
            '\r' => buf.push_str("\\r"),
            '\u{000b}' => buf.push_str("\\v"),
            '\t' => buf.push('\t'),
            '\\' => {
                let next = iter.peek();

                match next {
                    // TODO fix me - workaround for surrogate pairs
                    Some('u') => {
                        let mut inner_iter = iter.clone();

                        inner_iter.next();

                        let mut is_curly = false;
                        let mut next = inner_iter.peek();

                        if next == Some(&'{') {
                            is_curly = true;

                            inner_iter.next();
                            next = inner_iter.peek();
                        }

                        if let Some(c @ 'D' | c @ 'd') = next {
                            let mut inner_buf = String::new();

                            inner_buf.push('\\');
                            inner_buf.push('u');

                            if is_curly {
                                inner_buf.push('{');
                            }

                            inner_buf.push(*c);

                            inner_iter.next();

                            let mut is_valid = true;

                            for _ in 0..3 {
                                let c = inner_iter.next();

                                match c {
                                    Some('0'..='9') | Some('a'..='f') | Some('A'..='F') => {
                                        inner_buf.push(c.unwrap());
                                    }
                                    _ => {
                                        is_valid = false;

                                        break;
                                    }
                                }
                            }

                            if is_curly {
                                inner_buf.push('}');
                            }

                            if is_valid {
                                buf.push_str(&inner_buf);

                                let end = if is_curly { 7 } else { 5 };

                                for _ in 0..end {
                                    iter.next();
                                }
                            }
                        } else {
                            buf.push_str("\\\\");
                        }
                    }
                    _ => {
                        buf.push_str("\\\\");
                    }
                }
            }
            '\'' => {
                buf.push('\'');
            }
            '"' => {
                buf.push('"');
            }
            '\x01'..='\x0f' if !first => {
                if may_need_quote {
                    need_quote = true;
                    let _ = write!(buf, "\\x{:x}", c as u8);
                } else {
                    let _ = write!(buf, "\\u00{:x}", c as u8);
                }
            }
            '\x10'..='\x1f' if !first => {
                if may_need_quote {
                    need_quote = true;
                    let _ = write!(buf, "\\x{:x}", c as u8);
                } else {
                    let _ = write!(buf, "\\u00{:x}", c as u8);
                }
            }
            '\x20'..='\x7e' => {
                buf.push(c);
            }
            '\u{7f}'..='\u{ff}' => {
                if may_need_quote {
                    need_quote = true;
                    let _ = write!(buf, "\\x{:x}", c as u8);
                } else {
                    let _ = write!(buf, "\\u00{:x}", c as u8);
                }
            }
            '\u{2028}' => {
                buf.push_str("\\u2028");
            }
            '\u{2029}' => {
                buf.push_str("\\u2029");
            }
            '\u{FEFF}' => {
                buf.push_str("\\uFEFF");
            }
            _ => {
                if c.is_ascii() {
                    buf.push(c);
                } else if c > '\u{FFFF}' {
                    // if we've got this far the char isn't reserved and if the callee has specified
                    // we should output unicode for non-ascii chars then we have
                    // to make sure we output unicode that is safe for the target
                    // Es5 does not support code point escapes and so surrograte formula must be
                    // used
                    if target <= EsVersion::Es5 {
                        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                        let h = ((c as u32 - 0x10000) / 0x400) + 0xd800;
                        let l = (c as u32 - 0x10000) % 0x400 + 0xdc00;

                        let _ = write!(buf, r#""\u{:04X}\u{:04X}""#, h, l);
                    } else {
                        let _ = write!(buf, "\\u{{{:04X}}}", c as u32);
                    }
                } else {
                    let _ = write!(buf, "\\u{:04X}", c as u16);
                }
            }
        }
        first = false;
    }

    if need_quote {
        CowStr::Owned(format_compact!("\"{}\"", buf))
    } else {
        CowStr::Owned(buf)
    }
}

fn handle_invalid_unicodes(s: &str) -> Cow<str> {
    static NEEDLE: Lazy<Finder> = Lazy::new(|| Finder::new("\\\0"));
    if NEEDLE.find(s.as_bytes()).is_none() {
        return Cow::Borrowed(s);
    }

    Cow::Owned(s.replace("\\\0", "\\"))
}

fn require_space_before_rhs(rhs: &Expr, op: &BinaryOp) -> bool {
    match rhs {
        Expr::Lit(Lit::Num(v)) if v.value.is_sign_negative() && *op == op!(bin, "-") => true,

        Expr::Update(UpdateExpr {
            prefix: true,
            op: update,
            ..
        }) => matches!(
            (op, update),
            (op!(bin, "-"), op!("--")) | (op!(bin, "+"), op!("++"))
        ),

        // space is mandatory to avoid outputting <!--
        Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) if *op == op!("<") || *op == op!("<<") => {
            if let Expr::Update(UpdateExpr { op: op!("--"), .. }) = &**arg {
                true
            } else {
                false
            }
        }

        Expr::Unary(UnaryExpr { op: unary, .. }) => matches!(
            (op, unary),
            (op!(bin, "-"), op!(unary, "-")) | (op!(bin, "+"), op!(unary, "+"))
        ),

        Expr::Bin(BinExpr { left, .. }) => require_space_before_rhs(left, op),

        _ => false,
    }
}

fn is_empty_comments(span: &Span, comments: &Option<&dyn Comments>) -> bool {
    span.is_dummy() || comments.map_or(true, |c| !c.has_leading(span.span_hi() - BytePos(1)))
}

fn span_has_leading_comment(cmt: &dyn Comments, span: Span) -> bool {
    let lo = span.lo;

    // see #415
    if let Some(cmt) = cmt.get_leading(lo) {
        if cmt.iter().any(|cmt| {
            cmt.kind == CommentKind::Line
                || cmt
                    .text
                    .chars()
                    // https://tc39.es/ecma262/#table-line-terminator-code-points
                    .any(|c| c == '\n' || c == '\r' || c == '\u{2028}' || c == '\u{2029}')
        }) {
            return true;
        }
    }

    false
}

#[node_impl]
impl MacroNode for Program {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Program::Module(m) => emit!(m),
            Program::Script(s) => emit!(s),
            // TODO: reenable once experimental_metadata breaking change is merged
            // _ => unreachable!(),
        }
    }
}

#[node_impl]
impl MacroNode for Module {
    #[tracing::instrument(skip_all)]
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.body.is_empty() {
            srcmap!(emitter, self, true);
        }

        if let Some(ref shebang) = self.shebang {
            punct!(emitter, "#!");
            emitter.wr.write_str_lit(DUMMY_SP, shebang)?;
            emitter.wr.write_line()?;
        }
        for stmt in &self.body {
            emit!(stmt);
        }

        emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;
        if !emitter.cfg.omit_last_semi {
            emitter.wr.commit_pending_semi()?;
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Script {
    #[tracing::instrument(skip_all)]
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.body.is_empty() {
            srcmap!(emitter, self, true);
        }

        if let Some(ref shebang) = self.shebang {
            punct!(emitter, "#!");
            emitter.wr.write_str_lit(DUMMY_SP, shebang)?;
            emitter.wr.write_line()?;
        }
        for stmt in &self.body {
            emit!(stmt);
        }

        emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;
        if !emitter.cfg.omit_last_semi {
            emitter.wr.commit_pending_semi()?;
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ModuleItem {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;
        match self {
            ModuleItem::Stmt(stmt) => emit!(stmt),
            ModuleItem::ModuleDecl(decl) => emit!(decl),
        }
        emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Callee {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Callee::Expr(e) => {
                if let Expr::New(new) = &**e {
                    emitter.emit_new(new, false)?;
                } else {
                    emit!(e);
                }
            }
            Callee::Super(n) => emit!(n),
            Callee::Import(n) => emit!(n),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Super {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        keyword!(emitter, self.span, "super");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Import {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        keyword!(emitter, self.span, "import");
        match self.phase {
            ImportPhase::Source => {
                punct!(emitter, ".");
                keyword!(emitter, "source")
            }
            ImportPhase::Defer => {
                punct!(emitter, ".");
                keyword!(emitter, "defer")
            }
            _ => {}
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Expr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Expr::Array(n) => emit!(n),
            Expr::Arrow(n) => emit!(n),
            Expr::Assign(n) => emit!(n),
            Expr::Await(n) => emit!(n),
            Expr::Bin(n) => emit!(n),
            Expr::Call(n) => emit!(n),
            Expr::Class(n) => emit!(n),
            Expr::Cond(n) => emit!(n),
            Expr::Fn(n) => emit!(n),
            Expr::Ident(n) => emit!(n),
            Expr::Lit(n) => emit!(n),
            Expr::Member(n) => emit!(n),
            Expr::SuperProp(n) => emit!(n),
            Expr::MetaProp(n) => emit!(n),
            Expr::New(n) => emit!(n),
            Expr::Object(n) => emit!(n),
            Expr::Paren(n) => emit!(n),
            Expr::Seq(n) => emit!(n),
            Expr::TaggedTpl(n) => emit!(n),
            Expr::This(n) => emit!(n),
            Expr::Tpl(n) => emit!(n),
            Expr::Unary(n) => emit!(n),
            Expr::Update(n) => emit!(n),
            Expr::Yield(n) => emit!(n),
            Expr::PrivateName(n) => emit!(n),

            Expr::JSXMember(n) => emit!(n),
            Expr::JSXNamespacedName(n) => emit!(n),
            Expr::JSXEmpty(n) => emit!(n),
            Expr::JSXElement(n) => emit!(n),
            Expr::JSXFragment(n) => emit!(n),

            Expr::TsAs(n) => emit!(n),
            Expr::TsNonNull(n) => emit!(n),
            Expr::TsTypeAssertion(n) => emit!(n),
            Expr::TsConstAssertion(n) => emit!(n),
            Expr::TsInstantiation(n) => emit!(n),
            Expr::OptChain(n) => emit!(n),
            Expr::Invalid(n) => emit!(n),
            Expr::TsSatisfies(n) => {
                emit!(n)
            }
        }

        if emitter.comments.is_some() {
            emitter.emit_trailing_comments_of_pos(self.span().hi, true, true)?;
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for OptChainExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match &*self.base {
            OptChainBase::Member(e) => {
                if let Expr::New(new) = &*e.obj {
                    emitter.emit_new(new, false)?;
                } else {
                    emit!(e.obj);
                }
                if self.optional {
                    punct!(emitter, "?.");
                } else if !e.prop.is_computed() {
                    punct!(emitter, ".");
                }

                match &e.prop {
                    MemberProp::Computed(computed) => emit!(computed),
                    MemberProp::Ident(i) => emit!(i),
                    MemberProp::PrivateName(p) => emit!(p),
                }
            }
            OptChainBase::Call(e) => {
                debug_assert!(!e.callee.is_new());
                emit!(e.callee);

                if self.optional {
                    punct!(emitter, "?.");
                }

                punct!(emitter, "(");
                emitter.emit_expr_or_spreads(
                    self.span(),
                    &e.args,
                    ListFormat::CallExpressionArguments,
                )?;
                punct!(emitter, ")");
            }
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Invalid {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span, false)?;

        emitter.wr.write_str_lit(self.span, "<invalid>")?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for CallExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.callee);

        if let Some(type_args) = &self.type_args {
            emit!(type_args);
        }

        punct!(emitter, "(");
        emitter.emit_expr_or_spreads(
            self.span(),
            &self.args,
            ListFormat::CallExpressionArguments,
        )?;
        punct!(emitter, ")");

        // srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for NewExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_new(self, true)?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for MemberExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        let mut needs_2dots_for_property_access = false;

        match &*self.obj {
            Expr::New(new) => {
                emitter.emit_new(new, false)?;
            }
            Expr::Lit(Lit::Num(num)) => {
                needs_2dots_for_property_access = emitter.emit_num_lit_internal(num, true)?;
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
                        emitter.emit_leading_comments(self.prop.span().lo() - BytePos(2), false)?;
                    }
                    punct!(emitter, ".");
                }
                if self.prop.span().lo() >= BytePos(1) {
                    emitter.emit_leading_comments(self.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(ident);
            }
            MemberProp::PrivateName(private) => {
                if needs_2dots_for_property_access {
                    if self.prop.span().lo() >= BytePos(2) {
                        emitter.emit_leading_comments(self.prop.span().lo() - BytePos(2), false)?;
                    }
                    punct!(emitter, ".");
                }
                if self.prop.span().lo() >= BytePos(1) {
                    emitter.emit_leading_comments(self.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(private);
            }
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SuperPropExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.obj);

        match &self.prop {
            SuperProp::Computed(computed) => emit!(computed),
            SuperProp::Ident(i) => {
                if self.prop.span().lo() >= BytePos(1) {
                    emitter.emit_leading_comments(self.prop.span().lo() - BytePos(1), false)?;
                }
                punct!(emitter, ".");
                emit!(i);
            }
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ArrowExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        let space = !emitter.cfg.minify
            || match self.params.as_slice() {
                [Pat::Ident(_)] => true,
                _ => false,
            };

        if self.is_async {
            keyword!(emitter, "async");
            if space {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
        }
        if self.is_generator {
            punct!(emitter, "*")
        }

        let parens = !emitter.cfg.minify
            || match self.params.as_slice() {
                [Pat::Ident(i)] => emitter.has_trailing_comment(i.span),
                _ => true,
            };

        emit!(self.type_params);

        if parens {
            punct!(emitter, "(");
        }

        emitter.emit_list(self.span, Some(&self.params), ListFormat::CommaListElements)?;
        if parens {
            punct!(emitter, ")");
        }

        if let Some(ty) = &self.return_type {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(ty);
            formatting_space!(emitter);
        }

        punct!(emitter, "=>");
        emit!(self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for MetaPropExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        if emitter.comments.is_some() {
            emitter.emit_leading_comments_of_span(self.span(), false)?;
        }

        srcmap!(emitter, self, true);

        match self.kind {
            MetaPropKind::ImportMeta => keyword!(emitter, "import.meta"),

            MetaPropKind::NewTarget => keyword!(emitter, "new.target"),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SeqExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        let mut first = true;
        //TODO: Indention
        for e in &self.exprs {
            if first {
                first = false
            } else {
                punct!(emitter, ",");
                formatting_space!(emitter);
            }

            emit!(e);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for AssignExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.left);
        formatting_space!(emitter);
        operator!(self.op.as_str());
        formatting_space!(emitter);
        emit!(self.right);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for BinExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

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
                    emitter.emit_bin_expr_trailing(left)?;
                }
            }
        }

        emitter.emit_bin_expr_trailing(self)?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for Decorator {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        punct!(emitter, "@");
        emit!(self.expr);
        emitter.wr.write_line()?;

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for CondExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.test);
        formatting_space!(emitter);
        punct!(emitter, "?");
        formatting_space!(emitter);
        emit!(self.cons);
        formatting_space!(emitter);
        punct!(emitter, ":");
        formatting_space!(emitter);
        emit!(self.alt);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for FnExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);

        if self.function.is_async {
            keyword!(emitter, "async");
            space!(emitter);
            keyword!(emitter, "function");
        } else {
            keyword!(emitter, "function");
        }

        if self.function.is_generator {
            punct!(emitter, "*");
        }
        if let Some(ref i) = self.ident {
            space!(emitter);
            emit!(i);
        }

        emitter.emit_fn_trailing(&self.function)?;

        Ok(())
    }
}
