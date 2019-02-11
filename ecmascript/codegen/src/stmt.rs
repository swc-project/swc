/// Copied from [ratel][]
///
/// [ratel]:https://github.com/ratel-rust/ratel-core
#[cfg(test)]
mod tests {
    use crate::tests::assert_min;

    #[test]
    fn block_statement() {
        assert_min("{}", "{}");
        assert_min("{foo;}", "{foo;}");
    }

    #[test]
    fn labeled_statement() {
        assert_min("foo: {}", "foo:{}");
        assert_min("foo: bar;", "foo:bar;");
    }

    #[test]
    fn function_statement() {
        assert_min("function foo() {}", "function foo(){}");
    }

    #[test]
    fn declaration_statement() {
        assert_min("var foo;", "var foo;");
        assert_min("let foo;", "let foo;");
        assert_min("const foo;", "const foo;");
        assert_min("var foo = 10;", "var foo=10;");
        assert_min("let foo = 10;", "let foo=10;");
        assert_min("const foo = 10;", "const foo=10;");
        assert_min("var foo, bar;", "var foo,bar;");
        assert_min("let foo, bar;", "let foo,bar;");
        assert_min("const foo, bar;", "const foo,bar;");
        assert_min("var foo = 10, bar = 20;", "var foo=10,bar=20;");
        assert_min("let foo = 10, bar = 20;", "let foo=10,bar=20;");
        assert_min("const foo = 10, bar = 20;", "const foo=10,bar=20;");
        assert_min("const a = {...foo};", "const a={...foo};");
    }

    #[test]
    fn if_statement() {
        assert_min("if (true) foo;", "if(true)foo;");
        assert_min("if (true) { foo; }", "if(true){foo;}");
        assert_min("if (true) foo; else bar;", "if(true)foo;else bar;");
        assert_min(
            "if (true) { foo; } else { bar; }",
            "if(true){foo;}else{bar;}",
        );
        assert_min("if (true) foo; else { bar; }", "if(true)foo;else{bar;}");
        assert_min("if (true) { foo; } else bar;", "if(true){foo;}else bar;");
    }

    #[test]
    fn while_statement() {
        assert_min("while (true) foo;", "while(true)foo;");
        assert_min("while (true) { foo; }", "while(true){foo;}");
    }

    #[test]
    fn do_statement() {
        assert_min("do { foo; } while (true)", "do{foo;}while(true)");
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
    fn import() {
        assert_min(
            "import colors, { color } from 'patterns/colors'",
            "import colors,{color}from'patterns/colors'",
        );
    }
}
