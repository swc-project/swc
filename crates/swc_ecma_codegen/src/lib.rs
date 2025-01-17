#![recursion_limit = "1024"]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::nonminimal_bool)]
#![allow(non_local_definitions)]

use std::{borrow::Cow, fmt::Write, io};

use memchr::memmem::Finder;
use once_cell::sync::Lazy;
use swc_allocator::maybe::vec::Vec;
use swc_atoms::Atom;
use swc_common::{
    comments::{CommentKind, Comments},
    sync::Lrc,
    BytePos, SourceMap, SourceMapper, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

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

fn replace_close_inline_script(raw: &str) -> Cow<str> {
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
        return Cow::Borrowed(raw);
    }

    let mut result = String::from(raw);

    for (offset, i) in matched_indexes.enumerate() {
        result.insert(i + 1 + offset, '\\');
    }

    Cow::Owned(result)
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
            srcmap!(node, true);
        }

        if let Some(ref shebang) = node.shebang {
            punct!("#!");
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
            srcmap!(node, true);
        }

        if let Some(ref shebang) = node.shebang {
            punct!("#!");
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

    #[emitter]
    fn emit_module_decl(&mut self, node: &ModuleDecl) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        match *node {
            ModuleDecl::Import(ref d) => emit!(d),
            ModuleDecl::ExportDecl(ref d) => emit!(d),
            ModuleDecl::ExportNamed(ref d) => emit!(d),
            ModuleDecl::ExportDefaultDecl(ref d) => emit!(d),
            ModuleDecl::ExportDefaultExpr(ref n) => emit!(n),
            ModuleDecl::ExportAll(ref d) => emit!(d),
            ModuleDecl::TsExportAssignment(ref n) => emit!(n),
            ModuleDecl::TsImportEquals(ref n) => emit!(n),
            ModuleDecl::TsNamespaceExport(ref n) => emit!(n),
        }

        self.emit_trailing_comments_of_pos(node.span().hi, true, true)?;

        if !self.cfg.minify {
            self.wr.write_line()?;
        }
    }

    #[emitter]
    fn emit_export_decl(&mut self, n: &ExportDecl) -> Result {
        srcmap!(n, true);

        match &n.decl {
            Decl::Class(decl) => {
                for dec in &decl.class.decorators {
                    emit!(dec);
                }

                keyword!("export");

                space!();
                self.emit_class_decl_inner(decl, true)?;
            }
            _ => {
                keyword!("export");

                space!();
                emit!(n.decl);
            }
        }
    }

    #[emitter]
    fn emit_export_default_expr(&mut self, n: &ExportDefaultExpr) -> Result {
        srcmap!(n, true);

        keyword!("export");

        space!();
        keyword!("default");
        {
            let starts_with_alpha_num = n.expr.starts_with_alpha_num();
            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }
            emit!(n.expr);
        }
        semi!();

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_export_default_decl(&mut self, n: &ExportDefaultDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("export");

        space!();
        keyword!("default");
        space!();
        match n.decl {
            DefaultDecl::Class(ref n) => emit!(n),
            DefaultDecl::Fn(ref n) => emit!(n),
            DefaultDecl::TsInterfaceDecl(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_import(&mut self, n: &ImportDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("import");

        if n.type_only {
            space!();
            keyword!("type");
        }

        match n.phase {
            ImportPhase::Evaluation => {}
            ImportPhase::Source => {
                space!();
                keyword!("source");
            }
            ImportPhase::Defer => {
                space!();
                keyword!("defer");
            }
        }

        let starts_with_ident = !n.specifiers.is_empty()
            && match &n.specifiers[0] {
                ImportSpecifier::Default(_) => true,
                _ => false,
            };
        if starts_with_ident {
            space!();
        } else {
            formatting_space!();
        }

        let mut specifiers = Vec::new();
        let mut emitted_default = false;
        let mut emitted_ns = false;
        for specifier in &n.specifiers {
            match specifier {
                ImportSpecifier::Named(ref s) => {
                    specifiers.push(s);
                }
                ImportSpecifier::Default(ref s) => {
                    emit!(s.local);
                    emitted_default = true;
                }
                ImportSpecifier::Namespace(ref ns) => {
                    if emitted_default {
                        punct!(",");
                        formatting_space!();
                    }

                    emitted_ns = true;

                    assert!(n.specifiers.len() <= 2);
                    punct!("*");
                    formatting_space!();
                    keyword!("as");
                    space!();
                    emit!(ns.local);
                }
            }
        }

        if specifiers.is_empty() {
            if emitted_ns || emitted_default {
                space!();
                keyword!("from");
                formatting_space!();
            }
        } else {
            if emitted_default {
                punct!(",");
                formatting_space!();
            }

            punct!("{");
            self.emit_list(
                n.span(),
                Some(&specifiers),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
            formatting_space!();

            keyword!("from");
            formatting_space!();
        }

        emit!(n.src);

        if let Some(with) = &n.with {
            formatting_space!();
            if self.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(n, false);
    }

    #[emitter]
    fn emit_import_specific(&mut self, node: &ImportNamedSpecifier) -> Result {
        srcmap!(node, true);

        if node.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(ref imported) = node.imported {
            emit!(imported);
            space!();
            keyword!("as");
            space!();
        }

        emit!(node.local);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_export_specifier(&mut self, node: &ExportSpecifier) -> Result {
        match node {
            ExportSpecifier::Default(..) => {
                unimplemented!("codegen of `export default from 'foo';`")
            }
            ExportSpecifier::Namespace(ref node) => emit!(node),
            ExportSpecifier::Named(ref node) => emit!(node),
        }
    }

    #[emitter]
    fn emit_namespace_export_specifier(&mut self, node: &ExportNamespaceSpecifier) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("*");
        formatting_space!();
        keyword!("as");
        space!();
        emit!(node.name);

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_named_export_specifier(&mut self, node: &ExportNamedSpecifier) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if node.is_type_only {
            keyword!("type");
            space!();
        }

        if let Some(exported) = &node.exported {
            emit!(node.orig);
            space!();
            keyword!("as");
            space!();
            emit!(exported);
        } else {
            emit!(node.orig);
        }
        srcmap!(node, false);
    }

    #[emitter]
    fn emit_named_export(&mut self, node: &NamedExport) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        struct Specifiers<'a> {
            has_namespace_spec: bool,
            namespace_spec: Option<&'a ExportNamespaceSpecifier>,
            has_named_specs: bool,
            named_specs: Vec<&'a ExportSpecifier>,
        }
        let Specifiers {
            has_namespace_spec,
            namespace_spec,
            has_named_specs,
            named_specs,
        } = node.specifiers.iter().fold(
            Specifiers {
                has_namespace_spec: false,
                namespace_spec: None,
                has_named_specs: false,
                named_specs: Vec::new(),
            },
            |mut result, s| match s {
                ExportSpecifier::Namespace(spec) => {
                    result.has_namespace_spec = true;
                    // There can only be one namespace export specifier.
                    if result.namespace_spec.is_none() {
                        result.namespace_spec = Some(spec)
                    }
                    result
                }
                spec => {
                    result.has_named_specs = true;
                    result.named_specs.push(spec);
                    result
                }
            },
        );

        keyword!("export");

        if node.type_only {
            space!();
            keyword!("type");
        }
        formatting_space!();

        if let Some(spec) = namespace_spec {
            emit!(spec);
            if has_named_specs {
                punct!(",");
                formatting_space!();
            }
        }
        if has_named_specs || !has_namespace_spec {
            punct!("{");
            self.emit_list(
                node.span,
                Some(&named_specs),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
        }

        if let Some(ref src) = node.src {
            if has_named_specs || !has_namespace_spec {
                formatting_space!();
            } else if has_namespace_spec {
                space!();
            }
            keyword!("from");
            formatting_space!();
            emit!(src);

            if let Some(with) = &node.with {
                formatting_space!();
                if self.cfg.emit_assert_for_import_attributes {
                    keyword!("assert");
                } else {
                    keyword!("with")
                };
                formatting_space!();
                emit!(with);
            }
        }
        semi!();

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_export_all(&mut self, node: &ExportAll) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("export");

        if node.type_only {
            space!();
            keyword!("type");
            space!();
        } else {
            formatting_space!();
        }

        punct!("*");
        formatting_space!();
        keyword!("from");
        formatting_space!();
        emit!(node.src);

        if let Some(with) = &node.with {
            formatting_space!();
            if self.cfg.emit_assert_for_import_attributes {
                keyword!("assert");
            } else {
                keyword!("with")
            };
            formatting_space!();
            emit!(with);
        }

        semi!();

        srcmap!(node, false);
    }

    #[emitter]

    fn emit_lit(&mut self, node: &Lit) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        match *node {
            Lit::Bool(Bool { value, .. }) => {
                if value {
                    keyword!("true")
                } else {
                    keyword!("false")
                }
            }
            Lit::Null(Null { .. }) => keyword!("null"),
            Lit::Str(ref s) => emit!(s),
            Lit::BigInt(ref s) => emit!(s),
            Lit::Num(ref n) => emit!(n),
            Lit::Regex(ref n) => {
                punct!("/");
                self.wr.write_str(&n.exp)?;
                punct!("/");
                self.wr.write_str(&n.flags)?;
            }
            Lit::JSXText(ref n) => emit!(n),
        }
    }

    fn emit_atom(&mut self, span: Span, value: &Atom) -> Result {
        self.wr.write_str_lit(span, value)?;

        Ok(())
    }

    #[emitter]

    fn emit_str_lit(&mut self, node: &Str) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if &*node.value == "use strict"
            && node.raw.is_some()
            && node.raw.as_ref().unwrap().contains('\\')
            && (!self.cfg.inline_script || !node.raw.as_ref().unwrap().contains("script"))
        {
            self.wr
                .write_str_lit(DUMMY_SP, node.raw.as_ref().unwrap())?;

            srcmap!(node, false);

            return Ok(());
        }

        let target = self.cfg.target;

        if !self.cfg.minify {
            if let Some(raw) = &node.raw {
                if (!self.cfg.ascii_only || raw.is_ascii())
                    && (!self.cfg.inline_script || !node.raw.as_ref().unwrap().contains("script"))
                {
                    self.wr.write_str_lit(DUMMY_SP, raw)?;
                    return Ok(());
                }
            }
        }

        let mut value = get_quoted_utf16(&node.value, self.cfg.ascii_only, target);

        if self.cfg.inline_script {
            value = replace_close_inline_script(&value)
                .replace("\x3c!--", "\\x3c!--")
                .replace("--\x3e", "--\\x3e");
        }

        self.wr.write_str_lit(DUMMY_SP, &value)?;

        // srcmap!(node, false);
    }

    #[emitter]

    fn emit_num_lit(&mut self, num: &Number) -> Result {
        self.emit_num_lit_internal(num, false)?;
    }

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
    fn emit_big_lit(&mut self, v: &BigInt) -> Result {
        self.emit_leading_comments_of_span(v.span, false)?;

        if self.cfg.minify {
            let value = if *v.value >= 10000000000000000_i64.into() {
                format!("0x{}", v.value.to_str_radix(16))
            } else if *v.value <= (-10000000000000000_i64).into() {
                format!("-0x{}", (-*v.value.clone()).to_str_radix(16))
            } else {
                v.value.to_string()
            };
            self.wr.write_lit(v.span, &value)?;
            self.wr.write_lit(v.span, "n")?;
        } else {
            match &v.raw {
                Some(raw) => {
                    if raw.len() > 2 && self.cfg.target < EsVersion::Es2021 && raw.contains('_') {
                        self.wr.write_str_lit(v.span, &raw.replace('_', ""))?;
                    } else {
                        self.wr.write_str_lit(v.span, raw)?;
                    }
                }
                _ => {
                    self.wr.write_lit(v.span, &v.value.to_string())?;
                    self.wr.write_lit(v.span, "n")?;
                }
            }
        }
    }

    // fn emit_object_binding_pat(&mut self, node: &ObjectPat) -> Result {
    //     self.wr.write_punct("{")?;
    //     self.emit_list(
    //         node.span(),
    //         &node.props,
    //         ListFormat::ObjectBindingPatternElements,
    //     );
    //     self.wr.write_punct("}")?;

    //     Ok(())
    // }

    // fn emit_array_binding_pat(&mut self, node: &ArrayPat) -> Result {
    //     self.wr.write_punct("[")?;
    //     self.emit_list(
    //         node.span(),
    //         &node.elems,
    //         ListFormat::ArrayBindingPatternElements,
    //     );
    //     self.wr.write_punct("]")?;

    //     Ok(())
    // }

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
        keyword!(node.span, "super");
    }

    #[emitter]
    fn emit_import_callee(&mut self, node: &Import) -> Result {
        keyword!(node.span, "import");
        match node.phase {
            ImportPhase::Source => {
                punct!(".");
                keyword!("source")
            }
            ImportPhase::Defer => {
                punct!(".");
                keyword!("defer")
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
                    punct!("?.");
                } else if !e.prop.is_computed() {
                    punct!(".");
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
                    punct!("?.");
                }

                punct!("(");
                self.emit_expr_or_spreads(n.span(), &e.args, ListFormat::CallExpressionArguments)?;
                punct!(")");
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

        srcmap!(node, true);

        emit!(node.callee);

        if let Some(type_args) = &node.type_args {
            emit!(type_args);
        }

        punct!("(");
        self.emit_expr_or_spreads(node.span(), &node.args, ListFormat::CallExpressionArguments)?;
        punct!(")");

        // srcmap!(node, false);
    }

    fn emit_new(&mut self, node: &NewExpr, should_ignore_empty_args: bool) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(self, node, true);

        keyword!(self, "new");

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
                punct!(self, "(");
                self.emit_expr_or_spreads(node.span(), args, ListFormat::NewExpressionArguments)?;
                punct!(self, ")");
            }
        }

        // srcmap!(self, node, false);

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

    #[emitter]
    fn emit_seq_expr(&mut self, node: &SeqExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        let mut first = true;
        //TODO: Indention
        for e in &node.exprs {
            if first {
                first = false
            } else {
                punct!(",");
                formatting_space!();
            }

            emit!(e);
        }
    }

    #[emitter]
    fn emit_assign_expr(&mut self, node: &AssignExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        emit!(node.left);
        formatting_space!();
        operator!(node.op.as_str());
        formatting_space!();
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

        srcmap!(node, true);

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

        srcmap!(node, true);

        punct!("@");
        emit!(node.expr);
        self.wr.write_line()?;

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_class_expr(&mut self, node: &ClassExpr) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        for dec in &node.class.decorators {
            emit!(dec);
        }

        if node.class.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("class");

        if let Some(ref i) = node.ident {
            space!();
            emit!(i);
            emit!(node.class.type_params);
        }

        self.emit_class_trailing(&node.class)?;
    }

    #[emitter]
    fn emit_class_trailing(&mut self, node: &Class) -> Result {
        if node.super_class.is_some() {
            space!();
            keyword!("extends");

            {
                let starts_with_alpha_num =
                    node.super_class.as_ref().unwrap().starts_with_alpha_num();

                if starts_with_alpha_num {
                    space!();
                } else {
                    formatting_space!()
                }
            }
            emit!(node.super_class);
            emit!(node.super_type_params);
        }

        if !node.implements.is_empty() {
            space!();
            keyword!("implements");

            space!();

            self.emit_list(
                node.span,
                Some(&node.implements),
                ListFormat::ClassHeritageClauses,
            )?;
        }

        formatting_space!();

        punct!("{");

        self.emit_list(node.span, Some(&node.body), ListFormat::ClassMembers)?;

        srcmap!(node, false, true);
        punct!("}");
    }

    #[emitter]

    fn emit_class_member(&mut self, node: &ClassMember) -> Result {
        match *node {
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

    #[emitter]
    fn emit_auto_accessor(&mut self, n: &AutoAccessor) -> Result {
        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accessibility(n.accessibility)?;

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.is_abstract {
            keyword!("abstract");
            space!();
        }

        if n.is_override {
            keyword!("override");
            space!();
        }

        keyword!("accessor");
        space!();

        emit!(n.key);

        if let Some(type_ann) = &n.type_ann {
            if n.definite {
                punct!("!");
            }
            punct!(":");
            space!();
            emit!(type_ann);
        }

        if let Some(init) = &n.value {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }

        semi!();
    }

    #[emitter]
    fn emit_key(&mut self, n: &Key) -> Result {
        match n {
            Key::Private(n) => emit!(n),
            Key::Public(n) => emit!(n),
        }
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
    fn emit_expr_or_spread(&mut self, node: &ExprOrSpread) -> Result {
        if let Some(span) = node.spread {
            self.emit_leading_comments_of_span(span, false)?;

            punct!("...");
        }

        emit!(node.expr);
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
    fn emit_array_lit(&mut self, node: &ArrayLit) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("[");
        let mut format = ListFormat::ArrayLiteralExpressionElements;
        if let Some(None) = node.elems.last() {
            format |= ListFormat::ForceTrailingComma;
        }

        self.emit_list(node.span(), Some(&node.elems), format)?;
        punct!("]");

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_object_lit(&mut self, node: &ObjectLit) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        punct!("{");

        let emit_new_line = !self.cfg.minify
            && !(node.props.is_empty() && is_empty_comments(&node.span(), &self.comments));

        if emit_new_line {
            self.wr.write_line()?;
        }

        let mut list_format =
            ListFormat::ObjectLiteralExpressionProperties | ListFormat::CanSkipTrailingComma;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        self.emit_list(node.span(), Some(&node.props), list_format)?;

        if emit_new_line {
            self.wr.write_line()?;
        }

        srcmap!(node, false, true);
        punct!("}");
    }

    #[emitter]
    fn emit_prop(&mut self, node: &Prop) -> Result {
        match *node {
            Prop::Shorthand(ref n) => emit!(n),
            Prop::KeyValue(ref n) => emit!(n),
            Prop::Assign(ref n) => emit!(n),
            Prop::Getter(ref n) => emit!(n),
            Prop::Setter(ref n) => emit!(n),
            Prop::Method(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_kv_prop(&mut self, node: &KeyValueProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;
        let key_span = node.key.span();
        let value_span = node.value.span();
        if !key_span.is_dummy() {
            self.wr.add_srcmap(key_span.lo)?;
        }
        emit!(node.key);
        if !key_span.is_dummy() && value_span.is_dummy() {
            self.wr.add_srcmap(key_span.hi)?;
        }
        punct!(":");
        formatting_space!();
        if key_span.is_dummy() && !value_span.is_dummy() {
            self.wr.add_srcmap(value_span.lo)?;
        }
        emit!(node.value);
    }

    #[emitter]
    fn emit_assign_prop(&mut self, node: &AssignProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.key);
        punct!("=");
        emit!(node.value);
    }

    #[emitter]
    fn emit_getter_prop(&mut self, node: &GetterProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("get");

        let starts_with_alpha_num = match node.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };
        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }
        emit!(node.key);
        formatting_space!();
        punct!("(");
        punct!(")");
        formatting_space!();
        emit!(node.body);
    }

    #[emitter]
    fn emit_setter_prop(&mut self, node: &SetterProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("set");

        let starts_with_alpha_num = match node.key {
            PropName::Str(_) | PropName::Computed(_) => false,
            _ => true,
        };

        if starts_with_alpha_num {
            space!();
        } else {
            formatting_space!();
        }

        emit!(node.key);
        formatting_space!();

        punct!("(");
        if let Some(this) = &node.this_param {
            emit!(this);
            punct!(",");

            formatting_space!();
        }

        emit!(node.param);

        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_method_prop(&mut self, node: &MethodProp) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        if node.function.is_async {
            keyword!("async");
            space!();
        }

        if node.function.is_generator {
            punct!("*");
        }

        emit!(node.key);
        formatting_space!();
        // TODO
        self.emit_fn_trailing(&node.function)?;
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
        self.emit_list(
            node.span(),
            Some(&node.elems),
            ListFormat::ArrayBindingPatternElements,
        )?;
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
                semi!();
            }
            Stmt::Decl(e @ Decl::Using(..)) => {
                emit!(e);
                semi!();
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

        semi!();
    }

    #[emitter]

    fn emit_block_stmt(&mut self, node: &BlockStmt) -> Result {
        self.emit_block_stmt_inner(node, false)?;
    }

    fn emit_block_stmt_inner(&mut self, node: &BlockStmt, skip_first_src_map: bool) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        if !skip_first_src_map {
            srcmap!(self, node, true);
        }
        punct!(self, "{");

        let emit_new_line = !self.cfg.minify
            && !(node.stmts.is_empty() && is_empty_comments(&node.span(), &self.comments));

        let mut list_format = ListFormat::MultiLineBlockStatements;

        if !emit_new_line {
            list_format -= ListFormat::MultiLine | ListFormat::Indented;
        }

        self.emit_list(node.span(), Some(&node.stmts), list_format)?;

        self.emit_leading_comments_of_span(node.span(), true)?;

        srcmap!(self, node, false, true);
        punct!(self, "}");

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

        keyword!(node.span, "debugger");
        semi!();
    }

    #[emitter]
    fn emit_with_stmt(&mut self, node: &WithStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(node, true);

        keyword!("with");
        formatting_space!();

        punct!("(");
        emit!(node.obj);
        punct!(")");

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

        srcmap!(n, true);

        keyword!("return");

        if let Some(arg) = n.arg.as_deref() {
            let need_paren = n
                .arg
                .as_deref()
                .map(|expr| self.has_leading_comment(expr))
                .unwrap_or(false);
            if need_paren {
                punct!("(");
            } else if arg.starts_with_alpha_num() {
                space!();
            } else {
                formatting_space!();
            }

            emit!(arg);
            if need_paren {
                punct!(")");
            }
        }

        semi!();
    }

    #[emitter]
    fn emit_labeled_stmt(&mut self, node: &LabeledStmt) -> Result {
        self.wr.commit_pending_semi()?;

        emit!(node.label);

        // TODO: Comment
        punct!(":");
        formatting_space!();

        emit!(node.body);
    }

    #[emitter]
    fn emit_break_stmt(&mut self, n: &BreakStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(n, true);

        keyword!("break");

        if let Some(ref label) = n.label {
            space!();
            emit!(label);
        }

        semi!();
    }

    #[emitter]
    fn emit_continue_stmt(&mut self, n: &ContinueStmt) -> Result {
        self.wr.commit_pending_semi()?;

        srcmap!(n, true);

        keyword!("continue");

        if let Some(ref label) = n.label {
            space!();
            emit!(label);
        }

        semi!();
    }

    #[emitter]
    fn emit_if_stmt(&mut self, n: &IfStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(n, true);

        keyword!("if");

        formatting_space!();
        punct!("(");
        emit!(n.test);
        punct!(")");
        formatting_space!();

        let is_cons_block = match *n.cons {
            Stmt::Block(..) => true,
            _ => false,
        };

        emit!(n.cons);

        if let Some(ref alt) = n.alt {
            if is_cons_block {
                formatting_space!();
            }
            keyword!("else");
            if alt.starts_with_alpha_num() {
                space!();
            } else {
                formatting_space!();
            }
            emit!(alt);
        }
    }

    #[emitter]
    fn emit_switch_stmt(&mut self, n: &SwitchStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("switch");

        punct!("(");
        emit!(n.discriminant);
        punct!(")");

        punct!("{");
        self.emit_list(n.span(), Some(&n.cases), ListFormat::CaseBlockClauses)?;

        srcmap!(n, false, true);
        punct!("}");
    }

    #[emitter]
    fn emit_catch_clause(&mut self, n: &CatchClause) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("catch");

        formatting_space!();

        if let Some(param) = &n.param {
            punct!("(");
            emit!(param);
            punct!(")");
        }

        formatting_space!();

        emit!(n.body);
    }

    #[emitter]
    fn emit_switch_case(&mut self, n: &SwitchCase) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        if let Some(ref test) = n.test {
            keyword!("case");

            let starts_with_alpha_num = test.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!();
            }

            emit!(test);
        } else {
            keyword!("default");
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
            punct!(":");
            space!();
            format &= !(ListFormat::MultiLine | ListFormat::Indented);
        } else {
            punct!(":");
        }
        self.emit_list(n.span(), Some(&n.cons), format)?;
    }

    #[emitter]
    fn emit_throw_stmt(&mut self, n: &ThrowStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("throw");

        {
            let need_paren = self.has_leading_comment(&n.arg);
            if need_paren {
                punct!("(");
            } else if n.arg.starts_with_alpha_num() {
                space!();
            } else {
                formatting_space!();
            }

            emit!(n.arg);
            if need_paren {
                punct!(")");
            }
        }
        semi!();
    }

    #[emitter]

    fn emit_try_stmt(&mut self, n: &TryStmt) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(n, true);

        keyword!("try");

        formatting_space!();
        emit!(n.block);

        if let Some(ref catch) = n.handler {
            formatting_space!();
            emit!(catch);
        }

        if let Some(ref finally) = n.finalizer {
            formatting_space!();
            keyword!("finally");
            // space!();
            emit!(finally);
        }
    }

    #[emitter]
    fn emit_while_stmt(&mut self, node: &WhileStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("while");

        punct!("(");
        emit!(node.test);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_do_while_stmt(&mut self, node: &DoWhileStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        keyword!("do");
        if node.body.starts_with_alpha_num() {
            space!();
        } else {
            formatting_space!()
        }
        emit!(node.body);

        keyword!("while");

        formatting_space!();

        punct!("(");
        emit!(node.test);
        punct!(")");

        if self.cfg.target <= EsVersion::Es5 {
            semi!();
        }

        srcmap!(node, false);
    }

    #[emitter]
    fn emit_for_stmt(&mut self, n: &ForStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("for");

        punct!("(");
        opt!(n.init);
        self.wr.write_punct(None, ";")?;
        opt_leading_space!(n.test);
        self.wr.write_punct(None, ";")?;
        opt_leading_space!(n.update);
        punct!(")");

        emit!(n.body);
    }

    #[emitter]
    fn emit_for_in_stmt(&mut self, n: &ForInStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("for");

        punct!("(");
        emit!(n.left);

        if n.left.ends_with_alpha_num() {
            space!();
        } else {
            formatting_space!();
        }
        keyword!("in");

        {
            let starts_with_alpha_num = n.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!()
            }
            emit!(n.right);
        }

        punct!(")");

        emit!(n.body);
    }

    #[emitter]
    fn emit_for_of_stmt(&mut self, n: &ForOfStmt) -> Result {
        self.wr.commit_pending_semi()?;

        self.emit_leading_comments_of_span(n.span(), false)?;

        srcmap!(n, true);

        keyword!("for");

        if n.is_await {
            space!();
            keyword!("await");
        }
        formatting_space!();
        punct!("(");
        emit!(n.left);
        if n.left.ends_with_alpha_num() {
            space!();
        } else {
            formatting_space!();
        }
        keyword!("of");

        {
            let starts_with_alpha_num = n.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!();
            } else {
                formatting_space!()
            }
            emit!(n.right);
        }
        punct!(")");
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

fn get_template_element_from_raw(s: &str, ascii_only: bool) -> String {
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
                    'n' => Some('\n'),
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

fn get_ascii_only_ident(sym: &str, may_need_quote: bool, target: EsVersion) -> Cow<str> {
    if sym.is_ascii() {
        return Cow::Borrowed(sym);
    }

    let mut first = true;
    let mut buf = String::with_capacity(sym.len() + 8);
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
        Cow::Owned(format!("\"{}\"", buf))
    } else {
        Cow::Owned(buf)
    }
}

fn get_quoted_utf16(v: &str, ascii_only: bool, target: EsVersion) -> String {
    // Count quotes first to determine which quote character to use
    let (mut single_quote_count, mut double_quote_count) = (0, 0);
    for c in v.chars() {
        match c {
            '\'' => single_quote_count += 1,
            '"' => double_quote_count += 1,
            _ => {}
        }
    }

    // Pre-calculate capacity to avoid reallocations
    let quote_char = if double_quote_count > single_quote_count {
        '\''
    } else {
        '"'
    };
    let escape_char = if quote_char == '\'' { '\'' } else { '"' };
    let escape_count = if quote_char == '\'' {
        single_quote_count
    } else {
        double_quote_count
    };

    // Add 2 for quotes, and 1 for each escaped quote
    let capacity = v.len() + 2 + escape_count;
    let mut buf = String::with_capacity(capacity);
    buf.push(quote_char);

    let mut iter = v.chars().peekable();
    while let Some(c) = iter.next() {
        match c {
            '\x00' => {
                if target < EsVersion::Es5 || matches!(iter.peek(), Some('0'..='9')) {
                    buf.push_str("\\x00");
                } else {
                    buf.push_str("\\0");
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
                    Some('u') => {
                        let mut inner_iter = iter.clone();
                        inner_iter.next();

                        let mut is_curly = false;
                        let mut next = inner_iter.peek();

                        if next == Some(&'{') {
                            is_curly = true;
                            inner_iter.next();
                            next = inner_iter.peek();
                        } else if next != Some(&'D') && next != Some(&'d') {
                            buf.push('\\');
                        }

                        if let Some(c @ 'D' | c @ 'd') = next {
                            let mut inner_buf = String::with_capacity(8);
                            inner_buf.push('\\');
                            inner_buf.push('u');

                            if is_curly {
                                inner_buf.push('{');
                            }

                            inner_buf.push(*c);
                            inner_iter.next();

                            let mut is_valid = true;
                            for _ in 0..3 {
                                match inner_iter.next() {
                                    Some(c @ '0'..='9') | Some(c @ 'a'..='f')
                                    | Some(c @ 'A'..='F') => {
                                        inner_buf.push(c);
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

                            let range = if is_curly {
                                3..(inner_buf.len() - 1)
                            } else {
                                2..6
                            };

                            if is_valid {
                                let val_str = &inner_buf[range];
                                if let Ok(v) = u32::from_str_radix(val_str, 16) {
                                    if v > 0xffff {
                                        buf.push_str(&inner_buf);
                                        let end = if is_curly { 7 } else { 5 };
                                        for _ in 0..end {
                                            iter.next();
                                        }
                                    } else if (0xd800..=0xdfff).contains(&v) {
                                        buf.push('\\');
                                    } else {
                                        buf.push_str("\\\\");
                                    }
                                } else {
                                    buf.push_str("\\\\");
                                }
                            } else {
                                buf.push_str("\\\\");
                            }
                        } else if is_curly {
                            buf.push_str("\\\\");
                        } else {
                            buf.push('\\');
                        }
                    }
                    _ => buf.push_str("\\\\"),
                }
            }
            c if c == escape_char => {
                buf.push('\\');
                buf.push(c);
            }
            '\x01'..='\x0f' => {
                buf.push_str("\\x0");
                write!(&mut buf, "{:x}", c as u8).unwrap();
            }
            '\x10'..='\x1f' => {
                buf.push_str("\\x");
                write!(&mut buf, "{:x}", c as u8).unwrap();
            }
            '\x20'..='\x7e' => buf.push(c),
            '\u{7f}'..='\u{ff}' => {
                if ascii_only || target <= EsVersion::Es5 {
                    buf.push_str("\\x");
                    write!(&mut buf, "{:x}", c as u8).unwrap();
                } else {
                    buf.push(c);
                }
            }
            '\u{2028}' => buf.push_str("\\u2028"),
            '\u{2029}' => buf.push_str("\\u2029"),
            '\u{FEFF}' => buf.push_str("\\uFEFF"),
            c => {
                if c.is_ascii() {
                    buf.push(c);
                } else if c > '\u{FFFF}' {
                    if target <= EsVersion::Es5 {
                        let h = ((c as u32 - 0x10000) / 0x400) + 0xd800;
                        let l = (c as u32 - 0x10000) % 0x400 + 0xdc00;
                        write!(&mut buf, "\\u{:04X}\\u{:04X}", h, l).unwrap();
                    } else if ascii_only {
                        write!(&mut buf, "\\u{{{:04X}}}", c as u32).unwrap();
                    } else {
                        buf.push(c);
                    }
                } else if ascii_only {
                    write!(&mut buf, "\\u{:04X}", c as u16).unwrap();
                } else {
                    buf.push(c);
                }
            }
        }
    }

    buf.push(quote_char);
    buf
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

fn minify_number(num: f64, detect_dot: &mut bool) -> String {
    // ddddd -> 0xhhhh
    // len(0xhhhh) == len(ddddd)
    // 10000000 <= num <= 0xffffff
    'hex: {
        if num.fract() == 0.0 && num.abs() <= u64::MAX as f64 {
            let int = num.abs() as u64;

            if int < 10000000 {
                break 'hex;
            }

            // use scientific notation
            if int % 1000 == 0 {
                break 'hex;
            }

            *detect_dot = false;
            return format!(
                "{}{:#x}",
                if num.is_sign_negative() { "-" } else { "" },
                int
            );
        }
    }

    let mut num = num.to_string();

    if num.contains(".") {
        *detect_dot = false;
    }

    if let Some(num) = num.strip_prefix("0.") {
        let cnt = clz(num);
        if cnt > 2 {
            return format!("{}e-{}", &num[cnt..], num.len());
        }
        return format!(".{}", num);
    }

    if let Some(num) = num.strip_prefix("-0.") {
        let cnt = clz(num);
        if cnt > 2 {
            return format!("-{}e-{}", &num[cnt..], num.len());
        }
        return format!("-.{}", num);
    }

    if num.ends_with("000") {
        *detect_dot = false;

        let cnt = num
            .as_bytes()
            .iter()
            .rev()
            .skip(3)
            .take_while(|&&c| c == b'0')
            .count()
            + 3;

        num.truncate(num.len() - cnt);
        num.push('e');
        num.push_str(&cnt.to_string());
    }

    num
}

fn clz(s: &str) -> usize {
    s.as_bytes().iter().take_while(|&&c| c == b'0').count()
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
