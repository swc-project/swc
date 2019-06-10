#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(specialization)]
#![recursion_limit = "1024"]

extern crate bitflags;
extern crate chashmap;
extern crate crossbeam;
extern crate node_resolve;
extern crate rayon;
extern crate swc_atoms;
#[macro_use]
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
#[cfg(test)]
extern crate testing;

use self::{analyzer::Info, errors::Error};
use crate::resolver::Resolver;
use chashmap::CHashMap;
use std::{path::PathBuf, sync::Arc};
use swc_common::{errors::Handler, Globals, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax, TsConfig};

pub mod analyzer;
pub mod errors;
pub mod loader;
pub mod resolver;
#[cfg(test)]
mod tests;
mod util;

/// Module with information.
pub type ModuleInfo = Arc<(Module, Info)>;

pub struct Checker<'a> {
    globals: swc_common::Globals,
    cm: Arc<SourceMap>,
    handler: &'a Handler,
    ts_config: TsConfig,
    /// Cache
    modules: Arc<CHashMap<PathBuf, ModuleInfo>>,
    resolver: Resolver,
    current: Arc<CHashMap<PathBuf, ()>>,
}

impl<'a> Checker<'a> {
    pub fn new(cm: Arc<SourceMap>, handler: &'a Handler, parser_config: TsConfig) -> Self {
        Checker {
            globals: Globals::new(),
            cm,
            handler,
            modules: Default::default(),
            ts_config: parser_config,
            resolver: Resolver::new(),
            current: Default::default(),
        }
    }

    pub const fn globals(&self) -> &swc_common::Globals {
        &self.globals
    }
}

impl Checker<'_> {
    /// Returns empty vector if no error is found.
    pub fn check(&self, entry: PathBuf) -> Vec<Error> {
        ::swc_common::GLOBALS.set(&self.globals, || {
            let mut errors = vec![];

            let module = self.load_module(entry.clone());

            errors.extend(module.1.errors.clone());

            // let (tasks, receiver) = channel::unbounded();
            // let (result_sender, result_receiver) = channel::unbounded();
            // for import in &module.1.imports {
            //     let _ = tasks.send(Task::Resolve {
            //         from: entry.clone(),
            //         src: import.src.clone(),
            //     });
            // }

            // for i in 1..6 {
            //     let worker = Worker {
            //         sender: result_sender.clone(),
            //         queue: receiver.clone(),
            //         modules: self.modules.clone(),
            //     };
            //     thread::scope(|s| {
            //         s.spawn(|_| worker.run());
            //     })
            //     .unwrap();
            // }

            errors
        })
    }

    fn load_module(&self, path: PathBuf) -> ModuleInfo {
        let cached = self.modules.get(&path);

        if let Some(cached) = cached {
            return cached.clone();
        }

        self.current.insert(path.clone(), ());

        let module = swc_common::GLOBALS.set(&self.globals, || {
            let session = Session {
                handler: &self.handler,
            };

            let fm = self.cm.load_file(&path).expect("failed to read file");

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
        let info = self.analyze_module(Arc::new(path.clone()), &module);
        let res = Arc::new((module, info));
        self.modules.insert(path.clone(), res.clone());
        self.current.remove(&path);

        res
    }
}
