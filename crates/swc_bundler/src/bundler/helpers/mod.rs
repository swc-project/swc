use std::sync::atomic::{AtomicBool, Ordering::SeqCst};

use once_cell::sync::Lazy;
use swc_common::{FileName, FilePathMapping, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_utils::{drop_span, prepend_stmts};

#[derive(Debug, Default)]
pub(crate) struct Helpers {
    /// `__swcpack_require__`
    pub require: AtomicBool,
}

fn parse(code: &'static str, name: &'static str) -> Vec<ModuleItem> {
    let cm = SourceMap::new(FilePathMapping::empty());
    let fm = cm.new_source_file(FileName::Custom(name.into()).into(), code.into());
    parse_file_as_module(
        &fm,
        Default::default(),
        Default::default(),
        None,
        &mut Vec::new(),
    )
    .map(|script| drop_span(script.body))
    .map_err(|_| {})
    .unwrap()
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
