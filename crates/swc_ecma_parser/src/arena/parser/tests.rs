use swc_common::comments::SingleThreadedComments;

use super::*;
use crate::EsSyntax;

fn program(src: &'static str) -> Program {
    test_parser(src, Default::default(), |p| p.parse_program())
}

/// Assert that Parser.parse_program returns [Program::Module].
fn module(src: &'static str) -> Module {
    program(src).expect_module()
}

/// Assert that Parser.parse_program returns [Program::Script].
fn script(src: &'static str) -> Script {
    program(src).expect_script()
}

/// Assert that Parser.parse_program returns [Program::Module] and has errors.
#[track_caller]
fn assert_module_error(src: &'static str) -> Module {
    test_parser(src, Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_ne!(errors, Vec::new());

        let module = program.expect_module();

        Ok(module)
    })
}

#[test]
fn parse_program_module_01() {
    module("import 'foo';");
    module("export const a = 1;");
}

#[test]
fn parse_program_script_01() {
    script("let a = 5;");
    script("function foo() {}");
    script("const a = 00176;");
}

#[test]
fn parse_program_module_02() {
    module(
        "
        function foo() {}
        export default foo;
        ",
    );
    module(
        "
        export function foo() {}
        export default foo;
        ",
    );
}

#[test]
fn parse_program_module_error_01() {
    assert_module_error(
        "
        const a = 01234;
        export default a;
        ",
    );
}

#[test]
fn issue_1813() {
    test_parser(
        "\\u{cccccccccsccccccQcXt[uc(~).const[uctor().const[uctor())tbr())",
        Default::default(),
        |p| {
            p.parse_program().expect_err("should fail");

            Ok(())
        },
    )
}

#[test]
fn parse_module_export_named_span() {
    let m = module("export function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { span, .. })) = &m.body[0] {
        assert_eq!(span.lo, BytePos(1));
    } else {
        panic!("expected ExportDecl");
    }
}

#[test]
fn parse_module_export_default_fn_span() {
    let m = module("export default function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(33));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_async_fn_span() {
    let m = module("export default async function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(39));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_class_span() {
    let m = module("export default class Foo {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(28));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn issue_1878() {
    // file with only comments should have the comments
    // in the leading map instead of the trailing
    {
        let c = SingleThreadedComments::default();
        let s = "
            // test
        ";
        let _ = super::test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
        assert!(leading.borrow().get(&BytePos(1)).is_some());
    }

    // file with shebang and comments should still work with the comments trailing
    // the shebang
    {
        let c = SingleThreadedComments::default();
        let s = "#!/foo/bar
            // test
        ";
        let _ = super::test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(leading.borrow().is_empty());
        assert_eq!(trailing.borrow().len(), 1);
        assert!(trailing.borrow().get(&BytePos(11)).is_some());
    }
}

#[test]
fn issue_2264_1() {
    let c = SingleThreadedComments::default();
    let s = "
        const t = <Switch>
            // 1
            /* 2 */
        </Switch>
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (_leading, trailing) = c.take_all();
    // assert!(leading.borrow().is_empty());
    assert!(trailing.borrow().is_empty());
}

#[test]
fn issue_2264_2() {
    let c = SingleThreadedComments::default();
    let s = "
        const t = <Switch>
            // 1
            /* 2 */
        </Switch>
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        |p| p.parse_module(),
    );

    let (leading, trailing) = c.take_all();
    assert!(leading.borrow().is_empty());
    assert!(trailing.borrow().is_empty());
}

#[test]
fn issue_2264_3() {
    let c = SingleThreadedComments::default();
    let s = "const foo = <h1>/* no */{/* 1 */ bar /* 2 */}/* no */</h1>;";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (leading, trailing) = c.take_all();
    assert!(leading.borrow().is_empty());
    assert_eq!(trailing.borrow().len(), 2);
    assert_eq!(trailing.borrow().get(&BytePos(26)).unwrap().len(), 1);
    assert_eq!(trailing.borrow().get(&BytePos(37)).unwrap().len(), 1);
}

#[test]
fn issue_2339_1() {
    let c = SingleThreadedComments::default();
    let s = "
        const t = <T>() => {
            // 1
            /* 2 */
            test;
        };
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (leading, trailing) = c.take_all();
    assert_eq!(leading.borrow().len(), 1);
    assert_eq!(leading.borrow().get(&BytePos(80)).unwrap().len(), 2);
    assert!(trailing.borrow().is_empty());
}

#[test]
fn issue_2853_1() {
    test_parser("const a = \"\\0a\";", Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_eq!(errors, Vec::new());
        assert_eq!(errors, Vec::new());

        Ok(program)
    });
}

#[test]
fn issue_2853_2() {
    test_parser("const a = \"\u{0000}a\";", Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_eq!(errors, Vec::new());

        Ok(program)
    });
}

#[test]
fn illegal_language_mode_directive1() {
    test_parser(
        r#"function f(a = 0) { "use strict"; }"#,
        Default::default(),
        |p| {
            let program = p.parse_program()?;

            let errors = p.take_errors();
            assert_eq!(
                errors,
                vec![Error::new(
                    Span {
                        lo: BytePos(21),
                        hi: BytePos(34),
                    },
                    crate::parser::SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn illegal_language_mode_directive2() {
    test_parser(
        r#"let f = (a = 0) => { "use strict"; }"#,
        Default::default(),
        |p| {
            let program = p.parse_program()?;

            let errors = p.take_errors();
            assert_eq!(
                errors,
                vec![Error::new(
                    Span {
                        lo: BytePos(22),
                        hi: BytePos(35),
                    },
                    crate::parser::SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn parse_non_strict_for_loop() {
    script("for (var v1 = 1 in v3) {}");
}

#[test]
fn parse_program_take_script_module_errors() {
    test_parser(r#"077;"#, Default::default(), |p| {
        let program = p.parse_program()?;

        assert_eq!(p.take_errors(), vec![]);
        // will contain the script's potential module errors
        assert_eq!(
            p.take_script_module_errors(),
            vec![Error::new(
                Span {
                    lo: BytePos(1),
                    hi: BytePos(4),
                },
                crate::parser::SyntaxError::LegacyOctal
            )]
        );

        Ok(program)
    });
}
