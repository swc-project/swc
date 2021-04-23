#![recursion_limit = "1024"]
#![allow(unused_variables)]

pub use self::config::Config;
use self::{
    list::ListFormat,
    text_writer::WriteJs,
    util::{SourceMapperExt, SpanExt, StartsWithAlphaNum},
};
use std::{fmt::Write, io, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{
    comments::Comments, sync::Lrc, BytePos, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;
use swc_ecma_parser::JscTarget;

#[macro_use]
pub mod macros;
mod comments;
mod config;
mod decl;
mod expr;
mod jsx;
pub mod list;
mod stmt;
#[cfg(test)]
mod tests;
pub mod text_writer;
mod typescript;
pub mod util;

pub type Result = io::Result<()>;

pub trait Node: Spanned {
    fn emit_with(&self, e: &mut Emitter<'_>) -> Result;
}
impl<N: Node> Node for Box<N> {
    #[inline(always)]
    fn emit_with(&self, e: &mut Emitter<'_>) -> Result {
        (**self).emit_with(e)
    }
}
impl<'a, N: Node> Node for &'a N {
    #[inline(always)]
    fn emit_with(&self, e: &mut Emitter<'_>) -> Result {
        (**self).emit_with(e)
    }
}

pub struct Emitter<'a> {
    pub cfg: config::Config,
    pub cm: Lrc<SourceMap>,
    pub comments: Option<&'a dyn Comments>,
    pub wr: Box<(dyn 'a + WriteJs)>,
}

impl<'a> Emitter<'a> {
    #[emitter]
    pub fn emit_program(&mut self, node: &Program) -> Result {
        match *node {
            Program::Module(ref m) => emit!(m),
            Program::Script(ref s) => emit!(s),
        }
    }

    #[emitter]
    pub fn emit_module(&mut self, node: &Module) -> Result {
        if let Some(ref shebang) = node.shebang {
            punct!("#!");
            self.wr.write_str_lit(DUMMY_SP, &*shebang)?;
            self.wr.write_line()?;
        }
        for stmt in &node.body {
            emit!(stmt);
        }
    }

    #[emitter]
    pub fn emit_script(&mut self, node: &Script) -> Result {
        if let Some(ref shebang) = node.shebang {
            punct!("#!");
            self.wr.write_str_lit(DUMMY_SP, &*shebang)?;
            self.wr.write_line()?;
        }
        for stmt in &node.body {
            emit!(stmt);
        }
    }

    #[emitter]
    fn emit_module_item(&mut self, node: &ModuleItem) -> Result {
        match *node {
            ModuleItem::Stmt(ref stmt) => emit!(stmt),
            ModuleItem::ModuleDecl(ref decl) => emit!(decl),
        }
    }

    #[emitter]
    fn emit_module_decl(&mut self, node: &ModuleDecl) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
        self.wr.write_line()?;
    }

    #[emitter]
    fn emit_export_decl(&mut self, node: &ExportDecl) -> Result {
        keyword!("export");
        space!();
        emit!(node.decl);
    }

    #[emitter]
    fn emit_export_default_expr(&mut self, node: &ExportDefaultExpr) -> Result {
        keyword!("export");
        space!();
        keyword!("default");
        space!();
        emit!(node.expr);
        formatting_semi!();
    }

    #[emitter]
    fn emit_export_default_decl(&mut self, node: &ExportDefaultDecl) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("export");
        space!();
        keyword!("default");
        space!();
        match node.decl {
            DefaultDecl::Class(ref n) => emit!(n),
            DefaultDecl::Fn(ref n) => emit!(n),
            DefaultDecl::TsInterfaceDecl(ref n) => emit!(n),
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_import(&mut self, node: &ImportDecl) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("import");
        space!();

        let mut specifiers = vec![];
        let mut emitted_default = false;
        let mut emitted_ns = false;
        for specifier in &node.specifiers {
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

                    assert!(node.specifiers.len() <= 2);
                    punct!("*");
                    space!();
                    keyword!("as");
                    space!();
                    emit!(ns.local);
                }
            }
        }

        if specifiers.is_empty() {
            space!();
            if emitted_ns || emitted_default {
                keyword!("from");
            }
        } else {
            if emitted_default {
                punct!(",");
                formatting_space!();
            }

            punct!("{");
            self.emit_list(
                node.span(),
                Some(&specifiers),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
            formatting_space!();

            keyword!("from");
        }

        formatting_space!();
        emit!(node.src);
        formatting_semi!();
    }

    #[emitter]
    fn emit_import_specific(&mut self, node: &ImportNamedSpecifier) -> Result {
        if let Some(ref imported) = node.imported {
            emit!(imported);
            space!();
            keyword!("as");
            space!();
        }

        emit!(node.local);
    }

    #[emitter]
    fn emit_export_specifier(&mut self, node: &ExportSpecifier) -> Result {
        match node {
            ExportSpecifier::Default(ref node) => {
                unimplemented!("codegen of `export default from 'foo';`")
            }
            ExportSpecifier::Namespace(ref node) => emit!(node),
            ExportSpecifier::Named(ref node) => emit!(node),
        }
    }

    #[emitter]
    fn emit_namespace_export_specifier(&mut self, node: &ExportNamespaceSpecifier) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("*");
        formatting_space!();
        keyword!("as");
        space!();
        emit!(node.name);
    }

    #[emitter]
    fn emit_named_export_specifier(&mut self, node: &ExportNamedSpecifier) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        if let Some(ref exported) = node.exported {
            emit!(node.orig);
            space!();
            keyword!("as");
            space!();
            emit!(node.exported);
        } else {
            emit!(node.orig);
        }
    }

    #[emitter]
    fn emit_named_export(&mut self, node: &NamedExport) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
                named_specs: vec![],
            },
            |mut result, s| match s {
                ExportSpecifier::Namespace(spec) => {
                    result.has_namespace_spec = true;
                    // There can only be one namespace export specifier.
                    if let None = result.namespace_spec {
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
        formatting_space!();
        if let Some(spec) = namespace_spec {
            emit!(spec);
            if has_named_specs {
                punct!(",");
                formatting_space!();
            }
        }
        if has_named_specs || (!has_namespace_spec && !has_named_specs) {
            punct!("{");
            self.emit_list(
                node.span,
                Some(&named_specs),
                ListFormat::NamedImportsOrExportsElements,
            )?;
            punct!("}");
        }

        if let Some(ref src) = node.src {
            if has_named_specs || (!has_namespace_spec && !has_named_specs) {
                formatting_space!();
            } else if has_namespace_spec {
                space!();
            }
            keyword!("from");
            formatting_space!();
            emit!(src);
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_export_all(&mut self, node: &ExportAll) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("export");
        space!();
        punct!("*");
        formatting_space!();
        keyword!("from");
        space!();
        emit!(node.src);
        formatting_semi!();
    }

    #[emitter]
    fn emit_lit(&mut self, node: &Lit) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        match *node {
            Lit::Bool(Bool { value, span }) => {
                if value {
                    keyword!(span, "true")
                } else {
                    keyword!(span, "false")
                }
            }
            Lit::Null(Null { span }) => keyword!(span, "null"),
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

    fn emit_js_word(&mut self, span: Span, value: &JsWord) -> Result {
        self.wr.write_str_lit(span, &value)?;

        Ok(())
    }

    #[emitter]
    fn emit_str_lit(&mut self, node: &Str) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        let (single_quote, value) = match node.kind {
            StrKind::Normal { contains_quote } => {
                let single_quote = if contains_quote {
                    is_single_quote(&self.cm, node.span)
                } else {
                    None
                };

                let value = escape_with_source(
                    &self.cm,
                    self.wr.target(),
                    node.span,
                    &node.value,
                    single_quote,
                );

                (single_quote.unwrap_or(false), value)
            }
            StrKind::Synthesized => {
                let single_quote = false;
                let value = escape_without_source(&node.value, self.wr.target(), single_quote);

                (single_quote, value)
            }
        };

        if single_quote {
            punct!("'");
            self.wr.write_str_lit(node.span, &value)?;
            punct!("'");
        } else {
            punct!("\"");
            self.wr.write_str_lit(node.span, &value)?;
            punct!("\"");
        }
    }

    #[emitter]
    fn emit_num_lit(&mut self, num: &Number) -> Result {
        self.emit_leading_comments_of_pos(num.span().lo(), false)?;

        // Handle infinity
        if num.value.is_infinite() {
            if num.value.is_sign_negative() {
                self.wr.write_str_lit(num.span, "-")?;
            }
            self.wr.write_str_lit(num.span, "Infinity")?;
        } else {
            if num.value.is_sign_negative() && num.value == 0.0 {
                self.wr.write_str_lit(num.span, "-0.0")?;
            } else {
                self.wr.write_str_lit(num.span, &format!("{}", num.value))?;
            }
        }
    }

    #[emitter]
    fn emit_big_lit(&mut self, v: &BigInt) -> Result {
        self.emit_leading_comments_of_pos(v.span.lo(), false)?;

        self.wr.write_lit(v.span, &v.value.to_string())?;
        self.wr.write_lit(v.span, "n")?;
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
    fn emit_expr_or_super(&mut self, node: &ExprOrSuper) -> Result {
        match *node {
            ExprOrSuper::Expr(ref e) => emit!(e),
            ExprOrSuper::Super(ref n) => emit!(n),
        }
    }
    #[emitter]
    fn emit_super(&mut self, node: &Super) -> Result {
        keyword!(node.span, "super");
    }

    #[emitter]
    fn emit_expr(&mut self, node: &Expr) -> Result {
        match *node {
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
            Expr::OptChain(ref n) => emit!(n),
            Expr::Invalid(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_opt_chain(&mut self, n: &OptChainExpr) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        match *n.expr {
            Expr::Member(ref e) => {
                emit!(e.obj);
                self.wr.write_operator("?.")?;

                if e.computed {
                    punct!("[");
                    emit!(e.prop);
                    punct!("]");
                } else {
                    emit!(e.prop);
                }
            }
            Expr::Call(ref e) => {
                emit!(e.callee);
                self.wr.write_operator("?.")?;

                punct!("(");
                self.emit_expr_or_spreads(n.span(), &e.args, ListFormat::CallExpressionArguments)?;
                punct!(")");
            }
            _ => {}
        }
    }

    #[emitter]
    fn emit_invalid(&mut self, n: &Invalid) -> Result {
        self.emit_leading_comments_of_pos(n.span.lo(), false)?;

        self.wr.write_str_lit(n.span, "<invalid>")?;
    }

    #[emitter]
    fn emit_call_expr(&mut self, node: &CallExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.callee);

        punct!("(");
        self.emit_expr_or_spreads(node.span(), &node.args, ListFormat::CallExpressionArguments)?;
        punct!(")");
    }

    #[emitter]
    fn emit_new_expr(&mut self, node: &NewExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("new");
        space!();
        emit!(node.callee);

        if let Some(type_args) = &node.type_args {
            emit!(type_args);
        }

        if let Some(ref args) = node.args {
            punct!("(");
            self.emit_expr_or_spreads(node.span(), args, ListFormat::NewExpressionArguments)?;
            punct!(")");
        }
    }

    #[emitter]
    fn emit_member_expr(&mut self, node: &MemberExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.obj);

        if node.computed {
            punct!("[");
            emit!(node.prop);
            punct!("]");
        } else {
            if self.needs_2dots_for_property_access(&node.obj) {
                if node.prop.span().lo() >= BytePos(2) {
                    self.emit_leading_comments_of_pos(node.prop.span().lo() - BytePos(2), false)?;
                }
                punct!(".");
            }
            if node.prop.span().lo() >= BytePos(1) {
                self.emit_leading_comments_of_pos(node.prop.span().lo() - BytePos(1), false)?;
            }
            punct!(".");
            emit!(node.prop);
        }
    }

    /// `1..toString` is a valid property access, emit a dot after the literal
    pub fn needs_2dots_for_property_access(&self, expr: &ExprOrSuper) -> bool {
        match *expr {
            ExprOrSuper::Expr(ref expr) => {
                match **expr {
                    Expr::Lit(Lit::Num(Number { span, value })) => {
                        if value.fract() == 0.0 {
                            return true;
                        }
                        // check if numeric literal is a decimal literal that was originally written
                        // with a dot
                        if let Ok(text) = self.cm.span_to_snippet(span) {
                            if text.contains('.') {
                                return false;
                            }
                            text.starts_with('0') || text.ends_with(' ')
                        } else {
                            true
                        }
                    }
                    _ => false,
                }
            }
            _ => false,
        }
    }

    #[emitter]
    fn emit_arrow_expr(&mut self, node: &ArrowExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
                [Pat::Ident(_)] => false,
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

        punct!("=>");
        emit!(node.body);
    }

    #[emitter]
    fn emit_meta_prop_expr(&mut self, node: &MetaPropExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.meta);
        punct!(".");
        emit!(node.prop);
    }

    #[emitter]
    fn emit_seq_expr(&mut self, node: &SeqExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
        let need_space = match node.op {
            op!("in") | op!("instanceof") => true,
            _ => false,
        };

        let need_pre_space = need_space
            || match *node.left {
                Expr::Update(UpdateExpr { prefix: false, .. }) => true,
                _ => false,
            };
        if need_pre_space {
            space!(self);
        } else {
            formatting_space!(self);
        }
        operator!(self, node.op.as_str());

        let need_post_space = need_space
            || match *node.right {
                Expr::Unary(..) | Expr::Update(UpdateExpr { prefix: true, .. }) => true,
                _ => false,
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        {
            let mut left = Some(node);
            let mut lefts = vec![];
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("@");
        emit!(node.expr);
        self.wr.write_line()?;
    }

    #[emitter]
    fn emit_class_expr(&mut self, node: &ClassExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        for dec in &node.class.decorators {
            emit!(dec);
        }

        keyword!("class");

        if let Some(ref i) = node.ident {
            space!();
            emit!(i);
            emit!(node.class.type_params);

            formatting_space!();
        } else {
            space!();
        }

        self.emit_class_trailing(&node.class)?;
    }

    #[emitter]
    fn emit_class_trailing(&mut self, node: &Class) -> Result {
        if node.super_class.is_some() {
            keyword!("extends");
            space!();
            emit!(node.super_class);
            space!();
        }

        punct!("{");
        self.emit_list(node.span, Some(&node.body), ListFormat::ClassMembers)?;
        punct!("}");
    }

    #[emitter]
    fn emit_class_memeber(&mut self, node: &ClassMember) -> Result {
        match *node {
            ClassMember::Constructor(ref n) => emit!(n),
            ClassMember::ClassProp(ref n) => emit!(n),
            ClassMember::Method(ref n) => emit!(n),
            ClassMember::PrivateMethod(ref n) => emit!(n),
            ClassMember::PrivateProp(ref n) => emit!(n),
            ClassMember::TsIndexSignature(ref n) => emit!(n),
            ClassMember::Empty(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_private_method(&mut self, n: &PrivateMethod) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        if n.is_static {
            keyword!("static");
            space!();
        }
        match n.kind {
            MethodKind::Method => {
                if n.function.is_async {
                    keyword!("async");
                }
                space!();
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
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        if n.value {
            keyword!(n.span, "true")
        } else {
            keyword!(n.span, "false")
        }
    }

    #[emitter]
    fn emit_class_method(&mut self, n: &ClassMethod) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        self.emit_accesibility(n.accessibility)?;

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
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accesibility(n.accessibility)?;

        if n.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(n.key);
        if let Some(type_ann) = &n.type_ann {
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

        formatting_semi!();
    }

    #[emitter]
    fn emit_class_prop(&mut self, n: &ClassProp) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        if n.accessibility != Some(Accessibility::Public) {
            self.emit_accesibility(n.accessibility)?;
        }

        if n.readonly {
            keyword!("readonly");
            space!()
        }

        if n.is_static {
            keyword!("static");
            space!();
        }

        if n.computed {
            punct!("[");
            emit!(n.key);
            punct!("]");
        } else {
            emit!(n.key);
        }

        if let Some(ty) = &n.type_ann {
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

        formatting_semi!();
    }

    fn emit_accesibility(&mut self, n: Option<Accessibility>) -> Result {
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
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        self.emit_accesibility(n.accessibility)?;

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
    fn emit_prop_name(&mut self, node: &PropName) -> Result {
        match *node {
            PropName::Ident(ref n) => emit!(n),
            PropName::Str(ref n) => emit!(n),
            PropName::Num(ref n) => emit!(n),
            PropName::BigInt(ref n) => emit!(n),
            PropName::Computed(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_computed_prop_name(&mut self, node: &ComputedPropName) -> Result {
        punct!("[");
        emit!(node.expr);
        punct!("]");
    }

    #[emitter]
    fn emit_cond_expr(&mut self, node: &CondExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
    fn emit_fn_expr(&mut self, node: &FnExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        if node.function.is_async {
            keyword!("async");
            space!()
        }
        keyword!("function");

        if node.function.is_generator {
            punct!("*");
        }
        if let Some(ref i) = node.ident {
            space!();
            emit!(i);
        }

        self.emit_fn_trailing(&node.function)?;
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
            emit!(body);
        } else {
            formatting_semi!()
        }
    }

    #[emitter]
    fn emit_block_stmt_or_expr(&mut self, node: &BlockStmtOrExpr) -> Result {
        match *node {
            BlockStmtOrExpr::BlockStmt(ref block_stmt) => emit!(block_stmt),
            BlockStmtOrExpr::Expr(ref expr) => {
                self.wr.increase_indent()?;
                emit!(expr);
                self.wr.decrease_indent()?;
                if !self.cfg.minify {
                    self.wr.write_line()?;
                }
            }
        }
    }

    #[emitter]
    fn emit_this_expr(&mut self, node: &ThisExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("this");
    }

    #[emitter]
    fn emit_tpl_lit(&mut self, node: &Tpl) -> Result {
        debug_assert!(node.quasis.len() == node.exprs.len() + 1);

        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("`");
        let i = 0;

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
    }

    #[emitter]
    fn emit_tagged_tpl_lit(&mut self, node: &TaggedTpl) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.tag);
        emit!(node.type_params);
        emit!(node.tpl);
    }

    #[emitter]
    fn emit_quasi(&mut self, node: &TplElement) -> Result {
        self.wr
            .write_str_lit(node.span, &unescape(&node.raw.value))?;
        return Ok(());
    }

    #[emitter]
    fn emit_unary_expr(&mut self, node: &UnaryExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        let need_formatting_space = match node.op {
            op!("typeof") | op!("void") | op!("delete") => {
                keyword!(node.op.as_str());
                true
            }
            op!(unary, "+") | op!(unary, "-") | op!("!") | op!("~") => {
                punct!(node.op.as_str());
                false
            }
        };

        if should_emit_whitespace_before_operand(node) {
            space!();
        } else if need_formatting_space {
            formatting_space!();
        }

        emit!(node.arg);
    }

    #[emitter]
    fn emit_update_expr(&mut self, node: &UpdateExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("yield");
        if node.delegate {
            operator!("*");
        }

        if let Some(ref arg) = node.arg {
            if arg.starts_with_alpha_num() {
                space!()
            } else {
                formatting_space!()
            }
            emit!(node.arg);
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        if node.spread.is_some() {
            punct!("...");
        }

        emit!(node.expr);
    }

    #[emitter]
    fn emit_await_expr(&mut self, node: &AwaitExpr) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("await");

        space!();

        emit!(&node.arg);
    }

    #[emitter]
    fn emit_array_lit(&mut self, node: &ArrayLit) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("[");
        self.emit_list(
            node.span(),
            Some(&node.elems),
            ListFormat::ArrayLiteralExpressionElements,
        )?;
        punct!("]");
    }

    #[emitter]
    fn emit_object_lit(&mut self, node: &ObjectLit) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("{");
        if !self.cfg.minify {
            self.wr.write_line()?;
        }
        self.emit_list(
            node.span(),
            Some(&node.props),
            ListFormat::ObjectLiteralExpressionProperties,
        )?;
        if !self.cfg.minify {
            self.wr.write_line()?;
        }
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.key);
        punct!(":");
        formatting_space!();
        emit!(node.value);
    }

    #[emitter]
    fn emit_assign_prop(&mut self, node: &AssignProp) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.key);
        punct!("=");
        emit!(node.value);
    }

    #[emitter]
    fn emit_getter_prop(&mut self, node: &GetterProp) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("get");
        space!();
        emit!(node.key);
        space!();
        punct!("(");
        punct!(")");
        formatting_space!();
        emit!(node.body);
    }

    #[emitter]
    fn emit_setter_prop(&mut self, node: &SetterProp) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("set");
        space!();
        emit!(node.key);
        space!();

        punct!("(");
        emit!(node.param);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_method_prop(&mut self, node: &MethodProp) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("(");
        emit!(node.expr);
        punct!(")");
    }

    #[emitter]
    fn emit_private_name(&mut self, n: &PrivateName) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo(), false)?;

        punct!("#");
        emit!(n.id)
    }

    #[emitter]
    fn emit_binding_ident(&mut self, ident: &BindingIdent) -> Result {
        emit!(ident.id);

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
        // TODO: Use write_symbol when ident is a symbol.
        self.emit_leading_comments_of_pos(ident.span.lo(), false)?;

        // TODO: span
        self.wr.write_symbol(ident.span, &ident.sym)?;
        if ident.optional {
            punct!("?");
        }

        // Call emitList directly since it could be an array of
        // TypeParameterDeclarations _or_ type arguments

        // emitList(node, node.typeArguments, ListFormat::TypeParameters);
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

    #[allow(clippy::cognitive_complexity)]
    fn emit_list5<N: Node>(
        &mut self,
        parent_node: Span,
        children: Option<&[N]>,
        format: ListFormat,
        start: usize,
        count: usize,
    ) -> Result {
        if children.is_none() && format.contains(ListFormat::OptionalIfUndefined) {
            return Ok(());
        }

        let is_empty = children.is_none() || start > children.unwrap().len() || count == 0;
        if is_empty && format.contains(ListFormat::OptionalIfEmpty) {
            return Ok(());
        }

        if format.contains(ListFormat::BracketsMask) {
            self.wr.write_punct(format.opening_bracket())?;

            if is_empty {
                self.emit_trailing_comments_of_pos(
                    {
                        // TODO: children.lo()

                        parent_node.lo()
                    },
                    true,
                    false,
                )?;
            }
        }

        // self.handlers.onBeforeEmitNodeArray(children);

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
            if self
                .cm
                .should_write_leading_line_terminator(parent_node, children, format)
            {
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
                        && previous_sibling.span().hi() != parent_node.hi()
                    {
                        self.emit_leading_comments_of_pos(previous_sibling.span().hi(), true)?;
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
                            should_decrease_indent_after_emit = true;
                        }

                        if !self.cfg.minify {
                            self.wr.write_line()?;
                        }
                        should_emit_intervening_comments = false;
                    } else if format.contains(ListFormat::SpaceBetweenSiblings) {
                        formatting_space!(self);
                    }
                }

                child.emit_with(self)?;

                // Emit this child.
                if should_emit_intervening_comments {
                    let comment_range = child.comment_range();
                    self.emit_trailing_comments_of_pos(comment_range.hi(), false, true)?;
                } else {
                    should_emit_intervening_comments = may_emit_intervening_comments;
                }

                if should_decrease_indent_after_emit {
                    self.wr.decrease_indent()?;
                    should_decrease_indent_after_emit = false;
                }

                previous_sibling = Some(child.span());
            }

            // Write a trailing comma, if requested.
            let has_trailing_comma = format.contains(ListFormat::AllowTrailingComma) && {
                if parent_node.is_dummy() {
                    false
                } else {
                    match self.cm.span_to_snippet(parent_node) {
                        Ok(snippet) => {
                            if snippet.len() < 3 {
                                false
                            } else {
                                snippet[..snippet.len() - 1].trim().ends_with(',')
                            }
                        }
                        _ => false,
                    }
                }
            };

            if has_trailing_comma && format.contains(ListFormat::CommaDelimited) {
                self.wr.write_punct(",")?;
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
                        && previous_sibling.span().hi() != parent_node.hi()
                        && emit_trailing_comments
                    {
                        self.emit_leading_comments_of_pos(previous_sibling.span().hi(), true)?;
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
                .should_write_closing_line_terminator(parent_node, children, format)
            {
                if !self.cfg.minify {
                    self.wr.write_line()?;
                }
            } else if format.contains(ListFormat::SpaceBetweenBraces) && !self.cfg.minify {
                self.wr.write_space()?;
            }
        }

        // self.handlers.onAfterEmitNodeArray(children);

        if format.contains(ListFormat::BracketsMask) {
            if is_empty {
                self.emit_leading_comments_of_pos(
                    {
                        //TODO: children.hi()

                        parent_node.hi()
                    },
                    true,
                )?; // Emit leading comments within empty lists
            }
            self.wr.write_punct(format.closing_bracket())?;
        }

        Ok(())
    }
}

/// Patterns
impl<'a> Emitter<'a> {
    #[emitter]
    fn emit_param(&mut self, node: &Param) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        self.emit_list(node.span, Some(&node.decorators), ListFormat::Decorators)?;

        emit!(node.pat);
    }

    #[emitter]
    fn emit_pat(&mut self, node: &Pat) -> Result {
        match *node {
            Pat::Array(ref n) => emit!(n),
            Pat::Assign(ref n) => emit!(n),
            Pat::Expr(ref n) => emit!(n),
            Pat::Ident(ref n) => emit!(n),
            Pat::Object(ref n) => emit!(n),
            Pat::Rest(ref n) => emit!(n),
            Pat::Invalid(..) => invalid_pat(),
        }
    }

    #[emitter]
    fn emit_rest_pat(&mut self, node: &RestPat) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("...");
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("...");
        emit!(node.expr)
    }

    #[emitter]
    fn emit_pat_or_expr(&mut self, node: &PatOrExpr) -> Result {
        match *node {
            PatOrExpr::Expr(ref n) => emit!(n),
            PatOrExpr::Pat(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_array_pat(&mut self, node: &ArrayPat) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
    }

    #[emitter]
    fn emit_assign_pat(&mut self, node: &AssignPat) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.left);
        formatting_space!();
        punct!("=");
        formatting_space!();
        emit!(node.right);
    }

    #[emitter]
    fn emit_object_pat(&mut self, node: &ObjectPat) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        let is_last_rest = match node.props.last() {
            Some(ObjectPatProp::Rest(..)) => true,
            _ => false,
        };
        let format = if is_last_rest {
            ListFormat::ObjectBindingPatternElements ^ ListFormat::AllowTrailingComma
        } else {
            ListFormat::ObjectBindingPatternElements
        };

        punct!("{");
        self.emit_list(node.span(), Some(&node.props), format)?;
        punct!("}");
        if node.optional {
            punct!("?");
        }

        if let Some(type_ann) = &node.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }
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
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.key);
        punct!(":");
        formatting_space!();
        emit!(node.value);
        space!();
    }

    #[emitter]
    fn emit_object_assign_pat(&mut self, node: &AssignPatProp) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        emit!(node.key);
        formatting_space!();
        if let Some(ref value) = node.value {
            punct!("=");
            emit!(node.value);
            space!();
        }
    }

    #[emitter]
    fn emit_var_decl_or_pat(&mut self, node: &VarDeclOrPat) -> Result {
        match *node {
            VarDeclOrPat::Pat(ref n) => emit!(n),
            VarDeclOrPat::VarDecl(ref n) => emit!(n),
        }
    }
}

/// Statements
impl<'a> Emitter<'a> {
    #[emitter]
    fn emit_stmt(&mut self, node: &Stmt) -> Result {
        match *node {
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
            Stmt::Decl(ref e) => emit!(e),
        }
        self.emit_trailing_comments_of_pos(node.span().hi(), true, true)?;

        if !self.cfg.minify {
            self.wr.write_line()?;
        }
    }

    #[emitter]
    fn emit_expr_stmt(&mut self, e: &ExprStmt) -> Result {
        emit!(e.expr);
        formatting_semi!();
    }

    #[emitter]
    fn emit_block_stmt(&mut self, node: &BlockStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        punct!("{");
        self.emit_list(
            node.span(),
            Some(&node.stmts),
            ListFormat::MultiLineBlockStatements,
        )?;

        self.emit_leading_comments_of_pos(node.span().hi(), true)?;

        punct!("}");
    }

    #[emitter]
    fn emit_empty_stmt(&mut self, node: &EmptyStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        semi!();
    }

    #[emitter]
    fn emit_debugger_stmt(&mut self, node: &DebuggerStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("debugger");
        formatting_semi!();
    }

    #[emitter]
    fn emit_with_stmt(&mut self, node: &WithStmt) -> Result {
        keyword!("with");
        formatting_space!();

        punct!("(");
        emit!(node.obj);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_return_stmt(&mut self, node: &ReturnStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span.lo(), false)?;

        keyword!("return");
        if let Some(ref arg) = node.arg {
            let need_paren = if let Some(cmt) = self.comments {
                let lo = node.arg.span().lo();

                // see #415
                cmt.has_leading(lo)
            } else {
                false
            };
            if need_paren {
                punct!("(");
            }
            space!();
            emit!(arg);
            if need_paren {
                punct!(")");
            }
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_labeled_stmt(&mut self, node: &LabeledStmt) -> Result {
        emit!(node.label);

        // TODO: Comment
        punct!(":");
        formatting_space!();

        emit!(node.body);
    }

    #[emitter]
    fn emit_break_stmt(&mut self, node: &BreakStmt) -> Result {
        keyword!("break");
        if let Some(ref label) = node.label {
            space!();
            emit!(label);
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_continue_stmt(&mut self, node: &ContinueStmt) -> Result {
        keyword!("continue");
        if let Some(ref label) = node.label {
            space!();
            emit!(label);
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_if_stmt(&mut self, node: &IfStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("if");

        formatting_space!();
        punct!("(");
        emit!(node.test);
        punct!(")");
        formatting_space!();

        let is_cons_block = match *node.cons {
            Stmt::Block(..) => true,
            _ => false,
        };

        emit!(node.cons);

        if let Some(ref alt) = node.alt {
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
    fn emit_switch_stmt(&mut self, node: &SwitchStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("switch");

        punct!("(");
        emit!(node.discriminant);
        punct!(")");

        punct!("{");
        self.emit_list(node.span(), Some(&node.cases), ListFormat::CaseBlockClauses)?;
        punct!("}");
    }

    #[emitter]
    fn emit_catch_clause(&mut self, node: &CatchClause) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("catch");
        formatting_space!();

        if let Some(param) = &node.param {
            punct!("(");
            emit!(param);
            punct!(")");
        }

        space!();

        emit!(node.body);
    }

    #[emitter]
    fn emit_switch_case(&mut self, node: &SwitchCase) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        if let Some(ref test) = node.test {
            keyword!("case");
            space!();
            emit!(test);
        } else {
            keyword!("default");
        }

        let emit_as_single_stmt = node.cons.len() == 1 && {
            // treat synthesized nodes as located on the same line for emit purposes
            node.is_synthesized()
                || node.cons[0].is_synthesized()
                || self
                    .cm
                    .is_on_same_line(node.span().lo(), node.cons[0].span().lo())
        };

        let mut format = ListFormat::CaseOrDefaultClauseStatements;
        if emit_as_single_stmt {
            punct!(":");
            space!();
            format &= !(ListFormat::MultiLine | ListFormat::Indented);
        } else {
            punct!(":");
        }
        self.emit_list(node.span(), Some(&node.cons), format)?;
    }

    #[emitter]
    fn emit_throw_stmt(&mut self, node: &ThrowStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("throw");
        space!();
        emit!(node.arg);
        formatting_semi!();
    }

    #[emitter]
    fn emit_try_stmt(&mut self, node: &TryStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("try");
        formatting_space!();
        emit!(node.block);

        if let Some(ref catch) = node.handler {
            formatting_space!();
            emit!(catch);
        }

        if let Some(ref finally) = node.finalizer {
            formatting_space!();
            keyword!("finally");
            // space!();
            emit!(finally);
        }
    }

    #[emitter]
    fn emit_while_stmt(&mut self, node: &WhileStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("while");

        punct!("(");
        emit!(node.test);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_do_while_stmt(&mut self, node: &DoWhileStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

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
    }

    #[emitter]
    fn emit_for_stmt(&mut self, node: &ForStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("for");
        punct!("(");
        opt!(node.init);
        semi!();
        opt_leading_space!(node.test);
        semi!();
        opt_leading_space!(node.update);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_for_in_stmt(&mut self, node: &ForInStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("for");
        punct!("(");
        emit!(node.left);
        space!();
        keyword!("in");
        space!();
        emit!(node.right);
        punct!(")");

        emit!(node.body);
    }

    #[emitter]
    fn emit_for_of_stmt(&mut self, node: &ForOfStmt) -> Result {
        self.emit_leading_comments_of_pos(node.span().lo(), false)?;

        keyword!("for");
        if node.await_token.is_some() {
            space!();
            keyword!("await");
        }
        formatting_space!();
        punct!("(");
        emit!(node.left);
        space!();
        keyword!("of");
        space!();
        emit!(node.right);
        punct!(")");
        emit!(node.body);
    }
}

impl<'a> Emitter<'a> {
    fn write_delim(&mut self, f: ListFormat) -> Result {
        match f & ListFormat::DelimitersMask {
            ListFormat::None => {}
            ListFormat::CommaDelimited => self.wr.write_punct(",")?,
            ListFormat::BarDelimited => {
                if !self.cfg.minify {
                    self.wr.write_space()?;
                }
                self.wr.write_punct("|")?;
            }
            ListFormat::AmpersandDelimited => {
                if !self.cfg.minify {
                    self.wr.write_space()?;
                }
                self.wr.write_punct("&")?;
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

#[allow(dead_code)]
fn get_text_of_node<T: Spanned>(
    cm: &Arc<SourceMap>,
    node: &T,
    _include_travia: bool,
) -> Option<String> {
    let span = node.span();
    if span.is_dummy() || span.ctxt() != SyntaxContext::empty() {
        // This node is transformed so we shoukld not use original source code.
        return None;
    }

    let s = cm.span_to_snippet(span).unwrap();
    if s == "" {
        return None;
    }
    Some(s)
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

    match *node.arg {
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
        _ => false,
    }
}

impl<N> Node for Option<N>
where
    N: Node,
{
    fn emit_with(&self, e: &mut Emitter<'_>) -> Result {
        match *self {
            Some(ref n) => n.emit_with(e),
            None => Ok(()),
        }
    }
}

fn unescape(s: &str) -> String {
    fn read_escaped(
        radix: u32,
        len: Option<usize>,
        buf: &mut String,
        chars: impl Iterator<Item = char>,
    ) {
        let mut v = 0;
        let mut pending = None;

        for (i, c) in chars.enumerate() {
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
            2 => write!(buf, "\\b{:b}", v).unwrap(),

            8 => write!(buf, "\\o{:o}", v).unwrap(),

            16 => {
                if v < 16 {
                    write!(buf, "\\x0{:x}", v).unwrap()
                } else {
                    write!(buf, "\\x{:x}", v).unwrap()
                }
            }

            _ => unreachable!(),
        }

        if let Some(pending) = pending {
            buf.push(pending);
        }
    }

    let mut result = String::with_capacity(s.len() * 6 / 5);
    let mut chars = s.chars();

    while let Some(c) = chars.next() {
        if c != '\\' {
            match c {
                '\r' => {
                    result.push_str("\\r");
                }
                '\n' => {
                    result.push_str("\\n");
                }

                // TODO: Handle all escapes
                _ => {
                    result.push(c);
                }
            }

            continue;
        }

        match chars.next() {
            None => {
                // This is wrong, but it seems like a mistake made by user.
                result.push('\\');
            }
            Some(c) => {
                match c {
                    '\\' => result.push_str(r"\\"),
                    'n' => result.push_str("\\n"),
                    'r' => result.push_str("\\r"),
                    't' => result.push_str("\\t"),
                    'b' => result.push_str("\\\u{0008}"),
                    'f' => result.push_str("\\\u{000C}"),
                    'v' => result.push_str("\\\u{000B}"),
                    '0' => match chars.next() {
                        Some('b') => read_escaped(2, None, &mut result, &mut chars),
                        Some('o') => read_escaped(8, None, &mut result, &mut chars),
                        Some('x') => read_escaped(16, Some(2), &mut result, &mut chars),
                        nc => {
                            // This is wrong, but it seems like a mistake made by user.
                            result.push_str("\\0");
                            result.extend(nc);
                        }
                    },

                    _ => {
                        result.push('\\');
                        result.push(c);
                    }
                }
            }
        }
    }

    result
}

fn escape_without_source(v: &str, target: JscTarget, single_quote: bool) -> String {
    let mut buf = String::with_capacity(v.len());

    for c in v.chars() {
        match c {
            '\u{0008}' => buf.push_str("\\b"),
            '\u{000c}' => buf.push_str("\\f"),
            '\n' => buf.push_str("\\n"),
            '\r' => buf.push_str("\\r"),
            '\t' => buf.push_str("\\t"),
            '\u{000b}' => buf.push_str("\\v"),
            '\0' => buf.push_str("\\0"),

            '\\' => buf.push_str("\\\\"),

            '\'' if single_quote => buf.push_str("\\'"),
            '"' if !single_quote => buf.push_str("\\\""),

            '\x01'..='\x0f' => {
                let _ = write!(buf, "\\x0{:x}", c as u8);
            }
            '\x10'..='\x1f' => {
                let _ = write!(buf, "\\x{:x}", c as u8);
            }

            '\x20'..='\x7e' => {
                //
                buf.push(c);
            }
            '\u{7f}'..='\u{ff}' => {
                let _ = write!(buf, "\\x{:x}", c as u8);
            }

            _ => {
                let escaped = c.escape_unicode().to_string();

                if escaped.starts_with('\\') {
                    buf.push_str("\\u");
                    if escaped.len() == 8 {
                        buf.push_str(&escaped[3..=6]);
                    } else {
                        buf.push_str(&escaped[2..]);
                    }
                }
            }
        }
    }

    buf
}

fn escape_with_source<'s>(
    cm: &SourceMap,
    target: JscTarget,
    span: Span,
    s: &'s str,
    single_quote: Option<bool>,
) -> String {
    if target <= JscTarget::Es5 {
        return escape_without_source(s, target, single_quote.unwrap_or(false));
    }

    if span.is_dummy() {
        return escape_without_source(s, target, single_quote.unwrap_or(false));
    }

    //
    let orig = cm.span_to_snippet(span);
    let orig = match orig {
        Ok(orig) => orig,
        Err(v) => {
            return escape_without_source(s, target, single_quote.unwrap_or(false));
        }
    };

    if single_quote.is_some() && orig.len() <= 2 {
        return escape_without_source(s, target, single_quote.unwrap_or(false));
    }

    let mut orig = &*orig;

    if (single_quote == Some(true) && orig.starts_with('\''))
        || (single_quote == Some(false) && orig.starts_with('"'))
    {
        orig = &orig[1..orig.len() - 1];
    } else {
        if single_quote.is_some() {
            return escape_without_source(s, target, single_quote.unwrap_or(false));
        }
    }

    let mut buf = String::with_capacity(s.len());
    let mut orig_iter = orig.chars().peekable();
    let mut s_iter = s.chars();

    while let Some(orig_c) = orig_iter.next() {
        // Javascript literal should not contain newlines
        if orig_c == '\n' {
            s_iter.next();
            s_iter.next();
            buf.push_str("\\n");
            continue;
        }

        if single_quote.is_none() && orig_c == '"' {
            s_iter.next();
            s_iter.next();
            buf.push_str("\\\"");
            continue;
        }

        if orig_c == '\\' {
            buf.push('\\');
            match orig_iter.next() {
                Some('\\') => {
                    buf.push('\\');
                    s_iter.next();
                    continue;
                }
                Some(escaper) => {
                    buf.push(escaper);
                    match escaper {
                        'x' => {
                            buf.extend(orig_iter.next());
                            buf.extend(orig_iter.next());
                            s_iter.next();
                        }
                        'u' => match orig_iter.next() {
                            Some('{') => {
                                buf.push('{');
                                loop {
                                    let ch = orig_iter.next();
                                    buf.extend(ch);
                                    if ch == Some('}') {
                                        break;
                                    }
                                }
                                s_iter.next();
                            }
                            Some(ch) => {
                                buf.push(ch);
                                buf.extend(orig_iter.next());
                                buf.extend(orig_iter.next());
                                buf.extend(orig_iter.next());
                                s_iter.next();
                            }
                            None => break,
                        },
                        'b' | 'f' | 'n' | 'r' | 't' | 'v' | '0' => {
                            s_iter.next();
                        }

                        '\'' if single_quote == Some(true) => {
                            s_iter.next();
                        }

                        '"' if single_quote == Some(false) => {
                            s_iter.next();
                        }

                        _ => {
                            s_iter.next();
                        }
                    }

                    continue;
                }
                _ => {}
            }
        }

        s_iter.next();
        buf.push(orig_c);
    }

    buf.extend(s_iter);

    buf
}

/// Returns [Some] if the span points to a string literal written by user.
///
/// Returns [None] if the span is created from a pass of swc. For example,
/// spans of string literals created from [TplElement] do not have `starting`
/// quote.
fn is_single_quote(cm: &SourceMap, span: Span) -> Option<bool> {
    let start = cm.lookup_byte_offset(span.lo);
    let end = cm.lookup_byte_offset(span.hi);

    if start.sf.start_pos != end.sf.start_pos {
        return None;
    }

    // Empty file
    if start.sf.start_pos == start.sf.end_pos {
        return None;
    }

    let start_index = start.pos.0;
    let end_index = end.pos.0;
    let source_len = (start.sf.end_pos - start.sf.start_pos).0;

    if start_index > end_index || end_index > source_len {
        return None;
    }

    let src = &start.sf.src;
    let single_quote = match src.as_bytes()[start_index as usize] {
        b'\'' => true,
        b'"' => false,
        _ => return None,
    };
    if end_index == 0 {
        return None;
    }

    if src.as_bytes()[start_index as usize] != src.as_bytes()[(end_index - 1) as usize] {
        return None;
    }

    Some(single_quote)
}

#[cold]
#[inline(never)]
fn invalid_pat() -> ! {
    unimplemented!("emit Pat::Invalid")
}
