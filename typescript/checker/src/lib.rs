#![deny(unused_must_use)]
#![deny(unreachable_patterns)]
#![deny(mutable_borrow_reservation_conflict)]
#![deny(irrefutable_let_patterns)]
#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_blocks)]
#![feature(vec_remove_item)]
#![feature(option_expect_none)]
#![recursion_limit = "1024"]

#[macro_use]
extern crate swc_common;

pub use self::builtin_types::Lib;
use crate::{
    analyzer::{Analyzer, Info},
    errors::Error,
    resolver::Resolver,
    ty::Type,
    validator::ValidateWith,
};
use dashmap::DashMap;
use std::{path::PathBuf, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{errors::Handler, Globals, SourceMap, Span};
use swc_ecma_ast::Module;
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_visit::FoldWith as _;
use swc_ts_types::Id;

#[macro_use]
mod debug;
pub mod analyzer;
mod builtin_types;
pub mod errors;
pub mod hygiene;
pub mod loader;
pub mod name;
pub mod resolver;
pub mod ty;
mod type_facts;
pub mod util;
pub mod validator;

pub type ValidationResult<T = Box<Type>> = Result<T, Error>;

#[derive(Debug, PartialEq, Eq)]
pub struct ImportInfo {
    pub span: Span,
    pub items: Vec<Specifier>,
    pub all: bool,
    pub src: JsWord,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Specifier {
    pub local: Id,
    pub export: Id,
}

#[derive(Debug)]
pub struct Config {
    /// Should we generate .d.ts?
    declaration: bool,
    /// Directory to store .d.ts files.
    declaration_dir: PathBuf,

    pub rule: Rule,
    pub libs: Vec<Lib>,
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Rule {
    pub no_implicit_any: bool,
    pub no_implicit_this: bool,
    pub always_strict: bool,
    pub strict_null_checks: bool,
    pub strict_function_types: bool,

    pub allow_unreachable_code: bool,
    pub allow_unused_labels: bool,
    pub no_fallthrough_cases_in_switch: bool,
    pub no_implicit_returns: bool,
    pub suppress_excess_property_errors: bool,
    pub suppress_implicit_any_index_errors: bool,
    pub no_strict_generic_checks: bool,
    pub no_unused_locals: bool,
    pub no_unused_parameters: bool,
}

/// Onc instance per swc::Compiler
pub struct Checker {
    globals: Arc<swc_common::Globals>,
    cm: Arc<SourceMap>,
    handler: Arc<Handler>,
    ts_config: TsConfig,
    target: JscTarget,
    /// Cache
    modules: Arc<DashMap<Arc<PathBuf>, (Module, Info)>>,
    resolver: Resolver,
    current: Arc<DashMap<Arc<PathBuf>, ()>>,
    libs: Vec<Lib>,
    rule: Rule,
}

impl Checker {
    pub fn new(
        globals: Arc<Globals>,
        cm: Arc<SourceMap>,
        handler: Arc<Handler>,
        libs: Vec<Lib>,
        rule: Rule,
        parser_config: TsConfig,
        target: JscTarget,
    ) -> Self {
        Checker {
            globals,
            cm,
            handler,
            modules: Default::default(),
            ts_config: parser_config,
            target,
            resolver: Resolver::new(),
            current: Default::default(),
            libs,
            rule,
        }
    }

    pub fn run<F, R>(&self, op: F) -> R
    where
        F: FnOnce() -> R,
    {
        ::swc_common::GLOBALS.set(&self.globals, || op())
    }

    pub fn globals(&self) -> &swc_common::Globals {
        &self.globals
    }
}

impl Checker {
    pub fn check(&self, entry: Arc<PathBuf>) -> (Module, Info) {
        self.run(|| {
            let module = self.load_module(entry.clone());

            module
        })
    }

    fn load_module(&self, path: Arc<PathBuf>) -> (Module, Info) {
        let cached = self.modules.get(&path);

        if let Some(cached) = cached {
            println!("Cached");
            return cached.clone();
        }

        self.current.insert(path.clone(), ());

        let mut module = self.run(|| {
            let fm = self.cm.load_file(&path).expect("failed to read file");

            let lexer = Lexer::new(
                Syntax::Typescript(self.ts_config),
                self.target,
                StringInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);

            let module = parser
                .parse_typescript_module()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .ok()
                .unwrap_or_else(|| {
                    println!("Parser.parse_module returned Err()");
                    Module {
                        span: Default::default(),
                        body: Default::default(),
                        shebang: None,
                    }
                });
            module
        });

        let mut a = Analyzer::root(path.clone(), &self.libs, self.rule, self);
        let mut module = module.fold_with(&mut hygiene::colorizer());
        module.validate_with(&mut a);
        let info = a.info;

        let res = (module, info);
        self.modules.insert(path.clone(), res.clone());
        self.current.remove(&path);

        res
    }
}
