use swc_es_ast::{Decl, DeclId, TsEnumMemberName, VarDeclKind};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(crate) fn emit_decl(&mut self, decl: DeclId) -> Result {
        self.emit_decl_with_mode(decl, false)
    }

    pub(super) fn emit_decl_in_for_head(&mut self, decl: DeclId) -> Result {
        self.emit_decl_with_mode(decl, true)
    }

    fn emit_decl_with_mode(&mut self, decl: DeclId, in_for_head: bool) -> Result {
        match self.decl(decl).clone() {
            Decl::Var(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }

                self.keyword(var_decl_kind_text(decl.kind))?;
                self.write_space_pretty()?;

                for (index, declarator) in decl.declarators.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }

                    self.emit_pat(declarator.name)?;
                    if let Some(init) = declarator.init {
                        self.write_space_pretty()?;
                        self.punct("=")?;
                        self.write_space_pretty()?;
                        self.emit_expr(init)?;
                    }
                }

                if !in_for_head {
                    self.punct(";")?;
                }

                Ok(())
            }
            Decl::Fn(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }

                self.keyword("function")?;
                self.write_space_pretty()?;
                self.emit_ident(&decl.ident)?;
                self.punct("(")?;
                for (index, param) in decl.params.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_pat(*param)?;
                }
                self.punct(")")?;
                self.write_space_pretty()?;
                self.emit_block_stmt_list(&decl.body)?;
                Ok(())
            }
            Decl::Class(decl) => {
                self.emit_class_decl(&decl)?;
                Ok(())
            }
            Decl::TsTypeAlias(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }
                self.keyword("type")?;
                self.write_space_pretty()?;
                self.emit_ident(&decl.ident)?;
                if !decl.type_params.is_empty() {
                    self.punct("<")?;
                    for (index, param) in decl.type_params.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ident(param)?;
                    }
                    self.punct(">")?;
                }
                self.write_space_pretty()?;
                self.punct("=")?;
                self.write_space_pretty()?;
                self.emit_ts_type(decl.ty)?;
                if !in_for_head {
                    self.punct(";")?;
                }
                Ok(())
            }
            Decl::TsInterface(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }
                self.keyword("interface")?;
                self.write_space_pretty()?;
                self.emit_ident(&decl.ident)?;
                if !decl.type_params.is_empty() {
                    self.punct("<")?;
                    for (index, param) in decl.type_params.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ident(param)?;
                    }
                    self.punct(">")?;
                }
                if !decl.extends.is_empty() {
                    self.write_space_pretty()?;
                    self.keyword("extends")?;
                    self.write_space_pretty()?;
                    for (index, ext) in decl.extends.iter().enumerate() {
                        if index != 0 {
                            self.punct(",")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_ident(ext)?;
                    }
                }
                self.write_space_pretty()?;
                self.emit_ts_type_members(&decl.body)?;
                Ok(())
            }
            Decl::TsEnum(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }
                if decl.is_const {
                    self.keyword("const")?;
                    self.write_space_force()?;
                }
                self.keyword("enum")?;
                self.write_space_pretty()?;
                self.emit_ident(&decl.ident)?;
                self.write_space_pretty()?;
                self.punct("{")?;
                for (index, member) in decl.members.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }

                    match &member.name {
                        TsEnumMemberName::Ident(ident) => self.emit_ident(ident)?,
                        TsEnumMemberName::Str(value) => {
                            self.emit_string_literal(value.value.as_ref())?
                        }
                        TsEnumMemberName::Num(value) => self.emit_number_literal(value.value)?,
                    }

                    if let Some(init) = member.init {
                        self.write_space_pretty()?;
                        self.punct("=")?;
                        self.write_space_pretty()?;
                        self.emit_expr(init)?;
                    }
                }
                self.punct("}")
            }
            Decl::TsModule(decl) => {
                if decl.declare {
                    self.keyword("declare")?;
                    self.write_space_force()?;
                }
                if decl.global {
                    self.keyword("global")?;
                    self.write_space_force()?;
                }
                if decl.namespace {
                    self.keyword("namespace")?;
                } else {
                    self.keyword("module")?;
                }
                self.write_space_pretty()?;
                self.emit_ts_module_name(&decl.id)?;

                if let Some(body) = &decl.body {
                    match body {
                        swc_es_ast::TsNamespaceBody::ModuleBlock(stmts) => {
                            self.write_space_pretty()?;
                            self.emit_block_stmt_list(stmts)?;
                        }
                        swc_es_ast::TsNamespaceBody::Namespace(namespace) => {
                            let mut names = vec![namespace.id.clone()];
                            let mut cursor = &*namespace.body;
                            while let swc_es_ast::TsNamespaceBody::Namespace(next) = cursor {
                                names.push(next.id.clone());
                                cursor = &*next.body;
                            }

                            if let (Some(first), swc_es_ast::TsModuleName::Ident(root)) =
                                (names.first(), &decl.id)
                            {
                                if first.sym == root.sym {
                                    names.remove(0);
                                }
                            }

                            for name in names {
                                self.punct(".")?;
                                self.emit_ident(&name)?;
                            }
                            self.write_space_pretty()?;

                            match cursor {
                                swc_es_ast::TsNamespaceBody::ModuleBlock(stmts) => {
                                    self.emit_block_stmt_list(stmts)?;
                                }
                                swc_es_ast::TsNamespaceBody::Namespace(_) => unreachable!(),
                            }
                        }
                    }
                } else {
                    self.punct(";")?;
                }

                Ok(())
            }
        }
    }
}

#[inline]
fn var_decl_kind_text(kind: VarDeclKind) -> &'static str {
    match kind {
        VarDeclKind::Var => "var",
        VarDeclKind::Let => "let",
        VarDeclKind::Const => "const",
        VarDeclKind::Using => "using",
        VarDeclKind::AwaitUsing => "await using",
    }
}
