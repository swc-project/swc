use once_cell::sync::Lazy;
use std::sync::atomic::{AtomicBool, Ordering::SeqCst};
use swc_common::{FileName, FilePathMapping, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_utils::{drop_span, prepend_stmts};

#[derive(Debug, Default)]
pub(crate) struct Helpers {
    /// `__spack_require__`
    pub require: AtomicBool,
}

macro_rules! define {
    (
        $(
            $name:ident {
                build: $build:ident
            }
        )*
    ) => {
        $(
            fn $build(to: &mut Vec<ModuleItem>) {
                static STMTS: Lazy<Vec<ModuleItem>> = Lazy::new(|| {
                    let cm = SourceMap::new(FilePathMapping::empty());
                    let code = include_str!(concat!("_", stringify!($name), ".js"));
                    let fm =
                       cm.new_source_file(FileName::Custom(stringify!($name).into()), code.into());
                    let lexer = Lexer::new(
                        Default::default(),
                        Default::default(),
                        StringInput::from(&*fm),
                        None,
                    );
                    let stmts = Parser::new_from(lexer)
                        .parse_module()
                        .map(|script| drop_span(script.body))
                        .map_err(|_| {
                            ()
                        })
                        .unwrap();
                    stmts
                });

                to.extend((*STMTS).clone());
            }
        )*
    };
}

define!(require {
    build: build_spack_require
});

impl Helpers {
    pub fn extend(&self, rhs: &Self) {
        if rhs.require.load(SeqCst) {
            self.require.store(true, SeqCst);
        }
    }

    pub fn add_to(&self, to: &mut Vec<ModuleItem>) {
        let mut buf = vec![];

        if self.require.load(SeqCst) {
            build_spack_require(&mut buf);
        }

        prepend_stmts(to, buf.into_iter());
    }
}
