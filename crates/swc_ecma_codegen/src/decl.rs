use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

#[node_impl]
impl MacroNode for ClassDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_class_decl_inner(self, false)?;
    }
}

#[node_impl]
impl MacroNode for UsingDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_await {
            keyword!("await");
            space!();
        }

        keyword!("using");
        space!();

        emitter.emit_list(
            self.span,
            Some(&self.decls),
            ListFormat::VariableDeclarationList,
        )?;
    }
}

#[node_impl]
impl MacroNode for FnDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.commit_pending_semi()?;

        srcmap!(self, true);

        if self.declare {
            keyword!("declare");
            space!();
        }

        if self.function.is_async {
            keyword!("async");
            space!();
        }

        keyword!("function");
        if self.function.is_generator {
            punct!("*");
            formatting_space!();
        } else {
            space!();
        }

        emit!(self.ident);

        emitter.emit_fn_trailing(&self.function)?;
    }
}

#[node_impl]
impl MacroNode for VarDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_var_decl_inner(self)?;
    }
}

#[node_impl]
impl MacroNode for VarDeclarator {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(self, true);

        emit!(self.name);

        if let Some(ref init) = self.init {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }
    }
}

#[node_impl]
impl MacroNode for Decl {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            Decl::Class(n) => emit!(n),
            Decl::Fn(n) => emit!(n),
            Decl::Var(n) => {
                emitter.emit_var_decl_inner(n)?;
                formatting_semi!();
                srcmap!(n, false);
            }
            Decl::Using(n) => emit!(n),
            Decl::TsEnum(n) => emit!(n),
            Decl::TsInterface(n) => emit!(n),
            Decl::TsModule(n) => emit!(n),
            Decl::TsTypeAlias(n) => emit!(n),
        }
    }
}

impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
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
