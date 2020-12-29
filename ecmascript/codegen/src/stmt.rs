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
        assert_min("const foo;", "const foo");
        assert_min("var foo = 10;", "var foo=10");
        assert_min("let foo = 10;", "let foo=10");
        assert_min("const foo = 10;", "const foo=10");
        assert_min("var foo, bar;", "var foo,bar");
        assert_min("let foo, bar;", "let foo,bar");
        assert_min("const foo, bar;", "const foo,bar");
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
            "for(var i = 0; i < 10; i++){\n}",
        );
        assert_pretty("for (i = 0; i < 10; i++) {}", "for(i = 0; i < 10; i++){\n}");
        assert_pretty("for (;;) {}", "for(;;){\n}");
        assert_pretty("for (foo in bar){}", "for(foo in bar){\n}");
        assert_pretty("for (let foo in bar){}", "for(let foo in bar){\n}");
        assert_pretty("for (foo of bar){}", "for (foo of bar){\n}");
        assert_pretty("for (let foo of bar){}", "for (let foo of bar){\n}");
    }

    #[test]
    fn import() {
        assert_min(
            "import colors, { color } from 'patterns/colors';",
            "import colors,{color}from'patterns/colors';",
        );
        assert_pretty(
            "import colors, { color } from 'patterns/colors';",
            "import colors, { color } from 'patterns/colors';",
        );
    }

    #[test]
    fn issue_204_01() {
        assert_min(r#"'\r\n';"#, r#"'\r\n'"#);
    }

    #[test]
    fn issue_204_02() {
        assert_min(r#"const a = fn() + '\r\n';"#, r#"const a=fn()+'\r\n'"#);
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
            "'Q'+ +x1+','+ +y1+','+(this._x1=+x)+','+(this._y1=+y)",
        );
    }
}
