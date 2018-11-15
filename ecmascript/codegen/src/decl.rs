use super::{list::ListFormat, Emitter, Result};
use ecma_codegen_macros::emitter;
use swc_common::Spanned;
use swc_ecma_ast::*;

impl<'a> Emitter<'a> {
    #[emitter]
    pub fn emit_decl(&mut self, node: &Decl) -> Result {
        match *node {
            Decl::Class(ref n) => emit!(n),
            Decl::Fn(ref n) => emit!(n),

            Decl::Var(ref n) => {
                emit!(n);
                semi!(); // VarDecl is also used for for-loops
            }
        }
    }

    #[emitter]
    pub fn emit_class_decl(&mut self, node: &ClassDecl) -> Result {
        keyword!("class");
        space!();
        emit!(node.ident);

        self.emit_class_trailing(&node.class)?;
    }

    #[emitter]
    pub fn emit_fn_decl(&mut self, node: &FnDecl) -> Result {
        if node.function.async.is_some() {
            keyword!("async");
            space!();
        }

        keyword!("function");
        if node.function.generator.is_some() {
            punct!("*");
        }

        space!();
        emit!(node.ident);

        self.emit_fn_trailing(&node.function)?;
    }

    #[emitter]
    pub fn emit_var_decl(&mut self, node: &VarDecl) -> Result {
        keyword!(node.kind.as_str());
        space!();

        self.emit_list(
            node.span(),
            Some(&node.decls),
            ListFormat::VariableDeclarationList,
        )?;
    }

    #[emitter]
    pub fn emit_var_declator(&mut self, node: &VarDeclarator) -> Result {
        emit!(node.name);

        if let Some(ref init) = node.init {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }
    }
}
