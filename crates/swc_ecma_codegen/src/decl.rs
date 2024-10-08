use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    fn emit_decl(&mut self, node: &Decl) -> Result {
        match node {
            Decl::Class(ref n) => emit!(n),
            Decl::Fn(ref n) => emit!(n),

            Decl::Var(ref n) => {
                self.emit_var_decl_inner(n)?;
                formatting_semi!();
                srcmap!(n, false);
            }
            Decl::Using(n) => emit!(n),
            Decl::TsEnum(ref n) => emit!(n),
            Decl::TsInterface(ref n) => emit!(n),
            Decl::TsModule(ref n) => emit!(n),
            Decl::TsTypeAlias(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_class_decl(&mut self, node: &ClassDecl) -> Result {
        self.emit_class_decl_inner(node, false)?;
    }

    #[emitter]
    fn emit_using_decl(&mut self, node: &UsingDecl) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        if node.is_await {
            keyword!("await");
            space!();
        }

        keyword!("using");
        space!();

        self.emit_list(
            node.span,
            Some(&node.decls),
            ListFormat::VariableDeclarationList,
        )?;
    }

    pub(super) fn emit_class_decl_inner(
        &mut self,
        node: &ClassDecl,
        skip_decorators: bool,
    ) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(self, node, true);

        if node.declare {
            keyword!(self, "declare");
            space!(self);
        }

        if !skip_decorators {
            for dec in &node.class.decorators {
                emit!(self, dec);
            }
        }

        if node.class.is_abstract {
            keyword!(self, "abstract");
            space!(self);
        }

        keyword!(self, "class");
        space!(self);
        emit!(self, node.ident);
        emit!(self, node.class.type_params);

        self.emit_class_trailing(&node.class)?;

        Ok(())
    }

    #[emitter]
    fn emit_fn_decl(&mut self, node: &FnDecl) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(node, true);

        if node.declare {
            keyword!("declare");
            space!();
        }

        if node.function.is_async {
            keyword!("async");
            space!();
        }

        keyword!("function");
        if node.function.is_generator {
            punct!("*");
            formatting_space!();
        } else {
            space!();
        }

        emit!(node.ident);

        self.emit_fn_trailing(&node.function)?;
    }

    #[emitter]
    fn emit_var_decl(&mut self, node: &VarDecl) -> Result {
        self.emit_var_decl_inner(node)?;
    }

    fn emit_var_decl_inner(&mut self, node: &VarDecl) -> Result {
        self.emit_leading_comments_of_span(node.span, false)?;

        self.wr.commit_pending_semi()?;

        srcmap!(self, node, true);

        if node.declare {
            keyword!(self, "declare");
            space!(self);
        }

        keyword!(self, node.kind.as_str());

        let starts_with_ident = match node.decls.first() {
            Some(VarDeclarator {
                name: Pat::Array(..) | Pat::Rest(..) | Pat::Object(..),
                ..
            }) => false,
            _ => true,
        };
        if starts_with_ident {
            space!(self);
        } else {
            formatting_space!(self);
        }

        self.emit_list(
            node.span(),
            Some(&node.decls),
            ListFormat::VariableDeclarationList,
        )?;

        Ok(())
    }

    #[emitter]
    fn emit_var_declarator(&mut self, node: &VarDeclarator) -> Result {
        self.emit_leading_comments_of_span(node.span(), false)?;

        srcmap!(node, true);

        emit!(node.name);

        if let Some(ref init) = node.init {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::tests::assert_min;

    #[test]
    fn issue_275() {
        assert_min(
            "function* foo(){
            yield getServiceHosts()
        }",
            "function*foo(){yield getServiceHosts()}",
        );
    }

    #[test]
    fn issue_1764() {
        assert_min(
            "class Hoge {};
class HogeFuga extends Hoge {};",
            "class Hoge{};class HogeFuga extends Hoge{};",
        );
    }

    #[test]
    fn single_argument_arrow_expression() {
        assert_min("function* f(){ yield x => x}", "function*f(){yield x=>x}");
        assert_min(
            "function* f(){ yield ({x}) => x}",
            "function*f(){yield({x})=>x}",
        );
    }

    #[test]
    fn class_static_block() {
        assert_min("class Foo { static { 1 + 1; }}", "class Foo{static{1+1}}");
    }
}
