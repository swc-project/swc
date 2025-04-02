use swc_common::{errors::emitter, SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use crate::{text_writer::WriteJs, Emitter, Result};

/// Statements
impl<W, S: SourceMapper> Emitter<'_, W, S>
where
    W: WriteJs,
    S: SourceMapperExt,
{
    #[emitter]
    fn emit_expr_stmt(&mut self, e: &ExprStmt) -> Result {
        self.emit_leading_comments_of_span(e.span, false)?;

        emit!(e.expr);

        semi!();
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

#[node_impl]
impl MacroNode for Stmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
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
        if emitter.comments.is_some() {
            emitter.emit_trailing_comments_of_pos(self.span().hi(), true, true)?;
        }

        if !emitter.cfg.minify {
            emitter.wr.write_line()?;
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for EmptyStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.write_punct(None, ";")?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for BlockStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_block_stmt_inner(self, false)?;

        Ok(())
    }
}

/// Copied from [ratel][]
///
/// [ratel]:https://github.com/ratel-rust/ratel-core
#[cfg(test)]
mod tests {
    use crate::tests::{assert_min, assert_pretty};

    #[test]
    fn block_statement() {
        assert_min("{}", "{}");
        assert_min("{foo;}", "{foo}");
    }

    #[test]
    fn empty_block_statement() {
        assert_pretty("{\n}", "{}");
        assert_pretty("{\n//todo\n}", "{\n//todo\n}");

        assert_pretty(
            "try {\n\n} catch {\n  // Pass\n}\n",
            "try {} catch  {\n// Pass\n}",
        );
    }

    #[test]
    fn empty_object_lit() {
        assert_pretty("Object.assign({\n}, a, b);", "Object.assign({}, a, b);");
    }

    #[test]
    fn labeled_statement() {
        assert_min("foo: {}", "foo:{}");
        assert_min("foo: bar;", "foo:bar");
    }

    #[test]
    fn function_statement() {
        assert_min("function foo() {}", "function foo(){}");
    }

    #[test]
    fn declaration_statement() {
        assert_min("var foo;", "var foo");
        assert_min("let foo;", "let foo");
        assert_min("var foo = 10;", "var foo=10");
        assert_min("let foo = 10;", "let foo=10");
        assert_min("const foo = 10;", "const foo=10");
        assert_min("var foo, bar;", "var foo,bar");
        assert_min("let foo, bar;", "let foo,bar");
        assert_min("var foo = 10, bar = 20;", "var foo=10,bar=20");
        assert_min("let foo = 10, bar = 20;", "let foo=10,bar=20");
        assert_min("const foo = 10, bar = 20;", "const foo=10,bar=20");
        assert_min("const a = {...foo};", "const a={...foo}");
    }

    #[test]
    fn if_statement() {
        assert_min("if (true) foo;", "if(true)foo");
        assert_min("if (true) { foo; }", "if(true){foo}");
        assert_min("if (true) foo; else bar;", "if(true)foo;else bar");
        assert_min("if (true) { foo; } else { bar; }", "if(true){foo}else{bar}");
        assert_min("if (true) foo; else { bar; }", "if(true)foo;else{bar}");
        assert_min("if (true) { foo; } else bar;", "if(true){foo}else bar");
        assert_min("if (true) y(); else x++;", "if(true)y();else x++");
        assert_min("if (true) y(); else x--;", "if(true)y();else x--");
    }

    #[test]
    fn while_statement() {
        assert_min("while (true) foo;", "while(true)foo");
        assert_min("while (true) { foo; }", "while(true){foo}");
    }

    #[test]
    fn do_statement() {
        assert_min("do { foo; } while (true)", "do{foo}while(true)");
        assert_min("do foo; while (true)", "do foo;while(true)");
    }

    #[test]
    fn for_statement() {
        assert_min("for (var i = 0; i < 10; i++) {}", "for(var i=0;i<10;i++){}");
        assert_min("for (i = 0; i < 10; i++) {}", "for(i=0;i<10;i++){}");
        assert_min("for (;;) {}", "for(;;){}");
        assert_min("for (foo in bar){}", "for(foo in bar){}");
        assert_min("for (let foo in bar){}", "for(let foo in bar){}");
        assert_min("for (foo of bar){}", "for(foo of bar){}");
        assert_min("for (let foo of bar){}", "for(let foo of bar){}");
    }

    #[test]
    fn for_statement_pretty() {
        assert_pretty(
            "for (var i = 0; i < 10; i++) {}",
            "for(var i = 0; i < 10; i++){}",
        );
        assert_pretty("for (i = 0; i < 10; i++) {}", "for(i = 0; i < 10; i++){}");
        assert_pretty("for (;;) {}", "for(;;){}");
        assert_pretty("for (foo in bar){}", "for(foo in bar){}");
        assert_pretty("for (let foo in bar){}", "for(let foo in bar){}");
        assert_pretty("for (foo of bar){}", "for (foo of bar){}");
        assert_pretty("for (let foo of bar){}", "for (let foo of bar){}");
    }

    #[test]
    fn import() {
        assert_min(
            "import colors, { color } from 'patterns/colors';",
            "import colors,{color}from\"patterns/colors\"",
        );
        assert_pretty(
            "import colors, { color } from 'patterns/colors';",
            "import colors, { color } from 'patterns/colors';",
        );
    }

    #[test]
    fn issue_204_01() {
        assert_min(r"'\r\n';", r#""\r\n""#);
    }

    #[test]
    fn issue_204_02() {
        assert_min(r"const a = fn() + '\r\n';", r#"const a=fn()+"\r\n""#);
    }

    #[test]
    fn issue_177() {
        assert_min(
            "#!/usr/bin/env node
let x = 4;",
            "#!/usr/bin/env node
let x=4",
        );
    }

    #[test]
    fn issue_197() {
        assert_pretty(
            "// type Foo = 'Oops';
const Link = 'Boo';",
            "// type Foo = 'Oops';
const Link = 'Boo';",
        );
    }

    #[test]
    fn issue_266() {
        assert_min(
            "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);",
            "\"Q\"+ +x1+\",\"+ +y1+\",\"+(this._x1=+x)+\",\"+(this._y1=+y)",
        );
    }
}
