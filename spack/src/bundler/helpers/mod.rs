use once_cell::sync::Lazy;
use std::sync::atomic::{AtomicBool, Ordering::SeqCst};
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, SourceFileInput};
use swc_ecma_utils::{
    options::{CM, SESSION},
    prepend_stmts, DropSpan,
};

#[derive(Debug, Default)]
pub(super) struct Helpers {
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
                    let code = include_str!(concat!("_", stringify!($name), ".js"));
                    let fm =
                        CM.new_source_file(FileName::Custom(stringify!($name).into()), code.into());
                    let lexer = Lexer::new(
                        *SESSION,
                        Default::default(),
                        Default::default(),
                        SourceFileInput::from(&*fm),
                        None,
                    );
                    let stmts = Parser::new_from(*SESSION, lexer)
                        .parse_module()
                        .map(|script| script.body.fold_with(&mut DropSpan {
                            preserve_ctxt:false,
                        }))
                        .map_err(|mut e| {
                            e.emit();
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

    pub fn append_to(&self, to: &mut Vec<ModuleItem>) {
        let mut buf = vec![];

        if self.require.load(SeqCst) {
            build_spack_require(&mut buf);
        }

        prepend_stmts(to, buf.into_iter());
    }
}
