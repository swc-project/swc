#[cfg(test)]
pub(crate) fn parse(name: &'static str, src: &'static str) -> ::swc_ecma_ast::Module {
    use std::rc::Rc;
    use swc_common::FileName;
    use swc_common::errors::{CodeMap, FilePathMapping};
    use swc_ecma_parser::{FileMapInput, Parser, Session};

    let cm = Rc::new(CodeMap::new(FilePathMapping::empty()));
    let fm = cm.new_filemap_and_lines(FileName::Real(name.into()), src.into());

    let handler = ::swc_common::errors::Handler::with_tty_emitter(
        ::swc_common::errors::ColorConfig::Auto,
        true,
        false,
        Some(cm),
    );
    let logger = ::testing::logger().new(o!("src" => src));

    let sess = Session {
        handler: &handler,
        logger: &logger,
        cfg: Default::default(),
    };

    let module = {
        let mut p = Parser::new(sess, FileMapInput::from(&*fm));
        p.parse_module().unwrap_or_else(|err| {
            err.emit();
            panic!("failed to parse")
        })
    };
    println!("parsed {} as a module", src);

    module
}

#[cfg(test)]
pub fn fold<F>(module: ::swc_ecma_ast::Module, f: &mut F) -> ::swc_ecma_ast::Module
where
    F: ::swc_common::Folder<::swc_ecma_ast::Module>,
{
    f.fold(module)
}

/// Test transformation.
#[cfg(test)]
macro_rules! test {
    ($tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            let module = $crate::macros::parse(stringify!($test_name), $input);
            let expected_module = $crate::macros::parse(stringify!($test_name), $expected);

            let module = $crate::macros::fold(module, &mut $tr);
            let expected_module = $crate::macros::fold(expected_module, &mut $tr);

            assert_eq_ignore_span!(module, expected_module);
        }
    };
}

#[cfg(test)]

macro_rules! test_exec {
    ($tr:expr, $test_name:ident, $src:expr) => {
        #[test]
        fn $test_name() {
            let _ = $tr;

            let _module = $crate::macros::parse(stringify!($test_name), $src);

        }
    }
}
