use swc_es_ast::{Decl, ForBinding, ForHead, ForInit, Stmt};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_stmt(&mut self, id: swc_es_ast::StmtId) -> EmitResult {
        let store = self.store;
        let node = Self::get_stmt(store, id)?;

        match node {
            Stmt::Empty(_) => self.out.push_byte(b';'),
            Stmt::Block(block) => self.emit_block_stmts(&block.stmts)?,
            Stmt::Expr(stmt) => {
                self.emit_expr_stmt(stmt.expr)?;
                self.out.push_byte(b';');
            }
            Stmt::Return(stmt) => {
                self.out.push_str("return");
                if let Some(arg) = stmt.arg {
                    self.out.push_byte(b' ');
                    self.emit_expr(arg, 0)?;
                }
                self.out.push_byte(b';');
            }
            Stmt::If(stmt) => {
                self.out.push_str("if(");
                self.emit_expr(stmt.test, 0)?;
                self.out.push_byte(b')');

                let force_brace = stmt.alt.is_some() && self.if_stmt_needs_brace(stmt.cons)?;
                if force_brace {
                    self.out.push_byte(b'{');
                    self.emit_stmt(stmt.cons)?;
                    self.out.push_byte(b'}');
                } else {
                    self.emit_stmt(stmt.cons)?;
                }

                if let Some(alt) = stmt.alt {
                    self.out.push_str("else");
                    self.emit_stmt(alt)?;
                }
            }
            Stmt::While(stmt) => {
                self.out.push_str("while(");
                self.emit_expr(stmt.test, 0)?;
                self.out.push_byte(b')');
                self.emit_stmt(stmt.body)?;
            }
            Stmt::For(stmt) => {
                match &stmt.head {
                    ForHead::Classic(head) => {
                        self.out.push_str("for(");
                        if let Some(init) = &head.init {
                            match init {
                                ForInit::Decl(id) => self.emit_decl_in_for_head(*id)?,
                                ForInit::Expr(id) => self.emit_expr(*id, 0)?,
                            }
                        }
                        self.out.push_byte(b';');
                        if let Some(test) = head.test {
                            self.emit_expr(test, 0)?;
                        }
                        self.out.push_byte(b';');
                        if let Some(update) = head.update {
                            self.emit_expr(update, 0)?;
                        }
                        self.out.push_byte(b')');
                    }
                    ForHead::In(head) => {
                        self.out.push_str("for(");
                        self.emit_for_binding(&head.left)?;
                        self.out.push_str(" in ");
                        self.emit_expr(head.right, 0)?;
                        self.out.push_byte(b')');
                    }
                    ForHead::Of(head) => {
                        if head.is_await {
                            self.out.push_str("for await(");
                        } else {
                            self.out.push_str("for(");
                        }
                        self.emit_for_binding(&head.left)?;
                        self.out.push_str(" of ");
                        self.emit_expr(head.right, 0)?;
                        self.out.push_byte(b')');
                    }
                }

                self.emit_stmt(stmt.body)?;
            }
            Stmt::DoWhile(stmt) => {
                self.out.push_str("do");
                self.emit_stmt(stmt.body)?;
                self.out.push_str("while(");
                self.emit_expr(stmt.test, 0)?;
                self.out.push_str(");");
            }
            Stmt::Switch(stmt) => {
                self.out.push_str("switch(");
                self.emit_expr(stmt.discriminant, 0)?;
                self.out.push_str("){");
                for case in &stmt.cases {
                    match case.test {
                        Some(test) => {
                            self.out.push_str("case ");
                            self.emit_expr(test, 0)?;
                            self.out.push_byte(b':');
                        }
                        None => self.out.push_str("default:"),
                    }
                    for cons in &case.cons {
                        self.emit_stmt(*cons)?;
                    }
                }
                self.out.push_byte(b'}');
            }
            Stmt::Try(stmt) => {
                self.out.push_str("try");
                self.emit_stmt(stmt.block)?;
                if let Some(handler) = &stmt.handler {
                    self.out.push_str("catch");
                    if let Some(param) = handler.param {
                        self.out.push_byte(b'(');
                        self.emit_pat(param)?;
                        self.out.push_byte(b')');
                    }
                    self.emit_stmt(handler.body)?;
                }
                if let Some(finalizer) = stmt.finalizer {
                    self.out.push_str("finally");
                    self.emit_stmt(finalizer)?;
                }
            }
            Stmt::Throw(stmt) => {
                self.out.push_str("throw ");
                self.emit_expr(stmt.arg, 0)?;
                self.out.push_byte(b';');
            }
            Stmt::With(stmt) => {
                self.out.push_str("with(");
                self.emit_expr(stmt.obj, 0)?;
                self.out.push_byte(b')');
                self.emit_stmt(stmt.body)?;
            }
            Stmt::Break(stmt) => {
                self.out.push_str("break");
                if let Some(label) = &stmt.label {
                    self.out.push_byte(b' ');
                    self.write_ident_sym(&label.sym);
                }
                self.out.push_byte(b';');
            }
            Stmt::Continue(stmt) => {
                self.out.push_str("continue");
                if let Some(label) = &stmt.label {
                    self.out.push_byte(b' ');
                    self.write_ident_sym(&label.sym);
                }
                self.out.push_byte(b';');
            }
            Stmt::Debugger(_) => self.out.push_str("debugger;"),
            Stmt::Labeled(stmt) => {
                self.write_ident_sym(&stmt.label.sym);
                self.out.push_byte(b':');
                self.emit_stmt(stmt.body)?;
            }
            Stmt::Decl(id) => self.emit_decl_stmt(*id)?,
            Stmt::ModuleDecl(id) => self.emit_module_decl_stmt(*id)?,
        }

        Ok(())
    }

    pub(super) fn emit_block_stmts(&mut self, stmts: &[swc_es_ast::StmtId]) -> EmitResult {
        self.out.push_byte(b'{');
        for stmt in stmts {
            self.emit_stmt(*stmt)?;
        }
        self.out.push_byte(b'}');
        Ok(())
    }

    fn emit_expr_stmt(&mut self, expr: swc_es_ast::ExprId) -> EmitResult {
        let store = self.store;
        let expr_node = Self::get_expr(store, expr)?;
        let needs_paren = self.expr_stmt_needs_paren(expr_node);
        if needs_paren {
            self.out.push_byte(b'(');
        }
        self.emit_expr(expr, 0)?;
        if needs_paren {
            self.out.push_byte(b')');
        }
        Ok(())
    }

    fn emit_decl_in_for_head(&mut self, id: swc_es_ast::DeclId) -> EmitResult {
        let store = self.store;
        match Self::get_decl(store, id)? {
            Decl::Var(var) => self.emit_var_decl(var, false),
            _ => Err(Self::invalid_ast(
                "for head declaration must be a variable declaration",
            )),
        }
    }

    fn emit_for_binding(&mut self, binding: &ForBinding) -> EmitResult {
        match binding {
            ForBinding::Decl(id) => self.emit_decl_in_for_head(*id),
            ForBinding::Pat(id) => self.emit_pat(*id),
            ForBinding::Expr(id) => self.emit_expr(*id, 0),
        }
    }

    fn if_stmt_needs_brace(&self, cons: swc_es_ast::StmtId) -> Result<bool, crate::CodegenError> {
        let store = self.store;
        Ok(matches!(Self::get_stmt(store, cons)?, Stmt::If(if_stmt) if if_stmt.alt.is_none()))
    }
}
