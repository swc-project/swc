use swc_common::comments::SingleThreadedComments;

use super::*;
use crate::EsSyntax;

fn program<'a>(alloc: &'a Allocator, src: &'static str) -> Program<'a> {
    test_parser(alloc, src, Default::default(), |p| p.parse_program())
}

/// Assert that Parser.parse_program returns [Program::Module].
fn module<'a>(alloc: &'a Allocator, src: &'static str) -> Module<'a> {
    program(alloc, src).expect_module().into_inner()
}

/// Assert that Parser.parse_program returns [Program::Script].
fn script<'a>(alloc: &'a Allocator, src: &'static str) -> Script<'a> {
    program(alloc, src).expect_script().into_inner()
}

/// Assert that Parser.parse_program returns [Program::Module] and has errors.
#[track_caller]
fn assert_module_error<'a>(alloc: &'a Allocator, src: &'static str) -> Module<'a> {
    test_parser(alloc, src, Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_ne!(errors, Vec::new());

        let module = program.expect_module();

        Ok(module.into_inner())
    })
}

#[test]
fn parse_program_module_01() {
    let alloc = Allocator::default();
    module(&alloc, "import 'foo';");
    module(&alloc, "export const a = 1;");
}

#[test]
fn parse_program_script_01() {
    let alloc = Allocator::default();
    script(&alloc, "let a = 5;");
    script(&alloc, "function foo() {}");
    script(&alloc, "const a = 00176;");
}

#[test]
fn parse_program_module_02() {
    let alloc = Allocator::default();
    module(
        &alloc,
        "
        function foo() {}
        export default foo;
        ",
    );
    module(
        &alloc,
        "
        export function foo() {}
        export default foo;
        ",
    );
}

#[test]
fn parse_program_module_error_01() {
    let alloc = Allocator::default();
    assert_module_error(
        &alloc,
        "
        const a = 01234;
        export default a;
        ",
    );
}

#[test]
fn issue_1813() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
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
    let alloc = Allocator::default();
    let m = module(&alloc, "export function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = &m.body[0] {
        assert_eq!(export_decl.span.lo, BytePos(1));
    } else {
        panic!("expected ExportDecl");
    }
}

#[test]
fn parse_module_export_default_fn_span() {
    let alloc = Allocator::default();
    let m = module(&alloc, "export default function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export_default_decl)) = &m.body[0] {
        assert_eq!(export_default_decl.span.lo, BytePos(1));
        assert_eq!(export_default_decl.span.hi, BytePos(33));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_async_fn_span() {
    let alloc = Allocator::default();
    let m = module(&alloc, "export default async function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export_default_decl)) = &m.body[0] {
        assert_eq!(export_default_decl.span.lo, BytePos(1));
        assert_eq!(export_default_decl.span.hi, BytePos(39));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_class_span() {
    let alloc = Allocator::default();
    let m = module(&alloc, "export default class Foo {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl)) = &m.body[0] {
        assert_eq!(decl.span.lo, BytePos(1));
        assert_eq!(decl.span.hi, BytePos(28));
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
        let alloc = Allocator::default();
        let _ = super::test_parser_comment(
            &alloc,
            &c,
            s,
            Syntax::Typescript(Default::default()),
            |p| p.parse_typescript_module(),
        );

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
        let alloc = Allocator::default();
        let _ = super::test_parser_comment(
            &alloc,
            &c,
            s,
            Syntax::Typescript(Default::default()),
            |p| p.parse_typescript_module(),
        );

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
    let alloc = Allocator::default();
    let _ = super::test_parser_comment(
        &alloc,
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
    let alloc = Allocator::default();
    let _ = super::test_parser_comment(
        &alloc,
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
    let alloc = Allocator::default();
    let _ = super::test_parser_comment(
        &alloc,
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
    let alloc = Allocator::default();
    let _ = super::test_parser_comment(
        &alloc,
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
    let alloc = Allocator::default();
    test_parser(&alloc, "const a = \"\\0a\";", Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_eq!(errors, Vec::new());
        assert_eq!(errors, Vec::new());

        Ok(program)
    });
}

#[test]
fn issue_2853_2() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
        "const a = \"\u{0000}a\";",
        Default::default(),
        |p| {
            let program = p.parse_program()?;

            let errors = p.take_errors();
            assert_eq!(errors, Vec::new());

            Ok(program)
        },
    );
}

#[test]
fn illegal_language_mode_directive1() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
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
                    SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn illegal_language_mode_directive2() {
    let alloc = Allocator::default();
    test_parser(
        &alloc,
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
                    SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn parse_non_strict_for_loop() {
    let alloc = Allocator::default();
    script(&alloc, "for (var v1 = 1 in v3) {}");
}

#[test]
fn parse_program_take_script_module_errors() {
    let alloc = Allocator::default();
    test_parser(&alloc, r#"077;"#, Default::default(), |p| {
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
                SyntaxError::LegacyOctal
            )]
        );

        Ok(program)
    });
}
