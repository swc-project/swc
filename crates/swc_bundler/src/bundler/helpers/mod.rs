use std::sync::atomic::{AtomicBool, Ordering::SeqCst};

use once_cell::sync::Lazy;
use swc_ecma_ast::*;
use swc_ecma_parser::next::{Parser, SourceType};
use swc_ecma_utils::{drop_span, prepend_stmts};

#[derive(Debug, Default)]
pub(crate) struct Helpers {
    /// `__swcpack_require__`
    pub require: AtomicBool,
}

fn parse(code: &'static str, name: &'static str) -> Vec<ModuleItem> {
    let parsed = Parser::new(code, SourceType::module()).parse();
    assert!(
        !parsed.panicked,
        "failed to parse bundler helper {name}: {:?}",
        parsed.diagnostics
    );
    match parsed.program {
        Program::Module(module) => drop_span(module.body),
        Program::Script(_) => unreachable!("module source type produced a script"),
    }
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
                    parse(include_str!(concat!("_", stringify!($name), ".js")), stringify!($name))
                });

                to.extend((*STMTS).clone());
            }
        )*
    };
}

define!(require {
    build: build_swcpack_require
});

impl Helpers {
    pub fn extend(&self, rhs: &Self) {
        if rhs.require.load(SeqCst) {
            self.require.store(true, SeqCst);
        }
    }

    pub fn add_to(&self, to: &mut Vec<ModuleItem>) {
        let mut buf = Vec::new();

        if self.require.load(SeqCst) {
            build_swcpack_require(&mut buf);
        }

        prepend_stmts(to, buf.into_iter());
    }
}
