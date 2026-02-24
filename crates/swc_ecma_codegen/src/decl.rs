use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use super::{Emitter, Result};
#[cfg(swc_ast_unknown)]
use crate::unknown_error;
use crate::{
    scope_helpers::{for_each_param_binding, for_each_var_decl_binding},
    text_writer::{BindingStorage, ScopeKind, WriteJs},
};

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

        if self.scope_tracking_enabled() {
            let storage = if matches!(node.kind, VarDeclKind::Var) {
                BindingStorage::Hoisted
            } else {
                BindingStorage::Lexical
            };
            let mut names = vec![];
            for_each_var_decl_binding(node, &mut |name| names.push(name.to_string()));
            for name in names {
                self.add_scope_variable(&name, Some(&name), storage)?;
            }
        }

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

#[node_impl]
impl MacroNode for Decl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Decl::Class(n) => emit!(n),
            Decl::Fn(n) => emit!(n),
            Decl::Var(n) => {
                emitter.emit_var_decl_inner(n)?;
                formatting_semi!(emitter);
                srcmap!(emitter, self, false);
            }
            Decl::Using(n) => emit!(n),
            Decl::TsEnum(n) => emit!(n),
            Decl::TsInterface(n) => emit!(n),
            Decl::TsModule(n) => emit!(n),
            Decl::TsTypeAlias(n) => emit!(n),
            #[cfg(swc_ast_unknown)]
            _ => return Err(unknown_error()),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ClassDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let name = self.ident.sym.as_ref();
        emitter.add_scope_variable(name, Some(name), BindingStorage::Lexical)?;
        emitter.emit_class_decl_inner(self, false)?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for UsingDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_await {
            keyword!(emitter, "await");
            space!(emitter);
        }

        keyword!(emitter, "using");
        space!(emitter);

        emitter.emit_list(
            self.span,
            Some(&self.decls),
            ListFormat::VariableDeclarationList,
        )?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for FnDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);
        let fn_name = self.ident.sym.as_ref();
        emitter.add_scope_variable(fn_name, Some(fn_name), BindingStorage::Hoisted)?;
        emitter.start_scope(
            Some(fn_name),
            ScopeKind::Function,
            true,
            false,
            Some(self.function.span),
        )?;
        if emitter.scope_tracking_enabled() {
            let mut names = vec![];
            for_each_param_binding(&self.function.params, &mut |name| {
                names.push(name.to_string())
            });
            for name in names {
                emitter.add_scope_variable(&name, Some(&name), BindingStorage::Lexical)?;
            }
        }

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        if self.function.is_async {
            keyword!(emitter, "async");
            space!(emitter);
        }

        keyword!(emitter, "function");
        if self.function.is_generator {
            punct!(emitter, "*");
            formatting_space!(emitter);
        } else {
            space!(emitter);
        }

        emit!(self.ident);

        emitter.emit_fn_trailing(&self.function)?;
        emitter.end_scope()?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for VarDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_var_decl_inner(self)?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for VarDeclarator {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        emit!(self.name);

        if let Some(ref init) = self.init {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(init);
        }

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
