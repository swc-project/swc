use swc_es_ast::{ForBinding, ForHead, ForInit, Stmt, StmtId};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(super) fn emit_stmt_list(&mut self, stmts: &[StmtId]) -> Result {
        for (index, stmt) in stmts.iter().enumerate() {
            self.emit_stmt(*stmt)?;

            if index + 1 != stmts.len() {
                self.write_line()?;
            }
        }

        Ok(())
    }

    pub(super) fn emit_block_stmt_list(&mut self, stmts: &[StmtId]) -> Result {
        self.punct("{")?;

        if !stmts.is_empty() {
            self.indent();
            self.write_line()?;
            self.emit_stmt_list(stmts)?;
            self.dedent();
            self.write_line()?;
        }

        self.punct("}")
    }

    pub(crate) fn emit_stmt(&mut self, stmt_id: StmtId) -> Result {
        match self.stmt(stmt_id).clone() {
            Stmt::Empty(_) => self.punct(";"),
            Stmt::Block(block) => self.emit_block_stmt_list(&block.stmts),
            Stmt::Expr(stmt) => {
                self.emit_expr(stmt.expr)?;
                self.punct(";")
            }
            Stmt::Return(stmt) => {
                self.keyword("return")?;
                if let Some(arg) = stmt.arg {
                    self.write_space_pretty()?;
                    self.emit_expr(arg)?;
                }
                self.punct(";")
            }
            Stmt::If(stmt) => {
                self.keyword("if")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                self.emit_expr(stmt.test)?;
                self.punct(")")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.cons)?;
                if let Some(alt) = stmt.alt {
                    self.write_space_pretty()?;
                    self.keyword("else")?;
                    self.write_space_pretty()?;
                    self.emit_stmt_as_body(alt)?;
                }
                Ok(())
            }
            Stmt::While(stmt) => {
                self.keyword("while")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                self.emit_expr(stmt.test)?;
                self.punct(")")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.body)
            }
            Stmt::For(stmt) => {
                self.keyword("for")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                match stmt.head {
                    ForHead::Classic(head) => {
                        if let Some(init) = head.init {
                            match init {
                                ForInit::Decl(decl) => self.emit_decl_in_for_head(decl)?,
                                ForInit::Expr(expr) => self.emit_expr(expr)?,
                            }
                        }
                        self.punct(";")?;
                        if let Some(test) = head.test {
                            self.write_space_pretty()?;
                            self.emit_expr(test)?;
                        }
                        self.punct(";")?;
                        if let Some(update) = head.update {
                            self.write_space_pretty()?;
                            self.emit_expr(update)?;
                        }
                    }
                    ForHead::In(head) => {
                        self.emit_for_binding(&head.left)?;
                        self.write_space_pretty()?;
                        self.keyword("in")?;
                        self.write_space_pretty()?;
                        self.emit_expr(head.right)?;
                    }
                    ForHead::Of(head) => {
                        if head.is_await {
                            self.keyword("await")?;
                            self.write_space_pretty()?;
                        }
                        self.emit_for_binding(&head.left)?;
                        self.write_space_pretty()?;
                        self.keyword("of")?;
                        self.write_space_pretty()?;
                        self.emit_expr(head.right)?;
                    }
                }
                self.punct(")")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.body)
            }
            Stmt::DoWhile(stmt) => {
                self.keyword("do")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.body)?;
                self.write_space_pretty()?;
                self.keyword("while")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                self.emit_expr(stmt.test)?;
                self.punct(")")?;
                self.punct(";")
            }
            Stmt::Switch(stmt) => {
                self.keyword("switch")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                self.emit_expr(stmt.discriminant)?;
                self.punct(")")?;
                self.write_space_pretty()?;
                self.punct("{")?;

                if !stmt.cases.is_empty() {
                    self.indent();
                    self.write_line()?;
                }

                for (index, case) in stmt.cases.iter().enumerate() {
                    if index != 0 {
                        self.write_line()?;
                    }

                    if let Some(test) = case.test {
                        self.keyword("case")?;
                        self.write_space_pretty()?;
                        self.emit_expr(test)?;
                        self.punct(":")?;
                    } else {
                        self.keyword("default")?;
                        self.punct(":")?;
                    }

                    if !case.cons.is_empty() {
                        self.indent();
                        self.write_line()?;
                        self.emit_stmt_list(&case.cons)?;
                        self.dedent();
                    }
                }

                if !stmt.cases.is_empty() {
                    self.dedent();
                    self.write_line()?;
                }

                self.punct("}")
            }
            Stmt::Try(stmt) => {
                self.keyword("try")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.block)?;

                if let Some(handler) = stmt.handler {
                    self.write_space_pretty()?;
                    self.keyword("catch")?;
                    if let Some(param) = handler.param {
                        self.write_space_pretty()?;
                        self.punct("(")?;
                        self.emit_pat(param)?;
                        self.punct(")")?;
                    }
                    self.write_space_pretty()?;
                    self.emit_stmt_as_body(handler.body)?;
                }

                if let Some(finalizer) = stmt.finalizer {
                    self.write_space_pretty()?;
                    self.keyword("finally")?;
                    self.write_space_pretty()?;
                    self.emit_stmt_as_body(finalizer)?;
                }

                Ok(())
            }
            Stmt::Throw(stmt) => {
                self.keyword("throw")?;
                self.write_space_pretty()?;
                self.emit_expr(stmt.arg)?;
                self.punct(";")
            }
            Stmt::With(stmt) => {
                self.keyword("with")?;
                self.write_space_pretty()?;
                self.punct("(")?;
                self.emit_expr(stmt.obj)?;
                self.punct(")")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.body)
            }
            Stmt::Break(stmt) => {
                self.keyword("break")?;
                if let Some(label) = stmt.label {
                    self.write_space_pretty()?;
                    self.emit_ident(&label)?;
                }
                self.punct(";")
            }
            Stmt::Continue(stmt) => {
                self.keyword("continue")?;
                if let Some(label) = stmt.label {
                    self.write_space_pretty()?;
                    self.emit_ident(&label)?;
                }
                self.punct(";")
            }
            Stmt::Debugger(_) => {
                self.keyword("debugger")?;
                self.punct(";")
            }
            Stmt::Labeled(stmt) => {
                self.emit_ident(&stmt.label)?;
                self.punct(":")?;
                self.write_space_pretty()?;
                self.emit_stmt_as_body(stmt.body)
            }
            Stmt::Decl(decl) => self.emit_decl(decl),
            Stmt::ModuleDecl(module_decl) => self.emit_module_decl(module_decl),
        }
    }

    fn emit_for_binding(&mut self, binding: &ForBinding) -> Result {
        match binding {
            ForBinding::Decl(decl) => self.emit_decl_in_for_head(*decl),
            ForBinding::Pat(pat) => self.emit_pat(*pat),
            ForBinding::Expr(expr) => self.emit_expr(*expr),
        }
    }

    fn emit_stmt_as_body(&mut self, stmt: StmtId) -> Result {
        match self.stmt(stmt) {
            Stmt::Block(_) => self.emit_stmt(stmt),
            _ => {
                if self.cfg.minify {
                    self.emit_stmt(stmt)
                } else {
                    self.indent();
                    self.write_line()?;
                    self.emit_stmt(stmt)?;
                    self.dedent();
                    Ok(())
                }
            }
        }
    }
}
