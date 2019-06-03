#![recursion_limit = "1024"]

extern crate chashmap;
extern crate rayon;
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;

use self::{errors::Error, module::Info};
use chashmap::CHashMap;
use rayon::iter::{IntoParallelIterator, ParallelIterator};
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_common::{errors::Handler, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax, TsConfig};

pub mod errors;
pub mod module;

/// Module with information.
pub type ModuleInfo = Arc<(Module, Info)>;

pub struct Checker {
    globals: swc_common::Globals,
    cm: SourceMap,
    handler: Handler,
    ts_config: TsConfig,
    /// Cache
    modules: CHashMap<PathBuf, ModuleInfo>,
}

impl Checker {
    pub fn check(&self, entry: PathBuf) -> Result<Module, Vec<Error>> {
        let mut errors = vec![];
        let module = self.load(entry);
    }

    fn load_all(&self, files: Vec<PathBuf>) -> Vec<ModuleInfo> {
        files
            .into_par_iter()
            .map(|path| self.load(path))
            .collect::<Vec<_>>()
    }

    fn load(&self, path: PathBuf) -> ModuleInfo {
        let cached = self.modules.get(&path);

        if let Some(cached) = cached {
            return cached.clone();
        }

        let module = swc_common::GLOBALS.set(&self.globals, || {
            let cm = self.cm;

            let session = Session {
                handler: &self.handler,
            };

            // Real usage
            let fm = cm
                .load_file(Path::new("test.js"))
                .expect("failed to load test.js");

            let mut parser = Parser::new(
                session,
                Syntax::Typescript(self.ts_config),
                SourceFileInput::from(&*fm),
                None, // Disable comments
            );

            parser
                .parse_module()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .expect("failed to parser module")
        });

        let res = Arc::new(module::analyze_module(module));
        self.modules.insert(path, res.clone());

        res
    }
}
