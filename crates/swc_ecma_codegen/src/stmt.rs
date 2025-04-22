use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use crate::util::{EndsWithAlphaNum, StartsWithAlphaNum};

#[node_impl]
impl MacroNode for Stmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            Stmt::Expr(ref e) => emit!(emitter, e),
            Stmt::Block(ref e) => {
                let stmt = emit!(emitter, e);
                return Ok(only_new!(Stmt::Block(stmt)));
            }
            Stmt::Empty(ref e) => emit!(emitter, e),
            Stmt::Debugger(ref e) => emit!(emitter, e),
            Stmt::With(ref e) => emit!(emitter, e),
            Stmt::Return(ref e) => emit!(emitter, e),
            Stmt::Labeled(ref e) => emit!(emitter, e),
            Stmt::Break(ref e) => emit!(emitter, e),
            Stmt::Continue(ref e) => emit!(emitter, e),
            Stmt::If(ref e) => emit!(emitter, e),
            Stmt::Switch(ref e) => emit!(emitter, e),
            Stmt::Throw(ref e) => emit!(emitter, e),
            Stmt::Try(ref e) => emit!(emitter, e),
            Stmt::While(ref e) => emit!(emitter, e),
            Stmt::DoWhile(ref e) => emit!(emitter, e),
            Stmt::For(ref e) => emit!(emitter, e),
            Stmt::ForIn(ref e) => emit!(emitter, e),
            Stmt::ForOf(ref e) => emit!(emitter, e),
            Stmt::Decl(Decl::Var(e)) => {
                emit!(emitter, e);
                semi!(emitter);
            }
            Stmt::Decl(e @ Decl::Using(..)) => {
                emit!(emitter, e);
                semi!(emitter);
            }
            Stmt::Decl(ref e) => emit!(emitter, e),
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

        let lo = only_new!(emitter.wr.get_pos());

        emitter.wr.write_punct(None, ";")?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(EmptyStmt {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for BlockStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_block_stmt_inner(self, false)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(BlockStmt {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ExprStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span, false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.expr);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(ExprStmt {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for DebuggerStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, self.span, "debugger");
        semi!(emitter);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(DebuggerStmt {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for WithStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        let lo = only_new!(emitter.wr.get_pos());

        srcmap!(emitter, self, true);

        keyword!(emitter, "with");
        formatting_space!(emitter);

        punct!(emitter, "(");
        emit!(emitter, self.obj);
        punct!(emitter, ")");

        emit!(emitter, self.body);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(WithStmt {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for ReturnStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span, false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "return");

        if let Some(arg) = self.arg.as_deref() {
            let need_paren = self
                .arg
                .as_deref()
                .map(|expr| emitter.has_leading_comment(expr))
                .unwrap_or(false);
            if need_paren {
                punct!(emitter, "(");
            } else if arg.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(emitter, arg);
            if need_paren {
                punct!(emitter, ")");
            }
        }

        semi!(emitter);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for LabeledStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emit!(emitter, self.label);

        // TODO: Comment
        punct!(emitter, ":");
        formatting_space!(emitter);

        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SwitchStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "switch");

        punct!(emitter, "(");
        emit!(emitter, self.discriminant);
        punct!(emitter, ")");

        punct!(emitter, "{");
        emitter.emit_list(self.span(), Some(&self.cases), ListFormat::CaseBlockClauses)?;

        srcmap!(emitter, self, false, true);
        punct!(emitter, "}");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for CatchClause {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "catch");

        formatting_space!(emitter);

        if let Some(param) = &self.param {
            punct!(emitter, "(");
            emit!(emitter, param);
            punct!(emitter, ")");
        }

        formatting_space!(emitter);

        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for SwitchCase {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        if let Some(ref test) = self.test {
            keyword!(emitter, "case");

            let starts_with_alpha_num = test.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(emitter, test);
        } else {
            keyword!(emitter, "default");
        }

        let emit_as_single_stmt = self.cons.len() == 1 && {
            // treat synthesized nodes as located on the same line for emit purposes
            self.is_synthesized()
                || self.cons[0].is_synthesized()
                || emitter
                    .cm
                    .is_on_same_line(self.span().lo(), self.cons[0].span().lo())
        };

        let mut format = ListFormat::CaseOrDefaultClauseStatements;
        if emit_as_single_stmt {
            punct!(emitter, ":");
            space!(emitter);
            format &= !(ListFormat::MultiLine | ListFormat::Indented);
        } else {
            punct!(emitter, ":");
        }
        emitter.emit_list(self.span(), Some(&self.cons), format)?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ThrowStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "throw");

        {
            let need_paren = emitter.has_leading_comment(&self.arg);
            if need_paren {
                punct!(emitter, "(");
            } else if self.arg.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }

            emit!(emitter, self.arg);
            if need_paren {
                punct!(emitter, ")");
            }
        }
        semi!(emitter);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TryStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "try");

        formatting_space!(emitter);
        emit!(emitter, self.block);

        if let Some(ref catch) = self.handler {
            formatting_space!(emitter);
            emit!(emitter, catch);
        }

        if let Some(ref finally) = self.finalizer {
            formatting_space!(emitter);
            keyword!(emitter, "finally");
            // space!(emitter);
            emit!(emitter, finally);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for WhileStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "while");

        punct!(emitter, "(");
        emit!(emitter, self.test);
        punct!(emitter, ")");

        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for DoWhileStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "do");
        if self.body.starts_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter)
        }
        emit!(emitter, self.body);

        keyword!(emitter, "while");

        formatting_space!(emitter);

        punct!(emitter, "(");
        emit!(emitter, self.test);
        punct!(emitter, ")");

        if emitter.cfg.target <= EsVersion::Es5 {
            semi!(emitter);
        }

        srcmap!(emitter, self, false);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ForStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "for");

        punct!(emitter, "(");
        opt!(emitter, self.init);
        emitter.wr.write_punct(None, ";")?;
        opt_leading_space!(emitter, self.test);
        emitter.wr.write_punct(None, ";")?;
        opt_leading_space!(emitter, self.update);
        punct!(emitter, ")");

        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ForInStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "for");

        punct!(emitter, "(");
        emit!(emitter, self.left);

        if self.left.ends_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }
        keyword!(emitter, "in");

        {
            let starts_with_alpha_num = self.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter)
            }
            emit!(emitter, self.right);
        }

        punct!(emitter, ")");

        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ForOfStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        emitter.emit_leading_comments_of_span(self.span(), false)?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "for");

        if self.is_await {
            space!(emitter);
            keyword!(emitter, "await");
        }
        formatting_space!(emitter);
        punct!(emitter, "(");
        emit!(emitter, self.left);
        if self.left.ends_with_alpha_num() {
            space!(emitter);
        } else {
            formatting_space!(emitter);
        }
        keyword!(emitter, "of");

        {
            let starts_with_alpha_num = self.right.starts_with_alpha_num();

            if starts_with_alpha_num {
                space!(emitter);
            } else {
                formatting_space!(emitter)
            }
            emit!(emitter, self.right);
        }
        punct!(emitter, ")");
        emit!(emitter, self.body);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for BreakStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "break");

        if let Some(ref label) = self.label {
            space!(emitter);
            emit!(emitter, label);
        }

        semi!(emitter);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ContinueStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "continue");

        if let Some(ref label) = self.label {
            space!(emitter);
            emit!(emitter, label);
        }

        semi!(emitter);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for IfStmt {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.wr.commit_pending_semi()?;

        srcmap!(emitter, self, true);

        keyword!(emitter, "if");

        formatting_space!(emitter);
        punct!(emitter, "(");
        emit!(emitter, self.test);
        punct!(emitter, ")");
        formatting_space!(emitter);

        let is_cons_block = match *self.cons {
            Stmt::Block(..) => true,
            _ => false,
        };

        emit!(emitter, self.cons);

        if let Some(ref alt) = self.alt {
            if is_cons_block {
                formatting_space!(emitter);
            }
            keyword!(emitter, "else");
            if alt.starts_with_alpha_num() {
                space!(emitter);
            } else {
                formatting_space!(emitter);
            }
            emit!(emitter, alt);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for ModuleExportName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            ModuleExportName::Ident(ident) => emit!(emitter, ident),
            ModuleExportName::Str(s) => emit!(emitter, s),
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for VarDeclOrExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            VarDeclOrExpr::Expr(node) => emit!(emitter, node),
            VarDeclOrExpr::VarDecl(node) => emit!(emitter, node),
        }

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
